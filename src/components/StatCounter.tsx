"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  color,
}: {
  value: number;
  suffix?: string;
  label: string;
  color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div
        className="text-4xl md:text-5xl font-extrabold"
        style={{ color, fontFamily: "var(--font-poppins)" }}
      >
        {count}
        {suffix}
      </div>
      <div className="text-xs md:text-sm tracking-wide text-white/70 mt-2 uppercase">
        {label}
      </div>
    </motion.div>
  );
}

export function StaticStat({
  text,
  label,
  color,
}: {
  text: string;
  label: string;
  color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div
        className="text-4xl md:text-5xl font-extrabold"
        style={{ color, fontFamily: "var(--font-poppins)" }}
      >
        {text}
      </div>
      <div className="text-xs md:text-sm tracking-wide text-white/70 mt-2 uppercase">
        {label}
      </div>
    </motion.div>
  );
}
