/**
 * MySQL schema of the application — the single source of truth for table/column definitions.
 * `migrations/001_initial_schema.sql` is generated from this file (npm run db:schema).
 *
 * Every table has:  id (primary key) · row_seq (insertion order) · typed columns · extra (JSON, for any field not listed).
 * Nested content (cards, sections, SEO, galleries …) is stored in JSON columns; scalar fields are real typed columns.
 */
export type ColType =
  | { t: "str"; n: number }
  | { t: "text" }
  | { t: "long" }
  | { t: "int" }
  | { t: "bigint" }
  | { t: "float" }
  | { t: "bool" }
  | { t: "date" }
  | { t: "json" };

export interface TableDef {
  /** "oid": 24-hex ObjectId-style ids exposed as ObjectId · "string": natural string keys (module name, counter name). */
  idType: "oid" | "string";
  columns: Record<string, ColType>;
  unique?: string[];
  index?: string[][];
}

const s = (n = 255): ColType => ({ t: "str", n });
const text: ColType = { t: "text" };
const long: ColType = { t: "long" };
const int: ColType = { t: "int" };
const bigint: ColType = { t: "bigint" };
const float: ColType = { t: "float" };
const bool: ColType = { t: "bool" };
const date: ColType = { t: "date" };
const json: ColType = { t: "json" };

const seoCols = { seo: json };
void seoCols;

