/**
 * Tiny schema system for the CMS content editor.
 * Client-safe: used by the admin editor (rendering) AND the server action (validation).
 */
export type Field =
  | { type: "text" | "textarea" | "url" | "image" | "email"; name: string; label: string; help?: string; max?: number; placeholder?: string; noData?: boolean }
  | { type: "boolean"; name: string; label: string; help?: string }
  | { type: "number"; name: string; label: string; help?: string; min?: number; max?: number }
  | { type: "select"; name: string; label: string; help?: string; options: { value: string; label: string }[] }
  | { type: "list"; name: string; label: string; help?: string; itemTitle: string; fields: Field[]; max?: number; addLabel?: string }
  | { type: "group"; name: string; label: string; help?: string; fields: Field[] };

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = Record<string, unknown>;

const SAFE_URL = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;

/** Allows site-relative paths, anchors, http(s), mailto and tel. Everything else (javascript:, data:) is dropped. */
export function safeUrl(value: unknown): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return "";
  return SAFE_URL.test(v) ? v.slice(0, 2000) : "";
}

const DATA_IMAGE = /^data:image\/(jpeg|png|gif|webp|avif);base64,[A-Za-z0-9+/=]+$/;
const MAX_DATA_IMAGE = 600_000; // characters (~450 KB) — larger pasted images should be uploaded instead

/** Image fields: a normal URL, or a pasted `data:image/...;base64` (Google thumbnails) up to a size cap. */
export function safeImage(value: unknown, allowData = true): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (allowData && v.length <= MAX_DATA_IMAGE && DATA_IMAGE.test(v)) return v;
  return safeUrl(v);
}

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Validates + coerces untrusted input against the schema. Unknown keys are dropped. */
export function sanitize(fields: Field[], input: unknown): Obj {
  const src = isObj(input) ? input : {};
  const out: Obj = {};
  for (const f of fields) {
    const v = src[f.name];
    switch (f.type) {
      case "text":
      case "textarea":
        out[f.name] = (typeof v === "string" ? v : "").slice(0, f.max ?? (f.type === "textarea" ? 5000 : 500)).trim();
        break;
      case "email": {
        const e = (typeof v === "string" ? v : "").trim().slice(0, 200);
        out[f.name] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : "";
        break;
      }
      case "url":
        out[f.name] = safeUrl(v);
        break;
      case "image":
        out[f.name] = safeImage(v, !f.noData);
        break;
      case "boolean":
        out[f.name] = v === true || v === "true";
        break;
      case "number": {
        let n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
        if (!Number.isFinite(n)) n = 0;
        if (f.min !== undefined) n = Math.max(f.min, n);
        if (f.max !== undefined) n = Math.min(f.max, n);
        out[f.name] = n;
        break;
      }
      case "select": {
        const s = typeof v === "string" ? v : "";
        out[f.name] = f.options.some((o) => o.value === s) ? s : f.options[0]?.value ?? "";
        break;
      }
      case "group":
        out[f.name] = sanitize(f.fields, v);
        break;
      case "list": {
        const arr = Array.isArray(v) ? v.slice(0, f.max ?? 100) : [];
        out[f.name] = arr.map((item) => sanitize(f.fields, item));
        break;
      }
    }
  }
  return out;
}

/** Deep-merges stored data over defaults. Arrays are replaced wholesale (admin owns the list). */
export function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (isObj(defaults)) {
    const s = isObj(stored) ? stored : {};
    const out: Obj = { ...defaults };
    for (const k of Object.keys(defaults)) {
      out[k] = k in s ? mergeDefaults((defaults as Obj)[k], s[k]) : (defaults as Obj)[k];
    }
    return out as T;
  }
  return (stored === undefined || stored === null ? defaults : stored) as T;
}

/** Blank object for a list item, so "Add" produces a fully-formed row. */
export function blankItem(fields: Field[]): Obj {
  const o: Obj = {};
  for (const f of fields) {
    o[f.name] =
      f.type === "boolean" ? true : f.type === "number" ? 0 : f.type === "list" ? [] : f.type === "group" ? blankItem(f.fields) : f.type === "select" ? f.options[0]?.value ?? "" : "";
  }
  return o;
}
