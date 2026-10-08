"use client";

import { IconCloud } from "./ui/IconCloud";

const slugs = [
  "react",
  "nextdotjs",
  "javascript",
  "typescript",
  "nodedotjs",
  "css3",
  "html5",
  "github",
  "gitlab",
  "docker",
  "figma",
  "firebase",
  "tailwindcss",
  "vite",
];

export default function IconCloudDemo() {
  return (
    <section className="w-full min-h-screen  text-white px-6 md:px-20 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: About Text + Stats */}
        <div className="w-full md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Nishkarsh It Solution Private Limited is one of the most trusted
            offshore software development companies today and a front runner in
            Website, Software and App Development Technologies. Nishkarsh IT
            Solution Private Limited specializes in offering business-aligned IT
            solutions and services for businesses of all sizes, from small to
            large.
          </p>

          {/* --- Stats Section Like Image --- */}
          <div className="w-full space-y-8">
            {/* Top Stats Row */}
            <div className="flex  flex-wrap mt-3 gap-6 text-center">
              <div>
                <div className="text-blue-400 text-3xl mb-2">📄</div>
                <p className="font-semibold text-white">Project Completed</p>
                <p className="text-sm text-gray-300">500+</p>
              </div>
              <div>
                <div className="text-blue-400 text-3xl mb-2">👤</div>
                <p className="font-semibold text-white">Satisfied Clients</p>
                <p className="text-sm text-gray-300">100+</p>
              </div>
              <div>
                <div className="text-blue-400 text-3xl mb-2">📊</div>
                <p className="font-semibold text-white">Year Of Experience</p>
                <p className="text-sm text-gray-300">7+</p>
              </div>
              <div></div>
            </div>

            {/* Bottom Checkpoint Row */}
            <div className="flex  flex-wrap mt-5 gap-2 text-gray-200">
              {[
                "ISO Certified Company",
                "Quality Assurance",
                "Certified Developer Team",
                "100% Client Satisfaction",
                "Creative Solutions",
                "24x7 Availability",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 text-xl pt-1">✅</span>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Icon Cloud */}
        <div className="w-full md:w-1/2 h-[400px] flex justify-center items-center">
          <div className="w-full h-full max-w-[600px]">
            <IconCloud iconSlugs={slugs} />
          </div>
        </div>
      </div>
    </section>
  );
}
