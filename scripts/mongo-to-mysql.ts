/**
 * One-time copy of all existing MongoDB data into MySQL.   npm run db:import-mongo
 *
 *   Needs in .env.local:  MONGODB_URI, MONGODB_DB (source)   +   DATABASE_URL (target MySQL — run `npm run db:migrate` first)
 *   Options:  --overwrite   replace rows that already exist in MySQL (default: existing rows are kept)
 *             --dry-run     read and convert everything, write nothing
 *
 * Record ids are preserved (24-hex ObjectId strings), so admin URLs, stored references and sessions keep working.
 * Re-running is safe: rows that already exist are skipped. A per-table count comparison is printed at the end.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId as MongoObjectId } from "mongodb";
import { closeDb, getDb } from "../src/lib/db";
import { TABLES } from "../src/lib/db/schema";

config({ path: ".env.local" });
config();

const overwrite = process.argv.includes("--overwrite");
const dryRun = process.argv.includes("--dry-run");

/** Mongo ObjectId / Decimal / Long … -> plain JSON-friendly values (dates stay dates). */
function convert(v: unknown): unknown {
  if (v instanceof MongoObjectId) return v.toHexString();
  if (v instanceof Date) return v;
  if (Array.isArray(v)) return v.map(convert);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o._bsontype === "string" && typeof (o as { toString(): string }).toString === "function") return o.toString();
    return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, convert(x)]));
  }
  return v;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set — it is only needed for this one-time import.");
  const mongo = await new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
  const src = mongo.db(process.env.MONGODB_DB || "nishkarsh_it");
  const dst = await getDb();
  const summary: string[] = [];
  let failures = 0;
  try {
    for (const table of Object.keys(TABLES)) {
      const docs = await src.collection(table).find().toArray();
      const target = dst.collection(table);
      let copied = 0, skipped = 0, failed = 0;
      for (const raw of docs) {
        const doc = convert(raw) as Record<string, unknown>;
        const id = String(doc._id);
        try {
          if (dryRun) { copied++; continue; }
          const exists = await target.findOne({ _id: id });
          if (exists && !overwrite) { skipped++; continue; }
          if (exists) await target.deleteOne({ _id: id });
          await target.insertOne(doc);
          copied++;
        } catch (e) {
          failed++; failures++;
          console.error(`  ✗ ${table} ${id}: ${(e as Error).message}`);
        }
      }
      const after = dryRun ? docs.length : await target.countDocuments();
      summary.push(`${table.padEnd(24)} mongo ${String(docs.length).padStart(5)}  →  mysql ${String(after).padStart(5)}   (copied ${copied}, already there ${skipped}, failed ${failed})`);
    }
  } finally {
    await mongo.close();
    await closeDb();
  }
  console.log(summary.join("\n"));
  console.log(failures ? `\n⚠ ${failures} record(s) failed — see messages above.` : `\n✔ Import ${dryRun ? "dry-run " : ""}finished with no errors.`);
  if (failures) process.exit(1);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
