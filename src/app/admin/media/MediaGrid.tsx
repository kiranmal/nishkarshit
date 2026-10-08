"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Upload } from "lucide-react";
import { deleteMediaAction, updateMediaAction } from "./actions";

export type MediaRow = { id: string; url: string; filename: string; alt: string; title: string; bytes: number; createdAt: string };

export function UploadButton() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload(files: FileList) {
    setBusy(true);
    setMsg(null);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMsg(`${file.name}: ${d.error || "upload failed"}`);
        break;
      }
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,image/avif" className="hidden"
        onChange={(e) => e.target.files && upload(e.target.files)} />
      <button onClick={() => ref.current?.click()} disabled={busy}
        className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60">
        <Upload size={15} /> {busy ? "Uploading…" : "Upload images"}
      </button>
      {msg && <span className="text-sm text-red-600">{msg}</span>}
    </div>
  );
}

export function MediaGrid({ items, canDelete }: { items: MediaRow[]; canDelete: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="text-gray-500 text-sm py-10 text-center">No media found.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((m) => (
        <div key={m.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m.url} alt={m.alt} className="aspect-square w-full object-cover bg-gray-50" loading="lazy" />
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-gray-800 truncate" title={m.filename}>{m.filename}</p>
            <p className="text-[11px] text-gray-400">{(m.bytes / 1024).toFixed(0)} KB · {m.createdAt}</p>
            {editing === m.id ? (
              <form action={(fd) => start(async () => { await updateMediaAction(m.id, fd); setEditing(null); })} className="space-y-1.5">
                <input name="alt" defaultValue={m.alt} placeholder="Alt text" className="input !text-xs" />
                <input name="title" defaultValue={m.title} placeholder="Title" className="input !text-xs" />
                <button disabled={pending} className="text-xs font-semibold text-blue-600">Save</button>
              </form>
            ) : (
              <div className="flex items-center gap-3 text-xs">
                <button onClick={() => { navigator.clipboard.writeText(m.url); setCopied(m.id); setTimeout(() => setCopied(null), 1500); }}
                  className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                  <Copy size={12} /> {copied === m.id ? "Copied" : "Copy URL"}
                </button>
                <button onClick={() => setEditing(m.id)} className="text-gray-500 hover:underline">Alt text</button>
                {canDelete && (
                  <button disabled={pending}
                    onClick={() => { if (confirm(`Delete ${m.filename}? Pages still using it will show a broken image.`)) start(() => deleteMediaAction(m.id)); }}
                    className="ml-auto text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
