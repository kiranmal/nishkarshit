import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type FestivalDoc } from "@/lib/models";

/**
 * Picks the festival that should currently be shown on the site, if any.
 *
 * A festival is "in range" when `active` is true AND today falls between
 * startDate/endDate (inclusive). `active` is a manual override an admin can
 * flip off at any time to kill a theme early without deleting it. When more
 * than one festival is in range at once, the highest `priority` wins.
 */
export async function getActiveFestival(): Promise<FestivalDoc | null> {
  if (!isDbConfigured()) return null;
  try {
    const db = await getDb();
    const now = new Date();
    const candidates = await db
      .collection<FestivalDoc>(COLLECTIONS.festivals)
      .find({
        active: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .sort({ priority: -1 })
      .limit(1)
      .toArray();
    return candidates[0] || null;
  } catch {
    return null;
  }
}