export const TABLES: Record<string, TableDef> = {
  admin_users: {
    idType: "oid",
    columns: { email: s(191), passwordHash: s(255), role: s(32), name: s(255), createdAt: date },
    unique: ["email"],
  },
  seo_meta: {
    idType: "oid",
    columns: { pageSlug: s(191), title: s(500), description: text, ogImage: text, keywords: text, canonicalUrl: text, ogTitle: s(500), ogDescription: text, twitterTitle: s(500), twitterDescription: text, twitterImage: text, noIndex: bool, noFollow: bool, updatedAt: date },
    unique: ["pageSlug"],
  },
  site_content: {
    idType: "string",
    columns: { data: json, updatedAt: date, updatedBy: s(255) },
  },
  cms_meta: { idType: "string", columns: { at: date } },
  counters: { idType: "string", columns: { seq: bigint } },
  homepage_sections: {
    idType: "oid",
    columns: { key: s(100), label: s(255), visible: bool, order: int, heading: text, description: text, image: text, buttonLabel: s(255), buttonHref: text, data: json, updatedAt: date },
    unique: ["key"],
  },
  cms_pages: {
    idType: "oid",
    columns: { pageKey: s(191), kind: s(32), slug: s(191), label: s(255), title: s(500), path: s(500), status: s(16), order: int, spacing: s(4), hero: json, heroImage: text, sections: json, seo: json, source: s(16), createdAt: date, updatedAt: date },
    unique: ["pageKey"],
    index: [["kind", "order"], ["kind", "slug"]],
  },
  blog_posts: {
    idType: "oid",
    columns: { title: s(500), slug: s(191), author: s(255), tagline: text, bannerImage: text, content: long, tags: json, featured: bool, status: s(16), publishedAt: date, previousSlugs: json, seo: json, source: s(16), createdAt: date, updatedAt: date },
    unique: ["slug"],
    index: [["status", "publishedAt"]],
  },
  hardware_products: {
    idType: "oid",
    columns: { slug: s(191), name: s(500), description: text, image: text, images: json, unitPrice: s(64), formFields: json, terms: text, status: s(16), order: int, previousSlugs: json, seo: json, source: s(16), createdAt: date, updatedAt: date },
    unique: ["slug"],
    index: [["status", "order"]],
  },
  expertise_items: {
    idType: "oid",
    columns: { slug: s(191), order: int, title: s(500), paragraph: long, accent: s(32), image: text, introImage: text, sections: json, formTitle: s(500), formOptions: json, seo: json, source: s(16), status: s(16), updatedAt: date },
    unique: ["slug"],
    index: [["status", "order"]],
  },
  service_sections: {
    idType: "oid",
    columns: { slug: s(191), order: int, label: s(255), heading: s(500), paragraph: long, ctaLabel: s(255), ctaHref: text, imageSide: s(8), imageUrl: text, accent: s(32), status: s(16), updatedAt: date },
    unique: ["slug"],
    index: [["status", "order"]],
  },
  management_team: {
    idType: "oid",
    columns: { name: s(255), slug: s(191), role: s(255), image: text, description: text, email: s(255), linkedin: text, section: s(32), order: int, active: bool, source: s(16), createdAt: date, updatedAt: date },
    unique: ["slug"],
    index: [["section", "order"]],
  },
  media: {
    idType: "oid",
    columns: { url: text, publicId: s(500), filename: s(500), alt: s(500), title: s(500), mimeType: s(128), bytes: bigint, width: int, height: int, folder: s(255), uploadedBy: s(255), createdAt: date },
    index: [["createdAt"]],
  },
  form_submissions: {
    idType: "oid",
    columns: { formType: s(191), formLabel: s(255), name: s(255), email: s(255), phone: s(64), data: json, sourceUrl: text, ip: s(64), userAgent: text, crmStatus: s(32), adminNotes: text, updatedAt: date, createdAt: date },
    index: [["formType", "createdAt"], ["crmStatus"]],
  },
  enquiries: {
    idType: "oid",
    columns: { source: s(64), name: s(255), email: s(255), phone: s(64), message: long, createdAt: date, status: s(32), crmStatus: s(32), adminNotes: text, updatedAt: date },
    index: [["createdAt"], ["status"]],
  },
  job_postings: {
    idType: "oid",
    columns: { title: s(500), location: s(255), type: s(64), postedAt: date, description: long, status: s(16) },
    index: [["status", "postedAt"]],
  },
  job_applications: {
    idType: "oid",
    columns: { jobTitle: s(500), name: s(255), email: s(255), phone: s(64), message: long, resumeNote: text, createdAt: date, status: s(32), crmStatus: s(32), adminNotes: text, updatedAt: date },
    index: [["createdAt"]],
  },
  partner_applications: {
    idType: "oid",
    columns: { fullName: s(255), businessName: s(255), email: s(255), phone: s(64), businessCategory: s(255), notes: long, createdAt: date, status: s(32), crmStatus: s(32), adminNotes: text, updatedAt: date },
    index: [["createdAt"]],
  },
  bank_csp_applications: {
    idType: "oid",
    columns: { fullName: s(255), fatherOrSpouseName: s(255), dob: s(32), gender: s(32), phone: s(64), email: s(255), address: text, createdAt: date, status: s(32), crmStatus: s(32), adminNotes: text, updatedAt: date },
    index: [["createdAt"]],
  },
  admission_applications: {
    idType: "oid",
    columns: { applicationNumber: s(64), status: s(32), crmStatus: s(32), adminNotes: text, personal: json, education: json, loan: json, additional: json, createdAt: date, updatedAt: date },
    unique: ["applicationNumber"],
    index: [["createdAt"], ["status"]],
  },
  loan_applications: {
    idType: "oid",
    columns: { applicationNumber: s(64), status: s(32), crmStatus: s(32), adminNotes: text, personal: json, education: json, loan: json, additional: json, createdAt: date, updatedAt: date },
    unique: ["applicationNumber"],
    index: [["createdAt"], ["status"]],
  },
  festivals: {
    idType: "oid",
    columns: { name: s(255), slug: s(191), startDate: date, endDate: date, active: bool, bannerText: text, background: text, primaryColor: s(64), accentColor: s(64), decoration: s(32), popupText: text, popupImage: text, priority: int, createdAt: date, updatedAt: date },
    unique: ["slug"],
  },
  site_theme: {
    idType: "oid",
    columns: { key: s(64), enabled: bool, presetName: s(255), primaryColor: s(64), accentColor: s(64), bannerText: text, decoration: s(32), updatedAt: date },
    unique: ["key"],
  },
  directory_listings: {
    idType: "oid",
    columns: { name: s(255), slug: s(191), category: s(191), city: s(191), address: text, phone: s(64), whatsapp: s(64), email: s(255), website: text, logoUrl: text, logoColor: s(32), description: long, tagline: text, whyChooseUs: json, services: json, products: json, gallery: json, videoUrl: text, latitude: float, longitude: float, mapUrl: text, hours: json, reviews: json, rating: float, plan: s(16), status: s(16), metaTitle: s(500), metaDescription: text, metaKeywords: text, createdAt: date, updatedAt: date },
    unique: ["slug"],
    index: [["status"], ["category"], ["city"]],
  },
  directory_categories: {
    idType: "oid",
    columns: { name: s(255), icon: s(32), order: int, status: s(16) },
    index: [["status", "order"]],
  },
  directory_blogs: {
    idType: "oid",
    columns: { title: s(500), excerpt: text, coverColor: s(64), slug: s(191), publishedAt: date, status: s(16) },
    unique: ["slug"],
  },
  directory_customers: {
    idType: "oid",
    columns: { name: s(255), email: s(191), mobile: s(64), address: text, passwordHash: s(255), createdAt: date },
    index: [["email"]],
  },
  directory_clients: {
    idType: "oid",
    columns: { name: s(255), email: s(191), passwordHash: s(255), createdAt: date },
    index: [["email"]],
  },
};

export const TABLE_NAMES = Object.keys(TABLES);
