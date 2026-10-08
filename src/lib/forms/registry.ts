import { ObjectId, type Filter, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, LEAD_STATUSES, type LeadStatus } from "@/lib/models";
import { APPLICATION_CONFIGS } from "@/lib/applications/config";

export interface FormSource {
  key: string;
  label: string;
  collection: string;
  filter?: Document;
}

/** Every public form on the site, and where its submissions live. */
export const FORM_SOURCES: FormSource[] = [
  { key: "enquiry", label: "General Enquiry", collection: COLLECTIONS.enquiries },
  { key: "expertise", label: "Expertise / Service Enquiry", collection: COLLECTIONS.formSubmissions, filter: { formType: "expertise-enquiry" } },
  { key: "career", label: "Career Application", collection: COLLECTIONS.jobApplications },
  { key: "partner", label: "Partnership Application", collection: COLLECTIONS.partnerApplications },
  { key: "bank-csp", label: "Bank CSP Application", collection: COLLECTIONS.bankCspApplications },
  { key: "admission", label: "Student Admission", collection: COLLECTIONS.admissionApplications },
  { key: "loan", label: "Loan Application", collection: COLLECTIONS.loanApplications },
  { key: "other", label: "Other Forms", collection: COLLECTIONS.formSubmissions, filter: { formType: { $ne: "expertise-enquiry" } } },
];

export const getSource = (key: string) => FORM_SOURCES.find((s) => s.key === key);

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New", read: "Read", in_progress: "In Progress", contacted: "Contacted",
  approved: "Approved", rejected: "Rejected", closed: "Closed", spam: "Spam",
};
export const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700", read: "bg-gray-100 text-gray-700", in_progress: "bg-amber-100 text-amber-700",
  contacted: "bg-cyan-100 text-cyan-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  closed: "bg-slate-200 text-slate-700", spam: "bg-pink-100 text-pink-700",
};

/** Maps each collection's legacy `status` value onto the unified lead workflow. */
function legacyStatus(raw: unknown): LeadStatus {
  switch (raw) {
    case "read": case "reviewed": case "under_review": return "read";
    case "responded": return "contacted";
    case "accepted": return "approved";
    case "rejected": return "rejected";
    default: return "new"; // new, pending, undefined
  }
}

export interface LeadField { section: string; label: string; value: string }
export interface Lead {
  id: string;
  formKey: string;
  formLabel: string;
  reference?: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
  status: LeadStatus;
  notes: string;
  fields: LeadField[];
}

const HIDDEN = new Set(["_id", "crmStatus", "adminNotes", "status", "updatedAt", "createdAt", "applicationNumber", "formType", "formLabel", "ip", "userAgent", "sourceUrl"]);

function prettify(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** field name → label, taken from the Admission/Loan config so the admin sees the real form labels. */
function appLabels(docKey: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const cfg of Object.values(APPLICATION_CONFIGS))
    for (const sec of cfg.sections)
      if (sec.docKey === docKey) for (const f of sec.fields) m.set(f.name, f.label);
  return m;
}
const SECTION_TITLES: Record<string, string> = { personal: "Personal Information", education: "Education", loan: "Loan Details", additional: "Additional Details", data: "Submitted Details" };

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  if (Array.isArray(v)) return v.map(str).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function normalize(doc: Document, source: FormSource): Lead {
  const fields: LeadField[] = [];
  const top: Record<string, unknown> = doc;
  for (const [k, v] of Object.entries(top)) {
    if (HIDDEN.has(k) || v === undefined || v === null || v === "") continue;
    if (typeof v === "object" && !(v instanceof Date) && !Array.isArray(v) && !(v instanceof ObjectId)) {
      const labels = appLabels(k);
      for (const [fk, fv] of Object.entries(v as Record<string, unknown>)) {
        if (fv === undefined || fv === null || fv === "") continue;
        fields.push({ section: SECTION_TITLES[k] || prettify(k), label: labels.get(fk) || prettify(fk), value: str(fv) });
      }
    } else {
      fields.push({ section: "Details", label: prettify(k), value: str(v) });
    }
  }
  const p = (top.personal as Record<string, unknown>) || {};
  const d = (top.data as Record<string, unknown>) || {};
  const pick = (...vals: unknown[]) => str(vals.find((x) => typeof x === "string" && x.trim())) || "";
  const status = (LEAD_STATUSES as readonly string[]).includes(top.crmStatus as string)
    ? (top.crmStatus as LeadStatus)
    : legacyStatus(top.status);
  return {
    id: String(doc._id),
    formKey: source.key,
    formLabel: source.key === "other" && top.formLabel ? String(top.formLabel) : source.label,
    reference: top.applicationNumber ? String(top.applicationNumber) : undefined,
    name: pick(top.name, top.fullName, p.fullName, d.name),
    email: pick(top.email, p.email, d.email),
    phone: pick(top.phone, top.mobile, p.mobile, d.phone),
    createdAt: (top.createdAt as Date) || new ObjectId(String(doc._id)).getTimestamp(),
    updatedAt: top.updatedAt as Date | undefined,
    status,
    notes: typeof top.adminNotes === "string" ? top.adminNotes : "",
    fields,
  };
}

