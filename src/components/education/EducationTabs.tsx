"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/education" },
  { label: "Internship", href: "/education/internship" },
  { label: "Admission", href: "/education/admission" },
  { label: "Our Partners", href: "/education/partners" },
  { label: "Events & Programs", href: "/education/events" },
];

export default function EducationTabs() {
  const pathname = usePathname();

  return (
    <section className="border-b border-white/10 sticky top-[73px] bg-[#050b16] z-30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative py-4 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors ${
                active ? "text-brand-cyan" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-cyan" />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
