import type { LocationContent } from "@/lib/cms/home";

export default function LocationSection({
  content,
}: {
  content: LocationContent;
}) {
  const description = content?.description ?? "";

  const pillars = (content?.cards ?? []).filter(
    (card) => card.visible !== false,
  );

  return (
    <section className="py-10 md:py-14 bg-[#008FF7]">
      {description && (
        <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center mb-10">
          <p className="text-white max-w-xl mx-auto">{description}</p>
        </div>
      )}

      <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {pillars.map((p, index) => (
          <div
            key={`${p.title}-${index}`}
            className="bg-[#1A97F9] rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-8 text-center hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Location Icon */}
            <div className="text-4xl mb-4 flex items-center justify-center min-h-12">
              {p.icon || "📍"}
            </div>

            {/* Card Title */}
            <h3 className="font-extrabold tracking-wide mb-4 text-white">
              {p.title}
            </h3>

            {/* Card Information */}
            <p className="text-sm text-white leading-relaxed whitespace-pre-line">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
