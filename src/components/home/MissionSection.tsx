"use client";

import { useEffect, useRef } from "react";
import type { MissionContent } from "@/lib/cms/home";

export default function MissionSection({
  content,
}: {
  content: MissionContent;
}) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      if (!vantaRef.current) return;

      try {
        const THREE = await import("three");
        const VANTA = await import("vanta/dist/vanta.globe.min");

        if (!mounted || !vantaRef.current) return;

        vantaEffect.current = VANTA.default({
          el: vantaRef.current,

          THREE: THREE,

          mouseControls: true,
          touchControls: true,
          gyroControls: false,

          minHeight: 200,
          minWidth: 200,

          scale: 1.0,
          scaleMobile: 1.0,

          // Background
          backgroundColor: 0x12343b,

          // Globe / network
          color: 0xc3800e,
          color2: 0xffffff,

          // Animation
          size: 1.15,

          // More visible network points
          points: 10,

          // Globe movement
          spacing: 17,

          // Camera / movement feel
          showDots: true,
        });

        // Vanta deliberately aims the camera to the LEFT of the globe on every screen (so desktop text can sit on the left),
        // which pushes the globe off to one side on phones. On narrow screens re-aim the camera at the globe's own centre
        // after Vanta's per-frame update and before it renders, so the globe sits exactly in the middle.
        const effect = vantaEffect.current;
        if (effect && typeof effect.onUpdate === "function") {
          const original = effect.onUpdate.bind(effect);
          effect.onUpdate = () => {
            original();
            if (window.innerWidth < 768 && effect.camera)
              effect.camera.lookAt(new THREE.Vector3(0, 15, 0));
          };
        }
      } catch (error) {
        console.error("Vanta Globe failed to initialize:", error);
      }
    };

    loadVanta();

    return () => {
      mounted = false;

      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#12343B] text-white text-left md:min-h-[520px]">
      {/* VANTA GLOBE — phones: its own centred 340px stage above the text · desktop: full-section background */}
      <div
        ref={vantaRef}
        className="absolute inset-x-0 top-0 z-0 h-[340px] md:inset-0 md:h-auto"
      />

      {/* Dark overlay to keep text readable (desktop, where text sits over the globe) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(5,11,26,0.35) 65%, rgba(5,11,26,0.75) 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-[2] flex items-center justify-start px-6 pt-[352px] pb-12 md:min-h-[520px] md:px-16 md:py-0 lg:px-24">
        <div className="max-w-2xl">
          <p className="text-brand text-2xl md:text-3xl font-bold uppercase tracking-wide mb-5 md:mb-8">
            {content.heading}
          </p>

          <h2
            className="text-base md:text-xl leading-relaxed md:tracking-wide mb-6 font-normal"
            style={{
              fontFamily: "var(--font-poppins)",
              fontWeight: 400,
            }}
          >
            {content.text}
          </h2>
        </div>
      </div>
    </section>
  );
}
