import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmForm from "@/components/admin/ConfirmForm";
import { requirePermission, can } from "@/lib/auth";
import { listPages } from "@/lib/cms/store";
import { addEducationTabAction, deleteEducationTabAction, moveEducationTabAction, syncCmsDefaultsAction, toggleEducationTabAction } from "../cms-actions";

export const dynamic = "force-dynamic";
async function syncForm() { "use server"; await syncCmsDefaultsAction(["education"]); }

export default async function EducationAdmin() {
  const admin = await requirePermission("content");
  const tabs = await listPages("education-tab");
  return (
    <AdminShell active="/admin/education">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Education Tabs</h1>
        <div className="flex gap-3">
          <Link href="/education" target="_blank" className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">View /education ↗</Link>
          <form action={syncForm}><button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">Sync default content</button></form>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-3xl">
        Each tab of the public Education page. Add, rename, reorder, hide or delete tabs, and edit everything inside them (banner, sections, cards, lists, events, buttons, images, SEO).
        A new tab appears on <code>/education</code> as soon as it is published — no code change needed.
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
        {tabs.map((t, i) => (
          <div key={t.pageKey} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-48">
              <p className="font-semibold text-gray-900">{t.label}</p>
              <p className="text-xs text-gray-400">/education#{t.slug} · {t.sections.length} sections</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{t.status === "published" ? "enabled" : "disabled"}</span>
            <form action={toggleEducationTabAction.bind(null, t.pageKey, t.status !== "published")}><button className="text-sm text-gray-600 hover:underline">{t.status === "published" ? "Disable" : "Enable"}</button></form>
            <form action={moveEducationTabAction.bind(null, t.pageKey, -1)}><button disabled={i === 0} className="text-sm text-gray-600 disabled:opacity-30" title="Move left">↑</button></form>
            <form action={moveEducationTabAction.bind(null, t.pageKey, 1)}><button disabled={i === tabs.length - 1} className="text-sm text-gray-600 disabled:opacity-30" title="Move right">↓</button></form>
            <Link href={`/admin/education/${t.slug}`} className="text-sm font-semibold text-blue-600">Edit</Link>
            {can(admin.role, "delete") && <ConfirmForm action={deleteEducationTabAction.bind(null, t.pageKey)} message={`Delete the “${t.label}” tab and all its content? This cannot be undone.`}>Delete</ConfirmForm>}
          </div>
        ))}
        {tabs.length === 0 && <p className="px-5 py-10 text-center text-gray-500 text-sm">No tabs yet — click “Sync default content” to import the existing ones.</p>}
      </div>
      <form action={addEducationTabAction} className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-3 items-end">
        <div><label className="block text-sm font-medium mb-1">New tab name</label><input name="label" required className="input" placeholder="e.g. Scholarship" /></div>
        <div><label className="block text-sm font-medium mb-1">Key / slug (optional)</label><input name="slug" className="input" placeholder="auto from name" /></div>
        <button className="bg-brand-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Add tab</button>
      </form>
    </AdminShell>
  );
}
