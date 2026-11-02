import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import EntityEditor from "@/components/admin/EntityEditor";
import { requirePermission } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { COLLECTIONS, type BlogPostDoc } from "@/lib/models";
import { blogFields } from "@/lib/cms/entity-fields";
import { blogToForm } from "@/lib/cms/form-map";
import { saveBlogAction } from "../../cms-actions";

export const dynamic = "force-dynamic";

export default async function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("content");
  const { id } = await params;
  let doc: BlogPostDoc | null = null;
  if (id !== "new") {
    if (!ObjectId.isValid(id)) notFound();
    doc = await (await getDb()).collection<BlogPostDoc>(COLLECTIONS.blogPosts).findOne({ _id: new ObjectId(id) });
    if (!doc) notFound();
  }
  return (
    <AdminShell active="/admin/blogs">
      <Link href="/admin/blogs" className="text-sm text-blue-600">← All blogs</Link>
      <h1 className="text-2xl font-bold text-brand-navy mt-2 mb-6" style={{ fontFamily: "var(--font-poppins)" }}>{doc ? doc.title : "New blog"}</h1>
      <EntityEditor fields={blogFields} initial={blogToForm(doc ?? { status: "draft", author: "" })} save={saveBlogAction} id={id} editBase="/admin/blogs" publicPath={doc ? `/blogs/${doc.slug}` : undefined} />
    </AdminShell>
  );
}
