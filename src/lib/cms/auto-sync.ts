import { getDb, isDbConfigured, type Document } from "@/lib/db";
import { TABLES } from "@/lib/db/schema";
import { createTableSql } from "@/lib/db/ddl";
import { COLLECTIONS, type CmsMetaDoc } from "@/lib/models";
import { SEED_GROUPS, seedCms, type SeedGroup } from "./seed";

/**
 * WHY THIS EXISTS
 * The public pages used to fall back to content hard-coded in the source (jobs, team, services, expertise, education…)
 * while the admin screens only listed what is in the database. On a fresh database that meant: website full, admin empty,
 * dashboard "0 open jobs" — until somebody remembered to click every "Sync default content" button.
 *
 * WHAT IT DOES (once per server process, never blocks for long, never throws)
 *  1. creates any missing table (CREATE TABLE IF NOT EXISTS — same SQL as `npm run db:migrate`)
 *  2. for every dataset that has NEVER been imported (no `cms_meta` marker) AND has no rows yet, imports the shipped defaults
 *  3. for a dataset that already has rows it only stores the marker — your existing admin data is left exactly as it is
 *
 * It is safe to run repeatedly. Set AUTO_SEED=false to switch it off.
 */

/** Which table / filter proves that a group already holds real data. `null` = always safe to (re)run (non-destructive). */
const GROUP_SOURCE: Record<SeedGroup, { table: string; filter?: Document } | null> = {
  home: null,
  education: { table: COLLECTIONS.cmsPages, filter: { kind: "education-tab" } },
  banking: { table: COLLECTIONS.cmsPages, filter: { kind: "banking" } },
  "footer-pages": { table: COLLECTIONS.cmsPages, filter: { kind: "footer-page" } },
  blog: { table: COLLECTIONS.blogPosts },
  hardware: { table: COLLECTIONS.hardwareProducts },
  careers: { table: COLLECTIONS.jobPostings },
  team: { table: COLLECTIONS.managementTeam },
  expertise: { table: COLLECTIONS.expertiseItems },
  services: { table: COLLECTIONS.serviceSections },
};

declare global {
  var _cmsSync: Promise<void> | undefined;
  var _cmsSyncRetryAt: number | undefined;
}

const disabled = () => ["false", "0", "off", "no"].includes((process.env.AUTO_SEED ?? "").trim().toLowerCase());

async function run() {
  const db = await getDb();

  // 1. tables (a managed database user may lack CREATE rights — then we simply carry on)
  try {
    for (const [name, def] of Object.entries(TABLES)) await db.pool.query(createTableSql(name, def));
  } catch (err) {
    console.warn("[auto-sync] could not verify tables (continuing):", (err as Error).message);
  }

  // 2 + 3. datasets
  const meta = db.collection<CmsMetaDoc>(COLLECTIONS.cmsMeta);
  const toImport: SeedGroup[] = [];
  for (const g of SEED_GROUPS) {
    if (await meta.findOne({ _id: `seeded:${g}` }, { projection: { _id: 1 } })) continue; // already handled earlier
    const src = GROUP_SOURCE[g];
    if (src && (await db.collection(src.table).countDocuments(src.filter ?? {})) > 0) {
      // Admin data already exists: just remember it, so a default the admin deleted can never come back.
      await meta.updateOne({ _id: `seeded:${g}` }, { $setOnInsert: { at: new Date() } }, { upsert: true });
      continue;
    }
    toImport.push(g);
  }
  if (toImport.length) {
    const report = await seedCms(db, toImport);
    for (const [g, r] of Object.entries(report)) console.log(`[auto-sync] ${g}: added ${r.added}, already present ${r.existing}`);
  }
}

/** Await this before reading content for the admin. After the first successful run it resolves immediately. */
export function ensureContentSynced(): Promise<void> {
  if (!isDbConfigured() || disabled()) return Promise.resolve();
  if (globalThis._cmsSync) return globalThis._cmsSync;
  if (globalThis._cmsSyncRetryAt && Date.now() < globalThis._cmsSyncRetryAt) return Promise.resolve(); // failed recently — don't hammer
  globalThis._cmsSync = run().catch((err) => {
    console.error("[auto-sync] failed, will retry in 60s:", err);
    globalThis._cmsSyncRetryAt = Date.now() + 60_000;
    globalThis._cmsSync = undefined;
  });
  return globalThis._cmsSync;
}
