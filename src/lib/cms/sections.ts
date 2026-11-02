import type { CmsPageDoc, CmsSectionDoc } from "@/lib/models";
import type { Field } from "./schema";
import { seoGroup } from "./seo-fields";

/**
 * Generic section engine — the content model behind Education tabs, Banking pages and Footer pages.
 * A section = a renderer (`sectionType` + `variant`) + plain content. The React components keep the
 * animation/layout; this data supplies every word, image, link and the order.
 */

export const SECTION_TYPES = [
  { value: "text", label: "Heading + paragraphs (+ bullets / note)" },
  { value: "richText", label: "Rich text (formatted article / policy text)" },
  { value: "cards", label: "Cards / steps / courses (grid)" },
  { value: "list", label: "List (checklist, bullets, numbered, pills)" },
  { value: "image", label: "Large image / banner" },
  { value: "gallery", label: "Image gallery strip" },
  { value: "slider", label: "Image + text slider (e.g. partners)" },
  { value: "events", label: "Events (alternating image/text cards)" },
  { value: "stats", label: "Statistic counters" },
  { value: "cta", label: "Buttons row (call to action)" },
  { value: "banner", label: "Info banner with tags" },
  { value: "hero", label: "Page heading band" },
  { value: "applicationForm", label: "Application form (Admission / Bank CSP) — keeps working form" },
  { value: "emiCalculator", label: "EMI calculator (functional)" },
  { value: "bankEnquiry", label: "Chat + enquiry block (bank page)" },
] as const;

export const VARIANTS = [
  { value: "default", label: "Default look for this type" },
  // text
  { value: "text-plain", label: "Text · plain, left (white heading)" },
  { value: "text-centered", label: "Text · centred cyan heading" },
  { value: "text-amber", label: "Text · amber heading block" },
  // cards
  { value: "cards-accordion", label: "Cards · expandable courses" },
  { value: "cards-steps", label: "Cards · numbered steps (01 / 02 …)" },
  { value: "cards-steps-labelled", label: "Cards · steps labelled 'Step 1'" },
  { value: "cards-white", label: "Cards · white feature cards (2 col)" },
  { value: "cards-purple", label: "Cards · light purple info cards (2 col)" },
  { value: "cards-small", label: "Cards · small workshop cards" },
  { value: "cards-image", label: "Cards · image on top" },
  { value: "cards-icon", label: "Cards · icon-circle highlights (3 col)" },
  { value: "cards-program", label: "Cards · dark program cards (2 col)" },
  { value: "cards-info", label: "Cards · info boxes (title + lines)" },
  { value: "cards-loan", label: "Cards · loan products (light band)" },
  { value: "cards-feature", label: "Cards · generic dark feature cards" },
  // list
  { value: "cards-cloud", label: "Cards · icon + title service cards on dark band" },
  { value: "form-admission", label: "Form · student admission" },
  { value: "form-csp", label: "Form · Bank CSP application" },
  { value: "list-pills", label: "List · pill rows (2 col)" },
  { value: "list-checklist", label: "List · green-dot checklist" },
  { value: "list-check-red", label: "List · tick list (white text)" },
  { value: "list-numbered", label: "List · numbered (white text)" },
  { value: "list-numbered-card", label: "List · numbered inside a card" },
  { value: "list-bullets", label: "List · bullets" },
  // image
  { value: "image-banner", label: "Image · full-width rounded banner" },
  { value: "image-plain", label: "Image · plain rounded image" },
  // gallery
  { value: "gallery-snap", label: "Gallery · swipe strip" },
  // cta
  { value: "cta-gradient", label: "Buttons · purple/pink gradient" },
  { value: "cta-cyan", label: "Buttons · cyan + WhatsApp green" },
  { value: "cta-apply", label: "Buttons · big blue Apply button (hides when form opens)" },
  // hero
  { value: "hero-navy", label: "Heading band · navy, centred" },
  { value: "hero-title", label: "Heading band · amber uppercase title" },
  // richText
  { value: "rich-light", label: "Rich text · white page" },
  { value: "rich-dark", label: "Rich text · dark background" },
  { value: "rich-card", label: "Rich text · card with shadow (policy style)" },
] as const;

const typeIn = (...t: string[]) => ({ field: "sectionType", in: t });

export const buttonFields: Field[] = [
  { type: "text", name: "label", label: "Button label", max: 80 },
  { type: "url", name: "href", label: "Link (URL, /path or #anchor)" },
  { type: "select", name: "action", label: "On click", options: [{ value: "link", label: "Open the link" }, { value: "openForm", label: "Open the application form on this page" }] },
  { type: "boolean", name: "newTab", label: "Open in new tab" },
];

