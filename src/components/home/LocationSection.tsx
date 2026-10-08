const pillars = [
  {
    icon: "👥",
    color: "#ffff",
    title: "Head Office",
    desc: "Mahavir Colony,Varanasi,Uttar Pradesh 221010",
  },
  {
    icon: "⚙️",
    color: "#ffff",
    title: "Branch Office",
    desc: "First Floor, B Block, Sector 2, Noida, Uttar Pradesh 201301, India",
  },
  {
    icon: "💠",
    color: "#ffff",
    title: "Email Us",
    desc: "nishkarshitsolution@gmail.com \ninfo@nishkarshit.com",
  },
  {
    icon: "💠",
    color: "#ffff",
    title: "Helpline No.",
    desc: ["+91-9219572223", "+91-9219572223"],
  },
];

export default function PeopleProcess({
  heading,
  description,
}: { heading?: string; description?: string } = {}) {
  return (
    <section className="py-8 md:py-8 bg-[rgb(0,143,247)]">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center mb-10">
        {description && (
          <p className="text-gray-500 max-w-xl mx-auto">{description}</p>
        )}
      </div>

      <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-[#1A97F9] rounded-2xl  border-shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-8 text-center hover:-translate-y-1 transition-transform"
          >
            <div className="text-4xl mb-4">{p.icon}</div>
            <h3
              className="font-extrabold tracking-wide mb-4"
              style={{ color: p.color }}
            >
              {p.title}
            </h3>
            <p className="text-sm text-white leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
