import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentAdmin, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type MediaDoc } from "@/lib/models";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { sniffImage as sniff } from "@/lib/image-sniff";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Admin image upload. Production: Cloudinary (persistent). Local dev without
 * Cloudinary keys: falls back to /public/uploads. In production without
 * Cloudinary keys it refuses, because Vercel's filesystem is not persistent.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin.role, "media")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buffer);
  if (!kind) {
    return NextResponse.json(
      { error: "Only JPG, PNG, GIF, WebP or AVIF images are allowed" },
      { status: 400 }
    );
  }

  let url: string;
  let publicId: string;
  let width: number | undefined;
  let height: number | undefined;

  try {
    if (isCloudinaryConfigured()) {
      const up = await uploadToCloudinary(buffer, kind.mime);
      url = up.url;
      publicId = up.publicId;
      width = up.width;
      height = up.height;
    } else if (process.env.NODE_ENV !== "production") {
      const dir = path.join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${kind.ext}`;
      await writeFile(path.join(dir, name), buffer);
      url = `/uploads/${name}`;
      publicId = `local:${name}`;
    } else {
      return NextResponse.json(
        {
          error:
            "Image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
        },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error("[upload] failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }

  let id: string | undefined;
  if (isDbConfigured()) {
    try {
      const db = await getDb();
      const doc: MediaDoc = {
        url,
        publicId,
        filename: file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "image",
        mimeType: kind.mime,
        bytes: buffer.length,
        width,
        height,
        uploadedBy: admin.email,
        createdAt: new Date(),
      };
      const r = await db.collection<MediaDoc>(COLLECTIONS.media).insertOne(doc);
      id = r.insertedId.toString();
    } catch (err) {
      console.error("[upload] media record failed:", err);
    }
  }
  return NextResponse.json({ url, id });
}
