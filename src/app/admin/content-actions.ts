"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type SiteContentDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { CMS_MODULES } from "@/lib/cms/modules";
import { sanitize } from "@/lib/cms/schema";
import { externalizeImages } from "@/lib/cms/persist-images";

export type SaveResult = { ok: true; data: Record<string, unknown> } | { ok: false; error: string };

export async function saveContentAction(key: string, payload: string): Promise<SaveResult> {
  const mod = CMS_MODULES[key];
  if (!mod) return { ok: false, error: "Unknown content module." };
  let admin;
  try {
    admin = await assertPermission(mod.permission);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Not allowed" };
  }
  if (payload.length > 3_000_000) return { ok: false, error: "Content is too large." };
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return { ok: false, error: "Invalid data." };
  }
  const data = await externalizeImages(sanitize(mod.fields, parsed), admin.email);
  try {
    const db = await getDb();
    await db.collection<SiteContentDoc>(COLLECTIONS.siteContent).updateOne(
      { _id: key },
      { $set: { data, updatedAt: new Date(), updatedBy: admin.email } },
      { upsert: true }
    );
  } catch (err) {
    console.error("[cms] save failed:", err);
    return { ok: false, error: "Could not save — database unavailable." };
  }
  revalidatePath("/", "layout");
  return { ok: true, data };
}

export async function resetContentAction(key: string): Promise<SaveResult> {
  const mod = CMS_MODULES[key];
  if (!mod) return { ok: false, error: "Unknown content module." };
  try {
    await assertPermission(mod.permission);
    const db = await getDb();
    await db.collection<SiteContentDoc>(COLLECTIONS.siteContent).deleteOne({ _id: key });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not reset" };
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/" + key);
  return { ok: true, data: mod.defaults };
}
