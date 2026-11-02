import type { Db } from "@/lib/db";
import { COLLECTIONS, type BlogPostDoc, type CmsMetaDoc, type CmsPageDoc, type ExpertiseItemDoc, type HardwareProductDoc, type HomepageSectionConfigDoc, type JobPostingDoc, type ServiceSectionDoc, type TeamMemberDoc } from "@/lib/models";
import { jobPostingsFallback } from "@/data/pagesFallback";
import { DEFAULT_MEMBERS } from "@/data/teamFallback";
import { servicesDetailed } from "@/data/servicesDetailed";
import { defaultExpertiseDocs } from "./entities";
import { educationDefaults } from "./defaults/education";
import { bankingDefaults } from "./defaults/banking";
import { footerPageDefaults } from "./defaults/pages";
import { blogDefaults } from "./defaults/blog";
import { hardwareDefaults } from "./defaults/hardware";
import { HOME_DEFAULTS, HOME_KEYS, HOME_LABELS } from "./home";
import type { PageDefault } from "./sections";

/**
 * INITIAL DEFAULT DATA → the database. Idempotent and non-destructive:
 *  - every record is inserted with $setOnInsert, so existing (possibly admin-edited) records are NEVER overwritten
 *  - running it twice creates no duplicates (unique keys: pageKey / slug / section key)
 *  - after a dataset has been imported once a marker is stored in `cms_meta`, so defaults an admin deleted never reappear
 * No React/Next imports here, so the same code runs from `npm run seed:cms` and from the admin "Sync defaults" buttons.
 */

export const SEED_GROUPS = ["home", "education", "banking", "footer-pages", "blog", "hardware", "careers", "team", "expertise", "services"] as const;
export type SeedGroup = (typeof SEED_GROUPS)[number];
export type SeedReport = Record<string, { added: number; existing: number }>;

export const ALL_PAGE_DEFAULTS: PageDefault[] = [...educationDefaults, ...bankingDefaults, ...footerPageDefaults];
export const pageDefaultGroup = (p: PageDefault): SeedGroup => (p.kind === "education-tab" ? "education" : p.kind === "banking" ? "banking" : "footer-pages");

export async function ensureCmsIndexes(db: Db) {
  await Promise.all([
    db.collection(COLLECTIONS.cmsPages).createIndex({ pageKey: 1 }, { unique: true }),
    db.collection(COLLECTIONS.cmsPages).createIndex({ kind: 1, order: 1 }),
    db.collection(COLLECTIONS.blogPosts).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.hardwareProducts).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.homepageSections).createIndex({ key: 1 }, { unique: true }).catch(() => undefined), // legacy data may contain duplicates — never block on it
  ]);
}

async function mark(db: Db, group: SeedGroup) {
  await db.collection<CmsMetaDoc>(COLLECTIONS.cmsMeta).updateOne({ _id: `seeded:${group}` }, { $setOnInsert: { at: new Date() } }, { upsert: true });
}

export async function seedPages(db: Db, group: "education" | "banking" | "footer-pages"): Promise<{ added: number; existing: number }> {
  const col = db.collection<CmsPageDoc>(COLLECTIONS.cmsPages);
  let added = 0, existing = 0;
  for (const d of ALL_PAGE_DEFAULTS.filter((p) => pageDefaultGroup(p) === group)) {
    const now = new Date();
    const r = await col.updateOne({ pageKey: d.pageKey }, { $setOnInsert: { ...d, seo: {}, source: "default", createdAt: now, updatedAt: now } } as never, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, group);
  return { added, existing };
}

export async function seedBlogs(db: Db) {
  const col = db.collection<BlogPostDoc>(COLLECTIONS.blogPosts);
  let added = 0, existing = 0;
  for (const d of blogDefaults) {
    const now = new Date();
    const r = await col.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, createdAt: now, updatedAt: now } } as never, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "blog");
  return { added, existing };
}

export async function seedHardware(db: Db) {
  const col = db.collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts);
  let added = 0, existing = 0;
  for (const d of hardwareDefaults()) {
    const now = new Date();
    const r = await col.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, createdAt: now, updatedAt: now } } as never, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "hardware");
  return { added, existing };
}

