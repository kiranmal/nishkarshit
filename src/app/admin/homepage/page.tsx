import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { getHomeSections } from "@/lib/cms/store";
import { HOME_FIELDS, HOME_LABELS, type HomeKey } from "@/lib/cms/home";
import { moveHomeSectionAction, resetHomeSectionAction, saveHomeSectionAction, syncCmsDefaultsAction, toggleHomeSectionAction } from "../cms-actions";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

async function syncForm() { "use server"; await syncCmsDefaultsAction(["home"]); }

export default async function HomepageAdmin({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  await requirePermission("content");
  const { section } = await searchParams;
  const sections = await getHomeSections();
  const open = sections.find((s) => s.key === section);
  return (
    <AdminShell active="/admin/homepage">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Homepage Sections</h1>
        <div className="flex gap-3">
          <Link href="/" target="_blank" className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">View homepage ↗</Link>
          <form action={syncForm}><button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">Sync default content</button></form>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-3xl">
        Every block of the homepage is edited here: show/hide, order, headings, text, cards, images, buttons and links. Saving updates the live site immediately.
        “Sync” only imports missing defaults — it never overwrites what you edited.
        {!isDbConfigured() && " (Database not configured — changes cannot be saved.)"}
      </p>

      {open ? (
        <div>
          <Link href="/admin/homepage" className="text-sm text-blue-600">← All sections</Link>
          <h2 className="text-xl font-bold text-brand-navy mt-2 mb-4">{HOME_LABELS[open.key]}</h2>
          <ContentEditor
            wide
            fields={HOME_FIELDS[open.key]}
            initial={open.content as unknown as Record<string, unknown>}
            publicPath="/"
            saveAction={saveHomeSectionAction.bind(null, open.key as HomeKey)}
            resetAction={resetHomeSectionAction.bind(null, open.key as HomeKey)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
          {sections.map((s, i) => (
            <div key={s.key} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-48">
                <p className="font-semibold text-gray-900">{HOME_LABELS[s.key]}</p>
                <p className="text-xs text-gray-400">position {i + 1}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{s.visible ? "visible" : "hidden"}</span>
              <form action={toggleHomeSectionAction.bind(null, s.key, !s.visible)}><button className="text-sm text-gray-600 hover:underline">{s.visible ? "Hide" : "Show"}</button></form>
              <form action={moveHomeSectionAction.bind(null, s.key, -1)}><button disabled={i === 0} className="text-sm text-gray-600 disabled:opacity-30" title="Move up">↑</button></form>
              <form action={moveHomeSectionAction.bind(null, s.key, 1)}><button disabled={i === sections.length - 1} className="text-sm text-gray-600 disabled:opacity-30" title="Move down">↓</button></form>
              <Link href={`/admin/homepage?section=${s.key}`} className="text-sm font-semibold text-blue-600">Edit content</Link>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
