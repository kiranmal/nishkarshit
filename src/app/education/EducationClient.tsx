"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Scale,
  Cpu,
  HeartPulse,
  Cloud,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { StatCounter, StaticStat } from "@/components/StatCounter";
import ApplicationForm from "@/components/applications/ApplicationForm";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "internship", label: "Internship" },
  { id: "admission", label: "Admission" },
  { id: "partners", label: "Our Partners" },
  { id: "events", label: "Events & Programs" },
];

const courses = [
  {
    icon: Cpu,
    category: "ENGINEERING & TECH",
    badge: "100% ONLINE",
    title: "B.Tech / M.Tech",
    detail:
      "Engineering degrees in Computer Science, AI & ML, Cloud Computing, and Data Science — fully accredited with industry labs.",
    tags: [
      "Live Virtual Labs",
      "AI & Cloud Specializations",
      "Industry Mentorship",
    ],
    duration: "2 – 4 Years",
  },
  {
    icon: Briefcase,
    category: "BUSINESS & MANAGEMENT",
    badge: "GLOBAL DEGREE",
    title: "MBA / PGDM",
    detail:
      "India's highest-ROI management degrees from NMIMS, Manipal, and Amity. Specializations in Marketing, Finance, HR & Analytics.",
    tags: [
      "Harvard Case Studies",
      "Executive Networking",
      "C-Suite Mentorship",
    ],
    duration: "2 Years",
  },
  {
    icon: Scale,
    category: "CORPORATE LAW & ETHICS",
    badge: "BAR COUNCIL ALIGNED",
    title: "LLB / Law Programs",
    detail:
      "Pursue premier legal education online from OP Jindal and leading law schools for careers in corporate compliance and cyber jurisprudence.",
    tags: ["Moot Court Simulators", "Corporate Compliance", "Cyber Law Focus"],
    duration: "3 – 5 Years",
  },
  {
    icon: GraduationCap,
    category: "APPLIED COMPUTER SCIENCE",
    badge: "PROJECT-DRIVEN",
    title: "BCA / MCA",
    detail:
      "Computer applications degrees focused on programming, systems design and modern software development practices.",
    tags: ["Live Coding Labs", "Capstone Projects", "Placement Prep"],
    duration: "3 Years",
  },
  {
    icon: HeartPulse,
    category: "HEALTHCARE & PHARMA",
    badge: "ACCREDITED",
    title: "Health Sciences",
    detail:
      "Accredited healthcare and pharma programs built for clinical and allied-health careers, with hands-on lab components.",
    tags: ["Clinical Practicals", "Pharma Compliance", "Accredited Faculty"],
    duration: "2 – 4 Years",
  },
  {
    icon: Cloud,
    category: "SHORT-TERM UPSKILLING",
    badge: "SELF-PACED",
    title: "IT & Cloud Certifications",
    detail:
      "Short, self-paced certification tracks in cloud platforms, DevOps and cybersecurity — built to get you job-ready fast.",
    tags: ["Self-Paced", "Industry Certification", "No Prior Degree Needed"],
    duration: "1 – 6 Months",
  },
];

const journeySteps = [
  {
    title: "Explore Programs",
    desc: "Browse courses across our 30+ university partners.",
  },
  {
    title: "Apply Online",
    desc: "Submit your application digitally — no paperwork runaround.",
  },
  {
    title: "Get Counselled",
    desc: "A dedicated counsellor walks you through the right fit.",
  },
  {
    title: "Enroll & Learn",
    desc: "Start learning with full placement and internship support.",
  },
];

const highlights = [
  "Flexible & Accessible for All",
  "Affordable Fee Structures",
  "Flexible Duration & Batch Options",
  "Industry-Aligned Curriculum",
];

const internshipDeliverables = [
  "Real client projects, not busywork",
  "A dedicated mentor throughout",
  "A certificate + portfolio piece at the end",
  "Direct referral into our hiring pipeline",
];

