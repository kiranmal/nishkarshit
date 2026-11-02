/** Creates / updates the MySQL tables (idempotent).   npm run db:migrate */
import { config } from "dotenv";
import mysql from "mysql2/promise";
import { createTableSql } from "../src/lib/db/ddl";
import { TABLES } from "../src/lib/db/schema";
import { poolOptions, readDbConfig } from "../src/lib/db";

config({ path: ".env.local" });
config();

async function main() {
  const cfg = readDbConfig();
  if (!cfg) throw new Error("Database is not configured. Set DATABASE_URL (or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD) in .env.local.");
  const conn = await mysql.createConnection({ ...poolOptions(cfg), multipleStatements: false });
  try {
    for (const [name, def] of Object.entries(TABLES)) {
      await conn.query(createTableSql(name, def));
      // Additive upgrade: add any column that a newer schema.ts introduced.
      const [cols] = await conn.query("SELECT COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [cfg.database, name]);
      const have = new Set((cols as { c: string }[]).map((r) => r.c));
      const create = createTableSql(name, def);
      for (const c of Object.keys(def.columns)) {
        if (have.has(c)) continue;
        const m = new RegExp("^  `" + c.replace(/`/g, "``") + "` ([^\\n]+?),?$", "m").exec(create);
        if (m) await conn.query(`ALTER TABLE \`${name}\` ADD COLUMN \`${c}\` ${m[1]}`);
      }
    }
    console.log(`✔ ${Object.keys(TABLES).length} tables ready in database "${cfg.database}".`);
  } finally { await conn.end(); }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
