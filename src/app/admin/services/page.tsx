import AdminShell from "@/components/admin/AdminShell";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type ServiceSectionDoc } from "@/lib/models";
import {
  updateServiceSectionAction,
  deleteServiceSectionAction,
  seedServiceSectionsAction,
  createServiceSectionAction,
} from "@/app/admin/services/actions";

export const dynamic = "force-dynamic";

async function getSections(): Promise<ServiceSectionDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db
    .collection<ServiceSectionDoc>(COLLECTIONS.serviceSections)
    .find()
    .sort({ order: 1 })
    .toArray();
}

export default async function AdminServicesPage() {
  const sections = await getSections();

  return (
    <AdminShell active="/admin/services">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-brand-navy"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Services Page
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit the 10 alternating sections shown on <code>/services</code>.
          </p>
        </div>
        {isDbConfigured() && (
          <form action={seedServiceSectionsAction}>
            <button
              type="submit"
              className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
            >
              Sync default content
            </button>
          </form>
        )}
      </div>

      {!isDbConfigured() && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected yet — the live <code>/services</code>{" "}
          page is currently reading the built-in defaults from{" "}
          <code>src/data/servicesDetailed.ts</code>. Set{" "}
          <code>MONGODB_URI</code>, click &quot;Sync default content&quot;
          once connected, and this page will let you edit each section.
        </div>
      )}

      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <summary className="cursor-pointer font-semibold text-brand-navy">
          + Add New Section
        </summary>
        <form
          action={createServiceSectionAction}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="slug" placeholder="URL slug (e.g. cyber-security)" className="input" />
          <input name="order" type="number" defaultValue={sections.length} placeholder="Order" className="input" />
          <input name="label" required placeholder="Label (e.g. CYBER SECURITY)" className="input" />
          <select name="imageSide" defaultValue="left" className="input">
            <option value="left">Image on left</option>
            <option value="right">Image on right</option>
          </select>
          <input name="heading" required placeholder="Heading" className="input md:col-span-2" />
          <textarea name="paragraph" required placeholder="Paragraph" rows={3} className="input md:col-span-2" />
          <input name="ctaLabel" defaultValue="Explore Now" placeholder="Button label" className="input" />
          <input name="ctaHref" defaultValue="/services#enquiry" placeholder="Button link" className="input" />
          <div className="md:col-span-2">
            <ImageUploadField name="imageUrl" label="Section image (optional — replaces the icon panel)" />
          </div>
          <input name="accent" defaultValue="#0c2340" placeholder="Accent color (#hex)" className="input" />
          <select name="status" defaultValue="published" className="input">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Add Section
          </button>
        </form>
      </details>

      <div className="space-y-4">
        {sections.map((s) => (
          <details
            key={String(s._id)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <summary className="cursor-pointer font-semibold text-brand-navy">
              {s.order + 1}. {s.label} — {s.heading}
            </summary>
            <form
              action={updateServiceSectionAction.bind(null, String(s._id))}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input name="slug" defaultValue={s.slug} className="input" placeholder="slug" />
              <input
                name="order"
                type="number"
                defaultValue={s.order}
                className="input"
                placeholder="order"
              />
              <input name="label" defaultValue={s.label} className="input" placeholder="Label" />
              <select name="imageSide" defaultValue={s.imageSide} className="input">
                <option value="left">Image on left</option>
                <option value="right">Image on right</option>
              </select>
              <input
                name="heading"
                defaultValue={s.heading}
                className="input md:col-span-2"
                placeholder="Heading"
              />
              <textarea
                name="paragraph"
                defaultValue={s.paragraph}
                rows={3}
                className="input md:col-span-2"
                placeholder="Paragraph"
              />
              <input
                name="ctaLabel"
                defaultValue={s.ctaLabel}
                className="input"
                placeholder="Button label"
              />
              <input
                name="ctaHref"
                defaultValue={s.ctaHref}
                className="input"
                placeholder="Button link"
              />
              <div className="md:col-span-2">
                <ImageUploadField
                  name="imageUrl"
                  label="Section image (optional — replaces the icon panel)"
                  defaultValue={s.imageUrl}
                />
              </div>
              <input
                name="accent"
                defaultValue={s.accent}
                className="input"
                placeholder="Accent color (#hex)"
              />
              <select name="status" defaultValue={s.status} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteServiceSectionAction.bind(null, String(s._id))}
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  Delete section
                </button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
