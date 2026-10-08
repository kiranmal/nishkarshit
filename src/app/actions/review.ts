"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing, type ReviewItem } from "@/lib/models";

export type ReviewFormState = { success?: boolean; error?: string } | null;

export async function submitReviewAction(
  listingId: string,
  listingSlug: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const name = String(formData.get("name") || "").trim();
  const comment = String(formData.get("comment") || "").trim();
  const rating = Number(formData.get("rating") || 5);

  if (!name || !comment) {
    return { error: "Please add your name and a comment." };
  }
  if (!isDbConfigured()) {
    return { error: "Reviews aren't available until MongoDB is configured." };
  }

  const review: ReviewItem = { name, comment, rating, createdAt: new Date() };

  try {
    const db = await getDb();
    await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
      { _id: new ObjectId(listingId) },
      { $push: { reviews: review } }
    );
    revalidatePath(`/directory/listings/${listingSlug}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong — please try again." };
  }
}
