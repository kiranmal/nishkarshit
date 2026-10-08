"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/models";

export async function updateEnquiryStatusAction(
  id: string,
  status: "new" | "read" | "responded"
) {
  await assertPermission("forms");
  const db = await getDb();
  await db
    .collection(COLLECTIONS.enquiries)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  revalidatePath("/admin/enquiries");
}

export async function updateApplicationStatusAction(
  collection:
    | typeof COLLECTIONS.jobApplications
    | typeof COLLECTIONS.partnerApplications
    | typeof COLLECTIONS.bankCspApplications,
  id: string,
  status: "new" | "reviewed"
) {
  await assertPermission("forms");
  const db = await getDb();
  await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  revalidatePath("/admin/enquiries");
}
