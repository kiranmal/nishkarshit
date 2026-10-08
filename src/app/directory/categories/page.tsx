import Link from "next/link";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing, type DirectoryCategoryDoc } from "@/lib/models";
import { fallbackCategories, fallbackListings } from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<{ name: string; icon: string }[]> {
  if (isDbConfigured()) {
    try {
      const db = await getDb();
      const docs = await db
        .collection<DirectoryCategoryDoc>(COLLECTIONS.directoryCategories)
        .find({ status: "published" })
        .sort({ order: 1 })
        .toArray();
      if (docs.length > 0) return docs.map((d) => ({ name: d.name, icon: d.icon }));
    } catch {
      // fall through
    }
  }
  return fallbackCategories;
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  let items: { category: string }[] = fallbackListings;

  if (isDbConfigured()) {
    try {
      const db = await getDb();
      const docs = await db
        .collection<DirectoryListing>(COLLECTIONS.directoryListings)
        .find({ status: "published" })
        .toArray();
      if (docs.length > 0) items = docs;
    } catch {
      // fall through to fallback data
    }
  }

  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();
  const categories = await getCategories();

  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="bg-gray-50 border-b border-gray-100 py-14 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Explore Categories
          </h1>
          <p className="text-gray-500 mt-2">
            Browse businesses across every category on the platform
          </p>
          <form className="mt-8 max-w-lg mx-auto flex gap-2 px-4">
            <input
              placeholder="Search categories..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-lg bg-blue-600 text-white text-sm font-semibold px-6 py-3 hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-3xl mb-5">
                  {c.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {counts[c.name] || 0} listing{counts[c.name] === 1 ? "" : "s"}
                </p>
                <Link
                  href={`/directory/listings?category=${encodeURIComponent(c.name)}`}
                  className="inline-block rounded-full border-2 border-blue-600 text-blue-600 text-sm font-semibold px-5 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Explore Category
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
