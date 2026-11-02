import { TABLES, type ColType, type TableDef } from "./schema";
import { q } from "./mapping";

const sqlType = (t: ColType): string => {
  switch (t.t) {
    case "str": return `VARCHAR(${t.n})`;
    case "text": return "TEXT";
    case "long": return "LONGTEXT";
    case "int": return "INT";
    case "bigint": return "BIGINT";
    case "float": return "DOUBLE";
    case "bool": return "TINYINT(1)";
    case "date": return "DATETIME(3)";
    case "json": return "JSON";
  }
};

/** CREATE TABLE statement for one table of schema.ts (idempotent: IF NOT EXISTS). */
export function createTableSql(name: string, def: TableDef): string {
  const lines = [
    `  \`id\` VARCHAR(${def.idType === "oid" ? 24 : 191}) CHARACTER SET ascii COLLATE ascii_bin NOT NULL`,
    "  `row_seq` BIGINT NOT NULL AUTO_INCREMENT",
    ...Object.entries(def.columns).map(([c, t]) => `  ${q(c)} ${sqlType(t)} NULL`),
    "  `extra` JSON NULL",
    "  PRIMARY KEY (`id`)",
    "  UNIQUE KEY `uq_row_seq` (`row_seq`)",
    ...(def.unique ?? []).map((c) => `  UNIQUE KEY ${q(`uq_${c}`)} (${q(c)})`),
    ...(def.index ?? []).map((cols) => `  KEY ${q(`ix_${cols.join("_")}`)} (${cols.map(q).join(", ")})`),
  ];
  return `CREATE TABLE IF NOT EXISTS ${q(name)} (\n${lines.join(",\n")}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
}

export function schemaSql(): string {
  const head = "-- GENERATED from src/lib/db/schema.ts by `npm run db:schema` — do not edit by hand.\n-- Safe to run repeatedly (CREATE TABLE IF NOT EXISTS). Requires MySQL 5.7+/8 or MariaDB 10.5+ (JSON columns).\n\n";
  return head + Object.entries(TABLES).map(([n, d]) => createTableSql(n, d)).join("\n\n") + "\n";
}
