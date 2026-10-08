"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "https://nishkarshit.com/assets/Slide1-BBF71Zne.jpeg",
  },
  {
    image: "https://nishkarshit.com/assets/Slide2-DkvPjqCE.jpeg",
  },
  {
    image: "https://nishkarshit.com/assets/Slide3-DLaXhvIz.jpeg",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-brand-navy-deep">
      {/* Background image with crossfade */}
      <AnimatePresence mode="sync">
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
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep/90 via-brand-navy-deep/40 to-transparent" />

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
            {/* 
              No heading or list here because
              your slides currently contain only images.
            */}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
