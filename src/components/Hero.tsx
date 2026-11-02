"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import type { HeroContent } from "@/lib/cms/home";

export default function Hero({ content }: { content: HeroContent }) {
  const slides = content.slides.filter((x) => x.visible !== false && x.image);
  const [index, setActive] = useState(0);
  const active = slides.length ? index % slides.length : 0;
  const seconds = Math.max(2, content.slideSeconds || 5);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, seconds * 1000);

    return () => clearInterval(id);
  }, [slides.length, seconds]);

  const slide = slides[active];
  if (!slide) return null;
  const slideHasText = (x: (typeof slides)[number]) =>
    Boolean(
      x.title ||
      x.subtitle ||
      x.description ||
      x.button1Label ||
      x.button2Label,
    );
  const hasText = slideHasText(slide);
  // BANNER MODE: when no slide carries text, the slides ARE finished banner graphics. Show each one whole (never cropped, no dark
  // gradient over it) and fill the leftover space with a blurred copy of the same picture, so there are no black bars.
  // Decided for the whole slider, not per slide, so the height never jumps between slides.
  const bannerMode = !slides.some(slideHasText);
  const btn = (label: string, href: string, primary: boolean) =>
    label ? (
      <Link
        href={href || "#"}
        className={
          primary
            ? "rounded-full bg-brand-cyan text-[#050b16] text-sm font-bold px-7 py-3 hover:bg-white transition-colors"
            : "rounded-full border border-white/40 text-white text-sm font-semibold px-7 py-3 hover:bg-white/10 transition-colors"
        }
      >
        {label}
      </Link>
    ) : null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-brand-navy-deep ${
        bannerMode
          ? "h-[clamp(200px,56vw,300px)] sm:h-[clamp(260px,44vw,420px)] md:h-[clamp(420px,40vw,680px)]"
          : "h-[520px] md:h-[620px]"
      }`}
    >
      {/* Background image with crossfade */}
      <AnimatePresence mode="sync">
        {bannerMode ? (
          <motion.div
            key={`bg-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* blurred copy fills any space the whole banner doesn't cover */}
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl opacity-90"
              style={{ backgroundImage: `url("${slide.image}")` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title || "Nishkarsh IT Solution banner"}
              className="relative h-full w-full object-contain"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`bg-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Gradient overlay — only behind real text; banner graphics stay crisp */}
      {!bannerMode && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep/90 via-brand-navy-deep/40 to-transparent" />
      )}

      {/* Main content */}
      <div className="relative max-w-[1440px] mx-auto h-full flex items-center px-6 md:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="max-w-3xl"
          >
            {hasText && (
              <>
                {slide.subtitle && (
                  <p className="text-brand-cyan text-sm font-bold uppercase tracking-widest mb-3">
                    {slide.subtitle}
                  </p>
                )}
                {slide.title && (
                  <h1
                    className="text-white text-3xl md:text-5xl font-bold leading-tight"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {slide.title}
                  </h1>
                )}
                {slide.description && (
                  <p className="text-white/80 mt-4 max-w-2xl">
                    {slide.description}
                  </p>
                )}
                {(slide.button1Label || slide.button2Label) && (
                  <div className="flex flex-wrap gap-4 mt-8">
                    {btn(slide.button1Label, slide.button1Href, true)}
                    {btn(slide.button2Label, slide.button2Href, false)}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex gap-2 ${bannerMode ? "bottom-2 md:bottom-4 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm" : "bottom-6"}`}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active ? "true" : "false"}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
