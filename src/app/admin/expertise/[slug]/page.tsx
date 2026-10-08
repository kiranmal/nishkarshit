import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type ExpertiseItemDoc } from "@/lib/models";
import { expertiseFields } from "@/lib/cms/entities";
import { saveExpertiseAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditExpertise({ params }: { params: Promise<{ slug: string }> }) {
  await requirePermission("content");
  const { slug } = await params;
  const doc = await (await getDb()).collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems).findOne({ slug });
  if (!doc) notFound();
  const initial = {
    title: doc.title, paragraph: doc.paragraph, accent: doc.accent, image: doc.image ?? "", introImage: doc.introImage ?? "",
    status: doc.status, order: doc.order, sections: doc.sections ?? [], formTitle: doc.formTitle ?? "",
    formOptions: (doc.formOptions ?? []).map((label) => ({ label })),
    seo: { metaTitle: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "", twitterDescription: "", twitterImage: "", noIndex: false, noFollow: false, ...(doc.seo ?? {}) },
  };
  return (
    <AdminShell active="/admin/expertise">
      <Link href="/admin/expertise" className="text-sm text-blue-600">← All expertise pages</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>{doc.title}</h1>
      <p className="text-gray-500 text-sm mb-6">/expertise/{doc.slug}</p>
      <ContentEditor saveAction={saveExpertiseAction.bind(null, slug)} fields={expertiseFields} initial={initial} publicPath={`/expertise/${slug}`} />
    </AdminShell>
  );
}
