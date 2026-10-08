import Link from "next/link";
import { Search, MapPin, Phone } from "lucide-react";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing } from "@/lib/models";
import { fallbackListings } from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getListings(): Promise<
  Pick<DirectoryListing, "slug" | "name" | "category" | "city" | "description" | "plan" | "phone">[]
> {
  if (!isDbConfigured()) return fallbackListings;
  try {
    const db = await getDb();
    const docs = await db
      .collection<DirectoryListing>(COLLECTIONS.directoryListings)
      .find({ status: "published" })
      .toArray();
    return docs.length > 0 ? docs : fallbackListings;
  } catch {
    return fallbackListings;
  }
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const all = await getListings();

  const filtered = all.filter((l) => {
    if (params.plan && l.plan !== params.plan) return false;
    if (params.category && l.category !== params.category) return false;
    if (params.city && l.city !== params.city) return false;
    if (params.q) {
      const q = params.q.toLowerCase();
      if (
        !l.name.toLowerCase().includes(q) &&
        !l.category.toLowerCase().includes(q) &&
        !l.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const categories = Array.from(new Set(all.map((l) => l.category)));
  const cities = Array.from(new Set(all.map((l) => l.city)));

  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="bg-gray-50 border-b border-gray-100 py-10">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <h1
              className="text-3xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Business Listings
            </h1>
            <p className="text-gray-500 mb-6">
              {filtered.length} businesses found
            </p>

            <form className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  name="q"
                  defaultValue={params.q}
                  placeholder="Search businesses..."
                  className="w-full py-3 text-sm text-gray-900 outline-none"
                />
              </div>
              <select
                name="category"
                defaultValue={params.category || ""}
                className="px-3 py-3 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                name="city"
                defaultValue={params.city || ""}
                className="px-3 py-3 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 text-white text-sm font-semibold px-8 py-3 hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l) => (
              <Link
                href={`/directory/listings/${l.slug}`}
                key={l.slug}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {l.category}
                  </span>
                  {l.plan !== "standard" && (
                    <span className="text-[11px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {l.plan}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{l.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin size={13} /> {l.city}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                  {l.description}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  {"phone" in l && l.phone ? (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone size={13} /> {l.phone}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm font-semibold text-blue-600">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-16">
                No listings match your search.
              </p>
            )}
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
