import { createHash } from "crypto";

/**
 * Minimal Cloudinary client (signed REST calls — no SDK needed).
 * Env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function sign(params: Record<string, string | number>): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");
}

export interface UploadedImage {
  url: string;
  publicId: string;
  bytes: number;
  width?: number;
  height?: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = process.env.CLOUDINARY_FOLDER || "nishkarsh"
): Promise<UploadedImage> {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }));
  form.append("api_key", process.env.CLOUDINARY_API_KEY!);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", sign(params));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.secure_url) {
    throw new Error(json?.error?.message || "Cloudinary upload failed");
  }
  return {
    url: json.secure_url,
    publicId: json.public_id,
    bytes: json.bytes,
    width: json.width,
    height: json.height,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured()) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", process.env.CLOUDINARY_API_KEY!);
  form.append("timestamp", String(timestamp));
  form.append("signature", sign({ public_id: publicId, timestamp }));
  await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
    { method: "POST", body: form }
  );
}
