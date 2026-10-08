import { Search, Star } from "lucide-react";
import Link from "next/link";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing } from "@/lib/models";
import {
  fallbackListings,
  fallbackCategories,
  testimonials,
  howItWorksSteps,
} from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getListings() {
  if (!isDbConfigured()) return null;
  try {
    const db = await getDb();
    return db
      .collection<DirectoryListing>(COLLECTIONS.directoryListings)
      .find({ status: "published" })
      .toArray();
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function DirectoryHomePage() {
  const dbListings = await getListings();

  const listings = dbListings && dbListings.length > 0 ? dbListings : fallbackListings;
  const premium = listings.filter((l) => l.plan === "premium");
  const featured = listings.filter((l) => l.plan === "featured");
  const supreme = listings.filter((l) => l.plan === "supreme");
  const categories = fallbackCategories;

  return (
    <>
      <DirectoryHeader />
      <main>
        {/* Hero */}
        <section className="relative bg-[#0b1224] text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(37,99,235,0.35), transparent 40%), radial-gradient(circle at 85% 70%, rgba(16,185,129,0.25), transparent 45%)",
              backgroundSize: "200% 200%",
              animation: "bg-pan 14s ease-in-out infinite",
            }}
          />
          <div className="relative max-w-[1300px] mx-auto px-4 md:px-8 pt-16 pb-40 md:pt-20 md:pb-52">
            <h1
              className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Grow Your Business, Discover The Best{" "}
              <span className="text-sky-400">Local Businesses</span>
            </h1>
            <p className="text-white/70 mt-4 max-w-lg">
              Search thousands of businesses, shops and directory listings
              near you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/directory/listings"
                className="rounded-lg bg-blue-600 text-white text-sm font-semibold px-6 py-3 hover:bg-blue-700 transition-colors"
              >
                Add Your Business
              </Link>
              <Link
                href="/directory/listings"
                className="rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Search size={15} /> Explore Listings
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-10">
              {[
                { value: "5000+", label: "Businesses Listed" },
                { value: "100+", label: "Business Categories" },
                { value: "50+", label: "Cities Covered" },
                { value: "100K+", label: "Happy Customers" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-sky-400">
                    {s.value}
                  </div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating search card */}
          <div className="relative max-w-[1100px] mx-auto px-4 md:px-8 -mt-24 md:-mt-28 z-10">
            <form
              action="/directory/listings"
              className="bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-2"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  name="q"
                  placeholder="What are you looking for?"
                  className="w-full py-3 text-sm text-gray-900 outline-none"
                />
              </div>
              <select
                name="category"
                className="px-3 py-3 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 outline-none"
                defaultValue=""
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name="city"
                className="px-3 py-3 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 outline-none"
                defaultValue=""
              >
                <option value="">Select City</option>
                <option value="Noida">Noida</option>
                <option value="Meerut">Meerut</option>
                <option value="Kanpur">Kanpur</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 text-white text-sm font-semibold px-8 py-3 hover:bg-blue-700 transition-colors"
              >
                Search Now
              </button>
            </form>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="max-w-[1300px] mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-20 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Popular Categories
          </h2>
          <p className="text-gray-500 mt-2 mb-10">
            Explore businesses by categories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.name}
                href={`/directory/categories`}
                className="group bg-gray-50 hover:bg-white hover:shadow-lg rounded-2xl border border-gray-100 p-8 transition-all"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-500">
                  Explore listings in this category
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/directory/categories"
            className="inline-block mt-10 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-sm px-7 py-2.5 hover:bg-blue-600 hover:text-white transition-colors"
          >
            View All Categories
          </Link>
        </section>

        {/* Premium Listing */}
        <section className="bg-[#0b1224] text-white py-20">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            <div>
              <span className="inline-block bg-amber-400 text-[#0b1224] text-xs font-bold px-3 py-1 rounded-full mb-4">
                PREMIUM SHOWCASE
              </span>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div>
                  <h2
                    className="text-3xl md:text-4xl font-bold"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Premium Listing
                  </h2>
                  <p className="text-white/60 mt-1">
                    Hand-picked premium businesses with brochure-style highlights.
                  </p>
                </div>
                <Link
                  href="/directory/listings?plan=premium"
                  className="rounded-full bg-white text-[#0b1224] text-sm font-semibold px-6 py-2.5"
                >
                  Show More →
                </Link>
              </div>

              {premium.map((p) => (
                <Link
                  href={`/directory/listings/${p.slug}`}
                  key={p.slug}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center hover:bg-white/10 transition-colors"
                >
                  <div
                    className="h-48 rounded-xl flex items-center justify-center text-4xl font-bold"
                    style={{ background: p.logoColor || "#1d4ed8" }}
                  >
                    {initials(p.name)}
                  </div>
                  <div>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-wide mb-2">
                      {p.category}
                    </p>
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">
                Digital Magazine
              </span>
              <h3 className="text-xl font-bold mt-2 mb-2">
                Open the full magazine
              </h3>
              <p className="text-white/60 text-sm mb-5">
                Browse the latest Social Route Media magazine in book view.
              </p>
              <div className="rounded-lg bg-gradient-to-br from-blue-700 to-emerald-600 h-40 flex items-center justify-center text-sm font-bold text-center px-4">
                Printing & Electronic Directory 2025-26
              </div>
              <Link
                href="/directory/magazine"
                className="block text-center mt-5 text-sm font-semibold text-sky-400"
              >
                See more about SRM →
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Listing */}
        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-20">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Featured Listing
              </h2>
              <p className="text-gray-500 mt-1">Explore selected business listings</p>
            </div>
            <Link
              href="/directory/listings?plan=featured"
              className="rounded-full bg-gray-900 text-white text-sm font-semibold px-6 py-2.5"
            >
              Show More →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((f) => (
              <Link
                href={`/directory/listings/${f.slug}`}
                key={f.slug}
                className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div
                  className="relative h-40 flex items-end p-4 text-white font-bold"
                  style={{ background: f.logoColor || "#0f172a" }}
                >
                  <span className="absolute top-3 left-3 text-xs bg-white/90 text-gray-900 px-3 py-1 rounded-full">
                    {f.category}
                  </span>
                  <div>
                    <div className="text-lg">{f.name}</div>
                    <div className="text-xs text-white/70">{f.city}</div>
                  </div>
                </div>
                <p className="p-4 text-sm text-gray-500 leading-relaxed flex-1">
                  {f.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Supreme Listing */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Supreme Listing
                </h2>
                <p className="text-gray-500 mt-1">Explore selected business listings</p>
              </div>
              <Link
                href="/directory/listings?plan=supreme"
                className="rounded-full bg-gray-900 text-white text-sm font-semibold px-6 py-2.5"
              >
                Show More →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supreme.map((s) => (
                <Link
                  href={`/directory/listings/${s.slug}`}
                  key={s.slug}
                  className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="absolute top-4 left-4 z-10 text-xs bg-white/95 px-3 py-1 rounded-full font-medium text-gray-700">
                    {s.category}
                  </span>
                  <div
                    className="h-64 flex items-end justify-center p-5 text-white text-center"
                    style={{
                      background: `linear-gradient(180deg, ${s.logoColor}55, ${s.logoColor})`,
                    }}
                  >
                    <div className="font-extrabold text-xl">{s.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6"
              >
                <div className="flex gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#0b1224] text-white py-20 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            How It Works
          </h2>
          <p className="text-white/50 mt-2 mb-12">
            Grow your business with our directory platform
          </p>
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksSteps.map((s, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
