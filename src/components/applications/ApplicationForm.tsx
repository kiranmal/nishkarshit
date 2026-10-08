"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, CircleAlert } from "lucide-react";
import {
  APPLICATION_CONFIGS,
  emptyValues,
  type ApplicationKind,
  type FieldDef,
  type FormValues,
  type SectionDef,
} from "@/lib/applications/config";
import { validateField, validateSection, yearOptions } from "@/lib/applications/validate";
import { formatFieldValue } from "@/lib/applications/format";
import { submitApplicationAction } from "@/app/actions/applications";

type Errors = Record<string, Record<string, string>>; // sectionKey -> field -> message
type Touched = Record<string, Record<string, boolean>>;

const fieldBase =
  "w-full h-12 rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors";

function Stepper({ labels, current }: { labels: string[]; current: number }) {
  return (
    <ol aria-label="Application progress" className="flex items-start w-full mb-10">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`relative flex-1 flex flex-col items-center ${i < labels.length - 1 ? "" : ""}`}
          >
            {/* connector to the next step */}
            {i < labels.length - 1 && (
              <span
                aria-hidden
                className={`absolute top-5 left-1/2 w-full h-px ${done ? "bg-emerald-500" : "bg-gray-200"}`}
              />
            )}
            <span
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                    ? "bg-brand-navy text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {done ? <Check size={18} strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium ${
                active ? "text-brand-navy" : done ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  id,
  def,
  value,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  def: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const years = useMemo(() => (def.options === "years" ? yearOptions() : null), [def.options]);
  const opts = years ?? (Array.isArray(def.options) ? (def.options as readonly string[]) : []);
  const cls = `${fieldBase} ${error ? "border-red-400" : "border-gray-200"}`;
  const common = {
    id,
    name: def.name,
    value,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : def.hint ? `${id}-hint` : undefined,
  } as const;

  const autoComplete: Record<string, string> = {
    fullName: "name", dob: "bday", mobile: "tel-national", email: "email",
    address: "street-address", city: "address-level2", state: "address-level1", pincode: "postal-code",
  };

  return (
    <div className={def.full ? "md:col-span-2" : undefined}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-1.5">
        {def.label}
        {def.required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
      </label>

      {def.type === "select" ? (
        <div className="relative">
          <select
            {...common}
            onChange={(e) => onChange(e.target.value)}
            className={`${cls} appearance-none pr-10 ${value ? "" : "text-gray-400"}`}
          >
            <option value="" disabled>
              {def.placeholder || "Select"}
            </option>
            {opts.map((o) => (
              <option key={o} value={o} className="text-gray-900">
                {o}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      ) : def.type === "textarea" ? (
        <textarea
          {...common}
          rows={3}
          maxLength={def.maxLength}
          placeholder={def.placeholder}
          autoComplete={autoComplete[def.name]}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} h-auto py-3 resize-none`}
        />
      ) : (
        <input
          {...common}
          type={def.type}
          maxLength={def.maxLength}
          placeholder={def.placeholder}
          autoComplete={autoComplete[def.name]}
          inputMode={def.type === "tel" || def.validate === "pincode" || def.validate === "amount" || def.validate === "income" ? "numeric" : undefined}
          max={def.type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : def.hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-400">
          {def.hint}
        </p>
      ) : null}
    </div>
  );
}

function ReviewSection({
  section,
  values,
  onEdit,
}: {
  section: SectionDef;
  values: Record<string, string>;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-brand-navy">{section.reviewTitle}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-gray-300 text-brand-navy text-xs font-semibold px-4 py-1.5 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors"
        >
          Edit
        </button>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {section.fields.map((f) => (
          <div key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
            <dt className="text-xs text-gray-500 mb-0.5">{f.label}</dt>
            <dd className="text-sm font-medium text-gray-900 break-words whitespace-pre-line">
              {formatFieldValue(f, values[f.name])}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ApplicationForm({
  kind,
  initialProgram,
}: {
  kind: ApplicationKind;
  /** Pre-selects the course / loan type (e.g. from a course card link). */
  initialProgram?: string;
}) {
  const cfg = APPLICATION_CONFIGS[kind];
  const labels = [...cfg.sections.map((s) => s.stepLabel), "Review"];
  const reviewIndex = cfg.sections.length;

  const [values, setValues] = useState<FormValues>(() => {
    const v = emptyValues(cfg);
    const programField = cfg.sections.find((s) => s.key === "program")?.fields.find((f) => f.name === cfg.programFilterField);
    if (initialProgram && Array.isArray(programField?.options) && (programField!.options as readonly string[]).includes(initialProgram)) {
      v.program[cfg.programFilterField] = initialProgram;
    }
    return v;
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [returnToReview, setReturnToReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const section = cfg.sections[step]; // undefined on the review step

  function goTo(next: number) {
    setStep(next);
    setSubmitError(null);
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function setValue(sKey: SectionDef["key"], name: string, v: string) {
    setValues((prev) => ({ ...prev, [sKey]: { ...prev[sKey], [name]: v } }));
    // re-validate live once a field has been touched so the message clears as soon as it's fixed
    if (touched[sKey]?.[name]) {
      const def = cfg.sections.find((s) => s.key === sKey)!.fields.find((f) => f.name === name)!;
      const err = validateField(def, v);
      setErrors((prev) => {
        const next = { ...(prev[sKey] ?? {}) };
        if (err) next[name] = err;
        else delete next[name];
        return { ...prev, [sKey]: next };
      });
    }
  }

  function blurField(sKey: SectionDef["key"], def: FieldDef) {
    setTouched((p) => ({ ...p, [sKey]: { ...p[sKey], [def.name]: true } }));
    const err = validateField(def, values[sKey][def.name] ?? "");
    setErrors((prev) => {
      const next = { ...(prev[sKey] ?? {}) };
      if (err) next[def.name] = err;
      else delete next[def.name];
      return { ...prev, [sKey]: next };
    });
  }

  function validateStep(s: SectionDef): boolean {
    const errs = validateSection(s, values[s.key]);
    setErrors((p) => ({ ...p, [s.key]: errs }));
    setTouched((p) => ({ ...p, [s.key]: Object.fromEntries(s.fields.map((f) => [f.name, true])) }));
    const first = s.fields.find((f) => errs[f.name]);
    if (first) {
      const n = Object.keys(errs).length;
      const names = s.fields.filter((f) => errs[f.name]).map((f) => f.label.replace(/ \(₹\)/, ""));
      // Shown right above Back / Continue so it is never off-screen.
      setSubmitError(
        `Please fix ${n} field${n === 1 ? "" : "s"} before continuing: ${names.join(", ")}.`
      );
      requestAnimationFrame(() => {
        const el = document.getElementById(`${kind}-${s.key}-${first.name}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      });
      return false;
    }
    return true;
  }

  function handleContinue() {
    if (!section || !validateStep(section)) return;
    if (returnToReview) {
      setReturnToReview(false);
      goTo(reviewIndex);
    } else {
      goTo(step + 1);
    }
  }

  function handleBack() {
    if (returnToReview) {
      // abandon the edit but keep what was typed, return to the summary
      setReturnToReview(false);
      goTo(reviewIndex);
    } else if (step > 0) {
      goTo(step - 1);
    }
  }

  function handleEdit(index: number) {
    setReturnToReview(true);
    goTo(index);
  }

  function handleSubmit() {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const res = await submitApplicationAction(kind, values);
        if (res.success) {
          setReference(res.applicationNumber);
          requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
          return;
        }
        if (res.fieldErrors) {
          setErrors(res.fieldErrors);
          const firstKey = cfg.sections.findIndex((s) => res.fieldErrors![s.key]);
          if (firstKey >= 0) {
            setReturnToReview(true);
            goTo(firstKey);
          }
        }
        setSubmitError(res.error);
      } catch {
        setSubmitError("Could not reach the server. Check your connection and try again.");
      }
    });
  }

  async function copyReference() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the number is visible on screen anyway */
    }
  }

  return (
    <div
      ref={cardRef}
      className="scroll-mt-24 bg-white rounded-3xl border border-gray-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-6 sm:p-10 max-w-3xl mx-auto"
    >
      {reference ? (
        <div className="text-center py-6" role="status">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
            {cfg.successHeading}
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">{cfg.successBody}</p>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 max-w-sm mx-auto mb-8">
            <p className="text-xs text-gray-500 mb-1">Application reference number</p>
            <p className="text-xl font-bold text-brand-navy tracking-wide break-all">{reference}</p>
            <button
              type="button"
              onClick={copyReference}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-navy"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy number"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-8">Please keep this number for any follow-up with our team.</p>

          <Link
            href={cfg.breadcrumbHref}
            className="inline-flex items-center justify-center rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors"
          >
            Back to {cfg.breadcrumbLabel}
          </Link>
        </div>
      ) : (
        <>
          <Stepper labels={labels} current={step} />

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (step === reviewIndex) handleSubmit();
              else handleContinue();
            }}
          >
            {section ? (
              <>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-xl font-bold text-brand-navy pb-4 mb-6 border-b border-gray-200 outline-none"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {section.fields.map((f) => (
                    <Field
                      key={f.name}
                      id={`${kind}-${section.key}-${f.name}`}
                      def={f}
                      value={values[section.key][f.name] ?? ""}
                      error={errors[section.key]?.[f.name]}
                      onChange={(v) => setValue(section.key, f.name, v)}
                      onBlur={() => blurField(section.key, f)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-xl font-bold text-brand-navy pb-4 mb-6 border-b border-gray-200 outline-none"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Review
                </h2>
                <p className="text-sm text-gray-500 mb-6">Check your details before submitting.</p>
                <div className="space-y-4">
                  {cfg.sections.map((s, i) => (
                    <ReviewSection key={s.key} section={s} values={values[s.key]} onEdit={() => handleEdit(i)} />
                  ))}
                </div>
              </>
            )}

            {submitError && (
              <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 mt-10">
              {step > 0 || returnToReview ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 text-brand-navy text-sm font-semibold px-6 py-2.5 hover:border-brand-navy transition-colors disabled:opacity-60"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <span />
              )}

              {step === reviewIndex ? (
                <button
                  key="submit"
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors disabled:opacity-60"
                >
                  {pending ? "Submitting…" : cfg.submitLabel}
                </button>
              ) : (
                <button
                  key="continue"
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors"
                >
                  {returnToReview ? "Back to Review" : "Continue"} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
