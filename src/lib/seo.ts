import type { Metadata } from "next";
import { cache } from "react";
import { getDb, isDbConfigured } from "@/lib/db";
import { COLLECTIONS, type SeoMetaDoc } from "@/lib/models";
import { getSeoDefault } from "@/lib/seo-pages";
import { getSettings } from "@/lib/cms/content";
import type { EntitySeo } from "@/lib/cms/seo-fields";


const SITE_NAME = "Nishkarsh IT Solution";
/** Reads the admin-saved SEO doc for a route (null when unset or DB unavailable). */
export const getSeoDoc = cache(async (slug: string): Promise<SeoMetaDoc | null> => {
  if (!isDbConfigured()) return null;
  try {
    const db = await getDb();
    return await db.collection<SeoMetaDoc>(COLLECTIONS.seoMeta).findOne({ pageSlug: slug });
  } catch {
    return null;
  }
});
export async function getPageMetadata(
  pageSlug: string,
  fallback: { title: string; description: string }
): Promise<Metadata> {
  let doc: SeoMetaDoc | null = null;

  if (isDbConfigured()) {
    try {
      const db = await getDb();
      doc = await db.collection<SeoMetaDoc>(COLLECTIONS.seoMeta).findOne({ pageSlug });
    } catch {
      doc = null;
    }
  }

  const title = doc?.title || fallback.title;
  const description = doc?.description || fallback.description;
  const keywords = doc?.keywords
    ? doc.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      ...(doc?.ogImage ? { images: [{ url: doc.ogImage }] } : {}),
    },
  };
}


/** Entity-level SEO (blog post, hardware product, CMS page…) overrides the route-level /admin/seo record, field by field. */
function mergeEntitySeo(doc: SeoMetaDoc | null, e?: EntitySeo): SeoMetaDoc | null {
  if (!e) return doc;
  const has = Object.values(e).some((v) => (typeof v === "string" ? v.trim() : v));
  if (!has) return doc;
  const pick = (a: string | undefined, b: string | undefined) => (a && a.trim() ? a : b);
  return {
    ...(doc ?? ({} as SeoMetaDoc)),
    title: pick(e.metaTitle, doc?.title) as string,
    description: pick(e.metaDescription, doc?.description) as string,
    keywords: pick(e.metaKeywords, doc?.keywords) as string,
    canonicalUrl: pick(e.canonicalUrl, doc?.canonicalUrl),
    ogTitle: pick(e.ogTitle, doc?.ogTitle),
    ogDescription: pick(e.ogDescription, doc?.ogDescription),
    ogImage: pick(e.ogImage, doc?.ogImage),
    twitterTitle: pick(e.twitterTitle, doc?.twitterTitle),
    twitterDescription: pick(e.twitterDescription, doc?.twitterDescription),
    twitterImage: pick(e.twitterImage, doc?.twitterImage),
    noIndex: Boolean(e.noIndex || doc?.noIndex),
    noFollow: Boolean(e.noFollow || doc?.noFollow),
  } as SeoMetaDoc;
}

/**
 * Metadata for a public page. Priority: admin-saved page SEO (/admin/seo) →
 * the caller's `fallback` → the built-in route default → global Site Settings.
 * Never returns empty / "undefined" tags.
 */
export async function buildMetadata(
  slug: string,
  fallback?: { title?: string; description?: string; keywords?: string; image?: string },
  entity?: EntitySeo
): Promise<Metadata> {
  const [seoDoc, settings] = await Promise.all([getSeoDoc(slug), getSettings()]);
  const doc = mergeEntitySeo(seoDoc, entity);
  const def = getSeoDefault(slug);

  const title = doc?.title?.trim() || fallback?.title || def?.title || settings.defaultTitle;
  const description = doc?.description?.trim() || fallback?.description || def?.description || settings.defaultDescription;
  const keywords = (doc?.keywords?.trim() || fallback?.keywords || settings.defaultKeywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const ogImage = doc?.ogImage || fallback?.image || settings.defaultOgImage;
  const twImage = doc?.twitterImage || doc?.ogImage || fallback?.image || settings.defaultTwitterImage || settings.defaultOgImage;
  const canonical = doc?.canonicalUrl?.trim() || slug;

  return {
    title: { absolute: title },
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical },
    robots: { index: !doc?.noIndex, follow: !doc?.noFollow },
    openGraph: {
      title: doc?.ogTitle?.trim() || title,
      description: doc?.ogDescription?.trim() || description,
      url: canonical,
      siteName: settings.siteName,
      type: "website",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: doc?.twitterTitle?.trim() || doc?.ogTitle?.trim() || title,
      description: doc?.twitterDescription?.trim() || doc?.ogDescription?.trim() || description,
      ...(twImage ? { images: [twImage] } : {}),
    },
  };
}
