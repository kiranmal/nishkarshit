/** Writes migrations/001_initial_schema.sql from src/lib/db/schema.ts.   npm run db:schema */
import fs from "node:fs";
import { schemaSql } from "../src/lib/db/ddl";
fs.mkdirSync("migrations", { recursive: true });
fs.writeFileSync("migrations/001_initial_schema.sql", schemaSql());
console.log("Wrote migrations/001_initial_schema.sql");
