"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type SeoMetaDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { safeUrl } from "@/lib/cms/schema";

const t = (fd: FormData, k: string, max = 500) => String(fd.get(k) || "").trim().slice(0, max);

export async function upsertSeoAction(formData: FormData) {
  await assertPermission("seo");
  const pageSlug = t(formData, "pageSlug", 200);
  if (!pageSlug.startsWith("/")) return;
  const data = {
    pageSlug,
    title: t(formData, "title", 120),
    description: t(formData, "description", 400),
    keywords: t(formData, "keywords", 500) || undefined,
    canonicalUrl: safeUrl(formData.get("canonicalUrl")) || undefined,
    ogTitle: t(formData, "ogTitle", 150) || undefined,
    ogDescription: t(formData, "ogDescription", 400) || undefined,
    ogImage: safeUrl(formData.get("ogImage")) || undefined,
    twitterTitle: t(formData, "twitterTitle", 150) || undefined,
    twitterDescription: t(formData, "twitterDescription", 400) || undefined,
    twitterImage: safeUrl(formData.get("twitterImage")) || undefined,
    noIndex: formData.get("noIndex") === "on",
    noFollow: formData.get("noFollow") === "on",
  };
  const db = await getDb();
  await db.collection<SeoMetaDoc>(COLLECTIONS.seoMeta).updateOne({ pageSlug }, { $set: { ...data, updatedAt: new Date() } }, { upsert: true });
  revalidatePath("/admin/seo");
  revalidatePath(pageSlug);
  revalidatePath("/sitemap.xml");
}

export async function deleteSeoAction(id: string) {
  await assertPermission("seo");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection<SeoMetaDoc>(COLLECTIONS.seoMeta).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
}
