"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { blankItem, type Field } from "@/lib/cms/schema";

type Obj = Record<string, unknown>;

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const label = <label className="block text-sm font-medium text-gray-900 mb-1">{field.label}</label>;
  const help = field.help ? <p className="text-xs text-gray-500 mt-1">{field.help}</p> : null;
  switch (field.type) {
    case "text":
    case "email":
    case "url":
      return (
        <div>{label}
          <input className="input" value={String(value ?? "")} maxLength={field.type === "text" ? field.max : 2000}
            placeholder={"placeholder" in field ? field.placeholder : undefined}
            onChange={(e) => onChange(e.target.value)} />{help}</div>
      );
    case "textarea":
      return (
        <div>{label}
          <textarea className="input min-h-24" rows={4} value={String(value ?? "")} maxLength={field.max}
            onChange={(e) => onChange(e.target.value)} />{help}</div>
      );
    case "image":
      return <div><ImageUploadField label={field.label} value={String(value ?? "")} onChange={onChange} />{help}</div>;
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {field.label}{field.help && <span className="text-xs text-gray-500">— {field.help}</span>}
        </label>
      );
    case "number":
      return (
        <div>{label}
          <input type="number" className="input" value={Number(value ?? 0)} min={field.min} max={field.max}
            onChange={(e) => onChange(Number(e.target.value))} />{help}</div>
      );
    case "select":
      return (
        <div>{label}
          <select className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>{help}</div>
      );
    case "group":
      return (
        <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
          <legend className="text-sm font-semibold px-1">{field.label}</legend>
          <Fields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange as (v: Obj) => void} />
        </fieldset>
      );
    case "list": {
      const items = (Array.isArray(value) ? value : []) as Obj[];
      const set = (next: Obj[]) => onChange(next);
      const move = (i: number, d: -1 | 1) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        set(next);
      };
      return (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">{field.label} <span className="text-gray-400 font-normal">({items.length})</span></p>
          {help}
          <div className="space-y-3 mt-2">
            {items.map((item, i) => (
              <details key={i} className="border border-gray-200 rounded-lg bg-gray-50/60" open={items.length <= 3}>
                <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none">
                  <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                    {i + 1}. {String(item[field.itemTitle] || "(untitled)")}
                  </span>
                  <button type="button" aria-label="Move up" onClick={(e) => { e.preventDefault(); move(i, -1); }} className="p-1 text-gray-500 hover:text-gray-900"><ChevronUp size={16} /></button>
                  <button type="button" aria-label="Move down" onClick={(e) => { e.preventDefault(); move(i, 1); }} className="p-1 text-gray-500 hover:text-gray-900"><ChevronDown size={16} /></button>
                  <button type="button" aria-label="Delete item" className="p-1 text-red-600"
                    onClick={(e) => { e.preventDefault(); if (confirm("Delete this item?")) set(items.filter((_, k) => k !== i)); }}>
                    <Trash2 size={15} /></button>
                </summary>
                <div className="p-4 pt-2 space-y-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <Fields fields={field.fields} value={item} onChange={(v) => set(items.map((x, k) => (k === i ? v : x)))} />
                </div>
              </details>
            ))}
          </div>
          {(field.max === undefined || items.length < field.max) && (
            <button type="button" onClick={() => set([...items, blankItem(field.fields)])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
              <Plus size={15} /> {field.addLabel || "Add item"}
            </button>
          )}
        </div>
      );
    }
  }
}

function Fields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={value[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} />
      ))}
    </>
  );
}

type SaveResult = { ok: true; data: Record<string, unknown> } | { ok: false; error: string };

/**
 * Generic schema-driven editor. The caller supplies bound server actions, so the same
 * UI edits site content, expertise pages, team members, etc.
 */
export default function ContentEditor({
  saveAction, resetAction, fields, initial, customised = true, publicPath, saveLabel = "Save changes",
}: {
  saveAction: (json: string) => Promise<SaveResult>;
  resetAction?: () => Promise<SaveResult>;
  fields: Field[];
  initial: Obj;
  customised?: boolean;
  publicPath?: string;
  saveLabel?: string;
}) {
  const [data, setData] = useState<Obj>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [isCustom, setIsCustom] = useState(customised);

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveAction(JSON.stringify(data));
      if (r.ok) { setData(r.data); setIsCustom(true); setMsg({ ok: true, text: "Saved. The public website is updated." }); }
      else setMsg({ ok: false, text: r.error });
    });
  }
  function reset() {
    if (!confirm("Discard all your changes and restore the original default content?")) return;
    start(async () => {
      const r = await resetAction!();
      if (r.ok) { setData(r.data); setIsCustom(false); setMsg({ ok: true, text: "Restored to default content." }); }
      else setMsg({ ok: false, text: r.error });
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <Fields fields={fields} value={data} onChange={setData} />
      </div>
      <div className="sticky bottom-0 bg-[#f5f6f8]/95 backdrop-blur py-4 mt-4 flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={pending} className="bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-60">
          {pending ? "Saving…" : saveLabel}
        </button>
        {isCustom && resetAction && (
          <button onClick={reset} disabled={pending} className="text-sm font-semibold text-gray-600 border border-gray-300 px-4 py-2.5 rounded-lg bg-white">
            Restore defaults
          </button>
        )}
        {publicPath && <a href={publicPath} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View site ↗</a>}
        {msg && <span className={`text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}
