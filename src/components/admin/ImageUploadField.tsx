"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X, Images } from "lucide-react";

type MediaItem = { id: string; url: string; filename: string; alt: string };

/**
 * Image input used across the admin. Works in two modes:
 *  - uncontrolled inside a <form>: renders a hidden <input name=...>
 *  - controlled (`value` + `onChange`): used by the schema-driven content editor
 * Supports uploading (Cloudinary), pasting a URL, or choosing from the Media Library.
 */
export default function ImageUploadField({
  name,
  label,
  defaultValue,
  value,
  onChange,
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
}) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue || "");
  const url = controlled ? value! : inner;
  const setUrl = (u: string) => {
    if (!controlled) setInner(u);
    onChange?.(u);
  };

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>}
      {name && <input type="hidden" name={name} value={url} />}
      <div className="flex items-center gap-3">
        {url ? (
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-50" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
            <Upload size={18} />
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <Images size={12} /> Media library
            </button>
          </div>
          {url.startsWith("data:image/") ? (
            <p className="text-xs text-gray-500">
              Embedded image (pasted from a website).{" "}
              <button type="button" onClick={() => setUrl("")} className="text-blue-600 hover:underline">Remove</button>
              {" · "}it will be stored permanently when you save if Cloudinary is set up.
            </p>
          ) : (
            <input
              type="text"
              placeholder="or paste image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input !text-xs"
            />
          )}
          {/google\.[a-z.]+\/(imgres|url|search)/i.test(url) && (
            <p className="text-xs text-amber-700">
              That is a Google results link, not the image itself. Open the picture, right-click it → “Copy image address”, or save it and use Upload image.
            </p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onPick={(u) => {
            setUrl(u);
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/media?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error();
        setItems((await res.json()).items);
        setFailed(false);
      } catch {
        setFailed(true);
        setItems([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b">
          <h3 className="font-bold text-gray-900">Media library</h3>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or alt text"
            className="input flex-1"
          />
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {items === null ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : failed ? (
            <p className="text-sm text-red-600">Could not load the media library.</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No images yet — upload one first.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="group text-left"
                  title={m.filename}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt} className="aspect-square w-full object-cover rounded-lg border group-hover:ring-2 ring-blue-500" />
                  <span className="block text-[11px] text-gray-500 truncate mt-1">{m.filename}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
