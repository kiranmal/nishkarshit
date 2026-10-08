import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/content";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSettings();
  const base = siteUrl.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/expertise/*/enquiry"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
