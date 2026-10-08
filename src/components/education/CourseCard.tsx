import {
  Code2,
  Briefcase,
  Scale,
  GraduationCap,
  HeartPulse,
  Cloud,
  type LucideIcon,
} from "lucide-react";

import type { EducationCourse } from "@/data/educationFallback";

const iconMap: Record<EducationCourse["icon"], LucideIcon> = {
  code: Code2,
  briefcase: Briefcase,
  scale: Scale,
  graduation: GraduationCap,
  health: HeartPulse,
  cloud: Cloud,
};

const badgeColors: Record<string, string> = {
  "100% ONLINE": "#17b6e8",
  "GLOBAL DEGREE": "#a855f7",
  "PROJECT-DRIVEN": "#eab308",
  "BAR COUNCIL ALIGNED": "#22c55e",
  ACCREDITED: "#ec4899",
  "SELF-PACED": "#38bdf8",
};

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

interface CourseCardProps {
  course: EducationCourse;
  onApply?: (courseTitle: string) => void;
}

export default function CourseCard({ course, onApply }: CourseCardProps) {
  const Icon = iconMap[course.icon] ?? Code2;
  const badgeColor = badgeColors[course.badge] ?? "#17b6e8";

  const external = isExternal(course.ctaHref);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-colors">
      {/* Top */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `${badgeColor}22`,
            color: badgeColor,
          }}
        >
          <Icon size={22} strokeWidth={1.75} />
        </div>

        <span
          className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
          style={{
            background: `${badgeColor}22`,
            color: badgeColor,
          }}
        >
          {course.badge}
        </span>
      </div>

      {/* Category */}
      <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1">
        {course.category}
      </p>

      {/* Title */}
      <h3
        className="text-lg font-bold text-white mb-3"
        style={{
          fontFamily: "var(--font-poppins)",
        }}
      >
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/55 leading-relaxed mb-4">
        {course.detail}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {course.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[11px] text-white/70 bg-white/10 rounded-full px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs text-white/40">{course.duration}</span>

        {onApply ? (
          <button
            type="button"
            onClick={() => onApply(course.title)}
            className="inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: badgeColor }}
          >
            Apply Online →
          </button>
        ) : external ? (
          <a
            href={course.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: badgeColor }}
          >
            {course.ctaLabel} →
          </a>
        ) : (
          <a
            href={course.ctaHref}
            className="inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: badgeColor }}
          >
            {course.ctaLabel} →
          </a>
        )}
      </div>
    </div>
  );
}
