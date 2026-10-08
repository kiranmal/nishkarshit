"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { getSource } from "@/lib/forms/registry";

export async function updateLeadAction(formKey: string, id: string, formData: FormData) {
  await assertPermission("forms");
  const src = getSource(formKey);
  if (!src || !ObjectId.isValid(id)) return;
  const status = String(formData.get("status") || "");
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  const notes = String(formData.get("notes") || "").slice(0, 4000);
  const db = await getDb();
  await db.collection(src.collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: { crmStatus: status as LeadStatus, adminNotes: notes, updatedAt: new Date() } }
  );
  revalidatePath("/admin/forms");
  revalidatePath(`/admin/forms/${formKey}/${id}`);
}

/** Quick status change from the list view. */
export async function setLeadStatusAction(formKey: string, id: string, status: string) {
  await assertPermission("forms");
  const src = getSource(formKey);
  if (!src || !ObjectId.isValid(id) || !(LEAD_STATUSES as readonly string[]).includes(status)) return;
  const db = await getDb();
  await db.collection(src.collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: { crmStatus: status as LeadStatus, updatedAt: new Date() } }
  );
  revalidatePath("/admin/forms");
}

export async function deleteLeadAction(formKey: string, id: string) {
  await assertPermission("forms_delete");
  const src = getSource(formKey);
  if (!src || !ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection(src.collection).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/forms");
  redirect("/admin/forms");
}
