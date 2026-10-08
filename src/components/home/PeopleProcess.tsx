const pillars = [
  {
    icon: "👥",
    color: "#e11d8f",
    title: "PEOPLE",
    desc: "We connect the best talent to the best businesses, dream teams to leaders, and change agents to visionaries. Explore more about our Award-Winning Recruitment, Professional Staffing and other leading services like Compliance.",
  },
  {
    icon: "⚙️",
    color: "#c026d3",
    title: "PROCESS",
    desc: "Navigate everyday operational challenges at ease with our strategic, innovative and tech-powered Contact Center and Back Office (Domestic and International), Field Services Management and Background Verification services.",
  },
  {
    icon: "💠",
    color: "#7c3aed",
    title: "TECHNOLOGY",
    desc: "Discover transformative technology solutions that drive your business to the next level. Our flexible and adaptable product and services suite includes AI, Automation and the likes, tailored to your business needs.",
  },
];

export default function PeopleProcess({
  heading,
  description,
}: { heading?: string; description?: string } = {}) {
  return (
    <section className="py-16 md:py-20 bg-[#0B243D]">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
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
            <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
