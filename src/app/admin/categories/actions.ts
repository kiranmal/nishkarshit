"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryCategoryDoc } from "@/lib/models";

export async function addCategoryAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryCategoryDoc>(COLLECTIONS.directoryCategories).insertOne({
    name: String(formData.get("name") || "").trim(),
    icon: String(formData.get("icon") || "🏢").trim(),
    order: Number(formData.get("order") || 0),
    status: (String(formData.get("status") || "published") as "draft" | "published"),
  });
  revalidatePath("/admin/categories");
  revalidatePath("/directory/categories");
  revalidatePath("/directory");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryCategoryDoc>(COLLECTIONS.directoryCategories).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: String(formData.get("name") || "").trim(),
        icon: String(formData.get("icon") || "🏢").trim(),
        order: Number(formData.get("order") || 0),
        status: (String(formData.get("status") || "published") as "draft" | "published"),
      },
    }
  );
  revalidatePath("/admin/categories");
  revalidatePath("/directory/categories");
  revalidatePath("/directory");
}

export async function deleteCategoryAction(id: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<DirectoryCategoryDoc>(COLLECTIONS.directoryCategories).deleteOne({
    _id: new ObjectId(id),
  });
  revalidatePath("/admin/categories");
  revalidatePath("/directory/categories");
  revalidatePath("/directory");
}
