// Creates (or updates the password of) the bootstrap admin account.   npm run seed:admin
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { closeDb, getDb } from "../src/lib/db";

config({ path: ".env.local" });
config();

async function main() {
  const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "";
  if (!email || !password) throw new Error("ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD are not set in .env.local.");
  try {
    const db = await getDb();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.collection("admin_users").updateOne({ email }, { $set: { email, passwordHash, role: "super_admin" }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
    console.log(`✔ Admin account ready for ${email}`);
    console.log("  Log in at /admin/login with the password from .env.local (re-run with a new ADMIN_BOOTSTRAP_PASSWORD to rotate it).");
  } finally { await closeDb(); }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
