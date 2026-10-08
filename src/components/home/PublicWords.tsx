const words = [
  {
    quote:
      "Nishkarsh IT turned our idea into a working product in weeks, not months.",
    name: "Rohit Sharma",
    role: "Founder, Retail Startup",
    image: "/images/rohit.jpg",
  },
  {
    quote: "Reliable, responsive, and genuinely invested in our growth.",
    name: "Priya Verma",
    role: "Operations Head",
    image: "/images/priya.jpg",
  },
  {
    quote: "Their support team feels like an extension of ours.",
    name: "Amit Gupta",
    role: "Director, Healthcare Group",
    image: "/images/amit.jpg",
  },
  {
    quote:
      "From banking CSPs to our website — one trusted partner for everything.",
    name: "Sunita Rao",
    role: "Business Owner",
    image: "/images/sunita.jpg",
  },
];

export default function PublicWords({
  heading,
  description,
}: { heading?: string; description?: string } = {}) {
  const track = [...words, ...words];
  return (
    <section className="py-16 md:py-20 bg-[#062E49] overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#FFFFFF] "
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {heading || "Public Words For This NIS"}
        </h2>
        {description && <p className="text-gray-500 mt-2">{description}</p>}
      </div>
      <div className="flex gap-6 w-max marquee-track">
        {track.map((w, i) => (
          <div
            key={i}
            className="w-80 shrink-0 bg-[#f7f8fa] rounded-2xl border border-gray-100 p-7"
          >
            {/* Quote Icon */}
            <div className="text-[#062E49] mb-5">
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
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              &quot;{w.quote}&quot;
            </p>

            {/* Person */}
            <div className="flex items-center gap-3">
              <img
                src={w.image}
                alt={w.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-bold text-brand-navy text-sm">{w.name}</p>

                <p className="text-xs text-gray-400">{w.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
