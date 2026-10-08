import AdminShell from "@/components/admin/AdminShell";
import { requirePermission, ROLES } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type AdminUserDoc } from "@/lib/models";
import CreateUserForm from "./CreateUserForm";
import { changeRoleAction, deleteUserAction, resetPasswordAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requirePermission("users");
  const users = await (await getDb()).collection<AdminUserDoc>(COLLECTIONS.adminUsers).find().sort({ createdAt: 1 }).toArray();
  return (
    <AdminShell active="/admin/users">
      <h1 className="text-2xl font-bold text-brand-navy mb-1" style={{ fontFamily: "var(--font-poppins)" }}>Users &amp; Roles</h1>
      <p className="text-gray-500 text-sm mb-5 max-w-2xl">
        <b>Super Admin</b>: everything incl. users and settings · <b>Admin</b>: content, media, forms, SEO and deleting content · <b>Editor</b>: edit content and images only.
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y mb-6">
        {users.map((u) => {
          const id = String(u._id);
          const self = u.email === me.email;
          return (
            <div key={id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-48"><p className="font-semibold text-gray-900">{u.name || u.email}{self && <span className="ml-2 text-xs text-blue-600">(you)</span>}</p><p className="text-xs text-gray-500">{u.email}</p></div>
              <form action={changeRoleAction.bind(null, id)} className="flex items-center gap-2">
                <select name="role" defaultValue={u.role ?? "super_admin"} className="input !w-auto !py-1.5">{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
                <button className="text-sm font-semibold text-blue-600">Update</button>
              </form>
              <form action={resetPasswordAction.bind(null, id)} className="flex items-center gap-2">
                <input name="password" type="password" minLength={10} placeholder="New password" className="input !w-40 !py-1.5" autoComplete="new-password" />
                <button className="text-sm font-semibold text-gray-600">Reset</button>
              </form>
              {!self && <form action={deleteUserAction.bind(null, id)}><button className="text-sm text-red-600">Delete</button></form>}
            </div>
          );
        })}
      </div>
      <CreateUserForm />
    </AdminShell>
  );
}
