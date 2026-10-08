import AdminShell from "@/components/admin/AdminShell";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryCategoryDoc } from "@/lib/models";
import { addCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/admin/categories/actions";
import { fallbackCategories } from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<DirectoryCategoryDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db
    .collection<DirectoryCategoryDoc>(COLLECTIONS.directoryCategories)
    .find()
    .sort({ order: 1 })
    .toArray();
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminShell active="/admin/categories">
      <h1
        className="text-2xl font-bold text-brand-navy mb-1"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Directory Categories
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Powers the category grid on <code>/directory</code> and{" "}
        <code>/directory/categories</code>, and the search filter dropdowns.
      </p>

      {!isDbConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected yet — the public site is currently showing these
          built-in defaults: {fallbackCategories.map((c) => c.name).join(", ")}.
        </div>
      )}

      <form
        action={addCategoryAction}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        <input name="icon" placeholder="Emoji icon" className="input" />
        <input name="name" required placeholder="Category name" className="input md:col-span-2" />
        <input name="order" type="number" placeholder="Order" className="input" />
        <select name="status" defaultValue="published" className="input">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button className="md:col-span-3 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
          + Add Category
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((c) => (
          <form
            key={String(c._id)}
            action={updateCategoryAction.bind(null, String(c._id))}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3"
          >
            <input name="icon" defaultValue={c.icon} className="input w-20 shrink-0" />
            <input name="name" defaultValue={c.name} required className="input flex-1 min-w-[160px]" />
            <input name="order" type="number" defaultValue={c.order} className="input w-20 shrink-0" />
            <select name="status" defaultValue={c.status} className="input w-32 shrink-0">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="text-xs font-semibold text-brand-navy hover:underline shrink-0">
              Save
            </button>
            <button
              type="submit"
              formAction={deleteCategoryAction.bind(null, String(c._id))}
              className="text-xs font-semibold text-red-600 hover:underline shrink-0"
            >
              Delete
            </button>
          </form>
        ))}
        {categories.length === 0 && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            No categories yet — add one above.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