const tagFields: Field[] = [{ type: "text", name: "label", label: "Tag", max: 80 }];
const lineFields: Field[] = [{ type: "text", name: "label", label: "Bold label (optional)", max: 80 }, { type: "text", name: "text", label: "Text", max: 300 }];

export const sectionFields: Field[] = [
  { type: "text", name: "sectionKey", label: "Section key (unique id, optional)", max: 60, help: "Used for #anchors and stable references. Leave blank to auto-generate." },
  { type: "select", name: "sectionType", label: "Section type", options: SECTION_TYPES.map((t) => ({ value: t.value, label: t.label })) },
  { type: "select", name: "variant", label: "Layout / look", options: VARIANTS.map((v) => ({ value: v.value, label: v.label })), help: "Pick the look that matches the section type (see the prefix). 'Default' is always safe." },
  { type: "select", name: "width", label: "Width", options: [{ value: "full", label: "Full width" }, { value: "half", label: "Half — two consecutive 'half' sections sit side by side" }] },
  { type: "boolean", name: "visible", label: "Visible on website" },
  { type: "text", name: "title", label: "Heading", max: 200, showWhen: typeIn("text", "richText", "cards", "list", "gallery", "slider", "events", "banner", "hero", "applicationForm", "bankEnquiry") },
  { type: "text", name: "subtitle", label: "Sub-heading / accent text", max: 300, showWhen: typeIn("banner", "hero", "bankEnquiry"), help: "Banner: the cyan part of the heading. Chat block: heading of the enquiry form." },
  { type: "textarea", name: "description", label: "Paragraph(s) — separate paragraphs with a blank line", max: 6000, showWhen: typeIn("text", "cards", "list", "events", "hero", "bankEnquiry") },
  { type: "richtext", name: "html", label: "Content", max: 400000, showWhen: typeIn("richText", "banner") },
  { type: "textarea", name: "note", label: "Small note under the section", max: 1500, showWhen: typeIn("text", "list", "cards", "gallery", "cta", "bankEnquiry"), help: "Chat block: description of the enquiry form." },
  { type: "image", name: "image", label: "Image", showWhen: typeIn("image", "hero", "bankEnquiry") },
  { type: "text", name: "imageAlt", label: "Image alt text", max: 200, showWhen: typeIn("image", "hero", "bankEnquiry") },
  { type: "list", name: "bullets", label: "Bullet / list items", itemTitle: "text", addLabel: "Add item", max: 100, showWhen: typeIn("text", "list", "banner", "bankEnquiry"), help: "Banner: tags. Chat block: bank names in the dropdown.",
    fields: [{ type: "text", name: "text", label: "Text", max: 400 }] },
  { type: "list", name: "items", label: "Cards", itemTitle: "title", addLabel: "Add card", max: 60, showWhen: typeIn("cards"),
    help: "Which fields show depends on the chosen layout (e.g. category/badge/tags/duration are for course cards; lines are for info boxes).",
    fields: [
      { type: "text", name: "title", label: "Title", max: 200 },
      { type: "text", name: "subtitle", label: "Category / eyebrow", max: 120 },
      { type: "text", name: "badge", label: "Badge", max: 80 },
      { type: "textarea", name: "description", label: "Description", max: 2000 },
      { type: "image", name: "image", label: "Image" },
      { type: "text", name: "icon", label: "Icon (cards-icon: symbol/emoji; course cards: cpu · briefcase · scale · graduation · health · cloud; loan: emoji)", max: 40 },
      { type: "url", name: "link", label: "Link (optional)" },
      { type: "text", name: "meta", label: "Duration / small print", max: 100 },
      { type: "list", name: "tags", label: "Tags", itemTitle: "label", addLabel: "Add tag", max: 20, fields: tagFields },
      { type: "list", name: "lines", label: "Info lines (info boxes)", itemTitle: "text", addLabel: "Add line", max: 20, fields: lineFields },
      { type: "boolean", name: "visible", label: "Visible" },
    ] },
  { type: "list", name: "items", label: "Images", itemTitle: "title", addLabel: "Add image", max: 80, showWhen: typeIn("gallery", "slider"),
    fields: [
      { type: "image", name: "image", label: "Image" },
      { type: "text", name: "title", label: "Title / name", max: 200 },
      { type: "text", name: "subtitle", label: "Sub-text (slider)", max: 300 },
      { type: "boolean", name: "visible", label: "Visible" },
    ] },
  { type: "list", name: "items", label: "Events", itemTitle: "title", addLabel: "Add event", max: 60, showWhen: typeIn("events"),
    fields: [
      { type: "text", name: "title", label: "Event title", max: 200 },
      { type: "text", name: "meta", label: "Date (shown as text, e.g. Aug 15, 2025)", max: 100 },
      { type: "textarea", name: "description", label: "Description", max: 2000 },
      { type: "image", name: "image", label: "Event image" },
      { type: "url", name: "link", label: "Button link (blank = open admission form)" },
      { type: "boolean", name: "visible", label: "Visible" },
    ] },
  { type: "list", name: "items", label: "Counters", itemTitle: "title", addLabel: "Add counter", max: 8, showWhen: typeIn("stats"),
    fields: [
      { type: "text", name: "value", label: "Number (digits = animated counter; any other text is shown as is, e.g. UGC)", max: 20 },
      { type: "text", name: "suffix", label: "Suffix (e.g. + or %)", max: 5 },
      { type: "text", name: "title", label: "Label", max: 100 },
      { type: "text", name: "color", label: "Colour (hex)", max: 20 },
      { type: "boolean", name: "visible", label: "Visible" },
    ] },
  { type: "list", name: "buttons", label: "Buttons", itemTitle: "label", addLabel: "Add button", max: 6, showWhen: typeIn("cards", "events", "cta"), fields: buttonFields,
    help: "Cards (courses) and events use the first button's label for their own per-item button." },
];

