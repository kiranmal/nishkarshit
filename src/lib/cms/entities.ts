import { expertiseItems } from "@/data/expertiseFallback";
import type { Field } from "./schema";
import { seoGroup } from "./seo-fields";

/* ------------------------------- EXPERTISE ------------------------------- */
export const expertiseFields: Field[] = [
  { type: "text", name: "title", label: "Title", max: 120 },
  { type: "textarea", name: "paragraph", label: "Short description (intro)", max: 1500 },
  { type: "text", name: "accent", label: "Accent colour (hex, e.g. #17b6e8)", max: 20 },
  { type: "image", name: "image", label: "Hero image" },
  { type: "image", name: "introImage", label: "Intro image" },
  { type: "select", name: "status", label: "Status", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft (hidden)" }] },
  { type: "number", name: "order", label: "Display order (lower = first)", min: 0, max: 9999 },
  {
    type: "list", name: "sections", label: "Content sections", itemTitle: "title", addLabel: "Add section", max: 30,
    fields: [{ type: "text", name: "title", label: "Section title", max: 150 }, { type: "textarea", name: "description", label: "Description", max: 3000 }],
  },
  { type: "text", name: "formTitle", label: "Enquiry form title", max: 150 },
  {
    type: "list", name: "formOptions", label: "Enquiry form options", itemTitle: "label", addLabel: "Add option", max: 40,
    fields: [{ type: "text", name: "label", label: "Option", max: 150 }],
  },
  seoGroup,
];

/** Defaults from the code (expertiseFallback.ts), shaped as stored documents. */
export function defaultExpertiseDocs() {
  return expertiseItems.map((e, i) => ({
    slug: e.slug,
    order: i,
    title: e.title,
    paragraph: e.paragraph,
    accent: e.accent,
    image: e.image && !/^YOUR-/i.test(e.image) ? e.image : "",
    introImage: e.introImage ?? "",
    sections: e.sections ?? [],
    formTitle: e.form?.title ?? e.title,
    formOptions: (e.form?.options ?? []).map((o) => o.label),
  }));
}

/* ------------------------------ MANAGEMENT TEAM --------------------------- */
export const TEAM_SECTIONS = [
  { value: "hod", label: "HOD" },
  { value: "legal", label: "Legal Team" },
  { value: "management", label: "Management Team" },
  { value: "our-team", label: "Our Team" },
];

export const teamFields: Field[] = [
  { type: "text", name: "name", label: "Name", max: 100 },
  { type: "text", name: "role", label: "Designation", max: 120 },
  { type: "image", name: "image", label: "Profile photo" },
  { type: "textarea", name: "description", label: "Biography", max: 3000 },
  { type: "email", name: "email", label: "Email" },
  { type: "url", name: "linkedin", label: "LinkedIn URL" },
  { type: "select", name: "section", label: "Group on the page", options: TEAM_SECTIONS },
  { type: "number", name: "order", label: "Display order (lower = first)", min: 0, max: 9999 },
  { type: "boolean", name: "active", label: "Published (visible on website)" },
];