const admissionSteps = [
  {
    title: "Apply Online",
    desc: "Fill out the digital application form in minutes.",
  },
  {
    title: "Document Verification",
    desc: "Upload documents — verified within 24-72 hours.",
  },
  {
    title: "Counselling Call",
    desc: "Get matched to the right program for your goals.",
  },
  {
    title: "Confirm & Enroll",
    desc: "Secure your seat and get your student portal access.",
  },
];

const upcomingEvents = [
  {
    title: "TechTalks 2025",
    date: "Aug 15, 2025",
    description:
      "Engage with engineers, product leaders, and CTOs discussing the latest in Web3, GenAI, and cloud infrastructure.",
    image:
      "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "AI Bootcamp",
    date: "Sep 5–10, 2025",
    description:
      "Intensive hands-on workshop on machine learning, LLMs, prompt engineering, and production-ready AI pipelines.",
    image:
      "https://images.unsplash.com/photo-1653412453468-3001356894e4?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Startup Showcase",
    date: "Oct 2, 2025",
    description:
      "Student-founded startups pitch to investors and alumni founders. Witness real innovation in action.",
    image:
      "https://images.unsplash.com/photo-1586764921336-8b37580c7aea?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Cybersecurity Week",
    date: "Nov 12–18, 2025",
    description:
      "From ethical hacking labs to CISO guest lectures — dive deep into securing tomorrow's digital world.",
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Career Connect Fair",
    date: "Dec 5, 2025",
    description:
      "Network with hiring managers from Google, Microsoft, TCS, and more. Resume reviews, mock interviews, and offers await.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=60",
  },
];
const admissionChecklist = [
  "Fill out the online application form",
  "Submit your academic documents",
  "Attend a short online interview",
  "Receive your confirmation email",
  "100% scholarship opportunity on the basis of skill",
];

const admissionPrograms = [
  {
    title: "Program Introduction",
    desc: "Discover our mission to foster talent and our commitment to student success.",
  },
  {
    title: "Courses Offered",
    desc: "Explore a diverse range of IT and management courses that fit your career goals.",
  },
  {
    title: "Admission Process",
    desc: "Understand our simplified admission journey. We guide you every step of the way.",
  },
  {
    title: "How to Apply",
    desc: "Get detailed instructions for a smooth application and start your journey today.",
  },
];

const admissionTags = [
  "Admission 2026",
  "Graduation courses",
  "Postgraduate",
  "IT Education",
  "B.Tech Admission",
  "M.Tech Admission",
];

