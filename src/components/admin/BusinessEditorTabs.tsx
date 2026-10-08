import Link from "next/link";

const tabs = [
  { key: "basic", label: "1. Basic & About" },
  { key: "why", label: "2. Why Choose Us" },
  { key: "services", label: "3. Services" },
  { key: "products", label: "4. Products" },
  { key: "gallery", label: "5. Gallery" },
  { key: "video", label: "6. Video" },
  { key: "location", label: "7. Location" },
  { key: "hours", label: "8. Business Hours" },
  { key: "reviews", label: "9. Reviews" },
  { key: "seo", label: "10. SEO" },
];

export default function BusinessEditorTabs({ id, active }: { id: string; active: string }) {
  return (
    <div className="flex flex-wrap gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-6">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={`/admin/directory/${id}?tab=${t.key}`}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            active === t.key
              ? "bg-brand-navy text-white"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
