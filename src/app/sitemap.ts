import type { MetadataRoute } from "next";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type SeoMetaDoc } from "@/lib/models";
import { SEO_PAGES } from "@/lib/seo-pages";
import { getSettings } from "@/lib/cms/content";
import { getExpertiseList } from "@/lib/cms/expertise";

export const dynamic = "force-dynamic";

/** Published, indexable public pages only — never admin, drafts, noindex pages or the external Directory. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = settings.siteUrl.replace(/\/$/, "");

  const noindex = new Set<string>();
  if (isDbConfigured()) {
    try {
      const docs = await (await getDb()).collection<SeoMetaDoc>(COLLECTIONS.seoMeta).find({ noIndex: true }, { projection: { pageSlug: 1 } }).toArray();
      docs.forEach((d) => noindex.add(d.pageSlug));
    } catch { /* ignore — sitemap still renders */ }
  }

  const expertise = await getExpertiseList();
  const expertiseSlugs = new Set(expertise.map((e) => `/expertise/${e.slug}`));
  const paths = new Set<string>(["/", "/education/admission", "/banking/loan/apply"]);
  for (const p of SEO_PAGES) {
    if (p.slug.startsWith("/expertise/")) continue; // use the live (published) expertise list instead
    paths.add(p.slug);
  }
  expertiseSlugs.forEach((p) => paths.add(p));

  const now = new Date();
  return [...paths]
    .filter((p) => !noindex.has(p))
    .map((p) => ({
      url: `${base}${p === "/" ? "" : p}`,
      lastModified: now,
      changeFrequency: p === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "/" ? 1 : p.startsWith("/expertise/") ? 0.6 : 0.8,
    }));
}
