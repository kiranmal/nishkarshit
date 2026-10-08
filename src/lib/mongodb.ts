import { MongoClient, type Db } from "mongodb";

/**
 * Lazy MongoDB connection.
 *
 * IMPORTANT: nothing here runs at import/build time — the client only
 * connects the first time getDb() is actually called from inside a Server
 * Action or Route Handler. That keeps `next build` working even when
 * MONGODB_URI isn't set yet (e.g. first clone, CI, preview environments).
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "nishkarsh_it";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example)."
    );
  }

  if (process.env.NODE_ENV === "development") {
    // Reuse the client across HMR reloads in dev so we don't open a new
    // connection pool on every file save.
    if (!global._mongoClientPromise) {
      const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
  return client.connect();
}

let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  const client = await getClientPromise();
  cachedDb = client.db(MONGODB_DB);
  return cachedDb;
}

/** True when MONGODB_URI is configured — use this to fall back to static data. */
export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}
