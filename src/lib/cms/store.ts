import { cache } from "react";
import { getDb, isDbConfigured } from "@/lib/db";
import { COLLECTIONS, type BlogPostDoc, type CmsMetaDoc, type CmsPageDoc, type HardwareProductDoc, type HomepageSectionConfigDoc } from "@/lib/models";
import { mergeDefaults } from "./schema";
import { ALL_PAGE_DEFAULTS, type SeedGroup } from "./seed";
import { blogDefaults } from "./defaults/blog";
import { hardwareDefaults } from "./defaults/hardware";
import { HOME_DEFAULTS, HOME_KEYS, type HomeContentMap, type HomeKey } from "./home";
import { normalizeSections, type PageDefault } from "./sections";

/**
 * Read side of the CMS (public pages + admin lists).
 * Rule: the database is the source of truth. The shipped defaults are used ONLY when the database is not configured / unreachable,
 * or when a dataset has never been imported (first install). Once imported (cms_meta marker) a record that was deleted stays deleted.
 */

/** Strips ObjectIds/Dates so documents can be handed to Client Components. */
export function plain<T>(v: T): T {
  return JSON.parse(JSON.stringify(v, (k, val) => (k === "_id" ? undefined : val)));
}

const EPOCH = new Date(0);
const pageFromDefault = (d: PageDefault): CmsPageDoc => ({ ...d, seo: {}, source: "default", createdAt: EPOCH, updatedAt: EPOCH });

/** True while a dataset has never been imported into the database (first install) — only then may the shipped defaults be shown. */
export async function neverImported(group: SeedGroup): Promise<boolean> {
  const db = await getDb();
  return !(await db.collection<CmsMetaDoc>(COLLECTIONS.cmsMeta).findOne({ _id: `seeded:${group}` }, { projection: { _id: 1 } }));
}

const groupOf = (kind: CmsPageDoc["kind"]): SeedGroup => (kind === "education-tab" ? "education" : kind === "banking" ? "banking" : "footer-pages");

/* ------------------------------------------------------------- pages --- */
export const getCmsPage = cache(async (pageKey: string): Promise<CmsPageDoc | null> => {
  const def = ALL_PAGE_DEFAULTS.find((p) => p.pageKey === pageKey);
  if (!isDbConfigured()) return def ? pageFromDefault(def) : null;
  try {
    const doc = await (await getDb()).collection<CmsPageDoc>(COLLECTIONS.cmsPages).findOne({ pageKey });
    if (doc) return { ...doc, sections: normalizeSections(doc.sections) };
  } catch (err) {
    console.error(`[cms] could not read page "${pageKey}":`, err);
  }
  // Fixed pages (policies, banking…) can't be deleted, so a missing record just means "not imported yet".
  return def && def.kind !== "education-tab" ? pageFromDefault(def) : null;
});

/** Published education tabs in display order. */
export const getEducationTabs = cache(async (): Promise<CmsPageDoc[]> => {
  const defaults = () => ALL_PAGE_DEFAULTS.filter((p) => p.kind === "education-tab").map(pageFromDefault);
  if (!isDbConfigured()) return defaults();
  try {
    const docs = await (await getDb()).collection<CmsPageDoc>(COLLECTIONS.cmsPages).find({ kind: "education-tab", status: "published" }).sort({ order: 1 }).toArray();
    if (docs.length === 0 && (await neverImported("education"))) return defaults();
    return docs.map((d) => ({ ...d, sections: normalizeSections(d.sections) }));
  } catch (err) {
    console.error("[cms] could not read education tabs:", err);
    return defaults();
  }
});

export async function getEducationTab(slug: string) {
  return (await getEducationTabs()).find((t) => t.slug === slug) ?? null;
}

/** Every page of a kind regardless of status (admin lists). */
export async function listPages(kind: CmsPageDoc["kind"]): Promise<CmsPageDoc[]> {
  const defaults = ALL_PAGE_DEFAULTS.filter((p) => p.kind === kind).map(pageFromDefault);
  if (!isDbConfigured()) return defaults;
  const docs = await (await getDb()).collection<CmsPageDoc>(COLLECTIONS.cmsPages).find({ kind }).sort({ order: 1 }).toArray();
  if (docs.length === 0 && (await neverImported(groupOf(kind)))) return defaults;
  return docs;
}

