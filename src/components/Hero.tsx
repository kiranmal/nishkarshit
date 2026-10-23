"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "https://nishkarshit.com/assets/Slide1-BBF71Zne.jpeg" },
  { image: "https://nishkarshit.com/assets/Slide2-DkvPjqCE.jpeg" },
  { image: "https://nishkarshit.com/assets/Slide3-DLaXhvIz.jpeg" },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-black">
      {/* Clear background image with smooth crossfade */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slides[active].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 } }}
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${slides[active].image}")`,
          }}
        />
      </AnimatePresence>

      {/* Very light overlay: keeps images bright */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Content area */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full flex items-center px-6 md:px-16 pointer-events-none">
        {/* Add your hero heading or content here if needed */}
      </div>

      {/* Slide indicators */}
      <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active ? "true" : "false"}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-white" : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
