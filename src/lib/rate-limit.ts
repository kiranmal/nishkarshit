import { headers } from "next/headers";

const hits = new Map<string, number[]>();

/**
 * Best-effort in-memory rate limit (per server instance). On serverless it limits
 * bursts within a warm instance; for hard guarantees put Vercel Firewall / Upstash in front.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}

export async function clientMeta() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return { ip, userAgent: (h.get("user-agent") || "").slice(0, 300), referer: (h.get("referer") || "").slice(0, 500) };
}
