import type { BlogPostDoc, CmsPageDoc, HardwareProductDoc } from "@/lib/models";

type Obj = Record<string, unknown>;
const EMPTY_SEO = { metaTitle: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "", twitterDescription: "", twitterImage: "", noIndex: false, noFollow: false };
const toLocalInput = (d: Date) => new Date(d).toISOString().slice(0, 16);

/** Maps a stored page to the editor's initial form values. */
export function pageToForm(p: Pick<CmsPageDoc, "kind" | "label" | "slug" | "title" | "status" | "order" | "spacing" | "hero" | "heroImage" | "sections" | "seo">): Obj {
  const seo = { ...EMPTY_SEO, ...(p.seo ?? {}) };
  const sections = JSON.parse(JSON.stringify(p.sections ?? []));
  if (p.kind === "education-tab") return { label: p.label, slug: p.slug, status: p.status, order: p.order, spacing: p.spacing ?? "14", hero: p.hero ?? { enabled: false, badge: "", title: "", description: "", image: "", buttons: [] }, sections, seo };
  if (p.kind === "footer-page") return { title: p.title, heroImage: p.heroImage ?? "", status: p.status, sections, seo };
  return { title: p.title, sections, seo };
}



export function blogToForm(b: Partial<BlogPostDoc>): Obj {
  return {
    title: b.title ?? "", author: b.author ?? "", tagline: b.tagline ?? "", bannerImage: b.bannerImage ?? "", content: b.content ?? "", tags: (b.tags ?? []).join(", "),
    slug: b.slug ?? "", publishedAt: toLocalInput(b.publishedAt ?? new Date()), featured: b.featured ?? false, status: b.status ?? "draft",
    seo: { ...EMPTY_SEO, ...(b.seo ?? {}) },
  };
}


export function hardwareToForm(h: Partial<HardwareProductDoc>): Obj {
  return {
    name: h.name ?? "", slug: h.slug ?? "", status: h.status ?? "draft", description: h.description ?? "", image: h.image ?? "", images: (h.images ?? []).map((image) => ({ image })),
    unitPrice: h.unitPrice ?? "", formFields: JSON.parse(JSON.stringify(h.formFields ?? [])), terms: h.terms ?? "",
    seo: { ...EMPTY_SEO, ...(h.seo ?? {}) },
  };
}

