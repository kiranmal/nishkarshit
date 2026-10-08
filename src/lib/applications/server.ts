import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type CounterDoc } from "@/lib/models";
import type { ApplicationConfig } from "./config";

let indexesReady: Promise<void> | null = null;

/** Creates the indexes the admin list relies on, once per server process. */
export function ensureApplicationIndexes(cfg: ApplicationConfig): Promise<void> {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      for (const name of [COLLECTIONS.admissionApplications, COLLECTIONS.loanApplications]) {
        const col = db.collection(name);
        await col.createIndex({ applicationNumber: 1 }, { unique: true });
        await col.createIndex({ createdAt: -1 });
        await col.createIndex({ status: 1 });
      }
    })().catch((err) => {
      indexesReady = null; // retry on the next submission
      console.error("[applications] index creation failed:", err);
    });
  }
  void cfg;
  return indexesReady;
}

/**
 * Builds the next application number, e.g. NIT-ADM-2026-000042.
 * Uses an atomic $inc on a per-type-per-year counter so two simultaneous
 * submissions can never receive the same number.
 */
export async function nextApplicationNumber(cfg: ApplicationConfig): Promise<string> {
  const db = await getDb();
  const year = new Date().getFullYear();
  const counter = await db
    .collection<CounterDoc>(COLLECTIONS.counters)
    .findOneAndUpdate(
      { _id: `${cfg.kind}-${year}` },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  const seq = counter?.seq ?? 1;
  return `${cfg.counterPrefix}-${year}-${String(seq).padStart(6, "0")}`;
}
