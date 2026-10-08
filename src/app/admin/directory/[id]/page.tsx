import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import BusinessEditorTabs from "@/components/admin/BusinessEditorTabs";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing } from "@/lib/models";
import {
  updateBasicInfoAction,
  updateSeoAction,
  addWhyChooseUsAction,
  removeWhyChooseUsAction,
  addBusinessServiceAction,
  removeBusinessServiceAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
  addGalleryImageAction,
  removeGalleryImageAction,
  updateVideoAction,
  updateLocationAction,
  updateHoursAction,
  deleteListingAction,
} from "@/app/admin/directory/actions";

export const dynamic = "force-dynamic";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function getListing(id: string): Promise<DirectoryListing | null> {
  const db = await getDb();
  return db
    .collection<DirectoryListing>(COLLECTIONS.directoryListings)
    .findOne({ _id: new ObjectId(id) });
}

export default async function BusinessEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "basic" } = await searchParams;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <AdminShell active="/admin/directory">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-brand-navy"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {listing.name}
          </h1>
          <p className="text-gray-500 text-sm">
            /directory/listings/{listing.slug}
          </p>
        </div>
        <form action={deleteListingAction.bind(null, id, listing.slug)}>
          <button className="text-red-600 text-xs font-semibold hover:underline">
            Delete this business
          </button>
        </form>
      </div>

      <BusinessEditorTabs id={id} active={tab} />

      {tab === "basic" && (
        <form
          action={updateBasicInfoAction.bind(null, id)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="name" defaultValue={listing.name} required placeholder="Business name" className="input" />
          <input name="slug" defaultValue={listing.slug} placeholder="URL slug" className="input" />
          <input name="category" defaultValue={listing.category} required placeholder="Category" className="input" />
          <input name="city" defaultValue={listing.city} required placeholder="City" className="input" />
          <input name="address" defaultValue={listing.address} placeholder="Address" className="input md:col-span-2" />
          <input name="phone" defaultValue={listing.phone} placeholder="Phone" className="input" />
          <input name="whatsapp" defaultValue={listing.whatsapp} placeholder="WhatsApp number" className="input" />
          <input name="email" defaultValue={listing.email} placeholder="Email" className="input" />
          <input name="website" defaultValue={listing.website} placeholder="Website" className="input" />
          <div className="md:col-span-2">
            <ImageUploadField name="logoUrl" label="Logo" defaultValue={listing.logoUrl} />
          </div>
          <input name="logoColor" defaultValue={listing.logoColor} placeholder="Fallback color (#hex, used if no logo)" className="input" />
          <input name="tagline" defaultValue={listing.tagline} placeholder="Tagline" className="input" />
          <textarea
            name="description"
            defaultValue={listing.description}
            required
            placeholder="About this business"
            rows={4}
            className="input md:col-span-2"
          />
          <select name="plan" defaultValue={listing.plan} className="input">
            <option value="standard">Standard</option>
            <option value="featured">Featured</option>
            <option value="premium">Premium</option>
            <option value="supreme">Supreme</option>
          </select>
          <select name="status" defaultValue={listing.status} className="input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={listing.rating}
            placeholder="Display rating (1-5)"
            className="input"
          />
          <button
            type="submit"
            className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
          >
            Save
          </button>
        </form>
      )}

      {tab === "why" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-brand-navy mb-4">+ Add Why Choose Us Card</h2>
            <form
              action={addWhyChooseUsAction.bind(null, id, listing.slug)}
              className="grid grid-cols-1 md:grid-cols-4 gap-3"
            >
              <input name="icon" placeholder="Emoji icon (e.g. 🤝)" className="input" />
              <input name="title" required placeholder="Title" className="input md:col-span-1" />
              <input name="description" placeholder="Description" className="input md:col-span-1" />
              <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-5">
                Add
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(listing.whyChooseUs || []).map((w, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="text-2xl mb-2">{w.icon}</div>
                <h3 className="font-bold text-brand-navy mb-1">{w.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{w.description}</p>
                <form action={removeWhyChooseUsAction.bind(null, id, listing.slug, i)}>
                  <button className="text-red-600 text-xs font-semibold hover:underline">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-brand-navy mb-4">+ Add Service</h2>
            <form
              action={addBusinessServiceAction.bind(null, id, listing.slug)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <input name="title" required placeholder="Service title" className="input" />
              <input name="image" placeholder="Image URL (optional)" className="input" />
              <textarea name="description" placeholder="Description" rows={2} className="input md:col-span-2" />
              <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-5 py-2 justify-self-start">
                Add Service
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(listing.services || []).map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-brand-navy mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{s.description}</p>
                <form action={removeBusinessServiceAction.bind(null, id, listing.slug, i)}>
                  <button className="text-red-600 text-xs font-semibold hover:underline">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-6">
          <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" open>
            <summary className="cursor-pointer font-bold text-brand-navy">
              + Add Product
            </summary>
            <form
              action={addProductAction.bind(null, id, listing.slug)}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input name="name" required placeholder="Product name" className="input md:col-span-2" />
              <textarea name="description" placeholder="Description" rows={2} className="input md:col-span-2" />
              <input name="price" type="number" step="0.01" placeholder="Price" className="input" />
              <input name="oldPrice" type="number" step="0.01" placeholder="Old / discount price" className="input" />
              <div className="md:col-span-2">
                <ImageUploadField name="mainImage" label="Main image" />
              </div>
              <input
                name="additionalImages"
                placeholder="Additional image URLs, comma separated"
                className="input md:col-span-2"
              />
              <input name="order" type="number" placeholder="Display order" className="input" />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="published" defaultChecked className="rounded border-gray-300" />
                Published
              </label>
              <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
                Add Product
              </button>
            </form>
          </details>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(listing.products || [])
              .sort((a, b) => a.order - b.order)
              .map((p) => (
                <details
                  key={String(p._id)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <summary className="cursor-pointer flex items-center justify-between gap-3">
                    <span className="font-bold text-brand-navy">{p.name}</span>
                    <span className="flex items-center gap-2 text-xs">
                      {p.price && <span className="text-emerald-600 font-semibold">₹{p.price}</span>}
                      {!p.published && (
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </span>
                  </summary>
                  <form
                    action={updateProductAction.bind(null, id, listing.slug, String(p._id))}
                    className="mt-4 grid grid-cols-1 gap-3"
                  >
                    <input name="name" defaultValue={p.name} required className="input" />
                    <textarea name="description" defaultValue={p.description} rows={2} className="input" />
                    <div className="grid grid-cols-2 gap-3">
                      <input name="price" type="number" step="0.01" defaultValue={p.price} className="input" />
                      <input name="oldPrice" type="number" step="0.01" defaultValue={p.oldPrice} className="input" />
                    </div>
                    <ImageUploadField name="mainImage" label="Main image" defaultValue={p.mainImage} />
                    <input
                      name="additionalImages"
                      defaultValue={p.additionalImages?.join(", ")}
                      placeholder="Additional image URLs, comma separated"
                      className="input"
                    />
                    <div className="flex items-center gap-4">
                      <input name="order" type="number" defaultValue={p.order} className="input w-24" />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          name="published"
                          defaultChecked={p.published}
                          className="rounded border-gray-300"
                        />
                        Published
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-5 py-2">
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={deleteProductAction.bind(null, id, listing.slug, String(p._id))}
                        className="text-red-600 text-xs font-semibold hover:underline"
                      >
                        Delete product
                      </button>
                    </div>
                  </form>
                </details>
              ))}
            {(listing.products || []).length === 0 && (
              <p className="text-gray-400 text-sm">No products yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === "gallery" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-brand-navy mb-4">+ Upload Image</h2>
            <form action={addGalleryImageAction.bind(null, id, listing.slug)}>
              <ImageUploadField name="image" />
              <button className="mt-4 rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
                Add to Gallery
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(listing.gallery || []).map((url, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full aspect-square object-cover rounded-xl border border-gray-100" />
                <form action={removeGalleryImageAction.bind(null, id, listing.slug, i)}>
                  <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs">
                    ×
                  </button>
                </form>
              </div>
            ))}
            {(listing.gallery || []).length === 0 && (
              <p className="text-gray-400 text-sm col-span-full">No gallery images yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === "video" && (
        <form
          action={updateVideoAction.bind(null, id, listing.slug)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 max-w-xl"
        >
          <label className="block text-sm font-medium text-gray-900">
            Video URL (YouTube/Vimeo embed link)
          </label>
          <input name="videoUrl" defaultValue={listing.videoUrl} placeholder="https://www.youtube.com/embed/..." className="input" />
          <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Save
          </button>
        </form>
      )}

      {tab === "location" && (
        <form
          action={updateLocationAction.bind(null, id, listing.slug)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 max-w-xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <input name="latitude" type="number" step="any" defaultValue={listing.latitude} placeholder="Latitude" className="input" />
            <input name="longitude" type="number" step="any" defaultValue={listing.longitude} placeholder="Longitude" className="input" />
          </div>
          <input name="mapUrl" defaultValue={listing.mapUrl} placeholder="Custom Google Maps embed URL (optional)" className="input" />
          <p className="text-xs text-gray-400">
            If left blank, the page falls back to a map search built from the business city.
          </p>
          <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Save
          </button>
        </form>
      )}

      {tab === "hours" && (
        <form
          action={updateHoursAction.bind(null, id, listing.slug)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3 max-w-xl"
        >
          {DAYS.map((day) => {
            const existing = listing.hours?.find((h) => h.day === day)?.time || "";
            return (
              <div key={day} className="flex items-center gap-4">
                <span className="w-28 text-sm text-gray-600">{day}</span>
                <input
                  name={`hours_${day}`}
                  defaultValue={existing}
                  placeholder="9:00 AM – 7:00 PM or Closed"
                  className="input flex-1"
                />
              </div>
            );
          })}
          <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Save Hours
          </button>
        </form>
      )}

      {tab === "reviews" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-4">
            Reviews are submitted by customers on the public listing page — this is a
            read-only view.
          </p>
          <div className="space-y-4">
            {(listing.reviews || []).map((r, i) => (
              <div key={i} className="border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-brand-navy text-sm">{r.name}</span>
                  <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-500">{r.comment}</p>
              </div>
            ))}
            {(listing.reviews || []).length === 0 && (
              <p className="text-gray-400 text-sm">No reviews yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === "seo" && (
        <form
          action={updateSeoAction.bind(null, id, listing.slug)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 max-w-xl"
        >
          <input name="metaTitle" defaultValue={listing.metaTitle} placeholder="Meta title" className="input" />
          <textarea name="metaDescription" defaultValue={listing.metaDescription} placeholder="Meta description" rows={3} className="input" />
          <input name="metaKeywords" defaultValue={listing.metaKeywords} placeholder="Meta keywords" className="input" />
          <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Save SEO
          </button>
        </form>
      )}
    </AdminShell>
  );
}
