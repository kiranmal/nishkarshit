import AdminShellClient from "./AdminShellClient";
import { getCurrentAdmin } from "@/lib/auth";

/** Server wrapper: resolves the signed-in role so the sidebar only lists what that role may use. */
export default async function AdminShell({
  active,
  children,
}: {
  active: string;
  role?: string; // accepted for convenience, the session is the source of truth
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  return (
    <AdminShellClient active={active} role={admin?.role ?? "editor"}>
      {children}
    </AdminShellClient>
  );
}
