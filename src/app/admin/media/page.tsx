import AdminShell from "@/components/admin/AdminShell";
import { requirePermission, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type MediaDoc } from "@/lib/models";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { MediaGrid, UploadButton } from "./MediaGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const admin = await requirePermission("media");
  const sp = await searchParams;
  const q = (sp.q || "").trim().slice(0, 80);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  let items: MediaDoc[] = [];
  let total = 0;
  if (isDbConfigured()) {
    const db = await getDb();
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = q ? { $or: ["filename", "alt", "title"].map((f) => ({ [f]: { $regex: esc, $options: "i" } })) } : {};
    const col = db.collection<MediaDoc>(COLLECTIONS.media);
    [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
      col.countDocuments(filter),
    ]);
  }
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminShell active="/admin/media" role={admin.role}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Media Library</h1>
        <UploadButton />
      </div>
      <p className="text-gray-500 mb-5 text-sm">
        Images uploaded here (or from any image field) are stored on Cloudinary and reusable everywhere.
      </p>
      {!isCloudinaryConfigured() && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          Cloudinary isn&apos;t configured. Local development saves to <code>/public/uploads</code>; <b>production uploads are
          disabled</b> until <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> and <code>CLOUDINARY_API_SECRET</code> are set.
        </div>
      )}
      <form className="mb-5 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search media…" className="input max-w-sm" />
        <button className="px-4 py-2 rounded-lg bg-white border text-sm font-semibold">Search</button>
      </form>
      <MediaGrid
        canDelete={can(admin.role, "delete")}
        items={items.map((m) => ({
          id: m._id!.toString(), url: m.url, filename: m.filename, alt: m.alt ?? "", title: m.title ?? "",
          bytes: m.bytes, createdAt: m.createdAt.toISOString().slice(0, 10),
        }))}
      />
      {pages > 1 && (
        <div className="flex items-center gap-3 mt-6 text-sm">
          {page > 1 && <Link className="text-blue-600" href={`?q=${encodeURIComponent(q)}&page=${page - 1}`}>← Previous</Link>}
          <span className="text-gray-500">Page {page} of {pages}</span>
          {page < pages && <Link className="text-blue-600" href={`?q=${encodeURIComponent(q)}&page=${page + 1}`}>Next →</Link>}
        </div>
      )}
    </AdminShell>
  );
}
