import AdminShell from "@/components/admin/AdminShell";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type HomepageSectionConfigDoc } from "@/lib/models";
import { seedHomepageSectionsAction, updateHomepageSectionAction } from "@/app/admin/homepage/actions";
import { homepageSectionDefaults } from "@/data/homepageSections";

export const dynamic = "force-dynamic";

async function getSections(): Promise<HomepageSectionConfigDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db
    .collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections)
    .find()
    .sort({ order: 1 })
    .toArray();
}

export default async function AdminHomepagePage() {
  const sections = await getSections();

  return (
    <AdminShell active="/admin/homepage">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold text-brand-navy"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Homepage
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Show/hide sections, reorder them, and override each section&apos;s heading
            and description. Lower order number = appears first.
          </p>
        </div>
        {isDbConfigured() && (
          <form action={seedHomepageSectionsAction}>
            <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
              Sync default sections
            </button>
          </form>
        )}
      </div>

      {!isDbConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected yet — the homepage is showing all{" "}
          {homepageSectionDefaults.length} default sections, visible, in their built-in
          order.
        </div>
      )}

      <div className="space-y-3">
        {sections.map((s) => (
          <details key={s.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <summary className="cursor-pointer flex items-center justify-between gap-3">
              <span className="font-semibold text-brand-navy">
                {s.label}
                {!s.visible && (
                  <span className="ml-2 text-[11px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-400">Order: {s.order}</span>
            </summary>
            <form
              action={updateHomepageSectionAction.bind(null, s.key)}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="visible" defaultChecked={s.visible} className="rounded border-gray-300" />
                Visible on homepage
              </label>
              <input name="order" type="number" defaultValue={s.order} placeholder="Order" className="input" />
              <input
                name="heading"
                defaultValue={s.heading}
                placeholder="Heading override (optional — leave blank to use default)"
                className="input md:col-span-2"
              />
              <textarea
                name="description"
                defaultValue={s.description}
                placeholder="Description override (optional)"
                rows={2}
                className="input md:col-span-2"
              />
              <div className="md:col-span-2">
                <ImageUploadField name="image" label="Section image (optional)" defaultValue={s.image} />
              </div>
              <input name="buttonLabel" defaultValue={s.buttonLabel} placeholder="Button label (optional)" className="input" />
              <input name="buttonHref" defaultValue={s.buttonHref} placeholder="Button link (optional)" className="input" />
              <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
                Save
              </button>
            </form>
          </details>
        ))}
        {sections.length === 0 && isDbConfigured() && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            Click &quot;Sync default sections&quot; above to get started.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
