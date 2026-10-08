"use server";

import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type FormSubmissionDoc } from "@/lib/models";
import { rateLimit, clientMeta } from "@/lib/rate-limit";

export type ExpertiseEnquiryResult = { success: true } | { success: false; error: string };

/** Stores a submission from /expertise/[slug]/enquiry in MongoDB (shown in Admin → Forms). */
export async function submitExpertiseEnquiryAction(
  slug: string,
  title: string,
  raw: Record<string, unknown>
): Promise<ExpertiseEnquiryResult> {
  const values: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (typeof v === "string" && k.length <= 60) values[k] = v.trim().slice(0, 2000);
  }
  if (values.website) return { success: true }; // honeypot: silently drop bots

  const email = values.email || "";
  const mobile = (values.mobile || "").replace(/[\s\-()]/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Please enter a valid email address." };
  if (!/^\+?\d{10,14}$/.test(mobile)) return { success: false, error: "Please enter a valid mobile number." };

  const meta = await clientMeta();
  if (!rateLimit(`expertise:${meta.ip}`, 5, 10 * 60_000)) {
    return { success: false, error: "Too many submissions. Please try again in a few minutes." };
  }
  if (!isDbConfigured()) {
    console.error("[expertise-enquiry] MONGODB_URI not set — enquiry NOT saved");
    return { success: false, error: "Enquiries are temporarily unavailable. Please contact us by phone or WhatsApp." };
  }
  try {
    const db = await getDb();
    const { fullName, email: _e, mobile: _m, ...rest } = values; // eslint-disable-line @typescript-eslint/no-unused-vars
    const doc: FormSubmissionDoc = {
      formType: "expertise-enquiry",
      formLabel: "Expertise / Service Enquiry",
      name: fullName || values.company || undefined,
      email,
      phone: mobile,
      data: { Expertise: String(title).slice(0, 200), ...rest },
      sourceUrl: `/expertise/${String(slug).slice(0, 100)}/enquiry`,
      ip: meta.ip,
      userAgent: meta.userAgent,
      crmStatus: "new",
      createdAt: new Date(),
    };
    await db.collection(COLLECTIONS.formSubmissions).insertOne(doc);
    return { success: true };
  } catch (err) {
    console.error("[expertise-enquiry] save failed:", err);
    return { success: false, error: "Something went wrong — please try again." };
  }
}
