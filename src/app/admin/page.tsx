import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdmin, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/models";
import { STATUS_COLOR, STATUS_LABEL, countByStatus, listLeads } from "@/lib/forms/registry";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

async function load(canForms: boolean) {
  if (!isDbConfigured()) return null;
  try {
    const db = await getDb();
    const n = (c: string, f = {}) => db.collection(c).countDocuments(f);
    const [expertise, team, jobs, blogs, festivals, media, seo, subs, recent] = await Promise.all([
      n(COLLECTIONS.expertiseItems, { status: "published" }), n(COLLECTIONS.managementTeam, { active: true }),
      n(COLLECTIONS.jobPostings, { status: "published" }), n(COLLECTIONS.directoryBlogs, { status: "published" }),
      n(COLLECTIONS.festivals, { active: true }), n(COLLECTIONS.media), n(COLLECTIONS.seoMeta),
      canForms ? countByStatus() : Promise.resolve({ total: 0, fresh: 0 }),
      canForms ? listLeads({}, 1, 8) : Promise.resolve({ leads: [], total: 0 }),
    ]);
    return { expertise, team, jobs, blogs, festivals, media, seo, subs, recent: recent.leads };
  } catch (e) {
    console.error("[dashboard]", e);
    return null;
  }
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const admin = await getCurrentAdmin();
  const sp = await searchParams;
  const d = await load(!!admin && can(admin.role, "forms"));

  const cards = [
    { label: "New submissions", value: d?.subs.fresh, href: "/admin/forms?status=new", hi: true, show: admin && can(admin.role, "forms") },
    { label: "Total submissions", value: d?.subs.total, href: "/admin/forms", show: admin && can(admin.role, "forms") },
    { label: "Expertise pages (live)", value: d?.expertise, href: "/admin/expertise", show: true },
    { label: "Team members (live)", value: d?.team, href: "/admin/management-team", show: true },
    { label: "Open jobs", value: d?.jobs, href: "/admin/careers", show: true },
    { label: "Blogs", value: d?.blogs, href: "/admin/blogs", show: true },
    { label: "Active festivals", value: d?.festivals, href: "/admin/events", show: true },
    { label: "Media files", value: d?.media, href: "/admin/media", show: true },
    { label: "SEO pages customised", value: d?.seo, href: "/admin/seo", show: admin && can(admin.role, "seo") },
  ].filter((c) => c.show);

  return (
    <AdminShell active="/admin">
      <h1 className="text-2xl font-bold text-brand-navy mb-1" style={{ fontFamily: "var(--font-poppins)" }}>Welcome{admin ? `, ${admin.email}` : ""}</h1>
      <p className="text-gray-500 mb-6">Role: <b>{admin?.role.replace("_", " ")}</b>. Changes you save here appear on the live website.</p>

      {sp.denied && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">Your role doesn&apos;t have access to that page.</div>}
      {!d && <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">MongoDB isn&apos;t connected (or is unreachable) — set <code>MONGODB_URI</code> to see live data and save changes.</div>}
      {!isCloudinaryConfigured() && <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">Cloudinary isn&apos;t configured — image uploads work locally only. Set the <code>CLOUDINARY_*</code> variables before deploying.</div>}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${c.hi ? "bg-brand-navy text-white border-brand-navy" : "bg-white border-gray-100"}`}>
            <div className="text-3xl font-bold">{c.value ?? "—"}</div>
            <div className={`text-sm mt-1 ${c.hi ? "text-white/70" : "text-gray-500"}`}>{c.label}</div>
          </Link>
        ))}
      </div>

      {d && d.recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b"><h2 className="font-bold">Recent submissions</h2><Link href="/admin/forms" className="text-sm text-blue-600">View all</Link></div>
          <div className="divide-y">
            {d.recent.map((l) => (
              <Link key={`${l.formKey}${l.id}`} href={`/admin/forms/${l.formKey}/${l.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <span className="font-medium text-gray-900 min-w-32">{l.name || l.email || "—"}</span>
                <span className="text-sm text-gray-500 flex-1">{l.formLabel}</span>
                <span className="text-xs text-gray-400">{l.createdAt.toLocaleDateString("en-IN")}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[l.status]}`}>{STATUS_LABEL[l.status]}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
