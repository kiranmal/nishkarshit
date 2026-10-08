import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type TeamMemberDoc } from "@/lib/models";
import { TEAM_SECTIONS } from "@/lib/cms/entities";
import { DEFAULT_MEMBERS } from "@/data/teamFallback";
import { addMemberAction, deleteMemberAction, moveMemberAction, setMemberActiveAction, syncTeamDefaultsAction } from "./actions";

export const dynamic = "force-dynamic";
async function syncForm() { "use server"; await syncTeamDefaultsAction(); }

export default async function TeamAdmin() {
  const admin = await requirePermission("content");
  let members: TeamMemberDoc[] = [];
  if (isDbConfigured()) {
    members = await (await getDb()).collection<TeamMemberDoc>(COLLECTIONS.managementTeam).find().sort({ order: 1, createdAt: 1 }).toArray();
  }
  const have = new Set(members.map((m) => m.slug));
  const missing = DEFAULT_MEMBERS.filter((m) => !have.has(m.slug)).length;

  return (
    <AdminShell active="/admin/management-team">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Management Team</h1>
        <form action={syncForm}>
          <button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">
            Sync default members{missing ? ` (${missing} to import)` : ""}
          </button>
        </form>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-2xl">
        Shown on <code>/management-team</code> in four groups. The built-in sample members are placeholders — sync them once, then edit or replace them with the real team.
      </p>

      {TEAM_SECTIONS.map((sec) => {
        const list = members.filter((m) => m.section === sec.value);
        return (
          <div key={sec.value} className="mb-6">
            <h2 className="font-bold text-gray-800 mb-2">{sec.label} <span className="text-gray-400 font-normal text-sm">({list.length})</span></h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
              {list.map((m) => (
                <div key={String(m._id)} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {m.image ? <img src={m.image} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" /> : <div className="w-10 h-10 rounded-full bg-gray-100" />}
                  <div className="flex-1 min-w-40"><p className="font-semibold text-gray-900">{m.name}</p><p className="text-xs text-gray-500">{m.role || "—"}</p></div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{m.active ? "published" : "hidden"}</span>
                  <form action={moveMemberAction.bind(null, String(m._id), -1)}><button className="px-1 text-gray-500" aria-label="Move up">↑</button></form>
                  <form action={moveMemberAction.bind(null, String(m._id), 1)}><button className="px-1 text-gray-500" aria-label="Move down">↓</button></form>
                  <form action={setMemberActiveAction.bind(null, String(m._id), !m.active)}><button className="text-sm text-gray-600 hover:underline">{m.active ? "Hide" : "Publish"}</button></form>
                  <Link href={`/admin/management-team/${m._id}`} className="text-sm font-semibold text-blue-600">Edit</Link>
                  {can(admin.role, "delete") && <form action={deleteMemberAction.bind(null, String(m._id))}><button className="text-sm text-red-600">Delete</button></form>}
                </div>
              ))}
              {list.length === 0 && <p className="px-4 py-5 text-sm text-gray-400">No members in this group.</p>}
            </div>
          </div>
        );
      })}

      <form action={addMemberAction} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-3 items-end">
        <div><label className="block text-sm font-medium mb-1">New member name</label><input name="name" required className="input" /></div>
        <div><label className="block text-sm font-medium mb-1">Group</label>
          <select name="section" className="input" defaultValue="management">{TEAM_SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
        <button className="bg-brand-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Add member</button>
      </form>
    </AdminShell>
  );
}
