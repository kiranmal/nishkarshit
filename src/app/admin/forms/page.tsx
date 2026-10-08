import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { LEAD_STATUSES } from "@/lib/models";
import { FORM_SOURCES, STATUS_COLOR, STATUS_LABEL, listLeads } from "@/lib/forms/registry";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

type SP = { form?: string; status?: string; q?: string; from?: string; to?: string; page?: string };

export default async function FormsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requirePermission("forms");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const qs = (o: Partial<SP>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...o })) if (v) p.set(k, String(v));
    return `?${p.toString()}`;
  };

  let data: Awaited<ReturnType<typeof listLeads>> | null = null;
  let error = false;
  if (isDbConfigured()) {
    try { data = await listLeads(sp, page, PAGE_SIZE); } catch (e) { console.error(e); error = true; }
  }
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <AdminShell active="/admin/forms">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Forms &amp; Enquiries</h1>
        {data && (
          <a href={`/admin/forms/export${qs({ page: undefined })}`} className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">
            Export CSV
          </a>
        )}
      </div>
      <p className="text-gray-500 mb-5 text-sm">Every submission from every form on the website — who enquired, through which form, and what they sent.</p>

      {!isDbConfigured() && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">MongoDB isn&apos;t connected — submissions can&apos;t be stored or listed.</div>}
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">Could not load submissions. Check the database connection.</div>}

      <form className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-5">
        <select name="form" defaultValue={sp.form || ""} className="input">
          <option value="">All forms</option>
          {FORM_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select name="status" defaultValue={sp.status || ""} className="input">
          <option value="">Any status</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <input name="q" defaultValue={sp.q} placeholder="Search name, email, phone…" className="input col-span-2" />
        <input type="date" name="from" defaultValue={sp.from} className="input" aria-label="From date" />
        <input type="date" name="to" defaultValue={sp.to} className="input" aria-label="To date" />
        <button className="col-span-2 md:col-span-6 md:w-32 bg-brand-navy text-white text-sm font-semibold rounded-lg py-2">Filter</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Form</th><th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {data?.leads.map((l) => (
              <tr key={`${l.formKey}-${l.id}`} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{l.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-3">{l.formLabel}{l.reference && <div className="text-xs text-gray-400">{l.reference}</div>}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{l.name || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{l.email || "—"}<div className="text-xs text-gray-400">{l.phone}</div></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[l.status]}`}>{STATUS_LABEL[l.status]}</span></td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/forms/${l.formKey}/${l.id}`} className="text-blue-600 font-semibold">Open</Link></td>
              </tr>
            ))}
            {data && data.leads.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No submissions match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="flex items-center gap-4 mt-5 text-sm">
          <span className="text-gray-500">{data.total} total</span>
          {page > 1 && <Link className="text-blue-600" href={qs({ page: String(page - 1) })}>← Previous</Link>}
          <span className="text-gray-500">Page {page} of {pages}</span>
          {page < pages && <Link className="text-blue-600" href={qs({ page: String(page + 1) })}>Next →</Link>}
        </div>
      )}
    </AdminShell>
  );
}
