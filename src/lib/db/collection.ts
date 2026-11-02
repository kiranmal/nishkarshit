import type { Pool, PoolConnection } from "mysql2/promise";
import { ObjectId } from "./objectid";
import { docToRow, isPlainObject, q, rowToDoc, tableDef, type Doc, type Row } from "./mapping";
import { buildOrderBy, buildWhere, equalityFields, type Filter, type Sort } from "./query";

export type Document = Record<string, unknown>;
export type Update = Record<string, Record<string, unknown>>;
type Executor = Pick<Pool, "query"> | Pick<PoolConnection, "query">;

/** Mirrors the duplicate-key error the application already handles (`err.code === 11000`). */
export class DuplicateKeyError extends Error {
  code = 11000;
  constructor(message: string) { super(message); this.name = "DuplicateKeyError"; }
}

const RETRYABLE = new Set(["ER_LOCK_DEADLOCK", "ER_LOCK_WAIT_TIMEOUT"]);

/* ----------------------------- update operators ---------------------------- */
function getPath(doc: Doc, path: string): unknown { return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Doc)[k] : undefined), doc); }
function setPath(doc: Doc, path: string, value: unknown) {
  const keys = path.split(".");
  let o: Doc = doc;
  for (const k of keys.slice(0, -1)) { if (!isPlainObject(o[k])) o[k] = {}; o = o[k] as Doc; }
  o[keys[keys.length - 1]] = value;
}
function unsetPath(doc: Doc, path: string) {
  const keys = path.split(".");
  let o: unknown = doc;
  for (const k of keys.slice(0, -1)) o = o && typeof o === "object" ? (o as Doc)[k] : undefined;
  if (o && typeof o === "object") delete (o as Doc)[keys[keys.length - 1]];
}
const same = (a: unknown, b: unknown) => String(a instanceof Date ? a.toISOString() : a) === String(b instanceof Date ? b.toISOString() : b);

export function applyUpdate(doc: Doc, update: Update, inserting: boolean): Doc {
  for (const [op, fields] of Object.entries(update)) {
    switch (op) {
      case "$setOnInsert": if (inserting) for (const [k, v] of Object.entries(fields)) setPath(doc, k, v); break;
      case "$set": for (const [k, v] of Object.entries(fields)) setPath(doc, k, v); break;
      case "$unset": for (const k of Object.keys(fields)) unsetPath(doc, k); break;
      case "$inc": for (const [k, v] of Object.entries(fields)) setPath(doc, k, (Number(getPath(doc, k)) || 0) + Number(v)); break;
      case "$push": for (const [k, v] of Object.entries(fields)) {
        const cur = getPath(doc, k); const arr = Array.isArray(cur) ? [...cur] : [];
        if (isPlainObject(v) && "$each" in v) arr.push(...((v.$each as unknown[]) ?? [])); else arr.push(v);
        setPath(doc, k, arr);
      } break;
      case "$addToSet": for (const [k, v] of Object.entries(fields)) {
        const cur = getPath(doc, k); const arr = Array.isArray(cur) ? [...cur] : [];
        if (!arr.some((x) => same(x, v))) arr.push(v);
        setPath(doc, k, arr);
      } break;
      case "$pull": for (const [k, v] of Object.entries(fields)) {
        const cur = getPath(doc, k);
        if (!Array.isArray(cur)) continue;
        setPath(doc, k, cur.filter((el) => !(isPlainObject(v) && isPlainObject(el) ? Object.entries(v).every(([ck, cv]) => same(el[ck], cv)) : same(el, v))));
      } break;
      default: throw new Error(`Unsupported update operator "${op}".`);
    }
  }
  return doc;
}

/* --------------------------------- cursor ---------------------------------- */
export class Cursor<T> {
  private _sort?: Sort; private _limit?: number; private _skip?: number;
  constructor(private run: (o: { sort?: Sort; limit?: number; skip?: number }) => Promise<T[]>) {}
  sort(s: Sort) { this._sort = s; return this; }
  limit(n: number) { this._limit = n; return this; }
  skip(n: number) { this._skip = n; return this; }
  project(_p?: unknown) { void _p; return this; }
  toArray(): Promise<T[]> { return this.run({ sort: this._sort, limit: this._limit, skip: this._skip }); }
}

