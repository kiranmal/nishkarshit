import type { ApplicationConfig, FieldDef, FormValues, SectionDef, SectionValues } from "./config";

/**
 * Validation shared by the browser (blocks "Continue") and the server action
 * (never trusts the client). Pure functions only — no DOM or Node APIs.
 */

const NAME_RE = /^\p{L}[\p{L}\s.'-]{1,79}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeMobile(raw: string): string {
  let d = raw.replace(/[\s()-]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  d = d.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

export function yearOptions(): string[] {
  const now = new Date().getFullYear();
  const out: string[] = [];
  for (let y = now + 4; y >= 1990; y--) out.push(String(y));
  return out;
}

function ageOn(dob: Date, today: Date): number {
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function validateField(def: FieldDef, rawValue: string): string | undefined {
  const value = (rawValue ?? "").trim();

  if (!value) return def.required ? `${def.label.replace(/ \(₹\)/, "")} is required` : undefined;
  if (def.maxLength && value.length > def.maxLength && def.type !== "tel") {
    return `${def.label} is too long`;
  }

  if (def.type === "select") {
    const opts = def.options === "years" ? yearOptions() : def.options ?? [];
    if (!opts.includes(value)) return `Select a valid ${def.label.toLowerCase()}`;
  }

  switch (def.validate) {
    case "name":
      if (!NAME_RE.test(value)) return "Enter a valid name (letters only)";
      break;
    case "email":
      if (!EMAIL_RE.test(value) || value.length > 120) return "Enter a valid email address";
      break;
    case "mobile":
      if (!/^[6-9]\d{9}$/.test(normalizeMobile(value))) return "Enter a valid 10-digit mobile number";
      break;
    case "pincode":
      if (!/^[1-9]\d{5}$/.test(value)) return "Enter a valid 6-digit pincode";
      break;
    case "dob": {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date of birth";
      const [yy, mm, dd] = value.split("-").map(Number);
const d = new Date(yy, mm - 1, dd);
if (d.getFullYear() !== yy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
  return "Enter a valid date of birth";
}
      const today = new Date();
      if (d > today) return "Date of birth cannot be in the future";
      const age = ageOn(d, today);
      if (def.minAge !== undefined && age < def.minAge) return `Applicant must be at least ${def.minAge} years old`;
      if (def.maxAge !== undefined && age > def.maxAge) return "Enter a valid date of birth";
      break;
    }
    case "percentage": {
      const n = value.replace(/%$/, "").trim();
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(n)) return "Enter a number like 78.5 or 8.4";
      const v = Number(n);
      if (v <= 0 || v > 100) return "Percentage must be between 1 and 100 (CGPA up to 10)";
      break;
    }
    case "year": {
      const y = Number(value);
      if (!Number.isInteger(y) || y < 1990 || y > new Date().getFullYear() + 4) return "Select a valid year";
      break;
    }
    case "amount": {
      if (!/^\d+$/.test(value)) return "Enter the amount in numbers only";
      const v = Number(value);
      if (v < 10000) return "Minimum amount is ₹10,000";
      if (v > 50000000) return "Maximum amount is ₹5,00,00,000";
      break;
    }
    case "income":
      if (!/^\d+$/.test(value) || Number(value) <= 0) return "Enter monthly income in numbers only";
      if (Number(value) > 100000000) return "Enter a valid monthly income";
      break;
    case "address":
      if (value.length < 10) return "Enter your full address (at least 10 characters)";
      break;
    case "text":
      if (value.length < 2) return `Enter a valid ${def.label.toLowerCase()}`;
      break;
  }
  return undefined;
}

export type SectionErrors = Record<string, string>;

export function validateSection(section: SectionDef, values: SectionValues): SectionErrors {
  const errors: SectionErrors = {};
  for (const f of section.fields) {
    const err = validateField(f, values[f.name] ?? "");
    if (err) errors[f.name] = err;
  }
  return errors;
}

export function validateAll(cfg: ApplicationConfig, values: FormValues): Record<string, SectionErrors> {
  const out: Record<string, SectionErrors> = {};
  for (const s of cfg.sections) {
    const e = validateSection(s, values[s.key] ?? {});
    if (Object.keys(e).length) out[s.key] = e;
  }
  return out;
}

/** Trim + normalise values into the shape persisted in MongoDB. Unknown keys are dropped. */
export function cleanSection(section: SectionDef, values: SectionValues): SectionValues {
  const out: SectionValues = {};
  for (const f of section.fields) {
    let v = String(values[f.name] ?? "").trim();
    if (f.validate === "mobile") v = normalizeMobile(v);
    if (f.validate === "percentage") v = v.replace(/%$/, "").trim();
    if (f.validate === "email") v = v.toLowerCase();
    if (f.type !== "textarea") v = v.replace(/\s+/g, " ");
    if (v || f.required) out[f.name] = v;
  }
  return out;
}
