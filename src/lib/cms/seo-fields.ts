import type { Field } from "./schema";

/** Reusable per-entity SEO block (expertise pages, blogs, jobs, …). */
export const seoGroup: Field = {
  type: "group", name: "seo", label: "SEO (search & social)",
  fields: [
    { type: "text", name: "metaTitle", label: "Meta title", max: 70, help: "Aim for ≤ 60 characters. Leave blank to use the page title." },
    { type: "textarea", name: "metaDescription", label: "Meta description", max: 300, help: "Aim for 120–160 characters." },
    { type: "textarea", name: "metaKeywords", label: "Meta keywords (comma separated)", max: 400 },
    { type: "url", name: "canonicalUrl", label: "Canonical URL (optional)" },
    { type: "text", name: "ogTitle", label: "Open Graph title", max: 100 },
    { type: "textarea", name: "ogDescription", label: "Open Graph description", max: 300 },
    { type: "image", name: "ogImage", label: "Open Graph image", noData: true },
    { type: "text", name: "twitterTitle", label: "Twitter/X title", max: 100 },
    { type: "textarea", name: "twitterDescription", label: "Twitter/X description", max: 300 },
    { type: "image", name: "twitterImage", label: "Twitter/X image", noData: true },
    { type: "boolean", name: "noIndex", label: "Hide from search engines (noindex)" },
    { type: "boolean", name: "noFollow", label: "Don't follow links (nofollow)" },
  ],
};

export interface EntitySeo {
  metaTitle?: string; metaDescription?: string; metaKeywords?: string; canonicalUrl?: string;
  ogTitle?: string; ogDescription?: string; ogImage?: string; twitterTitle?: string; twitterDescription?: string;
  twitterImage?: string; noIndex?: boolean; noFollow?: boolean;
}
