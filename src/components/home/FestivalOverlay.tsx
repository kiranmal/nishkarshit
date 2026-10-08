"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { FestivalDoc } from "@/lib/models";

const DECORATION_EMOJI: Record<string, string> = {
  diyas: "🪔",
  snow: "❄️",
  confetti: "🎉",
  hearts: "💛",
};

// Fixed positions so decoration doesn't jump between server/client renders.
const PARTICLE_POSITIONS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 6) * 0.7}s`,
  duration: `${8 + (i % 5) * 2}s`,
  size: 14 + (i % 3) * 6,
}));

export default function FestivalOverlay({ festival }: { festival: FestivalDoc }) {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const emoji = DECORATION_EMOJI[festival.decoration] || null;

  useEffect(() => {
    if (!festival.popupText && !festival.popupImage) return;
    const key = `festival-popup-${festival.slug}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      setShowPopup(true);
      sessionStorage.setItem(key, "1");
    }
  }, [festival.slug, festival.popupText, festival.popupImage]);

  return (
    <>
      {/* Falling/floating decoration */}
      {emoji && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {PARTICLE_POSITIONS.map((p, i) => (
            <span
              key={i}
              className="absolute -top-10 opacity-80"
              style={{
                left: p.left,
                fontSize: p.size,
                animation: `festival-fall ${p.duration} linear ${p.delay} infinite`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Banner strip */}
      {festival.bannerText && !dismissedBanner && (
        <div
          className="relative z-30 flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold text-center"
          style={{ background: festival.primaryColor, color: festival.accentColor }}
        >
          <span>{festival.bannerText}</span>
          <button
            onClick={() => setDismissedBanner(true)}
            aria-label="Dismiss"
            className="absolute right-4"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* One-time popup */}
      {showPopup && (festival.popupText || festival.popupImage) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden text-center shadow-2xl"
            style={{ background: festival.background, color: festival.accentColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {festival.popupImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={festival.popupImage}
                alt={festival.name}
                className="block w-full max-h-[70vh] object-contain"
              />
            )}
            {(festival.popupText || !festival.popupImage) && (
              <div className="p-8">
                {emoji && !festival.popupImage && <div className="text-4xl mb-4">{emoji}</div>}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: festival.primaryColor }}
                >
                  {festival.name}
                </h3>
                {festival.popupText && <p className="text-sm">{festival.popupText}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