/* ------------------------------- collection -------------------------------- */
export class Collection<T extends object = Document> {
  constructor(private pool: Pool, readonly name: string) { tableDef(name); }

  private async rows(ex: Executor, filter: Filter | undefined, o: { sort?: Sort; limit?: number; skip?: number; lock?: boolean } = {}): Promise<Row[]> {
    const params: unknown[] = [];
    let sql = `SELECT * FROM ${q(this.name)} WHERE ${buildWhere(this.name, filter, params)}${buildOrderBy(this.name, o.sort, params)}`;
    if (o.limit !== undefined) sql += ` LIMIT ${Math.max(0, Math.trunc(o.limit))}`;
    if (o.skip) sql += ` OFFSET ${Math.max(0, Math.trunc(o.skip))}`;
    if (o.lock) sql += " FOR UPDATE";
    const [res] = await ex.query(sql, params);
    return res as Row[];
  }

  find(filter?: Filter, _opts?: { projection?: Document }): Cursor<T & Doc> {
    void _opts;
    return new Cursor<T & Doc>(async (o) => (await this.rows(this.pool, filter, o)).map((r) => rowToDoc(this.name, r) as T & Doc));
  }
  async findOne(filter?: Filter, opts?: { projection?: Document; sort?: Sort }): Promise<(T & Doc) | null> {
    const [row] = await this.rows(this.pool, filter, { limit: 1, sort: opts?.sort });
    return row ? (rowToDoc(this.name, row) as T & Doc) : null;
  }
  async countDocuments(filter?: Filter): Promise<number> {
    const params: unknown[] = [];
    const [res] = await this.pool.query(`SELECT COUNT(*) AS c FROM ${q(this.name)} WHERE ${buildWhere(this.name, filter, params)}`, params);
    return Number((res as Row[])[0].c);
  }
  estimatedDocumentCount() { return this.countDocuments(); }

  private async insertRow(ex: Executor, doc: Doc): Promise<string> {
    const def = tableDef(this.name);
    const withId: Doc = { ...doc };
    if (withId._id === undefined || withId._id === null) withId._id = def.idType === "oid" ? new ObjectId() : undefined;
    if (withId._id === undefined) throw new Error(`"${this.name}" documents need an _id.`);
    const { id, cols, extra } = docToRow(this.name, withId);
    const names = ["id", ...Object.keys(cols), "extra"];
    const values = [id, ...Object.values(cols), extra];
    try {
      await ex.query(`INSERT INTO ${q(this.name)} (${names.map(q).join(",")}) VALUES (${names.map(() => "?").join(",")})`, values);
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new DuplicateKeyError(`Duplicate value in "${this.name}": ${(err as Error).message}`);
      throw err;
    }
    return id;
  }
  async insertOne(doc: object): Promise<{ insertedId: ObjectId | string; acknowledged: true }> {
    const id = await this.insertRow(this.pool, doc as Doc);
    return { insertedId: tableDef(this.name).idType === "oid" ? new ObjectId(id) : id, acknowledged: true };
  }
  async insertMany(docs: object[]) { for (const d of docs) await this.insertOne(d); return { insertedCount: docs.length }; }

  private async writeRow(ex: Executor, doc: Doc) {
    const { id, cols, extra } = docToRow(this.name, doc);
    const names = [...Object.keys(cols), "extra"];
    await ex.query(`UPDATE ${q(this.name)} SET ${names.map((n) => `${q(n)} = ?`).join(", ")} WHERE \`id\` = ?`, [...Object.values(cols), extra, id]);
  }

