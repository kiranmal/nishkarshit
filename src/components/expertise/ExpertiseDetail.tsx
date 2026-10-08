import Link from "next/link";
import type { ExpertiseItem } from "@/data/expertiseFallback";

export default function ExpertiseDetail({ item }: { item: ExpertiseItem }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-4 sm:px-8 py-10">
      {/* =========================
          PAGE TITLE
      ========================== */}
      <h1
        className="text-3xl sm:text-5xl font-bold text-center text-amber-500 mb-8"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {item.title}
      </h1>

      {/* =========================
          HERO IMAGE
      ========================== */}
      {item.image && (
        <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <div className="w-full h-[300px] sm:h-[400px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      )}

      {/* =========================
          INTRO SECTION
      ========================== */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* TEXT */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {item.title}
          </h2>

          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {item.paragraph}
          </p>

          <Link
            href={`/expertise/${item.slug}/enquiry`}
            className="inline-block mt-2 px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            Explore Now
          </Link>
        </div>

        {/* INTRO IMAGE */}
        {item.introImage ? (
          <div>
            <img
              src={item.introImage}
              alt={`${item.title} illustration`}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        ) : (
          <div
            className="w-full h-[250px] rounded-lg"
            style={{
              background: `linear-gradient(
                135deg,
                ${item.accent || "#2563eb"},
                ${item.accent || "#2563eb"}66
              )`,
            }}
          />
        )}
      </div>

      {/* =========================
          CONTENT / SERVICE CARDS
      ========================== */}
      {item.sections && item.sections.length > 0 && (
        <div className="mt-10 space-y-6 max-w-6xl mx-auto">
          {item.sections.map((section, index) => (
            <div
              key={section.title || index}
              className="bg-white/60 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                {section.title}
              </h3>

              <p className="text-gray-700 text-base leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
