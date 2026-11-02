"use client";

import { Fragment, useActionState, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Activity, Boxes, Briefcase, ChevronDown, Cloud, Code2, Cpu, Database, GraduationCap, HardDrive, HeartPulse, Lock, MessageCircle, Monitor, Scale, Server, Settings, ShieldCheck, type LucideIcon } from "lucide-react";
import type { CmsSectionDoc } from "@/lib/models";
import { optimizeImage } from "@/lib/img";
import { StatCounter, StaticStat } from "@/components/StatCounter";
import ApplicationForm from "@/components/applications/ApplicationForm";
import CspApplicationForm from "@/components/cms/CspApplicationForm";
import EmiCalculator from "@/components/banking/EmiCalculator";
import { submitBankEnquiryAction } from "@/app/actions/cms-forms";
import type { FormState } from "@/app/actions/forms";

/**
 * Renders the ordered sections of a CMS page. Layout/animation lives here; every word, image, link and the order
 * comes from the database (see lib/cms/sections.ts for the content model).
 */

type Item = Record<string, unknown>;
type Btn = CmsSectionDoc["buttons"][number];
const s = (v: unknown) => (typeof v === "string" ? v : "");
const visibleItems = (sec: CmsSectionDoc): Item[] => (sec.items ?? []).filter((i) => i.visible !== false);
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const POPPINS = { fontFamily: "var(--font-poppins)" } as const;

const COURSE_ICONS: Record<string, LucideIcon> = { cpu: Cpu, briefcase: Briefcase, scale: Scale, graduation: GraduationCap, health: HeartPulse, cloud: Cloud };
const CLOUD_ICONS: Record<string, LucideIcon> = { server: Server, cloud: Cloud, monitor: Monitor, harddrive: HardDrive, settings: Settings, code: Code2, activity: Activity, database: Database, briefcase: Briefcase, boxes: Boxes, lock: Lock, shield: ShieldCheck };

export interface FormCtx { open: boolean; course?: string; openForm: (course?: string) => void; closeForm: () => void }

/** A button/link coming from the CMS. */
export function CmsButton({ b, className, ctx, children }: { b: Btn; className: string; ctx?: FormCtx; children?: React.ReactNode }) {
  const label = children ?? b.label;
  if (b.action === "openForm" && ctx) return <button type="button" onClick={() => ctx.openForm()} className={className}>{label}</button>;
  const href = b.href || "#";
  if (b.newTab || /^https?:\/\//i.test(href)) return <a href={href} target={b.newTab ? "_blank" : undefined} rel="noopener noreferrer" className={className}>{label}</a>;
  if (href.startsWith("#")) return <a href={href} className={className}>{label}</a>;
  return <Link href={href} className={className}>{label}</Link>;
}

/* ------------------------------ stats band ------------------------------ */
export function StatsBand({ sec }: { sec: CmsSectionDoc }) {
  const items = visibleItems(sec);
  if (!items.length) return null;
  return (
    <section className="bg-[#0a1526] py-14 border-y border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {items.map((it, i) => {
          const n = Number(s(it.value));
          const color = s(it.color) || "#17b6e8";
          return /^\d+$/.test(s(it.value)) && Number.isFinite(n)
            ? <StatCounter key={i} value={n} suffix={s(it.suffix)} label={s(it.title)} color={color} />
            : <StaticStat key={i} text={s(it.value) + s(it.suffix)} label={s(it.title)} color={color} />;
        })}
      </div>
    </section>
  );
}

/* ------------------------------ text / list ----------------------------- */
function TextBlock({ sec }: { sec: CmsSectionDoc }) {
  const v = sec.variant;
  const ps = paras(sec.description);
  const bullets = sec.bullets.map((b) => b.text).filter(Boolean);
  if (v === "text-centered") return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-cyan" style={POPPINS}>{sec.title}</h2>
      {ps.map((p, i) => <p key={i} className="mt-2 text-white/60 max-w-xl mx-auto text-sm md:text-base">{p}</p>)}
    </div>
  );
  if (v === "text-amber") return (
    <section className="py-8 px-4 md:px-10">
      <div>
        <h2 className="text-3xl font-bold text-amber-500 mb-4">{sec.title}</h2>
        {ps.map((p, i) => <p key={i} className="text-white mb-4">{p}</p>)}
        {bullets.length > 0 && <ul className="space-y-2 text-white list-disc ml-5 mb-6">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
        {sec.note && <p className="text-sm text-white/70">{sec.note}</p>}
      </div>
    </section>
  );
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={POPPINS}>{sec.title}</h2>
      {ps.map((p, i) => <p key={i} className="text-white/60 max-w-2xl leading-relaxed mb-3">{p}</p>)}
      {bullets.length > 0 && <ul className="list-disc ml-5 text-white/70 space-y-1">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
      {sec.note && <p className="text-sm text-white/50 mt-3">{sec.note}</p>}
    </div>
  );
}

