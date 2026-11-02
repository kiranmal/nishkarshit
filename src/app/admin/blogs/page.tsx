import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmForm from "@/components/admin/ConfirmForm";
import { requirePermission, can } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/db";
import { COLLECTIONS, type BlogPostDoc, type CmsMetaDoc } from "@/lib/models";
import { blogDefaults } from "@/lib/cms/defaults/blog";
import { deleteBlogAction, syncCmsDefaultsAction, toggleBlogAction } from "../cms-actions";

export const dynamic = "force-dynamic";
async function syncForm() { "use server"; await syncCmsDefaultsAction(["blog"]); }

export default async function BlogsAdmin() {
  const admin = await requirePermission("content");
  let posts: BlogPostDoc[] = [];
  let imported = true;
  if (isDbConfigured()) {
    const db = await getDb();
    posts = await db.collection<BlogPostDoc>(COLLECTIONS.blogPosts).find().sort({ publishedAt: -1 }).toArray();
    imported = Boolean(await db.collection<CmsMetaDoc>(COLLECTIONS.cmsMeta).findOne({ _id: "seeded:blog" }));
  }
  return (
    <AdminShell active="/admin/blogs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-poppins)" }}>Blog Posts</h1>
        <div className="flex gap-3">
          <Link href="/blogs" target="_blank" className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">View /blogs ↗</Link>
          {!imported && <form action={syncForm}><button className="text-sm font-semibold bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">Import existing post ({blogDefaults.length})</button></form>}
          <Link href="/admin/blogs/new" className="text-sm font-semibold bg-brand-navy text-white px-4 py-2 rounded-lg">+ New blog</Link>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-5 max-w-3xl">These posts are the public <code>/blogs</code> page (linked from the website footer). The separate directory blog is under “Directory Blogs”.</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
        {posts.map((p) => {
          const id = String(p._id);
          return (
            <div key={id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-48">
                <p className="font-semibold text-gray-900">{p.title} {p.featured && <span className="ml-1 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">featured</span>}</p>
                <p className="text-xs text-gray-400">/blogs/{p.slug} · {p.author || "no author"} · {new Date(p.publishedAt).toISOString().slice(0, 10)}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
              <form action={toggleBlogAction.bind(null, id, "status", p.status !== "published")}><button className="text-sm text-gray-600 hover:underline">{p.status === "published" ? "Unpublish" : "Publish"}</button></form>
              <form action={toggleBlogAction.bind(null, id, "featured", !p.featured)}><button className="text-sm text-gray-600 hover:underline">{p.featured ? "Unfeature" : "Feature"}</button></form>
              <Link href={`/admin/blogs/${id}`} className="text-sm font-semibold text-blue-600">Edit</Link>
              {can(admin.role, "delete") && <ConfirmForm action={deleteBlogAction.bind(null, id)} message={`Delete “${p.title}”? This cannot be undone.`}>Delete</ConfirmForm>}
            </div>
          );
        })}
        {posts.length === 0 && <p className="px-5 py-10 text-center text-gray-500 text-sm">No blog posts yet.</p>}
      </div>
    </AdminShell>
  );
}
