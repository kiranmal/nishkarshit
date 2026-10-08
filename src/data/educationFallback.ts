export type EducationCourse = {
  icon: "code" | "briefcase" | "scale" | "graduation" | "health" | "cloud";
  category: string;
  badge: string;
  title: string;
  detail: string;
  tags: string[];
  duration: string;
  ctaLabel: string;
  ctaHref: string;
};

export const educationCourses: EducationCourse[] = [
  { icon: "code", category: "ENGINEERING & TECH", badge: "100% ONLINE", title: "B.Tech / M.Tech",
    detail: "Engineering degrees in Computer Science, AI & ML, Cloud Computing, and Data Science.",
    tags: ["Live Virtual Labs", "AI & Cloud Specializations", "Industry Mentorship"],
    duration: "2 – 4 Years", ctaLabel: "Apply Online", ctaHref: "/education/admission" },
  { icon: "briefcase", category: "BUSINESS & MANAGEMENT", badge: "GLOBAL DEGREE", title: "MBA / PGDM",
    detail: "Management degrees with specializations in Marketing, Finance, HR & Analytics.",
    tags: ["Harvard Case Studies", "Executive Networking", "C-Suite Mentorship"],
    duration: "2 Years", ctaLabel: "Apply Online", ctaHref: "/education/admission" },
  { icon: "scale", category: "CORPORATE LAW & ETHICS", badge: "BAR COUNCIL ALIGNED", title: "LLB / Law Programs",
    detail: "Premier legal education online for careers in corporate compliance and cyber jurisprudence.",
    tags: ["Moot Court Simulators", "Corporate Compliance", "Cyber Law Focus"],
    duration: "3 – 5 Years", ctaLabel: "Apply Online", ctaHref: "/education/admission" },
];
