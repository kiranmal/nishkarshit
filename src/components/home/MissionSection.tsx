"use client";

import { useEffect, useRef } from "react";

export default function MissionSection({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
} = {}) {
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
    <section
      className="relative overflow-hidden bg-[#12343B] text-white text-left"
      style={{ minHeight: "520px" }}
    >
      {/* VANTA GLOBE BACKGROUND */}
      <div ref={vantaRef} className="absolute inset-0 z-0" />

      {/* Dark overlay to keep text readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(5,11,26,0.35) 65%, rgba(5,11,26,0.75) 100%)",
        }}
      />

      {/* Soft blue glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(5,11,26,0.35) 65%, rgba(5,11,26,0.75) 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-[2] min-h-[520px] flex items-center justify-start px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <p className="text-brand text-3xl font-bold uppercase tracking-wide mb-8">
            {heading || "Our Mission"}
          </p>

          <h2
            className="text-lg md:text-xl leading-relaxed tracking-wide mb-6 font-normal"
            style={{
              fontFamily: "var(--font-poppins)",
              fontWeight: 400,
            }}
          >
            {description ||
              "At Nishkarsh IT Solution Pvt. Ltd., our mission is to deliver innovative, scalable, and cost-effective IT and business solutions through collaborative teamwork, integrity, and a client‑centric approach. We empower organizations across Banking, Education, Information Technology, Business Solutions, Software Development, Cloud Services, Digital Marketing, Startup Support, Cyber Security, Fintech Services, B2b & B2c Solutions, Government Projects, Manpower, Insurance, Healthcare, Retail, Pharma, and beyond by integrating advanced AI applications, automation, and digital technologies to solve complex challenges and catalyze sustainable growth. By establishing enduring partnerships grounded in trust, quality, and transparency, we build future-ready ecosystems that uplift communities and elevate business performance nationwide."}
          </h2>
        </div>
      </div>
    </section>
  );
}
