"use server";

import { assertPermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type HomepageSectionConfigDoc } from "@/lib/models";
import { homepageSectionDefaults } from "@/data/homepageSections";

export async function seedHomepageSectionsAction() {
  await assertPermission("content");
  const db = await getDb();
  const collection = db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections);

  // Per-key upsert with $setOnInsert: safe to run anytime. Existing (possibly
  // admin-customized) sections are left completely untouched; only sections
  // that don't exist yet get created with defaults. This also means running
  // it again later — e.g. after new default sections are added to the code —
  // fills in just the new ones instead of resetting everything.
  const ops = homepageSectionDefaults.map((s, i) => ({
    updateOne: {
      filter: { key: s.key },
      update: {
        $setOnInsert: {
          key: s.key,
          label: s.label,
          visible: true,
          order: i,
          updatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));
  if (ops.length > 0) await collection.bulkWrite(ops);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function updateHomepageSectionAction(key: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections).updateOne(
    { key },
    {
      $set: {
        visible: formData.get("visible") === "on",
        order: Number(formData.get("order") || 0),
        heading: String(formData.get("heading") || "").trim() || undefined,
        description: String(formData.get("description") || "").trim() || undefined,
        image: String(formData.get("image") || "").trim() || undefined,
        buttonLabel: String(formData.get("buttonLabel") || "").trim() || undefined,
        buttonHref: String(formData.get("buttonHref") || "").trim() || undefined,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}
