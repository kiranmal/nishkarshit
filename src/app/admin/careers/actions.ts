"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type JobPostingDoc } from "@/lib/models";

export async function addJobPostingAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<JobPostingDoc>(COLLECTIONS.jobPostings).insertOne({
    title: String(formData.get("title") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    type: String(formData.get("type") || "Full-time").trim(),
    description: String(formData.get("description") || "").trim(),
    status: (String(formData.get("status") || "published") as "draft" | "published"),
    postedAt: new Date(),
  });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}

export async function updateJobPostingAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<JobPostingDoc>(COLLECTIONS.jobPostings).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: String(formData.get("title") || "").trim(),
        location: String(formData.get("location") || "").trim(),
        type: String(formData.get("type") || "Full-time").trim(),
        description: String(formData.get("description") || "").trim(),
        status: (String(formData.get("status") || "published") as "draft" | "published"),
      },
    }
  );
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}

export async function deleteJobPostingAction(id: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<JobPostingDoc>(COLLECTIONS.jobPostings).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}
