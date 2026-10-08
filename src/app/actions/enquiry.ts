"use server";

import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type EnquiryDoc } from "@/lib/models";
import { rateLimit, clientMeta } from "@/lib/rate-limit";

export type EnquiryFormState = { success?: boolean; error?: string } | null;

export async function submitEnquiryAction(
  source: EnquiryDoc["source"],
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  let message = String(formData.get("message") || "").trim();
  const listingName = String(formData.get("listingName") || "").trim();
  if (listingName) {
    message = `[Re: ${listingName}] ${message}`;
  }

  if (!message) {
    return { error: "Please write a message." };
  }

  if (message.length > 3000) return { error: "Message is too long." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (phone && !/^\+?\d{10,14}$/.test(phone.replace(/[\s\-()]/g, ""))) return { error: "Please enter a valid phone number." };

  if (!isDbConfigured()) {
    console.error("[enquiry] MONGODB_URI not set — enquiry NOT saved");
    return { error: "This form is temporarily unavailable. Please contact us by phone or WhatsApp." };
  }
  const meta = await clientMeta();
  if (!rateLimit(`enquiry:${meta.ip}`, 5, 10 * 60_000)) {
    return { error: "Too many submissions. Please try again in a few minutes." };
  }

  try {
    const db = await getDb();
    await db.collection<EnquiryDoc>(COLLECTIONS.enquiries).insertOne({
      source,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      message,
      status: "new",
      crmStatus: "new",
      ip: meta.ip,
      userAgent: meta.userAgent,
      createdAt: new Date(),
    } as EnquiryDoc);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong — please try again." };
  }
}

export async function submitHomeEnquiryAction(
  prevState: EnquiryFormState,
  formData: FormData
) {
  return submitEnquiryAction("home", prevState, formData);
}

export async function submitDirectoryContactAction(
  prevState: EnquiryFormState,
  formData: FormData
) {
  return submitEnquiryAction("directory-contact", prevState, formData);
}

export async function submitListingInquiryAction(
  listingName: string,
  prevState: EnquiryFormState,
  formData: FormData
) {
  formData.set("listingName", listingName);
  return submitEnquiryAction("directory-contact", prevState, formData);
}
