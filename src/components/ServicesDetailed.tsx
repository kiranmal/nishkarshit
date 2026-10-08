"use client";

import { useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Code2,
  Cloud,
  HandCoins,
  Landmark,
  HeartPulse,
  BookOpenText,
  Building2,
  GraduationCap,
  ShoppingCart,
  Pill,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import type { ServiceBlock } from "@/data/servicesDetailed";

/* =========================================================
   ICON MAP
========================================================= */

const iconMap: Record<ServiceBlock["icon"], LucideIcon> = {
  code: Code2,
  cloud: Cloud,
  loan: HandCoins,
  bank: Landmark,
  health: HeartPulse,
  publish: BookOpenText,
  gov: Building2,
  education: GraduationCap,
  retail: ShoppingCart,
  pharma: Pill,
};

/* =========================================================
   EXTERNAL LINK CHECK
========================================================= */

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/* =========================================================
   ORIGINAL IMAGE PANEL
========================================================= */

function ImagePanel({ block }: { block: ServiceBlock }) {
  const Icon = iconMap[block.icon] ?? Code2;
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(block.imageUrl) && !imgFailed;

  return (
    <div
      className="
        relative
        w-full
    h-full min-h-[220px] md:min-h-0
        rounded-2xl
        overflow-hidden
        flex
        items-center
        justify-center
      "
      style={{
        background: `linear-gradient(
          135deg,
          ${block.accent} 0%,
          ${block.accent}cc 100%
        )`,
      }}
    >
      {/* Decorative background circle */}
      <div
        className="
          absolute
          w-48
          h-48
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.imageUrl}
          alt={block.heading}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
      ) : (
        <Icon
          className="relative z-10 text-white/90"
          size={72}
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}

/* =========================================================
   SERVICE ROW
   ORIGINAL DESIGN + SAME MOUSE EFFECT
========================================================= */

function ServiceRow({ block, index }: { block: ServiceBlock; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({
    rx: 0,
    ry: 0,
  });

  const [glow, setGlow] = useState({
    x: 50,
    y: 50,
  });

  const imageFirst = block.imageSide === "left";

  // "/services#enquiry" is the original default and means "take me to the enquiry form on the home page".
  const ctaHref =
    !block.ctaHref || block.ctaHref === "/services#enquiry" ? "/#enquiry" : block.ctaHref;
  const external = isExternal(ctaHref);

  /* =======================================================
     SAME MOUSE EFFECT FROM YOUR CODE
  ======================================================= */

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const px = (e.clientX - rect.left) / rect.width;

    const py = (e.clientY - rect.top) / rect.height;

    const maxTilt = 10;

    setTilt({
      ry: (px - 0.5) * maxTilt * 2,
      rx: -(py - 0.5) * maxTilt * 2,
    });

    setGlow({
      x: px * 100,
      y: py * 100,
    });
  }

  /* =======================================================
     RESET EFFECT
  ======================================================= */

  function handleMouseLeave() {
    setTilt({
      rx: 0,
      ry: 0,
    });

    setGlow({
      x: 50,
      y: 50,
    });
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: "easeOut",
      }}
      style={{
        perspective: "1200px",
      }}
    >
      {/* ===================================================
          ORIGINAL CARD
      =================================================== */}

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          group
          relative
          bg-white
          rounded-2xl
          border
          border-gray-100
          p-5
          md:p-7
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8
          md:gap-12
          items-stretch
          mb-8
          overflow-hidden
          transition-shadow
          duration-300
          hover:shadow-[0_25px_50px_rgba(15,23,42,0.18)]
        "
        style={{
          /*
           * EXACT SAME TILT LOGIC
           * FROM YOUR NEW CARD
           */
          transform: `
            rotateX(${tilt.rx}deg)
            rotateY(${tilt.ry}deg)
            translateY(${tilt.rx || tilt.ry ? -6 : 0}px)
            scale(${tilt.rx || tilt.ry ? 1.02 : 1})
          `,

          transformStyle: "preserve-3d",

          transition: "transform 220ms ease-out, box-shadow 300ms ease-out",

          boxShadow:
            tilt.rx || tilt.ry
              ? "0 25px 50px rgba(15,23,42,0.18)"
              : "0 10px 35px rgba(15,23,42,0.07)",
        }}
      >
        {/* =================================================
            MOUSE FOLLOWING GLOW
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            transition-opacity
            duration-300
          "
          style={{
            opacity: tilt.rx || tilt.ry ? 1 : 0,

            background: `
              radial-gradient(
                280px circle at
                ${glow.x}%
                ${glow.y}%,
                ${block.accent}22,
                transparent 70%
              )
            `,
          }}
        />

        {/* =================================================
            IMAGE / ICON SIDE
        ================================================= */}

        <div
          className={`h-full ${imageFirst ? "order-1" : "order-1 md:order-2"}`}
          style={{
            transform: "translateZ(30px)",

            transformStyle: "preserve-3d",
          }}
        >
          <ImagePanel block={block} />
        </div>

        {/* =================================================
            CONTENT SIDE
        ================================================= */}

        <div
          className={imageFirst ? "order-2" : "order-2 md:order-1"}
          style={{
            transform: "translateZ(40px)",

            transformStyle: "preserve-3d",
          }}
        >
          {/* LABEL */}

          <p
            className="
              text-[13px]
              md:text-sm
              font-bold
              tracking-wide
              uppercase
              mb-3
            "
            style={{
              color: "#d8102e",
            }}
          >
            {block.label}
          </p>

          {/* HEADING */}

          <h3
            className="
              text-2xl
              md:text-[32px]
              font-bold
              text-brand-navy
              leading-snug
              mb-4
            "
            style={{
              fontFamily: "var(--font-poppins)",
            }}
          >
            {block.heading}
          </h3>

          {/* DESCRIPTION */}

          <p
            className="
              text-gray-500
              text-[15px]
              leading-relaxed
              mb-7
              max-w-xl
            "
          >
            {block.paragraph}
          </p>

          {/* =================================================
              BUTTON
          ================================================= */}

          {(() => {
            const cls =
              "inline-flex items-center gap-1.5 justify-center rounded-full border-2 px-7 py-2.5 text-[15px] font-semibold transition-colors";
            const style = { borderColor: "#d8102e", color: "#d8102e" };
            const enter = (e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.backgroundColor = "#d8102e";
              e.currentTarget.style.color = "#ffffff";
            };
            const leave = (e: MouseEvent<HTMLElement>) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#d8102e";
            };
            return external ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
                style={style}
                onMouseEnter={enter}
                onMouseLeave={leave}
              >
                {block.ctaLabel}
                <ArrowUpRight size={15} />
              </a>
            ) : (
              <Link
                href={ctaHref}
                className={cls}
                style={style}
                onMouseEnter={enter}
                onMouseLeave={leave}
              >
                {block.ctaLabel}
                <ArrowUpRight size={15} />
              </Link>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ServicesDetailed({
  sections,
}: {
  sections: ServiceBlock[];
}) {
  return (
    <>
      {/* ===================================================
          PAGE TITLE
      =================================================== */}

      <section className="bg-white border-b border-gray-100">
        <div
          className="
            max-w-[1440px]
            mx-auto
            px-6
            md:px-16
            py-14
            md:py-20
            text-center
          "
        >
          <motion.h1
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-[#1b2430]
            "
            style={{
              fontFamily: "var(--font-poppins)",
            }}
          >
            Services
          </motion.h1>
        </div>
      </section>

      {/* ===================================================
          SERVICES
      =================================================== */}

      <section className="bg-[#f7f8fa] py-12 md:py-16">
        <div
          id="enquiry"
          className="
            max-w-[1200px]
            mx-auto
            px-6
            md:px-10
          "
        >
          {sections.map((block, index) => (
            <ServiceRow key={`${block.label}-${index}`} block={block} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
