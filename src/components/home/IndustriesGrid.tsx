const industries = [
  { icon: "💻", name: "Information Technology" },
  { icon: "🏦", name: "Banking & Finance" },
  { icon: "🏥", name: "Healthcare" },
  { icon: "🎓", name: "Education" },
  { icon: "🏛️", name: "Government" },
  { icon: "💊", name: "Pharma" },
  { icon: "🛍️", name: "Retail" },
  { icon: "📰", name: "Publishing" },
];

export default function IndustriesGrid({
  heading,
  description,
}: { heading?: string; description?: string } = {}) {
  return (
    <section className="py-16 md:py-20 bg-[#062E49]">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {heading || "Major Industries We Service"}
        </h2>

        {description && <p className="text-gray-200 mb-9">{description}</p>}

        {!description && <div className="mb-9" />}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="
                flex flex-col items-center justify-center
                gap-3
                p-6
                min-h-[160px]
                rounded-xl
                bg-[#F8FAFC]
                shadow-md
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              {/* Emoji */}
              <div className="text-4xl">{ind.icon}</div>

              {/* Industry title */}
              <p className="text-sm md:text-base font-semibold text-[#062E49]">
                {ind.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
