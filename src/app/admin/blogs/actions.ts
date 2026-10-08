"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryBlogDoc } from "@/lib/models";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function addBlogAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const title = String(formData.get("title") || "").trim();
  await db.collection<DirectoryBlogDoc>(COLLECTIONS.directoryBlogs).insertOne({
    title,
    slug: slugify(String(formData.get("slug") || "") || title),
    excerpt: String(formData.get("excerpt") || "").trim(),
    coverColor: String(formData.get("coverColor") || "#1d4ed8").trim(),
    status: (String(formData.get("status") || "published") as "draft" | "published"),
    publishedAt: new Date(),
  });
  revalidatePath("/admin/blogs");
  revalidatePath("/directory/blogs");
}

export async function updateBlogAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryBlogDoc>(COLLECTIONS.directoryBlogs).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: String(formData.get("title") || "").trim(),
        slug: slugify(String(formData.get("slug") || "").trim()),
        excerpt: String(formData.get("excerpt") || "").trim(),
        coverColor: String(formData.get("coverColor") || "#1d4ed8").trim(),
        status: (String(formData.get("status") || "published") as "draft" | "published"),
      },
    }
  );
  revalidatePath("/admin/blogs");
  revalidatePath("/directory/blogs");
}

export async function deleteBlogAction(id: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<DirectoryBlogDoc>(COLLECTIONS.directoryBlogs).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/blogs");
  revalidatePath("/directory/blogs");
}
