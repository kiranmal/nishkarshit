import type { PublicWordsContent } from "@/lib/cms/home";

/** All text and photos come from the database (Admin → Homepage → "Public Words"). */
export default function PublicWords({
  content,
}: {
  content: PublicWordsContent;
}) {
  const { heading, description } = content;
  const words = (content.items ?? []).filter((w) => w.visible !== false);
  if (words.length === 0) return null;
  // The marquee scrolls exactly half the track, so the track must be two identical halves; a short list is repeated inside each half.
  const half = Array.from(
    { length: Math.ceil(4 / words.length) },
    () => words,
  ).flat();
  const track = [...half, ...half];
  return (
    <section className="relative py-16 md:py-20 bg-[#062E49] overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        {heading && (
          <h2
            className="text-3xl md:text-4xl font-bold text-[#FFFFFF] "
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {heading}
          </h2>
        )}
        {description && <p className="text-gray-500 mt-2">{description}</p>}
      </div>
      <div className="bg-[#0e3550] p-xl-5">
        <div className="flex gap-6 w-max marquee-track">
          {track.map((w, i) => (
            <div
              key={i}
              className="w-80 shrink-0 bg-[#0B2033] rounded-2xl border border-[#0B2033] p-7"
            >
              {/* Quote Icon */}
              <div className="text-[#3884cb] mb-5">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="32"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
                </svg>
              </div>

              {/* Quote */}
              <p className="text-[#9ba6af] text-sm leading-relaxed mb-6">
                &quot;{w.quote}&quot;
              </p>

              {/* Person */}
              <div className="flex items-center gap-3">
                {w.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={w.image}
                    alt={w.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#3884cb]/30 text-white text-sm font-bold flex items-center justify-center">
                    {w.name.slice(0, 1)}
                  </div>
                )}

                <div>
                  <p className="font-bold text-brand-navy text-sm">{w.name}</p>

                  <p className="text-xs text-[#9ba6af]">{w.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
