"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#6f9dde]">
      <div className="flex flex-col items-center text-center text-blue-900">
        {/* LOGO */}
        <img
          src="https://nishkarshit.com/assets/niskashitlogo-DhjNDn8M.svg"
          alt="Nishkarsh IT Solution"
          className="w-36 h-36 object-contain logo-animation"
        />

        {/* COMPANY NAME */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-animation">
          Nishkarsh IT Solution
        </h1>

        {/* TAGLINE */}
        <p className="mt-2 text-base md:text-lg font-medium tracking-wide tagline-animation">
          The next generation of Technology
        </p>
      </div>

      <style jsx>{`
        /* LOGO: CLEAR SMALL → BIG + ROTATION */
        .logo-animation {
          animation: logoEntrance 1.2s ease-out forwards;
        }

        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: scale(0.1) rotate(-90deg);
          }

          40% {
            opacity: 1;
            transform: scale(0.6) rotate(25deg);
          }

          70% {
            transform: scale(0.9) rotate(-10deg);
          }

          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        /* COMPANY NAME */
        .text-animation {
          opacity: 0;
          animation: textEntrance 0.6s ease-out 0.8s forwards;
        }

        @keyframes textEntrance {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* TAGLINE */
        .tagline-animation {
          opacity: 0;
          animation: taglineEntrance 0.5s ease-out 1.2s forwards;
        }

        @keyframes taglineEntrance {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
