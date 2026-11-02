import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import EntityEditor from "@/components/admin/EntityEditor";
import { requirePermission } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { COLLECTIONS, type HardwareProductDoc } from "@/lib/models";
import { hardwareFields } from "@/lib/cms/entity-fields";
import { hardwareToForm } from "@/lib/cms/form-map";
import { saveHardwareAction } from "../../../cms-actions";

export const dynamic = "force-dynamic";

export default async function EditHardware({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("content");
  const { id } = await params;
  let doc: HardwareProductDoc | null = null;
  if (id !== "new") {
    if (!ObjectId.isValid(id)) notFound();
    doc = await (await getDb()).collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts).findOne({ _id: new ObjectId(id) });
    if (!doc) notFound();
  }
  const blank: Partial<HardwareProductDoc> = { status: "draft", formFields: [
    { label: "Full Name", name: "fullName", type: "text", required: true }, { label: "Email", name: "email", type: "email", required: true },
    { label: "Mobile Number", name: "mobile", type: "tel", required: true }, { label: "Quantity", name: "quantity", type: "number", required: false },
  ] };
  return (
    <AdminShell active="/admin/banking/hardware">
      <Link href="/admin/banking/hardware" className="text-sm text-blue-600">← All hardware</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-6" style={{ fontFamily: "var(--font-poppins)" }}>{doc ? doc.name : "New hardware product"}</h1>
      <EntityEditor fields={hardwareFields} initial={hardwareToForm(doc ?? blank)} save={saveHardwareAction} id={id} editBase="/admin/banking/hardware" publicPath={doc ? `/banking/csp-hardware/${doc.slug}` : undefined} />
    </AdminShell>
  );
}
