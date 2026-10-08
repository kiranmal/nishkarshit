"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type ExpertiseItemDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { sanitize } from "@/lib/cms/schema";
import { externalizeImages } from "@/lib/cms/persist-images";
import { expertiseFields, defaultExpertiseDocs } from "@/lib/cms/entities";

type R = { ok: true; data: Record<string, unknown> } | { ok: false; error: string };

function refresh(slug?: string) {
  revalidatePath("/admin/expertise");
  revalidatePath("/expertise");
  if (slug) revalidatePath(`/expertise/${slug}`);
  revalidatePath("/", "layout");
}

export async function saveExpertiseAction(slug: string, payload: string): Promise<R> {
  let admin;
  try { admin = await assertPermission("content"); } catch (e) { return { ok: false, error: (e as Error).message }; }
  if (payload.length > 3_000_000) return { ok: false, error: "Content is too large — upload big images instead of pasting them." };
  let parsed: unknown;
  try { parsed = JSON.parse(payload); } catch { return { ok: false, error: "Invalid data." }; }
  const d = (await externalizeImages(sanitize(expertiseFields, parsed), admin.email)) as Record<string, unknown>;
  if (!d.title) return { ok: false, error: "Title is required." };
  const { sections, formOptions, ...rest } = d as { sections: ExpertiseItemDoc["sections"]; formOptions: { label: string }[] } & Record<string, unknown>;
  const db = await getDb();
  await db.collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems).updateOne(
    { slug },
    { $set: { ...rest, sections, formOptions: formOptions.map((o) => o.label).filter(Boolean), updatedAt: new Date() } as never, $setOnInsert: { slug, source: "custom" } as never },
    { upsert: true }
  );
  refresh(slug);
  return { ok: true, data: { ...d } };
}

export async function addExpertiseAction(formData: FormData) {
  await assertPermission("content");
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const slug = String(formData.get("slug") || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  if (!title || !slug) return;
  const db = await getDb();
  const col = db.collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems);
  if (await col.findOne({ slug })) return; // never overwrite / duplicate
  // The database becomes the source of truth once it has any record — import the defaults first so they don't disappear.
  if ((await col.estimatedDocumentCount()) === 0) await syncExpertiseDefaultsAction();
  const last = await col.find().sort({ order: -1 }).limit(1).toArray();
  await col.insertOne({ slug, title, paragraph: "", accent: "#17b6e8", order: (last[0]?.order ?? 0) + 1, status: "draft", source: "custom", updatedAt: new Date() });
  refresh(slug);
}

export async function deleteExpertiseAction(slug: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection(COLLECTIONS.expertiseItems).deleteOne({ slug });
  refresh(slug);
}

export async function toggleExpertiseAction(slug: string, publish: boolean) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection(COLLECTIONS.expertiseItems).updateOne({ slug }, { $set: { status: publish ? "published" : "draft", updatedAt: new Date() } });
  refresh(slug);
}

/** Imports the code defaults. Existing records (default OR admin-edited) are never overwritten; custom ones are never touched. */
export async function syncExpertiseDefaultsAction() {
  await assertPermission("content");
  const db = await getDb();
  const col = db.collection(COLLECTIONS.expertiseItems);
  let added = 0, existing = 0;
  for (const d of defaultExpertiseDocs()) {
    const r = await col.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, status: "published", source: "default", updatedAt: new Date() } }, { upsert: true });
    if (r.upsertedCount) added++; else existing++;
  }
  refresh();
  return { added, existing };
}