const partner = [
  {
    name: "NMIMS",
    type: "Business & Management",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Manipal University",
    type: "Multi-disciplinary",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Amity University",
    type: "Multi-disciplinary",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "OP Jindal Global University",
    type: "Law & Corporate Compliance",
    image:
      "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "IGNOU",
    type: "Distance & Open Learning",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chandigarh University",
    type: "Engineering & Tech",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lovely Professional University",
    type: "Engineering & Tech",
    image:
      "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sikkim Manipal University",
    type: "IT & Cloud Certifications",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
];

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=9219572223&text&type=phone_number&app_absent=0";

type HeroButton =
  | { label: string; href: string; external?: boolean }
  | { label: string; action: "openForm" };

// The text above the tabs changes with the selected tab. Edit the copy here.
const heroByTab: Record<
  string,
  {
    badge?: string;
    title: string;
    desc: string[];
    image?: string;
    buttons: HeroButton[];
  }
> = {
  overview: {
    badge: "Empowering India's Youth Through IT",
    title: "Smart Education for a Smarter Future",
    desc: [
      "Nishkarsh IT Solution Pvt. Ltd. is an official enrollment partner for 30+ leading Indian universities, offering fully accredited online degree programs and skill certifications.",
    ],
    buttons: [
      { label: "Explore Programs", href: "#courses" },
      { label: "View Highlights", href: "#highlights" },
    ],
  },
  internship: {
    title: "Empowering India's Youth Through IT",
    desc: [
      "Welcome to the Complete IT Internship Program, presented by Nishkarsh IT Solution Pvt. Ltd. A golden opportunity for students, graduates, and freshers to kick-start their careers! Our internship program is specially designed for young minds who want to gain real-world experience, enhance their skills, and take confident steps toward a successful future.",
    ],
    image:
      "https://www.naukri.com/campus/career-guidance/wp-content/uploads/2023/10/internship-resume.jpg",
    buttons: [
      { label: "Apply Now →", action: "openForm" },
      { label: "WhatsApp Us", href: WHATSAPP_URL, external: true },
    ],
  },
  admission: {
    title: "Student Admission",
    desc: [
      "Begin your journey with UGC-approved online degree programs through our university partners.",
      "Apply digitally, get your documents verified, and talk to a dedicated counsellor who will help you pick the right program.",
    ],
    buttons: [
      { label: "Apply Now →", action: "openForm" },
      { label: "WhatsApp Us", href: WHATSAPP_URL, external: true },
    ],
  },
  partners: {
    title: "",
    desc: [],
    buttons: [],
  },
  events: {
    title: "",
    desc: [],
    buttons: [],
  },
};

export default function EducationClient({
  initialTab = "overview",
  initialCourse,
  initialShowForm = false,
}: {
  initialTab?: string;
  initialCourse?: string;
  initialShowForm?: boolean;
} = {}) {
  const [active, setActive] = useState(initialTab);
  const [openCourse, setOpenCourse] = useState<number | null>(null);
  // Student Admission form opens inside the Admission tab (no page change).
  const [showForm, setShowForm] = useState(initialShowForm);
  const [formCourse, setFormCourse] = useState<string | undefined>(
    initialCourse,
  );

  function selectTab(id: string) {
    setActive(id);
    // keep the URL in sync so refresh / share / back-forward land on the same tab
    window.history.replaceState(null, "", `#${id}`);
  }

  function openAdmissionForm(course?: string) {
    setFormCourse(course);
    setShowForm(true);
    setActive("admission");
    requestAnimationFrame(() =>
      document
        .getElementById("admission-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  // Let nav links like /education#admission open the matching tab.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#", "");
      if (id === "student-admission") {
        setActive("admission");
        setShowForm(true);
      } else if (tabs.some((t) => t.id === id)) setActive(id);
    };
    // Next.js <Link> uses history.pushState, which does NOT fire "hashchange".
    // Wrap pushState so those clicks are noticed too.
    const origPush = window.history.pushState;
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args);
      window.dispatchEvent(new Event("edu-locationchange"));
      return r;
    };
    // only apply the URL hash on load if there is one (don't override initialTab)
    if (window.location.hash) sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener("edu-locationchange", sync);
    return () => {
      window.history.pushState = origPush;
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("edu-locationchange", sync);
    };
  }, []);

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1 bg-[#050b16]">
        {/* Tabs */}
        <section className="border-b border-white/10 sticky top-[73px] bg-[#050b16] z-30">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`relative py-4 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors ${
                  active === tab.id
                    ? "text-brand-cyan"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
                {active === tab.id && (
                  <motion.div
                    layoutId="edu-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-cyan"
                  />
                )}
              </button>
            ))}
          </div>
        </section>
        {/* Cosmic hero */}
        {active !== "events" && active !== "partners" && (
          <section
            className="relative py-20  md:py-12 overflow-hidden"
            style={{
              backgroundColor: "#050b16",
              backgroundImage:
                "linear-gradient(rgba(0,160,227,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,227,0.06) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          >
            <div className="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px]" />

            <div className="relative max-w-[1440px] mx-auto px-6 md:px-16 text-center min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  {(() => {
                    const h = heroByTab[active] ?? heroByTab.overview;
                    return (
                      <>
                        <h1
                          className="text-white text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {h.title}
                        </h1>
                        <div className="max-w-2xl mx-auto mt-5 space-y-3">
                          {h.desc.map((d) => (
                            <p key={d} className="text-white/60">
                              {d}
                            </p>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                          {h.buttons.map((b, i) => {
                            const cls =
                              i === 0
                                ? "rounded-full bg-brand-cyan text-[#050b16] text-sm font-bold px-7 py-3 hover:bg-white transition-colors"
                                : "rounded-full border border-white/20 text-white text-sm font-semibold px-7 py-3 hover:bg-white/10 transition-colors";
                            if ("action" in b)
                              return (
                                <button
                                  key={b.label}
                                  type="button"
                                  onClick={() => openAdmissionForm()}
                                  className={cls}
                                >
                                  {b.label}
                                </button>
                              );
                            return b.external ? (
                              <a
                                key={b.label}
                                href={b.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cls}
                              >
                                {b.label}
                              </a>
                            ) : (
                              <Link key={b.label} href={b.href} className={cls}>
                                {b.label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Stats */}
        {active !== "events" && active !== "partners" && (
          <section className="bg-[#0a1526] py-14 border-y border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-10">
              <StatCounter
                value={30}
                suffix="+"
                label="University Partners"
                color="#17b6e8"
              />
              <StatCounter
                value={100}
                suffix="+"
                label="Programs Available"
                color="#22c55e"
              />
              <StatCounter
                value={100}
                suffix="%"
                label="Placement Assistance"
                color="#eab308"
              />
              <StaticStat text="UGC" label="Approved Degrees" color="#17b6e8" />
            </div>
          </section>
        )}

        {/* Tab content */}
        <section className="max-w-[1440px] mx-auto md:px-16  min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              {active === "overview" && (
                <div className="space-y-16">
                  <div>
                    <h2
                      className="text-2xl md:text-3xl font-bold text-white mb-4"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Education, Reimagined
                    </h2>
                    <p className="text-white/60 max-w-2xl leading-relaxed">
                      We partner with UGC-approved Indian universities to offer
                      fully accredited online degree programs and skill
                      certifications, giving learners flexible access to quality
                      higher education.
                    </p>
                  </div>

                  {/* Courses — clickable cards */}
                  <div id="courses">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Courses for Every Career Goal
                    </h3>
                    <p className="text-white/40 text-sm mb-6">
                      Tap a program to see what&apos;s inside.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {courses.map((c, i) => {
                        const Icon = c.icon;
                        const isOpen = openCourse === i;
                        return (
                          <div
                            key={c.title}
                            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenCourse(isOpen ? null : i)}
                              className="w-full flex items-center justify-between gap-4 p-5 text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-brand-cyan/15 flex items-center justify-center shrink-0">
                                  <Icon size={20} className="text-brand-cyan" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-brand-cyan/80">
                                      {c.category}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase bg-brand-cyan/15 text-brand-cyan px-2 py-0.5 rounded-full">
                                      {c.badge}
                                    </span>
                                  </div>
                                  <p className="font-bold text-white">
                                    {c.title}
                                  </p>
                                </div>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`text-white/40 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 pt-0">
                                    <p className="text-sm text-white/60 leading-relaxed mb-4">
                                      {c.detail}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {c.tags.map((t) => (
                                        <span
                                          key={t}
                                          className="text-[11px] text-white/70 bg-white/10 rounded-full px-3 py-1"
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-white/40">
                                        {c.duration}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openAdmissionForm(c.title)
                                        }
                                        className="inline-block rounded-full bg-brand-cyan text-[#050b16] text-xs font-bold px-5 py-2"
                                      >
                                        Apply Online →
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Simple 4-step journey */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">
                      Simple 4-Step Journey
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {journeySteps.map((s, i) => (
                        <div
                          key={s.title}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5"
                        >
                          <div className="text-brand-cyan font-bold text-sm mb-2">
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <p className="font-bold text-white mb-1">{s.title}</p>
                          <p className="text-xs text-white/50">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key program highlights */}
                  <div id="highlights">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Key Program Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80"
                        >
                          <span className="w-2 h-2 rounded-full bg-brand-cyan shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {active === "internship" && (
                <div className="space-y-14">
                  {/* Internship Hero - Image Without Gradient */}
                  <div
                    className="relative overflow-hidden rounded-3xl min-h-[480px] flex items-center"
                    style={{
                      backgroundImage: `url("${heroByTab.internship.image}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>

                  {/* Program Overview */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                      Program Overview: Learn, Build, and Get Placed!
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          title: "For Everyone",
                          desc: "Designed for students, freshers, and job seekers across PAN India.",
                        },
                        {
                          title: "Comprehensive Training",
                          desc: "Full training covering essential IT skills, from basics to advanced.",
                        },
                        {
                          title: "Hands-on Experience",
                          desc: "Engage in live projects to build a strong portfolio.",
                        },
                        {
                          title: "Certified & Get Placed",
                          desc: "Receive valuable certification along with placement assistance to help you move confidently toward your career.",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
                        >
                          <h3 className="text-lg font-semibold text-rose-600 mb-2">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section Heading */}
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-rose-600">
                      Our Top Courses
                    </h2>
                  </div>

                  {/* Course Cards */}
                  <div className="flex flex-wrap gap-6 justify-center">
                    {/* Course 1 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/web-development.jpg"
                        alt="Web Development"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Web Development
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Learn modern web development skills.
                        </p>
                      </div>
                    </div>

                    {/* Course 2 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/python.jpg"
                        alt="Programming with Python"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Programming with Python
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Master Python from basics to advanced concepts.
                        </p>
                      </div>
                    </div>

                    {/* Course 3 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/java.jpg"
                        alt="Java Programming"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Java Programming
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Build a strong foundation in Java programming.
                        </p>
                      </div>
                    </div>

                    {/* Course 4 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/data-science.jpg"
                        alt="Data Science"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Data Science
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Learn data analysis and practical data science.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section Heading */}
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-rose-600">
                      Placement Guarantee Courses
                    </h2>
                  </div>

                  {/* Course Cards */}
                  <div className="flex flex-wrap gap-6 justify-center">
                    {/* Course 1 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/web-development.jpg"
                        alt="Web Development"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Web Development
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Learn modern web development skills.
                        </p>
                      </div>
                    </div>

                    {/* Course 2 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/python.jpg"
                        alt="Programming with Python"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Programming with Python
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Master Python from basics to advanced concepts.
                        </p>
                      </div>
                    </div>

                    {/* Course 3 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/java.jpg"
                        alt="Java Programming"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Java Programming
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Build a strong foundation in Java programming.
                        </p>
                      </div>
                    </div>

                    {/* Course 4 */}
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden
                      transform hover:scale-105 transition duration-300
                      w-full sm:w-[250px]"
                    >
                      <img
                        src="/images/courses/data-science.jpg"
                        alt="Data Science"
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-800">
                          Data Science
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Learn data analysis and practical data science.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Program Highlights */}
                  <div id="internship-highlights" className="py-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-10">
                      Key Program Highlights
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {[
                        {
                          icon: "✓",
                          text: "100% Job Placement Assistance",
                        },
                        {
                          icon: "</>",
                          text: "Hands-on Training with Real Projects",
                        },
                        {
                          icon: "👥",
                          text: "Industry Expert Mentors",
                        },
                        {
                          icon: "◉",
                          text: "Live Workshops & Doubt Sessions",
                        },
                        {
                          icon: "★",
                          text: "Government & NGO-Supported Certification",
                        },
                        {
                          icon: "☑",
                          text: "Daily Task Sheets & Personalized Feedback",
                        },
                        {
                          icon: "▤",
                          text: "Resume Building & Interview Prep",
                        },
                        {
                          icon: "⌂",
                          text: "Flexible Online + Offline Modes",
                        },
                        {
                          icon: "♢",
                          text: "Scholarships for Needy Students",
                        },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                        >
                          <div className="bg-blue-600 w-12 h-12 min-w-12 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {item.icon}
                            </span>
                          </div>

                          <p className="text-lg font-medium text-gray-700">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Affordable & Accessible */}
                  <section className="py-8 px-4 md:px-10">
                    <div>
                      <h2 className="text-3xl font-bold text-amber-500 mb-4">
                        Affordable & Accessible for All
                      </h2>

                      <p className="text-white mb-4">
                        We believe quality IT education should be accessible to
                        everyone. Our program offers the lowest cost internship
                        fees in India.
                      </p>

                      <ul className="space-y-2 text-white list-disc ml-5 mb-6">
                        <li>Nominal Registration Fees</li>
                        <li>Discounts for Groups / College Tie-ups</li>
                        <li>
                          Special Offers for Women, SC/ST, and Rural Candidates
                        </li>
                      </ul>

                      <p className="text-sm text-white/70">
                        Thanks to the generous support from leading NGOs and CSR
                        initiatives, special subsidies are being offered to make
                        this program more affordable and accessible for
                        deserving candidates.
                      </p>
                    </div>
                  </section>

                  {/* Flexible Duration */}
                  <section className="py-8 px-4 md:px-10">
                    <h2 className="text-3xl font-bold text-amber-500 mb-6">
                      Flexible Duration & Batch Options
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Duration",
                          desc: "Choose from 1 to 3 months to suit your learning pace.",
                        },
                        {
                          title: "Modes",
                          desc: "Hybrid learning with Online + Offline (where available) options.",
                        },
                        {
                          title: "Batch Options",
                          desc: "Weekday (Mon–Fri), Weekend (Sat–Sun), or Evening Flexible Timing.",
                        },
                        {
                          title: "Location",
                          desc: "Accessible PAN India (Online) with physical centers in key locations.",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="bg-purple-50 p-4 rounded-xl border border-purple-200"
                        >
                          <h4 className="font-semibold text-gray-700 mb-1">
                            {item.title}
                          </h4>

                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-white/70 mt-4">
                      Our flexible structure allows you to balance your studies
                      with other commitments, making professional development
                      achievable.
                    </p>
                  </section>

                  {/* Specialized Workshops + Who Should Join */}
                  <section className="py-8 px-4 lg:px-10 rounded-2xl">
                    <div className="grid lg:grid-cols-2 gap-12">
                      <div>
                        <h2 className="text-3xl font-bold mb-6 text-amber-500">
                          Specialized Workshops for Career Growth
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            {
                              title: "Web Development Mastery",
                              desc: "From HTML basics to advanced hosting techniques.",
                            },
                            {
                              title: "App Development & Backend APIs",
                              desc: "Learn to build mobile apps and integrate with robust databases.",
                            },
                            {
                              title: "Deployment Strategies",
                              desc: "Master deploying applications on platforms like AWS and Firebase.",
                            },
                            {
                              title: "Interview & HR Readiness",
                              desc: "Prepare for success with resume building and mock interviews.",
                            },
                            {
                              title: "Freelancing & Startup Guidance",
                              desc: "Explore entrepreneurial pathways and independent work.",
                            },
                          ].map((item) => (
                            <div
                              key={item.title}
                              className="bg-white rounded-xl p-4 border hover:shadow-lg transition"
                            >
                              <h4 className="font-semibold text-gray-800">
                                {item.title}
                              </h4>

                              <p className="text-sm text-gray-600 mt-1">
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>

                        <p className="mt-6 text-white text-sm">
                          These workshops are designed to give you practical and
                          soft skills crucial for a thriving IT career.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold mb-6 text-amber-500">
                          Who Should Seize This Opportunity?
                        </h2>

                        <ul className="space-y-3 mb-6">
                          {[
                            "B.Tech / BCA / MCA / M.Sc IT Students",
                            "Diploma Holders",
                            "10th / 12th Pass Students Interested in IT",
                            "Working Professionals Looking to Upskill",
                            "Anyone with a strong desire to learn coding!",
                          ].map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-white"
                            >
                              <span className="text-red-500 font-bold">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <p className="text-white text-sm">
                          If you have a passion for coding and a desire to build
                          a career in IT, this program is for you. No prior
                          experience is required—just a keen interest and
                          willingness to learn!
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Internship Deliverables */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-4 md:px-10">
                    <div className="md:w-3/5">
                      <h2 className="text-3xl font-bold text-center md:text-left text-amber-500 mb-10 mt-8">
                        Your Internship Deliverables
                      </h2>

                      <p className="text-white mb-6">
                        Upon successful completion of your internship, you will
                        receive:
                      </p>

                      <ul className="space-y-3 mb-6">
                        {[
                          "Internship Offer Letter",
                          "Daily Assignments & Feedback",
                          "Final Project Code + Report",
                          "Internship Completion Certificate",
                          "Project Completion Certificate",
                          "Placement Letter (Post Internship)",
                        ].map((item, index) => (
                          <li key={item} className="flex items-start">
                            <span className="text-purple-600 font-semibold mr-3">
                              {index + 1}.
                            </span>

                            <span className="text-white">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="text-sm text-white/70">
                        These documents will significantly enhance your resume
                        and open doors to exciting career opportunities.
                      </p>
                    </div>
                  </div>

                  {/* Final Apply Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => openAdmissionForm()}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300"
                    >
                      Apply Now
                    </button>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300"
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              )}

              {active === "admission" && (
                <div className="space-y-14">
                  {/* Heading */}
                  <div className="text-center">
                    <h2
                      className="text-3xl md:text-4xl font-extrabold text-brand-cyan"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Admission Process
                    </h2>
                    <p className="mt-2 text-white/60 max-w-xl mx-auto text-sm md:text-base">
                      Start your journey with a simple, fully digital admission
                      process.
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 max-w-3xl mx-auto">
                    {admissionChecklist.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                        <p className="text-white/80 text-sm md:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Eligibility + Deadlines */}
                  <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 w-full max-w-sm">
                      <h3 className="text-lg font-bold text-brand-cyan mb-3">
                        Eligibility
                      </h3>
                      <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                        <li>10+2 or equivalent for undergraduate programs</li>
                        <li>Graduation required for postgraduate programs</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 w-full max-w-sm">
                      <h3 className="text-lg font-bold text-brand-cyan mb-3">
                        Deadlines
                      </h3>
                      <p className="text-sm text-white/70">
                        <span className="font-semibold text-white">
                          Early Bird:
                        </span>{" "}
                        April 30
                      </p>
                      <p className="text-sm text-white/70">
                        <span className="font-semibold text-white">
                          Regular:
                        </span>{" "}
                        June 30
                      </p>
                    </div>
                  </div>

                  {/* New Admission Program */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      New Admission Program
                    </h3>
                    <p className="text-white/60 max-w-3xl mb-6">
                      A comprehensive admission program covering all levels,
                      from graduation to Ph.D.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {admissionPrograms.map((p) => (
                        <div
                          key={p.title}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand-cyan/60 transition"
                        >
                          <p className="font-bold text-white mb-1">{p.title}</p>
                          <p className="text-sm text-white/50">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Streamlined steps (your existing admissionSteps) */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">
                      Streamlined Admission Process
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {admissionSteps.map((s, i) => (
                        <div
                          key={s.title}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-green-500/60 transition"
                        >
                          <div className="text-brand-cyan font-bold text-sm mb-2">
                            Step {i + 1}
                          </div>
                          <p className="font-bold text-white mb-1">{s.title}</p>
                          <p className="text-xs text-white/50">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Program banner + tags */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 border-b border-white/10 pb-2 text-white">
                      Admission Program –{" "}
                      <span className="text-brand-cyan">
                        Nishkarsh IT Solution Pvt. Ltd.
                      </span>
                    </h3>
                    <p className="text-white/60 mb-4">
                      Direct admission for{" "}
                      <strong className="text-white">
                        BCA, BBA, MBA, MCA, Ph.D.
                      </strong>{" "}
                      and more. Apply online with full career guidance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {admissionTags.map((t) => (
                        <span
                          key={t}
                          className="bg-brand-cyan/15 text-brand-cyan text-xs px-3 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA buttons: Student Admission + WhatsApp */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => openAdmissionForm()}
                      className="rounded-full bg-brand-cyan text-[#050b16] text-sm font-bold px-7 py-3 hover:bg-white transition-colors"
                    >
                      Student Admission →
                    </button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-7 py-3 transition-colors"
                    >
                      <MessageCircle size={18} />
                      Need Help with Admission? WhatsApp Us
                    </a>
                  </div>

                  {/* Application form (unchanged) */}
                  {showForm && (
                    <div id="admission-form" className="scroll-mt-40">
                      <div className="flex items-center justify-between mb-6">
                        <h3
                          className="text-xl md:text-2xl font-bold text-white"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          Student Admission
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="text-sm text-white/60 hover:text-white"
                        >
                          Close ✕
                        </button>
                      </div>
                      <ApplicationForm
                        kind="admission"
                        initialProgram={formCourse}
                        key={formCourse ?? "none"}
                      />
                    </div>
                  )}
                </div>
              )}
              {active === "partners" && (
                <div>
                  {/* Partners Slider */}
                  <div className="min-h-screen overflow-x-hidden -mx-6 md:-mx-16 bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-6 md:px-16 py-16 md:py-20">
                    <div className="text-center mb-16">
                      <h2
                        className="text-4xl sm:text-5xl font-bold text-amber-500 mb-4"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        University Partners
                      </h2>
                    </div>
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={24}
                      slidesPerView={1.15}
                      autoplay={{
                        delay: 2800,
                        disableOnInteraction: false,
                      }}
                      loop
                      breakpoints={{
                        640: {
                          slidesPerView: 2.2,
                        },
                        1024: {
                          slidesPerView: 3.2,
                        },
                      }}
                    >
                      {partner.map((partner) => (
                        <SwiperSlide key={partner.name}>
                          <div className="rounded-2xl overflow-hidden bg-[#F8FAFC] shadow-lg h-full">
                            <div className="h-56 overflow-hidden">
                              <img
                                src={partner.image}
                                alt={partner.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                              />
                            </div>

                            <div className="p-6 text-left">
                              <h3 className="text-xl font-bold text-[#062E49] mb-2">
                                {partner.name}
                              </h3>

                              <p className="text-sm text-[#062E49]/75 leading-relaxed">
                                {partner.type}
                              </p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}
              {active === "events" && (
                <div className="min-h-screen overflow-x-hidden -mx-6 md:-mx-16 bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-6 md:px-16 py-16 md:py-20">
                  {/* Events Heading */}
                  <div className="text-center mb-16">
                    <h2
                      className="text-4xl sm:text-5xl font-bold text-amber-500 mb-4"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Events &amp; Programs
                    </h2>

                    <p className="max-w-2xl mx-auto text-lg text-white/80">
                      Go beyond the curriculum. Join immersive experiences
                      designed to prepare you for the tech world — led by
                      experts, driven by innovation.
                    </p>
                  </div>

                  {/* Events */}
                  <div className="space-y-20 max-w-6xl mx-auto">
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event.title}
                        initial={{
                          opacity: 0,
                          y: 60,
                          scale: 0.96,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.25,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <motion.div
                          className="rounded-3xl shadow-md bg-white overflow-hidden border border-gray-200"
                          whileHover={{
                            y: -6,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                        >
                          <div
                            className={`flex flex-col lg:flex-row ${
                              index % 2 === 1 ? "lg:flex-row-reverse" : ""
                            }`}
                          >
                            {/* Image */}
                            <motion.div className="w-full lg:w-1/2 relative min-h-[300px] overflow-hidden">
                              <motion.img
                                src={event.image}
                                alt={event.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                                initial={{ scale: 1.12 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 1.2,
                                  ease: "easeOut",
                                }}
                              />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                              className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center"
                              initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? 30 : -30,
                              }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{
                                once: true,
                                amount: 0.3,
                              }}
                              transition={{
                                duration: 0.7,
                                delay: 0.2,
                                ease: "easeOut",
                              }}
                            >
                              <p className="text-sm text-blue-600 font-semibold uppercase mb-2">
                                {event.date}
                              </p>

                              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                {event.title}
                              </h3>

                              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                {event.description}
                              </p>

                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    openAdmissionForm();
                                  }}
                                  className="px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition inline-block"
                                >
                                  Explore Event
                                </button>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
