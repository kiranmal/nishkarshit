import type { Field } from "./schema";
import { seoGroup } from "./seo-fields";

/** Admin form for a Blog post (the public /blogs page — not the directory blog). */
export const blogFields: Field[] = [
  { type: "text", name: "title", label: "Blog title", max: 200 },
  { type: "text", name: "author", label: "Author name", max: 100 },
  { type: "text", name: "tagline", label: "Tagline (shown on the blog card)", max: 300 },
  { type: "image", name: "bannerImage", label: "Banner image" },
  { type: "richtext", name: "content", label: "Content", max: 400000, help: "Headings, bold, italic, underline, lists, links, quotes and paragraphs are supported." },
  { type: "text", name: "tags", label: "Tags (comma separated)", max: 300 },
  { type: "text", name: "slug", label: "Slug (URL: /blogs/your-slug)", max: 100, help: "Leave blank to generate from the title. Changing it keeps the old link working (it redirects)." },
  { type: "date", name: "publishedAt", label: "Published date" },
  { type: "boolean", name: "featured", label: "Featured blog (shown first, with a badge)" },
  { type: "select", name: "status", label: "Status", options: [{ value: "published", label: "Published — visible on /blogs" }, { value: "draft", label: "Draft — hidden" }] },
  seoGroup,
];

const FORM_TYPES = ["text", "email", "tel", "number", "textarea"].map((v) => ({ value: v, label: v }));

/** Admin form for a hardware product (/banking/csp-hardware/[slug]). */
export const hardwareFields: Field[] = [
  { type: "text", name: "name", label: "Product name", max: 150 },
  { type: "text", name: "slug", label: "Slug (URL: /banking/csp-hardware/your-slug)", max: 100, help: "Leave blank to generate from the name. Changing it keeps the old link working (it redirects)." },
  { type: "select", name: "status", label: "Status", options: [{ value: "published", label: "Published — visible" }, { value: "draft", label: "Draft — hidden" }] },
  { type: "textarea", name: "description", label: "Description", max: 4000 },
  { type: "image", name: "image", label: "Main image" },
  { type: "list", name: "images", label: "Extra images", itemTitle: "image", addLabel: "Add image", max: 12, fields: [{ type: "image", name: "image", label: "Image" }] },
  { type: "text", name: "unitPrice", label: "Unit price (₹, shown as entered — leave blank to hide)", max: 30 },
  { type: "list", name: "formFields", label: "Enquiry form fields", itemTitle: "label", addLabel: "Add field", max: 20, help: "These are the fields visitors fill in on the product page.",
    fields: [
      { type: "text", name: "label", label: "Label", max: 100 },
      { type: "text", name: "name", label: "Field key (letters/numbers, e.g. companyName)", max: 40 },
      { type: "select", name: "type", label: "Type", options: FORM_TYPES },
      { type: "boolean", name: "required", label: "Required" },
    ] },
  { type: "textarea", name: "terms", label: "Terms (a checkbox visitors must accept — leave blank for none)", max: 3000 },
  seoGroup,
];

/** Admin-side base for each homepage section (visibility lives in the section config, content in `data`). */
export const homeBaseField: Field = { type: "boolean", name: "visible", label: "Show this section on the homepage" };
