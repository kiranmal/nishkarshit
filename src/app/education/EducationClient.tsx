"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { CmsButton, CmsSections, StatsBand, type FormCtx } from "@/components/cms/CmsSections";
import type { CmsPageDoc } from "@/lib/models";

/**
 * Public Education page. Tabs, banners and every content block come from the database (cms_pages, kind "education-tab") —
 * nothing about the individual tabs is hardcoded here. Only layout + animation + the functional admission form live in code.
 */
export type EduTab = Pick<CmsPageDoc, "slug" | "label" | "hero" | "sections" | "spacing">;

export default function EducationClient({
  tabs,
  initialTab,
  initialCourse,
  initialShowForm = false,
}: {
  tabs: EduTab[];
  initialTab?: string;
  initialCourse?: string;
  initialShowForm?: boolean;
}) {
  const firstId = tabs[0]?.slug ?? "";
  const [active, setActive] = useState(tabs.some((t) => t.slug === initialTab) ? (initialTab as string) : firstId);
  const [showForm, setShowForm] = useState(initialShowForm);
  const [formCourse, setFormCourse] = useState<string | undefined>(initialCourse);

  const tab = tabs.find((t) => t.slug === active) ?? tabs[0];
  const hasForm = (t: EduTab) => t.sections.some((x) => x.visible !== false && x.sectionType === "applicationForm");

  function selectTab(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`); // keep refresh / share / back-forward on the same tab
  }
  function openForm(course?: string) {
    setFormCourse(course);
    setShowForm(true);
    // The form lives in whichever tab has an "application form" section (Admission by default).
    const target = tab && hasForm(tab) ? tab : tabs.find(hasForm);
    if (target) setActive(target.slug);
    requestAnimationFrame(() => document.getElementById("admission-form")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  const ctx: FormCtx = { open: showForm, course: formCourse, openForm, closeForm: () => setShowForm(false) };

  // Let nav links like /education#admission open the matching tab.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#", "");
      if (id === "student-admission") {
        const t = tabs.find(hasForm);
        if (t) { setActive(t.slug); setShowForm(true); }
      } else if (tabs.some((t) => t.slug === id)) setActive(id);
    };
    // Next.js <Link> uses history.pushState, which does NOT fire "hashchange" — wrap it so those clicks are noticed too.
    const origPush = window.history.pushState;
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args);
      window.dispatchEvent(new Event("edu-locationchange"));
      return r;
    };
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
  }, [tabs]);

  const hero = tab?.hero;
  const stats = (tab?.sections ?? []).filter((x) => x.visible !== false && x.sectionType === "stats");
  const rest = (tab?.sections ?? []).filter((x) => x.sectionType !== "stats");

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1 bg-[#050b16]">
        {/* Tabs */}
        <section className="border-b border-white/10 sticky top-[112px] sm:top-[128px] bg-[#050b16] z-30">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex gap-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.slug}
                onClick={() => selectTab(t.slug)}
                className={`relative py-4 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors ${active === t.slug ? "text-brand-cyan" : "text-white/40 hover:text-white/70"}`}
              >
                {t.label}
                {active === t.slug && <motion.div layoutId="edu-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-cyan" />}
              </button>
            ))}
          </div>
        </section>

        {/* Cosmic hero */}
        {hero?.enabled && (
          <section
            className="relative py-20  md:py-12 overflow-hidden"
            style={{
              backgroundColor: "#050b16",
              backgroundImage: "linear-gradient(rgba(0,160,227,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,227,0.06) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          >
            <div className="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
            <div className="relative max-w-[1440px] mx-auto px-6 md:px-16 text-center min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                  {hero.badge && <p className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-4">{hero.badge}</p>}
                  <h1 className="text-white text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight" style={{ fontFamily: "var(--font-poppins)" }}>{hero.title}</h1>
                  <div className="max-w-2xl mx-auto mt-5 space-y-3">
                    {hero.description.split(/\n\s*\n/).filter(Boolean).map((d, i) => <p key={i} className="text-white/60">{d}</p>)}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    {hero.buttons.map((b, i) => (
                      <CmsButton
                        key={i}
                        b={b}
                        ctx={ctx}
                        className={i === 0
                          ? "rounded-full bg-brand-cyan text-[#050b16] text-sm font-bold px-7 py-3 hover:bg-white transition-colors"
                          : "rounded-full border border-white/20 text-white text-sm font-semibold px-7 py-3 hover:bg-white/10 transition-colors"}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        )}

        {stats.map((x) => <StatsBand key={`${active}-${x.sectionKey}`} sec={x} />)}

        {/* Tab content */}
        <section className="max-w-[1440px] mx-auto md:px-16  min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
              <div className={tab?.spacing === "16" ? "space-y-16" : "space-y-14"}>
                <CmsSections sections={rest} theme="education" ctx={ctx} />
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
