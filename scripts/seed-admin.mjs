// Creates (or updates the password of) the bootstrap admin account.
// Run with: npm run seed:admin
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nishkarsh_it";
const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "";

async function main() {
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }
  if (!email || !password) {
    console.error(
      "ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD are not set in .env.local.",
    );
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const passwordHash = await bcrypt.hash(password, 10);

  await db
    .collection("admin_users")
    .updateOne(
      { email },
      {
        $set: { email, passwordHash, role: "super_admin" },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

  console.log(`✔ Admin account ready for ${email}`);
  console.log("  Log in at /admin/login with the password from .env.local");
  console.log(
    "  (change ADMIN_BOOTSTRAP_PASSWORD and re-run any time to rotate it)",
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