/* ----------------------------------------------------------- homepage --- */
export interface HomeSectionView<K extends HomeKey = HomeKey> { key: K; visible: boolean; order: number; content: HomeContentMap[K] }

export const getHomeSections = cache(async (): Promise<HomeSectionView[]> => {
  let docs: HomepageSectionConfigDoc[] = [];
  if (isDbConfigured()) {
    try { docs = await (await getDb()).collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections).find().toArray(); }
    catch (err) { console.error("[cms] could not read homepage sections:", err); }
  }
  const byKey = new Map(docs.map((d) => [d.key, d]));
  return HOME_KEYS.map((key, i) => {
    const doc = byKey.get(key);
    const defaults = HOME_DEFAULTS[key] as unknown as Record<string, unknown>;
    const merged = mergeDefaults(defaults, doc?.data ?? {});
    // Backwards compatibility: heading/description overrides saved by the previous admin screen.
    if (doc && !doc.data) {
      if (doc.heading && "heading" in merged) merged.heading = doc.heading;
      if (doc.description && "description" in merged) merged.description = doc.description;
    }
    // "services" existed in the old admin list but was never rendered on the homepage — keep it hidden until an admin turns it on.
    const visible = doc ? (key === "services" && !doc.data ? false : doc.visible) : key !== "services";
    return { key, visible, order: doc?.order ?? i, content: merged as never };
  }).sort((a, b) => a.order - b.order);
});

/* --------------------------------------------------------------- blogs --- */
const blogDefaultDocs = (): BlogPostDoc[] => blogDefaults.map((b) => ({ ...b, createdAt: EPOCH, updatedAt: EPOCH }));
const byFeaturedThenDate = (a: BlogPostDoc, b: BlogPostDoc) => Number(b.featured) - Number(a.featured) || +new Date(b.publishedAt) - +new Date(a.publishedAt);

export const getPublishedBlogs = cache(async (): Promise<BlogPostDoc[]> => {
  if (!isDbConfigured()) return blogDefaultDocs().sort(byFeaturedThenDate);
  try {
    const docs = await (await getDb()).collection<BlogPostDoc>(COLLECTIONS.blogPosts).find({ status: "published" }).toArray();
    if (docs.length === 0 && (await neverImported("blog"))) return blogDefaultDocs();
    return docs.sort(byFeaturedThenDate);
  } catch (err) {
    console.error("[cms] could not read blogs:", err);
    return blogDefaultDocs();
  }
});

/** Returns the post for a slug, or { redirectTo } when the slug was changed in the admin. */
export async function findBlog(slug: string): Promise<{ post: BlogPostDoc } | { redirectTo: string } | null> {
  const list = await getPublishedBlogs();
  const hit = list.find((b) => b.slug === slug);
  if (hit) return { post: hit };
  if (!isDbConfigured()) return null;
  try {
    const old = await (await getDb()).collection<BlogPostDoc>(COLLECTIONS.blogPosts).findOne({ previousSlugs: slug, status: "published" }, { projection: { slug: 1 } });
    if (old) return { redirectTo: old.slug };
  } catch { /* ignore */ }
  return null;
}

/* ------------------------------------------------------------ hardware --- */
const hwDefaultDocs = (): HardwareProductDoc[] => hardwareDefaults().map((h) => ({ ...h, createdAt: EPOCH, updatedAt: EPOCH }));

export const getPublishedHardware = cache(async (): Promise<HardwareProductDoc[]> => {
  if (!isDbConfigured()) return hwDefaultDocs();
  try {
    const docs = await (await getDb()).collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts).find({ status: "published" }).sort({ order: 1 }).toArray();
    if (docs.length === 0 && (await neverImported("hardware"))) return hwDefaultDocs();
    return docs;
  } catch (err) {
    console.error("[cms] could not read hardware:", err);
    return hwDefaultDocs();
  }
});

export async function findHardware(slug: string): Promise<{ product: HardwareProductDoc } | { redirectTo: string } | null> {
  const list = await getPublishedHardware();
  const hit = list.find((p) => p.slug === slug);
  if (hit) return { product: hit };
  if (!isDbConfigured()) return null;
  try {
    const old = await (await getDb()).collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts).findOne({ previousSlugs: slug, status: "published" }, { projection: { slug: 1 } });
    if (old) return { redirectTo: old.slug };
  } catch { /* ignore */ }
  return null;
}
