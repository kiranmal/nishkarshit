import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryBlogDoc } from "@/lib/models";
import { fallbackBlogs } from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getBlogs() {
  if (!isDbConfigured()) return fallbackBlogs;
  try {
    const db = await getDb();
    const docs = await db
      .collection<DirectoryBlogDoc>(COLLECTIONS.directoryBlogs)
      .find({ status: "published" })
      .sort({ publishedAt: -1 })
      .toArray();
    return docs.length > 0 ? docs : fallbackBlogs;
  } catch {
    return fallbackBlogs;
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="bg-gray-50 border-b border-gray-100 py-14 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Our Blog &amp; News
          </h1>
          <p className="text-gray-500 mt-2">
            Updates, tips and stories from Social Route Media
          </p>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <article
                key={b.slug}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div
                  className="h-40"
                  style={{ background: b.coverColor }}
                />
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
