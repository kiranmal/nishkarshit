import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type ExpertiseItemDoc } from "@/lib/models";
import { defaultExpertiseDocs } from "@/lib/cms/entities";
import { addExpertiseAction, deleteExpertiseAction, syncExpertiseDefaultsAction, toggleExpertiseAction } from "./actions";

export const dynamic = "force-dynamic";

async function syncForm() { "use server"; await syncExpertiseDefaultsAction(); }

export default async function ExpertiseAdmin() {
  const admin = await requirePermission("content");
  let docs: ExpertiseItemDoc[] = [];
  if (isDbConfigured()) {
    docs = await (await getDb()).collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems).find().sort({ order: 1 }).toArray();
  }
  const have = new Set(docs.map((d) => d.slug));
  const missing = defaultExpertiseDocs().filter((d) => !have.has(d.slug)).length;

  return (
    <AdminShell active="/admin/expertise">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Expertise Pages</h1>
        <form action={syncForm}>
          <button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">
            Sync default content{missing ? ` (${missing} to import)` : ""}
          </button>
        </form>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-2xl">
        Each expertise page under <code>/expertise/…</code>. Until you edit or sync a page, the website shows the built-in default.
        Sync imports missing defaults only — it never overwrites your edits and never deletes pages you added.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
        {docs.map((d) => (
          <div key={d.slug} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-48">
              <p className="font-semibold text-gray-900">{d.title}</p>
              <p className="text-xs text-gray-400">/expertise/{d.slug} · order {d.order}{d.source === "default" ? " · default" : ""}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{d.status}</span>
            <form action={toggleExpertiseAction.bind(null, d.slug, d.status !== "published")}>
              <button className="text-sm text-gray-600 hover:underline">{d.status === "published" ? "Unpublish" : "Publish"}</button>
            </form>
            <Link href={`/admin/expertise/${d.slug}`} className="text-sm font-semibold text-blue-600">Edit</Link>
            {can(admin.role, "delete") && (
              <form action={deleteExpertiseAction.bind(null, d.slug)}>
                <button className="text-sm text-red-600" title="Delete (default pages can be re-imported with Sync)">Delete</button>
              </form>
            )}
          </div>
        ))}
        {docs.length === 0 && <p className="px-5 py-10 text-center text-gray-500 text-sm">No records yet — click “Sync default content” to import the existing pages.</p>}
      </div>

      <form action={addExpertiseAction} className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-3 items-end">
        <div><label className="block text-sm font-medium mb-1">New page title</label><input name="title" required className="input" /></div>
        <div><label className="block text-sm font-medium mb-1">Slug (optional)</label><input name="slug" className="input" placeholder="auto from title" /></div>
        <button className="bg-brand-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Add page (as draft)</button>
      </form>
    </AdminShell>
  );
}