/** Homepage: creates missing section docs, and fills `data` ONLY on docs that have none yet (never touches saved content). */
export async function seedHome(db: Db) {
  const col = db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections);
  let added = 0, existing = 0;
  for (const [i, key] of HOME_KEYS.entries()) {
    const r = await col.updateOne(
      { key },
      { $setOnInsert: { key, label: HOME_LABELS[key], visible: key !== "services", order: i, data: HOME_DEFAULTS[key] as unknown as Record<string, unknown>, updatedAt: new Date() } },
      { upsert: true }
    );
    if (r.upsertedCount) added++;
    else {
      existing++;
      await col.updateOne({ key, data: { $exists: false } }, { $set: { data: HOME_DEFAULTS[key] as unknown as Record<string, unknown>, label: HOME_LABELS[key], updatedAt: new Date() } });
    }
  }
  await mark(db, "home");
  return { added, existing };
}


/** Job openings of /careers (the three that used to exist only in code). */
export async function seedJobs(db: Db) {
  const col = db.collection<JobPostingDoc>(COLLECTIONS.jobPostings);
  let added = 0, existing = 0;
  for (const j of jobPostingsFallback) {
    const r = await col.updateOne({ title: j.title }, { $setOnInsert: { ...j, status: "published", postedAt: new Date() } } as never, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "careers");
  return { added, existing };
}

/** /management-team members. */
export async function seedTeam(db: Db) {
  const col = db.collection<TeamMemberDoc>(COLLECTIONS.managementTeam);
  let added = 0, existing = 0;
  for (const m of DEFAULT_MEMBERS) {
    const now = new Date();
    const r = await col.updateOne(
      { slug: m.slug },
      { $setOnInsert: { name: m.name, slug: m.slug, role: m.role, image: m.image, description: m.description ?? "", section: m.section, order: m.order, active: m.active, source: "default", createdAt: now, updatedAt: now } } as never,
      { upsert: true }
    );
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "team");
  return { added, existing };
}

/** /expertise/<slug> pages. */
export async function seedExpertise(db: Db) {
  const col = db.collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems);
  let added = 0, existing = 0;
  for (const d of defaultExpertiseDocs()) {
    const r = await col.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, status: "published", source: "default", updatedAt: new Date() } } as never, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "expertise");
  return { added, existing };
}

/** The alternating blocks of /services. */
export async function seedServices(db: Db) {
  const col = db.collection<ServiceSectionDoc>(COLLECTIONS.serviceSections);
  let added = 0, existing = 0;
  for (const [i, s] of servicesDetailed.entries()) {
    const slug = s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const r = await col.updateOne(
      { slug },
      { $setOnInsert: { slug, order: i, label: s.label, heading: s.heading, paragraph: s.paragraph, ctaLabel: s.ctaLabel, ctaHref: s.ctaHref, imageSide: s.imageSide, accent: s.accent, status: "published", updatedAt: new Date() } } as never,
      { upsert: true }
    );
    if (r.upsertedCount) added++; else existing++;
  }
  await mark(db, "services");
  return { added, existing };
}

export async function seedCms(db: Db, only?: SeedGroup[]): Promise<SeedReport> {
  await ensureCmsIndexes(db);
  const want = (g: SeedGroup) => !only || only.includes(g);
  const report: SeedReport = {};
  if (want("home")) report.home = await seedHome(db);
  if (want("education")) report.education = await seedPages(db, "education");
  if (want("banking")) report.banking = await seedPages(db, "banking");
  if (want("footer-pages")) report["footer-pages"] = await seedPages(db, "footer-pages");
  if (want("blog")) report.blog = await seedBlogs(db);
  if (want("hardware")) report.hardware = await seedHardware(db);
  if (want("careers")) report.careers = await seedJobs(db);
  if (want("team")) report.team = await seedTeam(db);
  if (want("expertise")) report.expertise = await seedExpertise(db);
  if (want("services")) report.services = await seedServices(db);
  return report;
}
