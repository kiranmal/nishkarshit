import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing } from "@/lib/models";
import { createListingAction } from "@/app/admin/directory/actions";

export const dynamic = "force-dynamic";

async function getListings(): Promise<DirectoryListing[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db
    .collection<DirectoryListing>(COLLECTIONS.directoryListings)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
}

export default async function AdminDirectoryPage() {
  const listings = await getListings();

  return (
    <AdminShell active="/admin/directory">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-brand-navy"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Directory — All Listings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select a business to manage its About, Why Choose Us, Services, Products,
            Gallery, Video, Location, Hours, Reviews and SEO.
          </p>
        </div>
      </div>

      {!isDbConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected yet — set <code>MONGODB_URI</code> in{" "}
          <code>.env.local</code> to add and manage listings.
        </div>
      )}

      {/* Add listing — basic info only; everything else is added after creation */}
      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <summary className="cursor-pointer font-semibold text-brand-navy">
          + Add Listing
        </summary>
        <form
          action={createListingAction}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="name" required placeholder="Business name" className="input" />
          <input name="slug" placeholder="URL slug (auto from name if blank)" className="input" />
          <input name="category" required placeholder="Category" className="input" />
          <input name="city" required placeholder="City" className="input" />
          <select name="plan" className="input" defaultValue="standard">
            <option value="standard">Standard</option>
            <option value="featured">Featured</option>
            <option value="premium">Premium</option>
            <option value="supreme">Supreme</option>
          </select>
          <select name="status" className="input" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <textarea
            name="description"
            required
            placeholder="Short description"
            rows={3}
            className="input md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
          >
            Create — then add the rest
          </button>
        </form>
      </details>

      {/* Listings table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={String(l._id)} className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium text-brand-navy">{l.name}</td>
                <td className="px-4 py-3">{l.category}</td>
                <td className="px-4 py-3">{l.city}</td>
                <td className="px-4 py-3">{l.products?.length || 0}</td>
                <td className="px-4 py-3 capitalize">{l.plan}</td>
                <td className="px-4 py-3 capitalize">{l.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/directory/${l._id}`}
                    className="text-blue-600 hover:underline text-xs font-semibold"
                  >
                    Edit Business →
                  </Link>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
