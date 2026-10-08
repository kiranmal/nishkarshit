import AdminShell from "@/components/admin/AdminShell";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryBlogDoc } from "@/lib/models";
import { addBlogAction, updateBlogAction, deleteBlogAction } from "@/app/admin/blogs/actions";

export const dynamic = "force-dynamic";

async function getBlogs(): Promise<DirectoryBlogDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db.collection<DirectoryBlogDoc>(COLLECTIONS.directoryBlogs).find().sort({ publishedAt: -1 }).toArray();
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <AdminShell active="/admin/blogs">
      <h1
        className="text-2xl font-bold text-brand-navy mb-1"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Blogs
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Posts shown on <code>/directory/blogs</code>.
      </p>

      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <summary className="cursor-pointer font-semibold text-brand-navy">
          + Add Blog Post
        </summary>
        <form action={addBlogAction} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" required placeholder="Title" className="input md:col-span-2" />
          <input name="slug" placeholder="URL slug (auto from title if blank)" className="input" />
          <input name="coverColor" placeholder="Cover color (#hex)" className="input" />
          <select name="status" defaultValue="published" className="input">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <textarea name="excerpt" required placeholder="Excerpt" rows={3} className="input md:col-span-2" />
          <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Add Post
          </button>
        </form>
      </details>

      <div className="space-y-3">
        {blogs.map((b) => (
          <details key={String(b._id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <summary className="cursor-pointer flex items-center justify-between gap-3">
              <span className="font-semibold text-brand-navy">{b.title}</span>
              <span className="text-xs capitalize bg-gray-100 px-2 py-1 rounded-full">{b.status}</span>
            </summary>
            <form action={updateBlogAction.bind(null, String(b._id))} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" defaultValue={b.title} required className="input md:col-span-2" />
              <input name="slug" defaultValue={b.slug} className="input" />
              <input name="coverColor" defaultValue={b.coverColor} className="input" />
              <select name="status" defaultValue={b.status} className="input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <textarea name="excerpt" defaultValue={b.excerpt} required rows={3} className="input md:col-span-2" />
              <div className="md:col-span-2 flex items-center gap-3">
                <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">Save</button>
                <button
                  type="submit"
                  formAction={deleteBlogAction.bind(null, String(b._id))}
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </form>
          </details>
        ))}
        {blogs.length === 0 && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            No blog posts yet.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
