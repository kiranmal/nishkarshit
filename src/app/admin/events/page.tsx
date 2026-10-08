import AdminShell from "@/components/admin/AdminShell";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type FestivalDoc } from "@/lib/models";
import {
  createFestivalAction,
  updateFestivalAction,
  deleteFestivalAction,
  toggleFestivalActiveAction,
} from "@/app/admin/events/actions";
import { getActiveFestival } from "@/lib/festival";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

async function getFestivals(): Promise<FestivalDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db
    .collection<FestivalDoc>(COLLECTIONS.festivals)
    .find()
    .sort({ priority: -1, startDate: -1 })
    .toArray();
}

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

const PRESETS = [
  { name: "Diwali", background: "#4c1d0c", primaryColor: "#f59e0b", accentColor: "#fde047", decoration: "diyas" },
  { name: "Christmas", background: "#0b3d2e", primaryColor: "#dc2626", accentColor: "#ffffff", decoration: "snow" },
  { name: "Holi", background: "#581c87", primaryColor: "#ec4899", accentColor: "#22d3ee", decoration: "confetti" },
  { name: "New Year", background: "#0b1224", primaryColor: "#eab308", accentColor: "#ffffff", decoration: "confetti" },
];

export default async function AdminEventsPage() {
  const festivals = await getFestivals();
  const active = await getActiveFestival();

  return (
    <AdminShell active="/admin/events">
      <h1
        className="text-2xl font-bold text-brand-navy mb-1"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Festivals &amp; Events
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Schedule seasonal themes for the homepage — a banner, colors, and a
        decoration overlay (diyas, snow, confetti…), plus an optional popup with an image. When a festival&apos;s date
        range is active and switched on, it automatically takes over the
        homepage&apos;s look. If more than one overlaps, the highest priority wins.
      </p>

      {!isDbConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected yet — set <code>MONGODB_URI</code> in{" "}
          <code>.env.local</code> to schedule festivals.
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-500">
          Currently live on the homepage:
        </span>
        {active ? (
          <span
            className="text-sm font-bold px-3 py-1 rounded-full text-white"
            style={{ background: active.primaryColor }}
          >
            {active.name}
          </span>
        ) : (
          <span className="text-sm text-gray-400">None — default site theme</span>
        )}
      </div>

      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <summary className="cursor-pointer font-semibold text-brand-navy">
          + Add Festival / Event
        </summary>

        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          <span className="text-xs text-gray-400 mr-1 self-center">Quick presets:</span>
          {PRESETS.map((p) => (
            <span
              key={p.name}
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: p.primaryColor }}
              title="Fill these values in manually below — presets are just a reference."
            >
              {p.name}
            </span>
          ))}
        </div>

        <form
          action={createFestivalAction}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="name" required placeholder="Name (e.g. Diwali)" className="input" />
          <input name="slug" placeholder="URL slug (auto from name if blank)" className="input" />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start date</label>
            <input name="startDate" type="date" required className="input" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End date</label>
            <input name="endDate" type="date" required className="input" />
          </div>
          <input name="bannerText" placeholder="Banner text (e.g. Happy Diwali! Flat 20% off all services)" className="input md:col-span-2" />
          <input name="popupText" placeholder="Popup text (optional, shown once per visit)" className="input md:col-span-2" />
          <div className="md:col-span-2">
            <ImageUploadField
              name="popupImage"
              label="Popup image (optional — shown in the festival popup)"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Background color</label>
            <input name="background" type="color" defaultValue="#4c1d0c" className="input h-10" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Primary color</label>
            <input name="primaryColor" type="color" defaultValue="#f59e0b" className="input h-10" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Accent color</label>
            <input name="accentColor" type="color" defaultValue="#fde047" className="input h-10" />
          </div>
          <select name="decoration" defaultValue="none" className="input">
            <option value="none">No decoration</option>
            <option value="diyas">Diyas (Diwali)</option>
            <option value="snow">Snow (Christmas / New Year)</option>
            <option value="confetti">Confetti (Holi / celebrations)</option>
            <option value="hearts">Hearts</option>
          </select>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Priority (higher wins if dates overlap)
            </label>
            <input name="priority" type="number" defaultValue={0} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="active" defaultChecked className="rounded border-gray-300" />
            Active (on/off switch, independent of dates)
          </label>
          <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Add Festival
          </button>
        </form>
      </details>

      <div className="space-y-3">
        {festivals.map((f) => (
          <details key={String(f._id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <summary className="cursor-pointer flex items-center justify-between gap-3 flex-wrap">
              <span className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ background: f.primaryColor }}
                />
                <span className="font-semibold text-brand-navy">{f.name}</span>
                <span className="text-xs text-gray-400">
                  {toDateInput(f.startDate)} → {toDateInput(f.endDate)}
                </span>
              </span>
              <div className="flex items-center gap-3">
                <form action={toggleFestivalActiveAction.bind(null, String(f._id), !f.active)}>
                  <button
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      f.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {f.active ? "Active" : "Inactive"} — toggle
                  </button>
                </form>
              </div>
            </summary>

            <form
              action={updateFestivalAction.bind(null, String(f._id))}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input name="name" defaultValue={f.name} required className="input" />
              <input name="slug" defaultValue={f.slug} className="input" />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start date</label>
                <input name="startDate" type="date" defaultValue={toDateInput(f.startDate)} required className="input" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End date</label>
                <input name="endDate" type="date" defaultValue={toDateInput(f.endDate)} required className="input" />
              </div>
              <input name="bannerText" defaultValue={f.bannerText} placeholder="Banner text" className="input md:col-span-2" />
              <input name="popupText" defaultValue={f.popupText} placeholder="Popup text" className="input md:col-span-2" />
              <div className="md:col-span-2">
                <ImageUploadField
                  name="popupImage"
                  label="Popup image (optional — shown in the festival popup)"
                  defaultValue={f.popupImage}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Background color</label>
                <input name="background" type="color" defaultValue={f.background} className="input h-10" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Primary color</label>
                <input name="primaryColor" type="color" defaultValue={f.primaryColor} className="input h-10" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Accent color</label>
                <input name="accentColor" type="color" defaultValue={f.accentColor} className="input h-10" />
              </div>
              <select name="decoration" defaultValue={f.decoration} className="input">
                <option value="none">No decoration</option>
                <option value="diyas">Diyas (Diwali)</option>
                <option value="snow">Snow (Christmas / New Year)</option>
                <option value="confetti">Confetti (Holi / celebrations)</option>
                <option value="hearts">Hearts</option>
              </select>
              <input name="priority" type="number" defaultValue={f.priority} className="input" />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="active" defaultChecked={f.active} className="rounded border-gray-300" />
                Active
              </label>
              <div className="md:col-span-2 flex items-center gap-3">
                <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteFestivalAction.bind(null, String(f._id))}
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </form>
          </details>
        ))}
        {festivals.length === 0 && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            No festivals scheduled yet — add one above.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
