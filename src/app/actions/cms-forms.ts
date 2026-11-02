"use server";

import { getDb, isDbConfigured } from "@/lib/db";
import { rateLimit, clientMeta } from "@/lib/rate-limit";
import { COLLECTIONS, type FormSubmissionDoc, type HardwareProductDoc } from "@/lib/models";
import { findHardware } from "@/lib/cms/store";
import type { FormState } from "./forms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: FormDataEntryValue | null, n = 500) => String(v ?? "").trim().slice(0, n);

async function save(doc: Omit<FormSubmissionDoc, "ip" | "userAgent" | "crmStatus" | "createdAt">, limitKey: string): Promise<FormState> {
  if (!isDbConfigured()) return { error: "This form is temporarily unavailable. Please contact us by phone or WhatsApp." };
  const meta = await clientMeta();
  if (!rateLimit(`${limitKey}:${meta.ip}`, 5, 10 * 60_000)) return { error: "Too many submissions. Please try again in a few minutes." };
  try {
    await (await getDb()).collection(COLLECTIONS.formSubmissions).insertOne({ ...doc, ip: meta.ip, userAgent: meta.userAgent, crmStatus: "new", createdAt: new Date() } as never);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong — please try again." };
  }
}

/** Hardware product enquiry. The accepted fields come from the product's own CMS form definition. */
export async function submitHardwareEnquiryAction(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const found = await findHardware(slug);
  if (!found || !("product" in found)) return { error: "This product is no longer available." };
  const product: HardwareProductDoc = found.product;
  const data: Record<string, string> = { Product: product.name };
  let name: string | undefined, email: string | undefined, phone: string | undefined;
  for (const f of product.formFields) {
    const v = clip(formData.get(f.name), f.type === "textarea" ? 3000 : 300);
    if (f.required && !v) return { error: `${f.label} is required.` };
    if (!v) continue;
    if (f.type === "email" && !EMAIL_RE.test(v)) return { error: "Please enter a valid email address." };
    data[f.label] = v;
    if (f.type === "email") email = v;
    else if (f.type === "tel") phone = v;
    else if (!name && /name/i.test(f.name + f.label)) name = v;
  }
  if (product.terms && formData.get("terms") !== "accepted") return { error: "Please accept the terms to continue." };
  return save({ formType: "hardware-enquiry", formLabel: "CSP Hardware Enquiry", name, email, phone, data, sourceUrl: `/banking/csp-hardware/${product.slug}` }, "hardware");
}

/** The "Create an enquiry" form at the bottom of the Bank CSP page. */
export async function submitBankEnquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = clip(formData.get("name"), 120), email = clip(formData.get("email"), 200), phone = clip(formData.get("phone"), 30);
  if (!name || !phone) return { error: "Name and phone are required." };
  if (email && !EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  return save({ formType: "bank-csp-enquiry", formLabel: "Bank CSP Enquiry", name, email: email || undefined, phone,
    data: { Bank: clip(formData.get("bank"), 120), Address: clip(formData.get("address"), 300), Message: clip(formData.get("comments"), 3000) }, sourceUrl: "/banking/bank-csp" }, "bank-enquiry");
}
