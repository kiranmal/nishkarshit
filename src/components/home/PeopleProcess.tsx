import type { PeopleProcessContent } from "@/lib/cms/home";

export default function PeopleProcess({ content }: { content: PeopleProcessContent }) {
  const { heading, description } = content;
  const pillars = content.cards.filter((c) => c.visible !== false);
  return (
    <section className="py-16 md:py-20 bg-[#0B243D]">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        {heading && <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-poppins)" }}>{heading}</h2>}
        {description && (
          <p className="text-gray-500 max-w-xl mx-auto">{description}</p>
        )}
      </div>

      <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-8 text-center hover:-translate-y-1 transition-transform"
          >
            <div className="text-4xl mb-4">{p.icon}</div>
            <h3
              className="font-extrabold tracking-wide mb-4"
              style={{ color: p.color }}
            >
              {p.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