function ListBlock({ sec }: { sec: CmsSectionDoc }) {
  const items = sec.bullets.map((b) => b.text).filter(Boolean);
  const v = sec.variant;
  const head = (cls: string) => sec.title ? <h2 className={cls}>{sec.title}</h2> : null;
  if (v === "list-pills") return (
    <div id={sec.sectionKey}>
      {sec.title && <h3 className="text-xl font-bold text-white mb-6">{sec.title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((h, i) => <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80"><span className="w-2 h-2 rounded-full bg-brand-cyan shrink-0" />{h}</div>)}
      </div>
    </div>
  );
  if (v === "list-checklist") return (
    <div>
      {sec.title && <h3 className="text-xl font-bold text-white mb-4 text-center">{sec.title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 max-w-3xl mx-auto">
        {items.map((it, i) => <div key={i} className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-500 shrink-0" /><p className="text-white/80 text-sm md:text-base">{it}</p></div>)}
      </div>
    </div>
  );
  if (v === "list-check-red") return (
    <div>
      {head("text-3xl font-bold mb-6 text-amber-500")}
      <ul className="space-y-3 mb-6">{items.map((it, i) => <li key={i} className="flex items-start gap-2 text-white"><span className="text-red-500 font-bold">✓</span>{it}</li>)}</ul>
      {sec.note && <p className="text-white text-sm">{sec.note}</p>}
    </div>
  );
  if (v === "list-numbered") return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-4 md:px-10">
      <div className="md:w-3/5">
        {head("text-3xl font-bold text-center md:text-left text-amber-500 mb-10 mt-8")}
        {sec.description && <p className="text-white mb-6">{sec.description}</p>}
        <ul className="space-y-3 mb-6">{items.map((it, i) => <li key={i} className="flex items-start"><span className="text-purple-600 font-semibold mr-3">{i + 1}.</span><span className="text-white">{it}</span></li>)}</ul>
        {sec.note && <p className="text-sm text-white/70">{sec.note}</p>}
      </div>
    </div>
  );
  if (v === "list-numbered-card") return (
    <div className="max-w-4xl mx-auto mb-0">
      {head("text-2xl md:text-3xl font-bold text-white uppercase mb-6")}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <ol className="list-decimal list-inside space-y-3 text-white text-base md:text-lg">{items.map((it, i) => <li key={i}>{it}</li>)}</ol>
      </div>
    </div>
  );
  return (
    <div>
      {head("text-xl font-bold text-white mb-4")}
      {sec.description && <p className="text-white/70 mb-3">{sec.description}</p>}
      <ul className="list-disc ml-5 text-white/80 space-y-1">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      {sec.note && <p className="text-sm text-white/60 mt-3">{sec.note}</p>}
    </div>
  );
}

/* --------------------------------- cards -------------------------------- */
function CourseAccordion({ sec, ctx }: { sec: CmsSectionDoc; ctx?: FormCtx }) {
  const [open, setOpen] = useState<number | null>(null);
  const cta = sec.buttons[0];
  return (
    <div id={sec.sectionKey}>
      <h3 className="text-xl font-bold text-white mb-2">{sec.title}</h3>
      {sec.description && <p className="text-white/40 text-sm mb-6">{sec.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleItems(sec).map((c, i) => {
          const Icon = COURSE_ICONS[s(c.icon)] ?? GraduationCap;
          const isOpen = open === i;
          const tagList = (Array.isArray(c.tags) ? c.tags : []) as Item[];
          return (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-cyan/15 flex items-center justify-center shrink-0"><Icon size={20} className="text-brand-cyan" /></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-brand-cyan/80">{s(c.subtitle)}</span>
                      {s(c.badge) && <span className="text-[10px] font-bold uppercase bg-brand-cyan/15 text-brand-cyan px-2 py-0.5 rounded-full">{s(c.badge)}</span>}
                    </div>
                    <p className="font-bold text-white">{s(c.title)}</p>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-white/40 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-white/60 leading-relaxed mb-4">{s(c.description)}</p>
                      <div className="flex flex-wrap gap-2 mb-4">{tagList.map((t, k) => <span key={k} className="text-[11px] text-white/70 bg-white/10 rounded-full px-3 py-1">{s(t.label)}</span>)}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">{s(c.meta)}</span>
                        {cta && <button type="button" onClick={() => (ctx ? ctx.openForm(s(c.title)) : undefined)} className="inline-block rounded-full bg-brand-cyan text-[#050b16] text-xs font-bold px-5 py-2">{cta.label}</button>}
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
  );
}

const wrapLink = (href: string, node: React.ReactNode, key: number) => href ? <Fragment key={key}>{/^https?:/i.test(href) ? <a href={href} className="block">{node}</a> : <Link href={href} className="block">{node}</Link>}</Fragment> : <Fragment key={key}>{node}</Fragment>;

function CardsBlock({ sec, ctx }: { sec: CmsSectionDoc; ctx?: FormCtx }) {
  const v = sec.variant;
  const items = visibleItems(sec);
  if (v === "cards-accordion") return <CourseAccordion sec={sec} ctx={ctx} />;
  const T = (cls: string, tag: "h2" | "h3" = "h3") => sec.title ? (tag === "h2" ? <h2 className={cls}>{sec.title}</h2> : <h3 className={cls}>{sec.title}</h3>) : null;
  if (v === "cards-steps" || v === "cards-steps-labelled") return (
    <div>
      {T("text-xl font-bold text-white mb-6")}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div key={i} className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${v === "cards-steps-labelled" ? "hover:border-green-500/60 transition" : ""}`}>
            <div className="text-brand-cyan font-bold text-sm mb-2">{v === "cards-steps-labelled" ? `Step ${i + 1}` : String(i + 1).padStart(2, "0")}</div>
            <p className="font-bold text-white mb-1">{s(it.title)}</p>
            <p className="text-xs text-white/50">{s(it.description)}</p>
          </div>
        ))}
      </div>
    </div>
  );
  if (v === "cards-white") return (
    <div>
      {T("text-2xl md:text-3xl font-bold text-white mb-6", "h2")}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((it, i) => <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"><h3 className="text-lg font-semibold text-rose-600 mb-2">{s(it.title)}</h3><p className="text-sm text-gray-600 leading-relaxed">{s(it.description)}</p></div>)}
      </div>
    </div>
  );
  if (v === "cards-image") return (
    <div>
      <div className="text-center mb-10">{T("text-3xl md:text-4xl font-semibold text-rose-600", "h2")}</div>
      <div className="flex flex-wrap gap-6 justify-center">
        {items.map((it, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 w-full sm:w-[250px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async" src={optimizeImage(s(it.image))} alt={s(it.title)} className="h-40 w-full object-cover" />
            <div className="p-4"><h3 className="text-md font-semibold text-gray-800">{s(it.title)}</h3><p className="text-sm text-gray-500 mt-1">{s(it.description)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
  if (v === "cards-icon") return (
    <div id={sec.sectionKey} className="py-4">
      {T("text-3xl md:text-4xl font-bold text-center text-amber-500 mb-10", "h2")}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-blue-600 w-12 h-12 min-w-12 rounded-full flex items-center justify-center"><span className="text-white font-bold text-lg">{s(it.icon)}</span></div>
            <p className="text-lg font-medium text-gray-700">{s(it.title)}</p>
          </div>
        ))}
      </div>
    </div>
  );
  if (v === "cards-purple") return (
    <section className="py-8 px-4 md:px-10">
      {T("text-3xl font-bold text-amber-500 mb-6", "h2")}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it, i) => <div key={i} className="bg-purple-50 p-4 rounded-xl border border-purple-200"><h4 className="font-semibold text-gray-700 mb-1">{s(it.title)}</h4><p className="text-sm text-gray-600">{s(it.description)}</p></div>)}
      </div>
      {sec.note && <p className="text-sm text-white/70 mt-4">{sec.note}</p>}
    </section>
  );
  if (v === "cards-small") return (
    <div>
      {T("text-3xl font-bold mb-6 text-amber-500", "h2")}
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it, i) => <div key={i} className="bg-white rounded-xl p-4 border hover:shadow-lg transition"><h4 className="font-semibold text-gray-800">{s(it.title)}</h4><p className="text-sm text-gray-600 mt-1">{s(it.description)}</p></div>)}
      </div>
      {sec.note && <p className="mt-6 text-white text-sm">{sec.note}</p>}
    </div>
  );
  if (v === "cards-program") return (
    <div>
      {T("text-2xl font-bold text-white mb-2")}
      {sec.description && <p className="text-white/60 max-w-3xl mb-6">{sec.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand-cyan/60 transition"><p className="font-bold text-white mb-1">{s(it.title)}</p><p className="text-sm text-white/50">{s(it.description)}</p></div>)}
      </div>
    </div>
  );
  if (v === "cards-info") return (
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
      {items.map((it, i) => {
        const lines = ((Array.isArray(it.lines) ? it.lines : []) as Item[]).filter((l) => s(l.text) || s(l.label));
        const labelled = lines.some((l) => s(l.label));
        return (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-brand-cyan mb-3">{s(it.title)}</h3>
            {labelled
              ? lines.map((l, k) => <p key={k} className="text-sm text-white/70">{s(l.label) && <><span className="font-semibold text-white">{s(l.label)}</span>{" "}</>}{s(l.text)}</p>)
              : <ul className="list-disc list-inside text-sm text-white/70 space-y-1">{lines.map((l, k) => <li key={k}>{s(l.text)}</li>)}</ul>}
          </div>
        );
      })}
    </div>
  );
  if (v === "cards-loan") return (
    <section className="bg-[#f7f8fa] py-16" id={sec.sectionKey}>
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((it, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {s(it.icon) && <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-2xl mb-5">{s(it.icon)}</div>}
            <h3 className="text-lg font-bold text-brand-navy mb-2">{s(it.title)}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{s(it.description)}</p>
            {sec.buttons[0] && <Link href={s(it.link) || sec.buttons[0].href || "#"} className="inline-block rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors">{sec.buttons[0].label}</Link>}
          </div>
        ))}
      </div>
    </section>
  );
  if (v === "cards-cloud") return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-amber-100 border-pink-500">{sec.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => {
          const Icon = CLOUD_ICONS[s(it.icon).toLowerCase()] ?? Cloud;
          return wrapLink(s(it.link), (
            <div className="p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] transition-all duration-300 hover:-translate-y-1 h-full">
              <div className="flex items-center gap-3 mb-4"><Icon size={34} strokeWidth={2} className="text-blue-600 shrink-0" /><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s(it.title)}</h3></div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{s(it.description)}</p>
            </div>
          ), i);
        })}
      </div>
    </div>
  );
  // cards-feature (generic, works on any theme)
  return (
    <div>
      {T("text-xl font-bold text-white mb-2")}
      {sec.description && <p className="text-white/60 mb-6 max-w-3xl">{sec.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => wrapLink(s(it.link), (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 h-full">
            {s(it.image) && /* eslint-disable-next-line @next/next/no-img-element */ <img loading="lazy" decoding="async" src={optimizeImage(s(it.image))} alt={s(it.title)} className="w-full h-40 object-cover rounded-xl mb-3" />}
            <p className="font-bold text-white mb-1">{s(it.title)}</p><p className="text-sm text-white/60">{s(it.description)}</p>
          </div>
        ), i))}
      </div>
    </div>
  );
}

/* ------------------------- image / gallery / slider ----------------------- */
function ImageBlock({ sec }: { sec: CmsSectionDoc }) {
  if (!sec.image) return null;
  if (sec.variant === "image-plain") return (
    <div className="mb-12">{/* eslint-disable-next-line @next/next/no-img-element */}<img loading="lazy" decoding="async" src={optimizeImage(sec.image)} alt={sec.imageAlt} className="w-full rounded-2xl shadow-2xl object-cover" /></div>
  );
  return <div className="relative overflow-hidden rounded-3xl min-h-[260px] sm:min-h-[380px] md:min-h-[480px] flex items-center" role="img" aria-label={sec.imageAlt} style={{ backgroundImage: `url("${optimizeImage(sec.image, 1600)}")`, backgroundSize: "cover", backgroundPosition: "center" }} />;
}

function GalleryBlock({ sec }: { sec: CmsSectionDoc }) {
  const items = visibleItems(sec);
  return (
    <div className="mt-14 md:mt-20 first:mt-0">
      {sec.title && <div className="text-center mb-10"><h2 className="text-2xl md:text-3xl font-bold uppercase">{sec.title}</h2></div>}
      <div className="relative">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-5 scrollbar-hide">
          {items.map((o, i) => (
            <div key={i} className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[32%] snap-center overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src={optimizeImage(s(o.image))} alt={s(o.title)} className="w-full aspect-[4/3] object-cover" />
            </div>
          ))}
        </div>
        {sec.note && <p className="text-center text-gray-400 text-sm mt-2">{sec.note}</p>}
      </div>
    </div>
  );
}

function SliderBlock({ sec }: { sec: CmsSectionDoc }) {
  const items = visibleItems(sec);
  return (
    <div className="min-h-screen overflow-x-hidden -mx-6 md:-mx-16 bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-6 md:px-16 py-16 md:py-20">
      <div className="text-center mb-16"><h2 className="text-4xl sm:text-5xl font-bold text-amber-500 mb-4" style={POPPINS}>{sec.title}</h2></div>
      <Swiper modules={[Autoplay]} spaceBetween={24} slidesPerView={1.15} autoplay={{ delay: 2800, disableOnInteraction: false }} loop={items.length > 3} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}>
        {items.map((p, i) => (
          <SwiperSlide key={i}>
            <div className="rounded-2xl overflow-hidden bg-[#F8FAFC] shadow-lg h-full">
              <div className="h-56 overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img loading="lazy" decoding="async" src={optimizeImage(s(p.image))} alt={s(p.title)} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" /></div>
              <div className="p-6 text-left"><h3 className="text-xl font-bold text-[#062E49] mb-2">{s(p.title)}</h3><p className="text-sm text-[#062E49]/75 leading-relaxed">{s(p.subtitle)}</p></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function EventsBlock({ sec, ctx }: { sec: CmsSectionDoc; ctx?: FormCtx }) {
  const items = visibleItems(sec);
  const btn = sec.buttons[0];
  return (
    <div className="min-h-screen overflow-x-hidden -mx-6 md:-mx-16 bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-6 md:px-16 py-16 md:py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-amber-500 mb-4" style={POPPINS}>{sec.title}</h2>
        {sec.description && <p className="max-w-2xl mx-auto text-lg text-white/80">{sec.description}</p>}
      </div>
      <div className="space-y-20 max-w-6xl mx-auto">
        {items.map((event, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 60, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div className="rounded-3xl shadow-md bg-white overflow-hidden border border-gray-200" whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.18)" }} transition={{ duration: 0.3 }}>
              <div className={`flex flex-col lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <motion.div className="w-full lg:w-1/2 relative min-h-[300px] overflow-hidden">
                  <motion.img src={optimizeImage(s(event.image))} alt={s(event.title)} className="absolute inset-0 w-full h-full object-cover" loading="lazy" initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
                </motion.div>
                <motion.div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center" initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}>
                  <p className="text-sm text-blue-600 font-semibold uppercase mb-2">{s(event.meta)}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{s(event.title)}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{s(event.description)}</p>
                  {btn && <div>
                    {s(event.link)
                      ? <CmsButton b={{ ...btn, href: s(event.link), action: "link" }} className="px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition inline-block" />
                      : <button type="button" onClick={() => ctx?.openForm()} className="px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition inline-block">{btn.label}</button>}
                  </div>}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ cta / banner ------------------------------ */
function CtaBlock({ sec, ctx }: { sec: CmsSectionDoc; ctx?: FormCtx }) {
  const v = sec.variant;
  if (v === "cta-apply") {
    if (ctx?.open) return null;
    return (
      <div className="text-center mt-10">
        {sec.buttons.map((b, i) => <CmsButton key={i} b={b} ctx={ctx} className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 text-lg shadow-lg transition-all duration-300 hover:scale-105" />)}
        {sec.note && <p className="text-gray-400 text-sm mt-3">{sec.note}</p>}
      </div>
    );
  }
  if (v === "cta-cyan") return (
    <div className="flex flex-wrap justify-center gap-4">
      {sec.buttons.map((b, i) => i === 0
        ? <CmsButton key={i} b={b} ctx={ctx} className="rounded-full bg-brand-cyan text-[#050b16] text-sm font-bold px-7 py-3 hover:bg-white transition-colors" />
        : <CmsButton key={i} b={b} ctx={ctx} className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-7 py-3 transition-colors"><MessageCircle size={18} />{b.label}</CmsButton>)}
    </div>
  );
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      {sec.buttons.map((b, i) => <CmsButton key={i} b={b} ctx={ctx} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300" />)}
    </div>
  );
}

function BannerBlock({ sec }: { sec: CmsSectionDoc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
      <h3 className="text-xl md:text-2xl font-semibold mb-3 border-b border-white/10 pb-2 text-white">{sec.title} <span className="text-brand-cyan">{sec.subtitle}</span></h3>
      <div className="cms-rich cms-rich-dark text-white/60 mb-4 [&_strong]:text-white" dangerouslySetInnerHTML={{ __html: sec.html }} />
      <div className="flex flex-wrap gap-2">{sec.bullets.map((t, i) => <span key={i} className="bg-brand-cyan/15 text-brand-cyan text-xs px-3 py-1 rounded-full">{t.text}</span>)}</div>
    </div>
  );
}

/* ------------------------------- bank enquiry ----------------------------- */
const fieldCls = "w-full px-4 py-3 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
function BankEnquiryBlock({ sec }: { sec: CmsSectionDoc }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitBankEnquiryAction, null);
  return (
    <section className="bg-[#0f1624] text-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative min-h-[320px] lg:min-h-[450px] flex items-center">
            {sec.image && /* eslint-disable-next-line @next/next/no-img-element */ <img loading="lazy" decoding="async" src={optimizeImage(sec.image)} alt={sec.imageAlt} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-[#07152b]/90" />
            <div className="relative z-10 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-5">{sec.title}</h2>
              <p className="text-gray-300 leading-7 max-w-md">{sec.description}</p>
            </div>
          </div>
          <div className="bg-[#0f1624] p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{sec.subtitle}</h2>
            <p className="text-gray-400 mb-7">{sec.note}</p>
            {state?.success ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-4 text-emerald-300 text-sm">Thank you — your enquiry has been submitted. Our team will get back to you shortly.</div>
            ) : (
              <form action={action} className="space-y-5">
                <input required name="name" placeholder="Full Name" className={fieldCls} />
                <input required name="email" type="email" placeholder="Email Address" className={fieldCls} />
                <select name="bank" required defaultValue="" className="w-full px-4 py-3 rounded-lg bg-[#0f1624] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Select Bank</option>
                  {sec.bullets.map((b, i) => <option key={i} value={b.text} className="text-black">{b.text}</option>)}
                </select>
                <input required name="phone" type="tel" placeholder="Phone Number" className={fieldCls} />
                <input required name="address" placeholder="Address" className={fieldCls} />
                <textarea required name="comments" rows={4} placeholder="Message" className={`${fieldCls} resize-none`} />
                {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
                <button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition">{pending ? "Submitting…" : "Submit Enquiry"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- router -------------------------------- */
const BAND_TYPES = new Set(["applicationForm", "bankEnquiry", "emiCalculator"]);
const isBand = (x: CmsSectionDoc) => BAND_TYPES.has(x.sectionType) || x.variant === "cards-loan" || x.variant === "hero-navy";

function Block({ sec, theme, ctx }: { sec: CmsSectionDoc; theme: Theme; ctx?: FormCtx }) {
  switch (sec.sectionType) {
    case "text": return <TextBlock sec={sec} />;
    case "richText": return <RichBlock sec={sec} theme={theme} />;
    case "cards": return <CardsBlock sec={sec} ctx={ctx} />;
    case "list": return <ListBlock sec={sec} />;
    case "image": return <ImageBlock sec={sec} />;
    case "gallery": return <GalleryBlock sec={sec} />;
    case "slider": return <SliderBlock sec={sec} />;
    case "events": return <EventsBlock sec={sec} ctx={ctx} />;
    case "stats": return theme === "education" ? null : <StatsBand sec={sec} />;
    case "cta": return <CtaBlock sec={sec} ctx={ctx} />;
    case "banner": return <BannerBlock sec={sec} />;
    case "hero":
      if (sec.variant === "hero-navy") return (
        <section className="bg-[#0b1a33] text-white py-14 text-center">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={POPPINS}>{sec.title}</h1>
            {sec.description && <p className="text-white/60 mt-2">{sec.description}</p>}
          </div>
        </section>
      );
      return <div className="text-center mb-10"><h1 className="text-3xl md:text-5xl font-extrabold text-amber-400 uppercase tracking-wide">{sec.title}</h1>{sec.description && <p className="mt-3 text-gray-300">{sec.description}</p>}</div>;
    case "emiCalculator": return <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-16"><EmiCalculator /></section>;
    case "bankEnquiry": return <BankEnquiryBlock sec={sec} />;
    case "applicationForm":
      return <FormBlock sec={sec} ctx={ctx} theme={theme} />;
    default: return null;
  }
}

function RichBlock({ sec, theme }: { sec: CmsSectionDoc; theme: Theme }) {
  const dark = sec.variant === "rich-dark" || (theme !== "page" && sec.variant !== "rich-light" && sec.variant !== "rich-card");
  const cls = sec.variant === "rich-card" ? "mt-10 bg-white rounded-2xl shadow-2xl p-6 md:p-10 text-gray-800 leading-relaxed cms-rich max-w-none animate-fade-in" : dark ? "cms-rich cms-rich-dark" : "cms-rich text-gray-800";
  return (
    <div>
      {sec.title && <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>{sec.title}</h2>}
      <div className={cls} dangerouslySetInnerHTML={{ __html: sec.html }} />
    </div>
  );
}

function FormBlock({ sec, ctx, theme }: { sec: CmsSectionDoc; ctx?: FormCtx; theme: Theme }) {
  if (!ctx?.open) return null;
  const csp = sec.variant === "form-csp" || (sec.variant !== "form-admission" && theme === "banking");
  if (csp) return <CspApplicationForm eyebrow={sec.subtitle} title={sec.title} intro={sec.description} successText={sec.note} onClose={ctx.closeForm} />;
  return (
    <div id="admission-form" className="scroll-mt-40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-white" style={POPPINS}>{sec.title}</h3>
        <button type="button" onClick={ctx.closeForm} className="text-sm text-white/60 hover:text-white">Close ✕</button>
      </div>
      <ApplicationForm kind="admission" initialProgram={ctx.course} key={ctx.course ?? "none"} />
    </div>
  );
}

export type Theme = "education" | "banking" | "page";

/** Splits the list into render units: consecutive "half" sections share a 2-column grid. */
function group(list: CmsSectionDoc[]): CmsSectionDoc[][] {
  const out: CmsSectionDoc[][] = [];
  for (const sec of list) {
    const last = out[out.length - 1];
    if (sec.width === "half" && last && last[0].width === "half") last.push(sec);
    else out.push([sec]);
  }
  return out;
}

export function CmsSections({ sections, theme, ctx }: { sections: CmsSectionDoc[]; theme: Theme; ctx?: FormCtx }) {
  const list = sections.filter((x) => x.visible !== false);

  if (theme === "banking") {
    // Consecutive plain sections share one navy band (exactly like the original page); "band" sections bring their own background.
    const nodes: React.ReactNode[] = [];
    let flow: CmsSectionDoc[] = [];
    const flush = () => {
      if (!flow.length) return;
      const batch = flow; flow = [];
      nodes.push(
        <section key={`flow-${nodes.length}`} className="bg-[#0b1a33] text-white py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            {batch.map((x) => <div key={x.sectionKey} id={x.sectionKey}><Block sec={x} theme={theme} ctx={ctx} /></div>)}
          </div>
        </section>
      );
    };
    for (const sec of list) {
      if (isBand(sec)) { flush(); nodes.push(<Fragment key={sec.sectionKey}><Block sec={sec} theme={theme} ctx={ctx} /></Fragment>); }
      else flow.push(sec);
    }
    flush();
    return <>{nodes}</>;
  }

  return (
    <>
      {group(list).map((g) => g.length === 1
        ? <div key={g[0].sectionKey} id={g[0].variant === "cards-accordion" || g[0].variant === "list-pills" || g[0].variant === "cards-icon" ? undefined : g[0].sectionKey}><Block sec={g[0]} theme={theme} ctx={ctx} /></div>
        : <section key={g[0].sectionKey} className="py-8 px-4 lg:px-10 rounded-2xl"><div className="grid lg:grid-cols-2 gap-12">{g.map((x) => <Block key={x.sectionKey} sec={x} theme={theme} ctx={ctx} />)}</div></section>)}
    </>
  );
}
