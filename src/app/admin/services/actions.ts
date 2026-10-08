"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type ServiceSectionDoc } from "@/lib/models";
import { servicesDetailed } from "@/data/servicesDetailed";
import { safeImage, safeUrl } from "@/lib/cms/schema";
import { externalizeImages } from "@/lib/cms/persist-images";

async function readSectionFromForm(formData: FormData) {
  const order = Number(formData.get("order") || 0);
  const accent = String(formData.get("accent") || "").trim();
  const imageUrl = await externalizeImages(safeImage(formData.get("imageUrl")));
  return {
    slug: String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
    order: Number.isFinite(order) ? order : 0,
    label: String(formData.get("label") || "").trim().slice(0, 100),
    heading: String(formData.get("heading") || "").trim().slice(0, 250),
    paragraph: String(formData.get("paragraph") || "").trim().slice(0, 3000),
    ctaLabel: String(formData.get("ctaLabel") || "Explore Now").trim().slice(0, 60),
    ctaHref: safeUrl(formData.get("ctaHref")) || "/services#enquiry",
    imageSide: (formData.get("imageSide") === "right" ? "right" : "left") as "left" | "right",
    imageUrl: imageUrl || undefined,
    accent: /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : "#0c2340",
    status: (formData.get("status") === "draft" ? "draft" : "published") as "draft" | "published",
  };
}

export async function updateServiceSectionAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const { imageUrl, ...data } = await readSectionFromForm(formData);
  // An emptied image field must REMOVE the image ($set with undefined is ignored by MongoDB).
  await db.collection<ServiceSectionDoc>(COLLECTIONS.serviceSections).updateOne(
    { _id: new ObjectId(id) },
    imageUrl
      ? { $set: { ...data, imageUrl, updatedAt: new Date() } }
      : { $set: { ...data, updatedAt: new Date() }, $unset: { imageUrl: "" } }
  );
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function createServiceSectionAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const data = await readSectionFromForm(formData);
  if (!data.slug) data.slug = data.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await db.collection<ServiceSectionDoc>(COLLECTIONS.serviceSections).insertOne({
    ...data,
    updatedAt: new Date(),
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteServiceSectionAction(id: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db
    .collection<ServiceSectionDoc>(COLLECTIONS.serviceSections)
    .deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

/** Safe to run anytime — upserts by slug with $setOnInsert, so it only fills
 *  in sections that don't exist yet and never touches admin-edited ones. */
export async function seedServiceSectionsAction(): Promise<void> {
  await assertPermission("content");
  const db = await getDb();
  const collection = db.collection<ServiceSectionDoc>(COLLECTIONS.serviceSections);

  const ops = servicesDetailed.map((s, i) => {
    const slug = s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      updateOne: {
        filter: { slug },
        update: {
          $setOnInsert: {
            slug,
            order: i,
            label: s.label,
            heading: s.heading,
            paragraph: s.paragraph,
            ctaLabel: s.ctaLabel,
            ctaHref: s.ctaHref,
            imageSide: s.imageSide,
            accent: s.accent,
            status: "published" as const,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    };
  });
  if (ops.length > 0) await collection.bulkWrite(ops);

  revalidatePath("/admin/services");
  revalidatePath("/services");
}
