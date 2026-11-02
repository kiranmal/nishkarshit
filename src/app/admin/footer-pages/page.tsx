import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission } from "@/lib/auth";
import { listPages } from "@/lib/cms/store";
import { syncCmsDefaultsAction } from "../cms-actions";

export const dynamic = "force-dynamic";
async function syncForm() { "use server"; await syncCmsDefaultsAction(["footer-pages"]); }

export default async function FooterPagesAdmin() {
  await requirePermission("content");
  const pages = await listPages("footer-page");
  return (
    <AdminShell active="/admin/footer-pages">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Footer Pages</h1>
        <form action={syncForm}><button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">Sync default content</button></form>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-3xl">Privacy Policy, Refund Policy, Terms &amp; Conditions and Cloud Computing — the pages linked from the website footer. Footer links themselves are edited under Footer Settings.</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
        {pages.map((p) => (
          <div key={p.pageKey} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-48"><p className="font-semibold text-gray-900">{p.label}</p><p className="text-xs text-gray-400">{p.path} · {p.sections.length} sections</p></div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
            <Link href={p.path} target="_blank" className="text-sm text-gray-600">View ↗</Link>
            <Link href={`/admin/footer-pages/${p.pageKey}`} className="text-sm font-semibold text-blue-600">Edit</Link>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3">
          <div className="flex-1 min-w-48"><p className="font-semibold text-gray-900">IT Services</p><p className="text-xs text-gray-400">/it-services</p></div>
          <Link href="/admin/footer-pages/it-services" className="text-sm font-semibold text-blue-600">Edit</Link>
        </div>
      </div>
    </AdminShell>
  );
}