export function blankSectionDefaults(): Record<string, unknown> {
  return { sectionKey: "", sectionType: "text", variant: "default", width: "full", visible: true, title: "", subtitle: "", description: "", html: "", note: "", image: "", imageAlt: "", items: [], bullets: [], buttons: [] };
}

const heroFields: Field = {
  type: "group", name: "hero", label: "Top banner (above the content)",
  fields: [
    { type: "boolean", name: "enabled", label: "Show the banner for this tab" },
    { type: "text", name: "badge", label: "Small badge text", max: 120 },
    { type: "text", name: "title", label: "Banner heading", max: 200 },
    { type: "textarea", name: "description", label: "Banner paragraph(s) — blank line between paragraphs", max: 3000 },
    { type: "image", name: "image", label: "Banner image (optional)" },
    { type: "list", name: "buttons", label: "Banner buttons", itemTitle: "label", addLabel: "Add button", max: 4, fields: buttonFields },
  ],
};

const sectionsList: Field = { type: "list", name: "sections", label: "Page sections (top → bottom)", itemTitle: "title", addLabel: "Add section", max: 60, fields: sectionFields };
const statusField: Field = { type: "select", name: "status", label: "Status", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft (hidden)" }] };

export const educationTabFields: Field[] = [
  { type: "text", name: "label", label: "Tab name (shown on the tab)", max: 60 },
  { type: "text", name: "slug", label: "Tab key / slug (used in /education#slug)", max: 60, help: "Lowercase letters, numbers and dashes. Changing it changes the tab's #link." },
  statusField,
  { type: "number", name: "order", label: "Tab order (lower = first)", min: 0, max: 9999 },
  { type: "select", name: "spacing", label: "Space between sections", options: [{ value: "14", label: "Tight (3.5rem)" }, { value: "16", label: "Roomy (4rem)" }] },
  heroFields,
  sectionsList,
  seoGroup,
];

export const bankingPageFields: Field[] = [
  { type: "text", name: "title", label: "Page title (admin label)", max: 150 },
  sectionsList,
  seoGroup,
];

export const footerPageFields: Field[] = [
  { type: "text", name: "title", label: "Page title (main heading)", max: 200 },
  { type: "image", name: "heroImage", label: "Top banner image" },
  statusField,
  sectionsList,
  seoGroup,
];

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
export { slugify };

/** Stable, unique sectionKeys + sequential order. Run before saving / after reading defaults. */
export function normalizeSections(raw: unknown): CmsSectionDoc[] {
  const arr = Array.isArray(raw) ? (raw as Partial<CmsSectionDoc>[]) : [];
  const seen = new Set<string>();
  return arr.map((s, i) => {
    let key = slugify(String(s.sectionKey || s.title || s.sectionType || "section")) || "section";
    if (seen.has(key)) key = `${key}-${i + 1}`;
    seen.add(key);
    return { ...blankSectionDefaults(), ...s, sectionKey: key, order: i } as CmsSectionDoc;
  });
}

export type PageDefault = Omit<CmsPageDoc, "_id" | "createdAt" | "updatedAt" | "source">;
