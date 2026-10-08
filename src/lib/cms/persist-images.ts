import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type MediaDoc } from "@/lib/models";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { sniffImage } from "@/lib/image-sniff";

const DATA_IMG = /^data:image\/(jpeg|png|gif|webp|avif);base64,([A-Za-z0-9+/=]+)$/;

/**
 * Images pasted from Google/Bing thumbnails arrive as `data:image/...;base64,` strings.
 * When Cloudinary is configured we upload them and store the permanent URL instead;
 * otherwise (local dev) the data URI is kept so nothing is lost.
 */
export async function externalizeImages<T>(value: T, uploadedBy?: string): Promise<T> {
  if (typeof value === "string") {
    const m = DATA_IMG.exec(value);
    if (!m || !isCloudinaryConfigured()) return value;
    try {
      const buf = Buffer.from(m[2], "base64");
      const kind = sniffImage(buf);
      if (!kind || buf.length > 8 * 1024 * 1024) return value;
      const up = await uploadToCloudinary(buf, kind.mime);
      if (isDbConfigured()) {
        const doc: MediaDoc = { url: up.url, publicId: up.publicId, filename: "pasted-image" + kind.ext, mimeType: kind.mime, bytes: buf.length, width: up.width, height: up.height, uploadedBy, createdAt: new Date() };
        await (await getDb()).collection<MediaDoc>(COLLECTIONS.media).insertOne(doc).catch(() => undefined);
      }
      return up.url as unknown as T;
    } catch (err) {
      console.error("[images] could not move pasted image to Cloudinary:", err);
      return value;
    }
  }
  if (Array.isArray(value)) return (await Promise.all(value.map((v) => externalizeImages(v, uploadedBy)))) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = await externalizeImages(v, uploadedBy);
    return out as T;
  }
  return value;
}
