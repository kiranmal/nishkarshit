import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { getCmsPage } from "@/lib/cms/store";
import { footerPageFields } from "@/lib/cms/sections";
import { pageToForm } from "@/lib/cms/form-map";
import { resetPageAction, savePageAction } from "../../cms-actions";
import { getContent } from "@/lib/cms/content";
import { defaultITServices, itServicesFields, type ITServicesContent } from "@/lib/cms/it-services";
import { resetContentAction, saveContentAction } from "../../content-actions";

export const dynamic = "force-dynamic";

export default async function EditFooterPage({ params }: { params: Promise<{ key: string }> }) {
  await requirePermission("content");
  const { key } = await params;
  if (key === "it-services") {
    const c = await getContent<ITServicesContent>("itServices", defaultITServices);
    return (
      <AdminShell active="/admin/footer-pages">
        <Link href="/admin/footer-pages" className="text-sm text-blue-600">← All footer pages</Link>
        <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>IT Services</h1>
        <p className="text-gray-500 text-sm mb-6">Public page: /it-services. Hero, tech-stack cards, projects, testimonials, client logos and SEO are editable. Section headings inside the decorative animated blocks (technology cloud, approach path, business model) are still part of the page code.</p>
        <ContentEditor wide fields={itServicesFields} initial={JSON.parse(JSON.stringify({ seo: {}, ...c }))} publicPath="/it-services"
          saveAction={saveContentAction.bind(null, "itServices")} resetAction={resetContentAction.bind(null, "itServices")} />
      </AdminShell>
    );
  }
  const page = await getCmsPage(key);
  if (!page || page.kind !== "footer-page") notFound();
  return (
    <AdminShell active="/admin/footer-pages">
      <Link href="/admin/footer-pages" className="text-sm text-blue-600">← All footer pages</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>{page.label}</h1>
      <p className="text-gray-500 text-sm mb-6">Public page: {page.path}</p>
      <ContentEditor wide fields={footerPageFields} initial={pageToForm(page)} publicPath={page.path}
        saveAction={savePageAction.bind(null, page.pageKey)} resetAction={resetPageAction.bind(null, page.pageKey)} />
    </AdminShell>
  );
}
