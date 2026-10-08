"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type FestivalDoc } from "@/lib/models";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readFestivalFromForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  return {
    name,
    slug: slugify(String(formData.get("slug") || "") || name),
    startDate: new Date(String(formData.get("startDate") || new Date().toISOString())),
    endDate: new Date(String(formData.get("endDate") || new Date().toISOString())),
    active: formData.get("active") === "on",
    bannerText: String(formData.get("bannerText") || "").trim() || undefined,
    background: String(formData.get("background") || "#7c2d12").trim(),
    primaryColor: String(formData.get("primaryColor") || "#f59e0b").trim(),
    accentColor: String(formData.get("accentColor") || "#fde047").trim(),
    decoration: (String(formData.get("decoration") || "none") as FestivalDoc["decoration"]),
    popupText: String(formData.get("popupText") || "").trim() || undefined,
    popupImage: String(formData.get("popupImage") || "").trim() || undefined,
    priority: Number(formData.get("priority") || 0),
  };
}

export async function createFestivalAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const data = readFestivalFromForm(formData);
  const now = new Date();
  await db.collection<FestivalDoc>(COLLECTIONS.festivals).insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath("/admin/events");
  revalidatePath("/");
}

export async function updateFestivalAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const data = readFestivalFromForm(formData);
  // Fields left blank in the form must be removed, not silently kept
  // (an undefined value in $set is ignored by the driver).
  const { popupImage, bannerText, popupText, ...rest } = data;
  const $set: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  const $unset: Record<string, ""> = {};
  for (const [k, v] of Object.entries({ popupImage, bannerText, popupText })) {
    if (v === undefined) $unset[k] = "";
    else $set[k] = v;
  }
  await db.collection<FestivalDoc>(COLLECTIONS.festivals).updateOne(
    { _id: new ObjectId(id) },
    Object.keys($unset).length ? { $set, $unset } : { $set }
  );
  revalidatePath("/admin/events");
  revalidatePath("/");
}

export async function deleteFestivalAction(id: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<FestivalDoc>(COLLECTIONS.festivals).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/events");
  revalidatePath("/");
}

export async function toggleFestivalActiveAction(id: string, active: boolean) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<FestivalDoc>(COLLECTIONS.festivals).updateOne(
    { _id: new ObjectId(id) },
    { $set: { active, updatedAt: new Date() } }
  );
  revalidatePath("/admin/events");
  revalidatePath("/");
}
