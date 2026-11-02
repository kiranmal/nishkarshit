/**
 * Imports the shipped default content into the database (idempotent, never overwrites admin edits).
 *   npm run seed:cms                       -> everything
 *   npm run seed:cms -- education blog     -> only these groups (home education banking footer-pages blog hardware)
 * Run `npm run db:migrate` first so the tables exist.
 */
import { config } from "dotenv";
import { closeDb, getDb } from "../src/lib/db";
import { SEED_GROUPS, seedCms, type SeedGroup } from "../src/lib/cms/seed";

config({ path: ".env.local" });
config();

async function main() {
  const args = process.argv.slice(2).filter(Boolean) as SeedGroup[];
  const bad = args.filter((a) => !SEED_GROUPS.includes(a));
  if (bad.length) throw new Error(`Unknown group(s): ${bad.join(", ")}. Valid: ${SEED_GROUPS.join(", ")}`);
  try {
    const report = await seedCms(await getDb(), args.length ? args : undefined);
    for (const [g, r] of Object.entries(report)) console.log(`${g.padEnd(13)} added ${r.added}, already present ${r.existing}`);
  } finally { await closeDb(); }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
