import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmForm from "@/components/admin/ConfirmForm";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/db";
import { COLLECTIONS, type CmsMetaDoc, type HardwareProductDoc } from "@/lib/models";
import { hardwareDefaults } from "@/lib/cms/defaults/hardware";
import { getCmsPage } from "@/lib/cms/store";
import { bankingPageFields } from "@/lib/cms/sections";
import { pageToForm } from "@/lib/cms/form-map";
import { deleteHardwareAction, moveHardwareAction, resetPageAction, savePageAction, syncCmsDefaultsAction, toggleHardwareAction } from "../../cms-actions";

export const dynamic = "force-dynamic";
async function syncForm() { "use server"; await syncCmsDefaultsAction(["hardware"]); }

export default async function HardwareAdmin() {
  const admin = await requirePermission("content");
  let products: HardwareProductDoc[] = [];
  let imported = true;
  if (isDbConfigured()) {
    const db = await getDb();
    products = await db.collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts).find().sort({ order: 1 }).toArray();
    imported = Boolean(await db.collection<CmsMetaDoc>(COLLECTIONS.cmsMeta).findOne({ _id: "seeded:hardware" }));
  }
  const page = await getCmsPage("bank-hardware");
  return (
    <AdminShell active="/admin/banking/hardware">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Banking · CSP Hardware</h1>
        <div className="flex gap-3">
          <Link href="/banking/csp-hardware" target="_blank" className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">View page ↗</Link>
          {!imported && <form action={syncForm}><button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">Import existing products ({hardwareDefaults().length})</button></form>}
          <Link href="/admin/banking/hardware/new" className="text-sm font-semibold bg-brand-navy text-white px-4 py-2 rounded-lg">+ Add product</Link>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-3xl">Every product here gets its own page at <code>/banking/csp-hardware/&lt;slug&gt;</code>. Order below = order on the public list.</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
        {products.map((p, i) => {
          const id = String(p._id);
          return (
            <div key={id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.image && <img src={p.image} alt="" className="h-10 w-10 object-contain rounded border bg-white" />}
              <div className="flex-1 min-w-48"><p className="font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400">/banking/csp-hardware/{p.slug}{p.unitPrice ? ` · ₹${p.unitPrice}` : ""}</p></div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
              <form action={toggleHardwareAction.bind(null, id, p.status !== "published")}><button className="text-sm text-gray-600 hover:underline">{p.status === "published" ? "Unpublish" : "Publish"}</button></form>
              <form action={moveHardwareAction.bind(null, id, -1)}><button disabled={i === 0} className="text-sm text-gray-600 disabled:opacity-30">↑</button></form>
              <form action={moveHardwareAction.bind(null, id, 1)}><button disabled={i === products.length - 1} className="text-sm text-gray-600 disabled:opacity-30">↓</button></form>
              <Link href={`/admin/banking/hardware/${id}`} className="text-sm font-semibold text-blue-600">Edit</Link>
              {can(admin.role, "delete") && <ConfirmForm action={deleteHardwareAction.bind(null, id)} message={`Delete “${p.name}”? Its page will disappear.`}>Delete</ConfirmForm>}
            </div>
          );
        })}
        {products.length === 0 && <p className="px-5 py-10 text-center text-gray-500 text-sm">No products yet.</p>}
      </div>

      {page && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-brand-navy mb-1">Listing page heading &amp; SEO</h2>
          <p className="text-gray-500 text-sm mb-4">The heading above the product list and the SEO of <code>/banking/csp-hardware</code>. Extra sections added here appear below the product list.</p>
          <ContentEditor wide fields={bankingPageFields} initial={pageToForm(page)} publicPath="/banking/csp-hardware"
            saveAction={savePageAction.bind(null, "bank-hardware")} resetAction={resetPageAction.bind(null, "bank-hardware")} />
        </div>
      )}
    </AdminShell>
  );
}
