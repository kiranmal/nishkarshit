const points = [
  {
    title: "End-to-end delivery",
    desc: "From strategy to support, one team owns the outcome.",
  },
  {
    title: "Industry expertise",
    desc: "Deep experience across IT, banking, healthcare and more.",
  },
  {
    title: "Transparent process",
    desc: "Clear timelines, honest updates, no surprises.",
  },
];

export default function Differentiator({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
} = {}) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-brand-navy text-white">
      {/* =========================
          THREAD BACKGROUND
      ========================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow for the threads */}
            <filter id="threadGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Fade from bottom to top */}
            <linearGradient id="threadFade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#46A5CA" stopOpacity="0" />

              <stop offset="20%" stopColor="#46A5CA" stopOpacity="0.8" />

              <stop offset="70%" stopColor="#8DDCFF" stopOpacity="0.45" />

              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* =========================
              ANIMATED THREADS
          ========================== */}

          <path
            className="differentiator-thread differentiator-thread-1"
            d="M720 900 C720 760 700 650 720 540 C735 470 720 450 720 450 C690 350 620 270 570 120"
          />

          <path
            className="differentiator-thread differentiator-thread-2"
            d="M720 900 C710 760 735 650 720 540 C705 480 720 450 720 450 C760 350 820 260 900 100"
          />

          <path
            className="differentiator-thread differentiator-thread-3"
            d="M720 900 C680 760 650 650 690 550 C710 500 720 470 720 450 C650 350 520 260 400 130"
          />

          <path
            className="differentiator-thread differentiator-thread-4"
            d="M720 900 C760 760 790 650 750 550 C730 500 720 470 720 450 C800 350 940 270 1050 120"
          />

          <path
            className="differentiator-thread differentiator-thread-5"
            d="M720 900 C700 780 680 650 700 560 C715 500 720 470 720 450 C670 380 580 330 500 250"
          />

          <path
            className="differentiator-thread differentiator-thread-6"
            d="M720 900 C740 780 770 650 740 560 C725 500 720 470 720 450 C770 370 850 330 970 240"
          />

          <path
            className="differentiator-thread differentiator-thread-7"
            d="M720 900 C650 760 600 650 650 550 C680 500 710 470 720 450 C600 400 470 340 300 280"
          />

          <path
            className="differentiator-thread differentiator-thread-8"
            d="M720 900 C790 760 840 650 790 550 C760 500 730 470 720 450 C850 400 1020 330 1180 250"
          />

          <path
            className="differentiator-thread differentiator-thread-9"
            d="M720 900 C690 780 620 690 650 590 C670 520 710 470 720 450 C620 420 540 390 430 350"
          />

          <path
            className="differentiator-thread differentiator-thread-10"
            d="M720 900 C750 780 820 690 790 590 C770 520 730 470 720 450 C820 420 920 390 1080 350"
          />
        </svg>
      </div>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#FE9A00] text-sm font-bold uppercase tracking-wide mb-3">
            What we done
          </p>

          <h2
            className="text-3xl md:text-4xl font-bold text-[#FE9A00]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {heading || "We Are The Differentiator You Need"}
          </h2>

          {description && <p className="text-white/60 mt-3">{description}</p>}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((p) => (
            <div
              key={p.title}
              className="
                bg-white
                border border-white/20
                rounded-2xl
                p-8
                min-h-[220px]
                flex flex-col justify-center
                shadow-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1447E6" }}
              >
                {p.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "#1E2939" }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
