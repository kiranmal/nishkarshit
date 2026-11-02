import { ObjectId } from "./objectid";
import { isPlainObject, q, tableDef } from "./mapping";
import type { ColType } from "./schema";

type Params = unknown[];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Filter<_T = unknown> = Record<string, unknown>;
export type Sort = Record<string, 1 | -1>;

interface Resolved { expr: string; params: Params; type: ColType | null }

/** Maps a (possibly dotted) field path to a SQL expression: real column, JSON path inside a JSON column, or the `extra` JSON column. */
function resolve(table: string, path: string): Resolved {
  if (path === "_id") return { expr: "`id`", params: [], type: { t: "str", n: 64 } };
  const def = tableDef(table);
  const [top, ...rest] = path.split(".");
  const type = def.columns[top];
  if (type && rest.length === 0) return { expr: q(top), params: [], type };
  if (type && type.t === "json") return { expr: `JSON_UNQUOTE(JSON_EXTRACT(${q(top)}, ?))`, params: ["$." + rest.join(".")], type: null };
  return { expr: "JSON_UNQUOTE(JSON_EXTRACT(`extra`, ?))", params: ["$." + path], type: null };
}

function toParam(type: ColType | null, v: unknown): unknown {
  if (v instanceof ObjectId) return v.toHexString();
  if (v instanceof Date) return v;
  if (type?.t === "bool") return v ? 1 : 0;
  if (typeof v === "boolean") return v ? "true" : "false";
  return v;
}

function isOperatorObject(v: unknown): v is Record<string, unknown> {
  return isPlainObject(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => k.startsWith("$"));
}

/** A regex built from escaped user input is a plain "contains" search → LIKE; anything else falls back to REGEXP. */
function regexToLike(pattern: string): string | null {
  let out = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === "\\") { out += pattern[++i] ?? ""; continue; }
    if (/[.*+?^${}()|[\]]/.test(c)) return null;
    out += c;
  }
  return "%" + out.replace(/[|%_]/g, (m) => "|" + m) + "%";
}

function fieldCondition(table: string, path: string, value: unknown, params: Params): string {
  const f = resolve(table, path);
  const isJsonCol = f.type?.t === "json";
  const col = (e = f.expr) => { params.push(...f.params); return e; };

  if (!isOperatorObject(value)) {
    if (value === null || value === undefined) return `(${col()} IS NULL)`;
    if (isJsonCol) { params.push(...f.params); params.push(JSON.stringify(value)); return `JSON_CONTAINS(${f.expr}, ?)`; } // array contains
    const c = col(); params.push(toParam(f.type, value));
    return `(${c} = ?)`;
  }

  const parts: string[] = [];
  const opts = value as Record<string, unknown>;
  for (const [op, v] of Object.entries(opts)) {
    switch (op) {
      case "$options": break;
      case "$eq": parts.push(fieldCondition(table, path, v, params)); break;
      case "$ne": {
        if (v === null) { parts.push(`(${col()} IS NOT NULL)`); break; }
        const c = col(); params.push(toParam(f.type, v));
        parts.push(`(${c} <> ? OR ${(params.push(...f.params), f.expr)} IS NULL)`); break;
      }
      case "$in": case "$nin": {
        const list = (Array.isArray(v) ? v : []) as unknown[];
        const hasNull = list.some((x) => x === null || x === undefined);
        const vals = list.filter((x) => x !== null && x !== undefined).map((x) => toParam(f.type, x));
        if (op === "$in") {
          const sub: string[] = [];
          if (vals.length) { const c = col(); params.push(...vals); sub.push(`${c} IN (${vals.map(() => "?").join(",")})`); }
          if (hasNull) sub.push(`${col()} IS NULL`);
          parts.push(sub.length ? `(${sub.join(" OR ")})` : "(0=1)");
        } else {
          const sub: string[] = [];
          if (vals.length) { const c = col(); params.push(...vals); sub.push(`(${c} NOT IN (${vals.map(() => "?").join(",")}) OR ${(params.push(...f.params), f.expr)} IS NULL)`); }
          if (hasNull) sub.push(`${col()} IS NOT NULL`);
          parts.push(sub.length ? `(${sub.join(" AND ")})` : "(1=1)");
        }
        break;
      }
      case "$gt": case "$gte": case "$lt": case "$lte": {
        const sym = { $gt: ">", $gte: ">=", $lt: "<", $lte: "<=" }[op];
        const c = col(); params.push(toParam(f.type, v)); parts.push(`(${c} ${sym} ?)`); break;
      }
      case "$exists": parts.push(`(${col()} IS ${v ? "NOT " : ""}NULL)`); break;
      case "$regex": {
        const pattern = v instanceof RegExp ? v.source : String(v);
        const like = regexToLike(pattern);
        const c = col();
        if (like) { params.push(like); parts.push(`(${c} COLLATE utf8mb4_unicode_ci LIKE ? ESCAPE '|')`); }
        else { params.push(pattern); parts.push(`(${c} REGEXP ?)`); }
        break;
      }
      default: throw new Error(`Unsupported query operator "${op}".`);
    }
  }
  return parts.length ? `(${parts.join(" AND ")})` : "(1=1)";
}

/** Translates a document-style filter into a parameterised SQL WHERE clause (values are never concatenated into the SQL). */
export function buildWhere(table: string, filter: Filter | undefined, params: Params = []): string {
  if (!filter || Object.keys(filter).length === 0) return "1=1";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(filter)) {
    if (k === "$or" || k === "$and" || k === "$nor") {
      const subs = ((v as Filter[]) ?? []).map((sf) => buildWhere(table, sf, params));
      if (!subs.length) { parts.push(k === "$or" ? "(0=1)" : "(1=1)"); continue; }
      parts.push(k === "$or" ? `(${subs.join(" OR ")})` : k === "$and" ? `(${subs.join(" AND ")})` : `(NOT (${subs.join(" OR ")}))`);
    } else parts.push(fieldCondition(table, k, v, params));
  }
  return parts.join(" AND ");
}

export function buildOrderBy(table: string, sort: Sort | undefined, params: Params): string {
  const items: string[] = [];
  for (const [path, dir] of Object.entries(sort ?? {})) {
    const f = resolve(table, path);
    params.push(...f.params);
    items.push(`${f.expr} ${dir === -1 ? "DESC" : "ASC"}`);
  }
  items.push("`row_seq` ASC"); // stable tie-breaker = insertion order (what the document store gave us for free)
  return " ORDER BY " + items.join(", ");
}

/** Equality fields of a filter, used to seed the document created by an upsert. */
export function equalityFields(filter: Filter | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(filter ?? {})) {
    if (k.startsWith("$") || k.includes(".")) continue;
    if (isOperatorObject(v)) { if ("$eq" in v) out[k] = v.$eq; continue; }
    out[k] = v;
  }
  return out;
}
