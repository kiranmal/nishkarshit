import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type MediaDoc } from "@/lib/models";

export const runtime = "nodejs";

/** Admin-only JSON feed used by the image picker. */
export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin.role, "media")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) return NextResponse.json({ items: [] });

  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 80);
  const filter = q
    ? { $or: ["filename", "alt", "title"].map((f) => ({ [f]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } })) }
    : {};
  const db = await getDb();
  const docs = await db
    .collection<MediaDoc>(COLLECTIONS.media)
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(60)
    .toArray();
  return NextResponse.json({
    items: docs.map((d) => ({ id: d._id!.toString(), url: d.url, filename: d.filename, alt: d.alt ?? "" })),
  });
}
