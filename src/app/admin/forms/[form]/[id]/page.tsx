import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission, can } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/models";
import { STATUS_COLOR, STATUS_LABEL, getLead } from "@/lib/forms/registry";
import { updateLeadAction, deleteLeadAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ form: string; id: string }> }) {
  const admin = await requirePermission("forms");
  const { form, id } = await params;
  const lead = await getLead(form, id);
  if (!lead) notFound();

  const sections = new Map<string, typeof lead.fields>();
  for (const f of lead.fields) sections.set(f.section, [...(sections.get(f.section) ?? []), f]);

  return (
    <AdminShell active="/admin/forms">
      <Link href="/admin/forms" className="text-sm text-blue-600">← All submissions</Link>
      <div className="flex flex-wrap items-center gap-3 mt-2 mb-1">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>{lead.formLabel}</h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[lead.status]}`}>{STATUS_LABEL[lead.status]}</span>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Submitted {lead.createdAt.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
        {lead.reference && <> · Ref <b>{lead.reference}</b></>}
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid sm:grid-cols-3 gap-4">
            {[["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone]].map(([k, v]) => (
              <div key={k}><p className="text-xs uppercase text-gray-400 font-semibold">{k}</p><p className="text-gray-900 break-words">{v || "—"}</p></div>
            ))}
          </div>
          {[...sections.entries()].map(([title, fields]) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">{title}</h2>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {fields.map((f, i) => (
                  <div key={i} className={f.value.length > 60 ? "sm:col-span-2" : ""}>
                    <dt className="text-xs uppercase text-gray-400 font-semibold">{f.label}</dt>
                    <dd className="text-gray-900 whitespace-pre-wrap break-words">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <form action={updateLeadAction.bind(null, form, id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
          <h2 className="font-bold text-gray-900">Manage</h2>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
            <select name="status" defaultValue={lead.status} className="input">
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Internal notes</label>
            <textarea name="notes" defaultValue={lead.notes} rows={6} maxLength={4000} className="input" placeholder="Visible to admins only" />
          </div>
          <button className="w-full bg-brand-navy text-white text-sm font-semibold py-2.5 rounded-lg">Save</button>
          {lead.updatedAt && <p className="text-xs text-gray-400">Last updated {lead.updatedAt.toLocaleString("en-IN")}</p>}
          {can(admin.role, "forms_delete") && (
            <button formAction={deleteLeadAction.bind(null, form, id)} className="w-full text-sm font-semibold text-red-600 border border-red-200 py-2 rounded-lg"
              >Delete submission</button>
          )}
        </form>
      </div>
    </AdminShell>
  );
}
