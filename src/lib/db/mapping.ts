import { ObjectId } from "./objectid";
import { TABLES, type ColType } from "./schema";

export type Doc = Record<string, unknown> & { _id?: unknown };
export type Row = Record<string, unknown>;

export const q = (ident: string) => "`" + ident.replace(/`/g, "``") + "`";

export function tableDef(name: string) {
  const def = TABLES[name];
  if (!def) throw new Error(`Unknown table/collection "${name}".`);
  return def;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Date) && !(v instanceof ObjectId);

export { isPlainObject };

function toDbValue(col: string, type: ColType, v: unknown): unknown {
  if (v === undefined || v === null) return null;
  switch (type.t) {
    case "bool": return v ? 1 : 0;
    case "date": { const d = v instanceof Date ? v : new Date(v as string | number); return Number.isNaN(+d) ? null : d; }
    case "int": case "bigint": { const n = Number(v); return Number.isFinite(n) ? Math.trunc(n) : null; }
    case "float": { const n = Number(v); return Number.isFinite(n) ? n : null; }
    case "json": return JSON.stringify(v);
    case "str": {
      const s = v instanceof ObjectId ? v.toHexString() : String(v);
      if (s.length > type.n) throw new Error(`Value for "${col}" is too long (${s.length} > ${type.n} characters).`);
      return s;
    }
    default: return v instanceof ObjectId ? v.toHexString() : String(v);
  }
}

function fromDbValue(type: ColType, v: unknown): unknown {
  switch (type.t) {
    case "bool": return Boolean(Number(v));
    case "date": return v instanceof Date ? v : new Date(v as string);
    case "int": case "bigint": case "float": return Number(v);
    case "json": return typeof v === "string" ? JSON.parse(v) : v;
    default: return String(v);
  }
}

/** Application document -> table row (unknown fields are kept in the `extra` JSON column, nothing is lost). */
export function docToRow(table: string, doc: Doc): { id: string; cols: Row; extra: string | null } {
  const def = tableDef(table);
  const cols: Row = {};
  const extra: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k === "_id" || v === undefined) continue;
    const type = def.columns[k];
    if (type) cols[k] = toDbValue(k, type, v);
    else extra[k] = v;
  }
  for (const k of Object.keys(def.columns)) if (!(k in cols)) cols[k] = null;
  const id = doc._id === undefined || doc._id === null ? "" : String(doc._id);
  return { id, cols, extra: Object.keys(extra).length ? JSON.stringify(extra) : null };
}

/** Table row -> application document (NULL columns are omitted, exactly like a missing field). */
export function rowToDoc(table: string, row: Row): Doc {
  const def = tableDef(table);
  const doc: Doc = { _id: def.idType === "oid" ? new ObjectId(String(row.id)) : String(row.id) };
  for (const [k, type] of Object.entries(def.columns)) {
    const v = row[k];
    if (v === null || v === undefined) continue;
    doc[k] = fromDbValue(type, v);
  }
  if (row.extra) {
    try {
      const extra = typeof row.extra === "string" ? JSON.parse(row.extra) : row.extra;
      for (const [k, v] of Object.entries(extra as Record<string, unknown>)) if (!(k in doc)) doc[k] = v;
    } catch { /* corrupt extra column: ignore rather than fail the whole read */ }
  }
  return doc;
}
