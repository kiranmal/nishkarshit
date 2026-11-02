import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { listPages } from "@/lib/cms/store";
import { educationTabFields } from "@/lib/cms/sections";
import { pageToForm } from "@/lib/cms/form-map";
import { resetPageAction, savePageAction } from "../../cms-actions";

export const dynamic = "force-dynamic";

export default async function EditEducationTab({ params }: { params: Promise<{ slug: string }> }) {
  await requirePermission("content");
  const { slug } = await params;
  const tab = (await listPages("education-tab")).find((t) => t.slug === slug);
  if (!tab) notFound();
  return (
    <AdminShell active="/admin/education">
      <Link href="/admin/education" className="text-sm text-blue-600">← All education tabs</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>{tab.label}</h1>
      <p className="text-gray-500 text-sm mb-6">Public page: /education#{tab.slug} (also /education/{tab.slug}). Metadata is used on /education/{tab.slug}.</p>
      <ContentEditor
        wide
        fields={educationTabFields}
        initial={pageToForm(tab)}
        publicPath={`/education/${tab.slug}`}
        saveAction={savePageAction.bind(null, tab.pageKey)}
        resetAction={resetPageAction.bind(null, tab.pageKey)}
      />
    </AdminShell>
  );
}
