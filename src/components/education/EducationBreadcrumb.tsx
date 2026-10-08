import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function EducationBreadcrumb({ current }: { current?: string }) {
  return (
    <div className="bg-[#0a1526] border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-3 flex items-center gap-2 text-xs text-white/40">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-white/70 transition-colors"
        >
          <Home size={12} />
          Home
        </Link>

        <ChevronRight size={12} />

        {current ? (
          <>
            <Link
              href="/education"
              className="hover:text-white/70 transition-colors"
            >
              Education
            </Link>

            <ChevronRight size={12} />

            <span className="text-white/70">{current}</span>
          </>
        ) : (
          <span className="text-white/70">Education</span>
        )}
      </div>
    </div>
  );
}
