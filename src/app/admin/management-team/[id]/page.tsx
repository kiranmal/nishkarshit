import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type TeamMemberDoc } from "@/lib/models";
import { teamFields } from "@/lib/cms/entities";
import { saveMemberAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditMember({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("content");
  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();
  const m = await (await getDb()).collection<TeamMemberDoc>(COLLECTIONS.managementTeam).findOne({ _id: new ObjectId(id) });
  if (!m) notFound();
  const initial = { name: m.name, role: m.role, image: m.image, description: m.description ?? "", email: m.email ?? "", linkedin: m.linkedin ?? "", section: m.section, order: m.order, active: m.active };
  return (
    <AdminShell active="/admin/management-team">
      <Link href="/admin/management-team" className="text-sm text-blue-600">← Management team</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-6" style={{ fontFamily: "var(--font-poppins)" }}>{m.name}</h1>
      <ContentEditor saveAction={saveMemberAction.bind(null, id)} fields={teamFields} initial={initial} publicPath="/management-team" />
    </AdminShell>
  );
}
