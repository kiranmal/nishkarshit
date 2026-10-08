"use server";

import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { getConfig, type FormValues } from "@/lib/applications/config";
import { cleanSection, validateAll } from "@/lib/applications/validate";
import { ensureApplicationIndexes, nextApplicationNumber } from "@/lib/applications/server";

export type SubmitApplicationResult =
  | { success: true; applicationNumber: string }
  | { success: false; error: string; fieldErrors?: Record<string, Record<string, string>> };

/** Coerces untrusted input into string-only section maps. */
function coerce(input: unknown): FormValues {
  const out = { personal: {}, program: {}, additional: {} } as FormValues;
  if (!input || typeof input !== "object") return out;
  for (const key of ["personal", "program", "additional"] as const) {
    const section = (input as Record<string, unknown>)[key];
    if (section && typeof section === "object") {
      for (const [k, v] of Object.entries(section as Record<string, unknown>)) {
        if (typeof v === "string" && v.length <= 1000) out[key][k] = v;
      }
    }
  }
  return out;
}

export async function submitApplicationAction(
  kind: string,
  rawValues: unknown
): Promise<SubmitApplicationResult> {
  const cfg = getConfig(kind);
  if (!cfg) return { success: false, error: "Unknown application type." };

  const values = coerce(rawValues);
  const fieldErrors = validateAll(cfg, values);
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please correct the highlighted fields.", fieldErrors };
  }

  // Unlike the simple contact forms, an application hands the user a reference
  // number, so we must never claim success when nothing was actually stored.
  if (!isDbConfigured()) {
    console.error(`[${cfg.collection}] MONGODB_URI not set — application NOT saved.`);
    return {
      success: false,
      error: "Applications are temporarily unavailable. Please try again later or contact us on WhatsApp.",
    };
  }

  try {
    await ensureApplicationIndexes(cfg);
    const db = await getDb();
    const now = new Date();

    const doc: Record<string, unknown> = {};
    for (const s of cfg.sections) doc[s.docKey] = cleanSection(s, values[s.key]);

    // A unique index guards the number; retry the (very unlikely) collision once.
    for (let attempt = 0; attempt < 2; attempt++) {
      const applicationNumber = await nextApplicationNumber(cfg);
      try {
        await db.collection(cfg.collection).insertOne({
          applicationNumber,
          ...doc,
          status: "pending",
          createdAt: now,
          updatedAt: now,
        });
        revalidatePath(cfg.adminPath);
        return { success: true, applicationNumber };
      } catch (err) {
        if ((err as { code?: number }).code !== 11000 || attempt === 1) throw err;
      }
    }
    return { success: false, error: "Something went wrong — please try again." };
  } catch (err) {
    console.error(`[${cfg.collection}] submit failed:`, err);
    return { success: false, error: "Something went wrong — please try again." };
  }
}
