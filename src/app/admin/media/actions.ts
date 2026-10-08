"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type MediaDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function updateMediaAction(id: string, formData: FormData) {
  await assertPermission("media");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection<MediaDoc>(COLLECTIONS.media).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        alt: String(formData.get("alt") || "").trim().slice(0, 200),
        title: String(formData.get("title") || "").trim().slice(0, 200),
      },
    }
  );
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string) {
  await assertPermission("delete");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  const col = db.collection<MediaDoc>(COLLECTIONS.media);
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return;
  if (!doc.publicId.startsWith("local:")) {
    try {
      await deleteFromCloudinary(doc.publicId);
    } catch (err) {
      console.error("[media] cloudinary delete failed:", err);
    }
  }
  await col.deleteOne({ _id: doc._id });
  revalidatePath("/admin/media");
}
