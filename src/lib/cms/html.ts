import sanitizeHtml from "sanitize-html";
import type { Field } from "./schema";

/** Server-only. Whitelists the HTML produced by the rich-text editor so stored content can be rendered safely. */
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "br", "ul", "ol", "li", "a", "blockquote", "img", "hr", "span", "div", "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "sup", "sub", "section"],
    allowedAttributes: { a: ["href", "target", "rel", "name"], img: ["src", "alt", "title", "width", "height"], "*": ["class"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    transformTags: { a: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, ...(attribs.target === "_blank" || /^https?:/i.test(attribs.href ?? "") ? { rel: "noopener noreferrer" } : {}) } }) },
  }).trim();
}

type Obj = Record<string, unknown>;

/** Walks a schema and runs cleanHtml() over every `richtext` field (including inside lists/groups). */
export function sanitizeRichFields(fields: Field[], data: Obj): Obj {
  const out: Obj = { ...data };
  for (const f of fields) {
    const v = out[f.name];
    if (f.type === "richtext" && typeof v === "string") out[f.name] = cleanHtml(v);
    else if (f.type === "group" && v && typeof v === "object") out[f.name] = sanitizeRichFields(f.fields, v as Obj);
    else if (f.type === "list" && Array.isArray(v)) out[f.name] = v.map((i) => (i && typeof i === "object" ? sanitizeRichFields(f.fields, i as Obj) : i));
  }
  return out;
}

/** Plain-text excerpt from stored HTML (for blog cards / meta descriptions). */
export function htmlToText(html: string, max = 200): string {
  const t = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}
