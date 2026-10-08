"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "framer-motion";

const sentence =
  "The company's resource staff and members of the founding team have continuously offered dependable support services and consulting in the roles of executive, business partner, and consultant to a wide range of corporate houses. The company's core values are centred around establishing enduring business partnerships with its clients, of which target-oriented modern technology, dependability, ensured quality, and human relationships are the fundamental building blocks.";
const words = sentence.split(" ");

export default function Turbocharge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.3"],
  });

  return (
    <section ref={ref} className="bg-brand-navy-deep py-28 md:py-36">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 gap-5">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
          Turbocharge Your Growth Potential
        </h2>
        <p className="flex flex-wrap gap-x-3 gap-y-2 text-2xl md:text-2xl font-bold leading-snug text-center justify-center">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={i}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  return (
    <motion.span
      style={{ opacity, fontFamily: "var(--font-poppins)" }}
      className="text-white"
    >
      {word}
    </motion.span>
  );
}
