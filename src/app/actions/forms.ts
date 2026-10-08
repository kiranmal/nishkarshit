"use server";

import { getDb, isDbConfigured } from "@/lib/mongodb";
import { rateLimit, clientMeta } from "@/lib/rate-limit";
import {
  COLLECTIONS,
  type BankCspApplicationDoc,
  type JobApplicationDoc,
  type PartnerApplicationDoc,
} from "@/lib/models";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{10,14}$/;
const cleanPhone = (v: string) => v.replace(/[\s\-()]/g, "");

export type FormState = { success?: boolean; error?: string } | null;

async function saveOrLog<T extends object>(
  collection: string,
  doc: T
): Promise<FormState> {
  if (!isDbConfigured()) {
    console.error(`[${collection}] MONGODB_URI not set — submission NOT saved`);
    return { error: "This form is temporarily unavailable. Please contact us by phone or WhatsApp." };
  }
  const meta = await clientMeta();
  if (!rateLimit(`${collection}:${meta.ip}`, 5, 10 * 60_000)) {
    return { error: "Too many submissions. Please try again in a few minutes." };
  }
  try {
    const db = await getDb();
    await db.collection(collection).insertOne({ ...(doc as object), crmStatus: "new", ip: meta.ip, userAgent: meta.userAgent } as never);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong — please try again." };
  }
}

export async function submitBankCspApplicationAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (!fullName || !phone) return { error: "Name and phone are required." };
  if (!PHONE_RE.test(cleanPhone(phone))) return { error: "Please enter a valid phone number." };
  if (fullName.length > 120) return { error: "Name is too long." };

  const doc: BankCspApplicationDoc = {
    fullName,
    fatherOrSpouseName: String(formData.get("fatherOrSpouseName") || "").trim() || undefined,
    dob: String(formData.get("dob") || "").trim() || undefined,
    gender: String(formData.get("gender") || "").trim() || undefined,
    phone,
    email: String(formData.get("email") || "").trim() || undefined,
    address: String(formData.get("address") || "").trim() || undefined,
    createdAt: new Date(),
    status: "new",
  };
  return saveOrLog(COLLECTIONS.bankCspApplications, doc);
}

export async function submitJobApplicationAction(
  jobTitle: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  if (!name || !email) return { error: "Name and email are required." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (name.length > 120) return { error: "Name is too long." };

  const doc: JobApplicationDoc = {
    jobTitle,
    name,
    email,
    phone: String(formData.get("phone") || "").trim() || undefined,
    message: String(formData.get("message") || "").trim() || undefined,
    resumeNote: String(formData.get("resumeNote") || "").trim() || undefined,
    createdAt: new Date(),
    status: "new",
  };
  return saveOrLog(COLLECTIONS.jobApplications, doc);
}

export async function submitPartnerApplicationAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const businessName = String(formData.get("businessName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (!fullName || !businessName || !email || !phone) {
    return { error: "Please fill in all required fields." };
  }
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (!PHONE_RE.test(cleanPhone(phone))) return { error: "Please enter a valid phone number." };

  const doc: PartnerApplicationDoc = {
    fullName,
    businessName,
    email,
    phone,
    businessCategory: String(formData.get("businessCategory") || "").trim(),
    notes: String(formData.get("notes") || "").trim() || undefined,
    createdAt: new Date(),
    status: "new",
  };
  return saveOrLog(COLLECTIONS.partnerApplications, doc);
}
