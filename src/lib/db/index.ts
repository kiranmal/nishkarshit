import mysql, { type Pool, type PoolOptions } from "mysql2/promise";
import { Collection } from "./collection";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
export { ObjectId } from "./objectid";
export { Collection, DuplicateKeyError, type Document, type Update } from "./collection";
export type { Filter, Sort } from "./query";

/**
 * MySQL connection (lazy, pooled).
 *
 * Nothing connects at import/build time — the pool is created the first time getDb() is called from a Server Action,
 * Route Handler or Server Component. That keeps `next build` working before the database is configured.
 *
 * Configure with DATABASE_URL (mysql://user:pass@host:3306/dbname) or DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD.
 */

export interface DbConfig {
  host: string; port: number; database: string; user: string; password: string;
  connectionLimit: number; ssl?: PoolOptions["ssl"];
}


export function readDbConfig(
  env: NodeJS.ProcessEnv = process.env
): DbConfig | null {
  let host = env.DB_HOST;
  let port = env.DB_PORT ? Number(env.DB_PORT) : 3306;
  let database = env.DB_NAME;
  let user = env.DB_USER;
  let password = env.DB_PASSWORD ?? "";

  if (env.DATABASE_URL) {
    const u = new URL(env.DATABASE_URL);

    host = u.hostname;
    port = u.port ? Number(u.port) : 3306;
    database = decodeURIComponent(u.pathname.replace(/^\//, ""));
    user = decodeURIComponent(u.username);
    password = decodeURIComponent(u.password);
  }

  if (!host || !database || !user) return null;

  const sslOn = ["1", "true", "yes", "required"].includes(
    (env.DB_SSL ?? "").toLowerCase()
  );

  const caValue =
    env.DB_SSL_CA_CONTENT?.trim() ||
    env.DB_SSL_CA?.trim();

  let ca: string | undefined;

  if (caValue) {
    if (caValue.includes("-----BEGIN CERTIFICATE-----")) {
      ca = caValue.replace(/\\n/g, "\n");
    } else {
      const { readFileSync } = require("node:fs");
      const { resolve } = require("node:path");

      ca = readFileSync(resolve(process.cwd(), caValue), "utf8");
    }
  }

  return {
    host,
    port,
    database,
    user,
    password,
    connectionLimit: Math.max(1, Number(env.DB_POOL_SIZE ?? 5)),
    ssl: sslOn
      ? {
          rejectUnauthorized:
            (env.DB_SSL_REJECT_UNAUTHORIZED ?? "true").toLowerCase() !== "false",
          ...(ca ? { ca } : {}),
        }
      : undefined,
  };
}


export function poolOptions(c: DbConfig): PoolOptions {
  return {
    host: c.host, port: c.port, database: c.database, user: c.user, password: c.password,
    waitForConnections: true, connectionLimit: c.connectionLimit, queueLimit: 0,
    charset: "utf8mb4", timezone: "Z", ssl: c.ssl, connectTimeout: 10_000, enableKeepAlive: true,
    // Always hand JSON columns back as strings (MySQL 8 would pre-parse them, MariaDB does not) so behaviour is identical.
    typeCast: (field, next) =>
  field.type === "JSON" ? field.string("utf8") : next(),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: Pool | undefined;
}

function getPool(): Pool {
  if (globalThis._mysqlPool) return globalThis._mysqlPool; // survives HMR reloads in dev
  const cfg = readDbConfig();
  if (!cfg) throw new Error("Database is not configured. Set DATABASE_URL (or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD) in .env.local — see .env.example.");
  globalThis._mysqlPool = mysql.createPool(poolOptions(cfg));
  return globalThis._mysqlPool;
}

export class Db {
  constructor(readonly pool: Pool) {}
  collection<T extends object = Record<string, unknown>>(name: string): Collection<T> { return new Collection<T>(this.pool, name); }
}

let cachedDb: Db | null = null;
export async function getDb(): Promise<Db> {
  if (!cachedDb) cachedDb = new Db(getPool());
  return cachedDb;
}

/** True when the database is configured — callers use it to fall back to the built-in default content. */
export function isDbConfigured(): boolean {
  return readDbConfig() !== null;
}

export async function closeDb(): Promise<void> {
  if (globalThis._mysqlPool) { await globalThis._mysqlPool.end(); globalThis._mysqlPool = undefined; cachedDb = null; }
}
