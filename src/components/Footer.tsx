"use client";

import Link from "next/link";
import { useSiteContent } from "@/components/SiteContentProvider";
import { FacebookIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

/* Dots begin around the arch and travel upward */
const PARTICLES = [
  { top: "73%", left: "4%", delay: "0s", duration: "5.5s" },
  { top: "68%", left: "9%", delay: "1.3s", duration: "6s" },
  { top: "76%", left: "14%", delay: "2.5s", duration: "5.2s" },
  { top: "64%", left: "19%", delay: "0.8s", duration: "6.3s" },
  { top: "71%", left: "24%", delay: "3s", duration: "5.7s" },

  { top: "59%", left: "29%", delay: "1.7s", duration: "6.2s" },
  { top: "65%", left: "34%", delay: "4s", duration: "5.3s" },
  { top: "55%", left: "39%", delay: "0.4s", duration: "6.5s" },
  { top: "62%", left: "44%", delay: "2.2s", duration: "5.8s" },

  { top: "55%", left: "49%", delay: "1s", duration: "6.4s" },
  { top: "57%", left: "54%", delay: "3.5s", duration: "5.5s" },
  { top: "62%", left: "59%", delay: "1.6s", duration: "6s" },
  { top: "66%", left: "64%", delay: "4.1s", duration: "5.4s" },

  { top: "61%", left: "69%", delay: "0.9s", duration: "6.2s" },
  { top: "70%", left: "74%", delay: "2.8s", duration: "5.8s" },
  { top: "65%", left: "79%", delay: "1.4s", duration: "6.4s" },
  { top: "74%", left: "84%", delay: "3.8s", duration: "5.5s" },

  { top: "68%", left: "89%", delay: "0.3s", duration: "6s" },
  { top: "76%", left: "94%", delay: "2s", duration: "5.6s" },
];

export default function Footer() {
  const { footer } = useSiteContent();
  return (
    <footer className="relative mt-auto overflow-hidden text-white">
      {/* =====================================================
          MAIN BACKGROUND
      ====================================================== */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #02040a 0%, #061426 45%, #0a3154 100%)",
        }}
      />

      {/* =====================================================
          SUBTLE GRID
      ====================================================== */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "70px 80px",
        }}
      />

      {/* =====================================================
          BLUE GLOW ABOVE THE ARCH
      ====================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[25%]
          h-[350px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          blur-[110px]
        "
        style={{
          background:
            "radial-gradient(ellipse, rgba(54,158,255,0.22) 0%, rgba(54,158,255,0.07) 45%, transparent 75%)",
        }}
      />

      {/* =====================================================
          MOVING DOTS
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="footer-particle absolute h-[3px] w-[3px] rounded-full bg-white"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          ORIGINAL-SIZE ARCH
          No border
      ====================================================== */}
      <svg
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-[3]
          h-[220px]
          w-full
        "
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0,220 L0,140 Q720,-40 1440,140 L1440,220 Z"
          fill="#02040a"
          fillOpacity="0.88"
        />
      </svg>

      {/* =====================================================
          DARKER AREA BELOW THE ARCH
          This reinforces the dark bottom portion
      ====================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-[4]
          h-[105px]
          w-full
        "
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,10,0.35), #010207 75%, #000106 100%)",
        }}
      />

      {/* =====================================================
          FOOTER CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-[5]
          mx-auto
          grid
          max-w-[1440px]
          grid-cols-1
          gap-10
          px-6
          pb-12
          pt-16
          md:grid-cols-4
          md:px-16
        "
      >
        {/* ABOUT */}
        <div>
          <h3
            className="mb-5 text-2xl font-bold text-blue-500"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {footer.brandName}
          </h3>
          <p className="max-w-sm text-sm leading-7 text-white/70">{footer.about}</p>
        </div>

        {/* LINK COLUMNS */}
        {footer.columns.map((col, ci) => (
          <div key={`${col.title}-${ci}`}>
            <h3 className="mb-5 text-lg font-semibold text-white">{col.title}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {col.links
                .filter((l) => l.visible)
                .map((l, li) => (
                  <li key={`${l.label}-${li}`}>
                    <Link href={l.href || "#"} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {/* CONTACT */}
        <div>
          <h2 className="font-semibold mb-2 text-white">{footer.contactTitle}</h2>
          <ul className="space-y-1 text-gray-300 mb-4">
            {footer.contactLines.map((line, i) => (
              <li key={i}>
                {line.href ? (
                  <a href={line.href} className="hover:text-white">
                    {line.text}
                  </a>
                ) : (
                  line.text
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-4">
            {footer.facebook && <a
              href={footer.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <FacebookIcon />
            </a>}

            {footer.instagram && <a
              href={footer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <InstagramIcon />
            </a>}

            {footer.linkedin && <a
              href={footer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <LinkedinIcon />
            </a>}
            {footer.youtube && (
              <a href={footer.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white transition-opacity hover:opacity-70">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          COPYRIGHT
      ====================================================== */}
      <div className="relative z-[5] px-6 pb-8 text-center text-xs text-white/70">
        © {new Date().getFullYear()}. {footer.copyrightText}{" "}
        <span className="font-semibold text-white">{footer.poweredBy}</span>
      </div>
    </footer>
  );
}