export interface LeadQuery { form?: string; status?: string; q?: string; from?: string; to?: string }

const SEARCH_PATHS = ["name", "fullName", "email", "phone", "mobile", "message", "jobTitle", "businessName", "applicationNumber",
  "personal.fullName", "personal.email", "personal.mobile", "data.name", "data.email", "data.phone"];

function buildFilter(src: FormSource, qy: LeadQuery): Filter<Document> {
  const and: Document[] = [];
  if (src.filter) and.push(src.filter);
  if (qy.status && (LEAD_STATUSES as readonly string[]).includes(qy.status)) {
    and.push(qy.status === "new"
      ? { $or: [{ crmStatus: "new" }, { crmStatus: { $exists: false }, status: { $in: ["new", "pending", null] } }, { crmStatus: { $exists: false }, status: { $exists: false } }] }
      : { $or: [{ crmStatus: qy.status }, ...(legacyAlias(qy.status))] });
  }
  if (qy.q?.trim()) {
    const rx = { $regex: qy.q.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    and.push({ $or: SEARCH_PATHS.map((p) => ({ [p]: rx })) });
  }
  const range: Document = {};
  if (qy.from && !isNaN(Date.parse(qy.from))) range.$gte = new Date(qy.from);
  if (qy.to && !isNaN(Date.parse(qy.to))) range.$lte = new Date(new Date(qy.to).getTime() + 86_399_999);
  if (Object.keys(range).length) and.push({ createdAt: range });
  return and.length ? { $and: and } : {};
}

function legacyAlias(status: string): Document[] {
  const map: Record<string, string[]> = { read: ["read", "reviewed", "under_review"], contacted: ["responded"], approved: ["accepted"], rejected: ["rejected"] };
  return map[status] ? [{ crmStatus: { $exists: false }, status: { $in: map[status] } }] : [];
}

export async function listLeads(qy: LeadQuery, page: number, pageSize: number): Promise<{ leads: Lead[]; total: number }> {
  const db = await getDb();
  const sources = qy.form ? FORM_SOURCES.filter((s) => s.key === qy.form) : FORM_SOURCES;
  const want = page * pageSize;
  const parts = await Promise.all(
    sources.map(async (src) => {
      const f = buildFilter(src, qy);
      const col = db.collection(src.collection);
      const [docs, count] = await Promise.all([
        col.find(f).sort({ createdAt: -1 }).limit(want).toArray(),
        col.countDocuments(f),
      ]);
      return { rows: docs.map((d) => normalize(d, src)), count };
    })
  );
  const all = parts.flatMap((p) => p.rows).sort((a, b) => +b.createdAt - +a.createdAt);
  return { leads: all.slice((page - 1) * pageSize, page * pageSize), total: parts.reduce((n, p) => n + p.count, 0) };
}

export async function getLead(formKey: string, id: string): Promise<Lead | null> {
  const src = getSource(formKey);
  if (!src || !ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(src.collection).findOne({ _id: new ObjectId(id) });
  return doc ? normalize(doc, src) : null;
}

export async function countByStatus(): Promise<{ total: number; fresh: number }> {
  const db = await getDb();
  const cols = [...new Set(FORM_SOURCES.map((s) => s.collection))];
  let total = 0, fresh = 0;
  for (const c of cols) {
    const col = db.collection(c);
    total += await col.countDocuments();
    fresh += await col.countDocuments({ $or: [{ crmStatus: "new" }, { crmStatus: { $exists: false }, status: { $in: ["new", "pending", null] } }, { crmStatus: { $exists: false }, status: { $exists: false } }] });
  }
  return { total, fresh };
}