  /** Read-modify-write inside a transaction with row locks: the same atomicity the document store gave single-document updates. */
  private async update(filter: Filter, update: Update, o: { upsert?: boolean; many?: boolean; returnAfter?: boolean }) {
    for (let attempt = 0; ; attempt++) {
      const conn = await this.pool.getConnection();
      try {
        await conn.beginTransaction();
        const rows = await this.rows(conn, filter, { limit: o.many ? undefined : 1, lock: true });
        let matched = 0, modified = 0, upsertedId: ObjectId | string | undefined, result: Doc | null = null;
        if (rows.length) {
          for (const row of rows) {
            const before = rowToDoc(this.name, row);
            const after = applyUpdate(structuredCloneDoc(before), update, false);
            matched++;
            if (JSON.stringify(docToRow(this.name, before)) !== JSON.stringify(docToRow(this.name, after))) { await this.writeRow(conn, after); modified++; }
            result = o.returnAfter ? after : before;
          }
        } else if (o.upsert) {
          const base: Doc = { ...equalityFields(filter) };
          const doc = applyUpdate(base, update, true);
          const id = await this.insertRow(conn, doc);
          upsertedId = tableDef(this.name).idType === "oid" ? new ObjectId(id) : id;
          result = rowToDoc(this.name, (await this.rows(conn, { _id: id }, { limit: 1 }))[0]);
          if (!o.returnAfter) result = null;
        }
        await conn.commit();
        return { matchedCount: matched, modifiedCount: modified, upsertedCount: upsertedId ? 1 : 0, upsertedId, doc: result };
      } catch (err) {
        await conn.rollback().catch(() => undefined);
        const code = (err as { code?: string | number }).code;
        const retry = (typeof code === "string" && RETRYABLE.has(code)) || (code === 11000 && o.upsert);
        if (retry && attempt < 3) continue; // concurrent upsert / deadlock: try again against the committed state
        throw err;
      } finally { conn.release(); }
    }
  }
  async updateOne(filter: Filter, update: Update, opts?: { upsert?: boolean }) {
    const { doc, ...r } = await this.update(filter, update, { upsert: opts?.upsert }); void doc; return { acknowledged: true as const, ...r };
  }
  async updateMany(filter: Filter, update: Update, opts?: { upsert?: boolean }) {
    const { doc, ...r } = await this.update(filter, update, { upsert: opts?.upsert, many: true }); void doc; return { acknowledged: true as const, ...r };
  }
  async findOneAndUpdate(filter: Filter, update: Update, opts?: { upsert?: boolean; returnDocument?: "before" | "after" }): Promise<(T & Doc) | null> {
    const r = await this.update(filter, update, { upsert: opts?.upsert, returnAfter: opts?.returnDocument === "after" });
    return (r.doc as (T & Doc) | null) ?? null;
  }

  private async del(filter: Filter, one: boolean) {
    const params: unknown[] = [];
    const where = buildWhere(this.name, filter, params);
    const [res] = await this.pool.query(`DELETE FROM ${q(this.name)} WHERE ${where}${one ? " ORDER BY `row_seq` ASC LIMIT 1" : ""}`, params);
    return { acknowledged: true as const, deletedCount: (res as { affectedRows: number }).affectedRows };
  }
  deleteOne(filter: Filter) { return this.del(filter, true); }
  deleteMany(filter?: Filter) { return this.del(filter ?? {}, false); }

  async bulkWrite(ops: Record<string, Document>[]) {
    let upserted = 0, modified = 0;
    for (const op of ops) {
      if (op.updateOne) { const u = op.updateOne as { filter: Filter; update: Update; upsert?: boolean }; const r = await this.updateOne(u.filter, u.update, { upsert: u.upsert }); upserted += r.upsertedCount; modified += r.modifiedCount; }
      else if (op.insertOne) await this.insertOne((op.insertOne as { document: object }).document);
      else if (op.deleteOne) await this.deleteOne((op.deleteOne as { filter: Filter }).filter);
      else throw new Error("Unsupported bulkWrite operation.");
    }
    return { upsertedCount: upserted, modifiedCount: modified };
  }

  /** Indexes are defined by the SQL migrations (src/lib/db/schema.ts); kept so existing call sites keep working. */
  async createIndex(_spec?: unknown, _opts?: unknown): Promise<string> { void _spec; void _opts; return "managed-by-migrations"; }
}

function structuredCloneDoc(d: Doc): Doc {
  // Deep copy that keeps Date / ObjectId instances intact.
  const clone = (v: unknown): unknown => {
    if (v instanceof Date || v instanceof ObjectId) return v;
    if (Array.isArray(v)) return v.map(clone);
    if (isPlainObject(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)]));
    return v;
  };
  return clone(d) as Doc;
}
