import type { ApplicationStatus } from "@/lib/models";

/**
 * Single source of truth for the multi-step application flows.
 *
 * Student Admission and Loan share the exact same structure
 * (Personal → Education/Loan → Details → Review), so one config drives the
 * public form, the server-side validation, the review screen and the admin
 * views. To change a field, option or label, edit it here once.
 */

export type ApplicationKind = "admission" | "loan";
export type SectionKey = "personal" | "program" | "additional";
export type FieldType = "text" | "tel" | "email" | "date" | "select" | "textarea";
export type ValidatorKey =
  | "name"
  | "dob"
  | "mobile"
  | "email"
  | "pincode"
  | "percentage"
  | "year"
  | "amount"
  | "income"
  | "address"
  | "text";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Static option list, or "years" for the year-of-passing list. */
  options?: readonly string[] | "years";
  required?: boolean;
  validate?: ValidatorKey;
  /** Span both columns on desktop. */
  full?: boolean;
  maxLength?: number;
  minAge?: number;
  maxAge?: number;
  hint?: string;
}

export interface SectionDef {
  key: SectionKey;
  /** Property name on the stored MongoDB document. */
  docKey: "personal" | "education" | "loan" | "additional";
  /** Label shown in the stepper. */
  stepLabel: string;
  /** Heading shown above the fields. */
  title: string;
  /** Heading shown on the review screen. */
  reviewTitle: string;
  fields: FieldDef[];
}

export interface ApplicationConfig {
  kind: ApplicationKind;
  collection: "admission_applications" | "loan_applications";
  counterPrefix: string; // application-number prefix, e.g. NIT-ADM
  adminPath: string;
  publicPath: string;
  adminTitle: string;
  singular: string; // "admission application"
  programFilterLabel: string; // admin filter label
  programFilterField: string; // field inside the program section used for the course/type filter
  pageTitle: string;
  pageSubtitle: string;
  breadcrumbHref: string;
  breadcrumbLabel: string;
  successHeading: string;
  successBody: string;
  submitLabel: string;
  sections: SectionDef[];
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};
export const STATUS_ORDER: ApplicationStatus[] = ["pending", "under_review", "accepted", "rejected"];

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

/** Same programs as the course cards on /education. */
export const COURSE_OPTIONS = [
  "B.Tech / M.Tech",
  "MBA / PGDM",
  "LLB / Law Programs",
  "BCA / MCA",
  "Health Sciences",
  "IT & Cloud Certifications",
] as const;

export const QUALIFICATION_OPTIONS = [
  "10th (Secondary)",
  "12th (Senior Secondary)",
  "Diploma",
  "Graduate",
  "Postgraduate",
] as const;

export const COURSE_TYPE_OPTIONS = ["Undergraduate", "Postgraduate", "Diploma", "Certification"] as const;

// The site lists a single physical office (Noida). Add more campuses here as they open.
export const CAMPUS_OPTIONS = ["Online (Remote)", "Noida, Uttar Pradesh"] as const;

export const LOAN_TYPE_OPTIONS = [
  "Housing Loan",
  "Business Loan Assistance",
  "Payday Loan",
  "Car Loan",
] as const;
export const TENURE_OPTIONS = [
  "6 months", "12 months", "24 months", "36 months", "60 months", "120 months", "240 months",
] as const;
export const EMPLOYMENT_OPTIONS = ["Salaried", "Self-Employed", "Business Owner", "Other"] as const;
export const BRANCH_OPTIONS = ["Noida, Uttar Pradesh", "Other (we will contact you)"] as const;

const personalFields = (minAge: number, maxAge: number, who: string): FieldDef[] => [
  { name: "fullName", label: who, type: "text", placeholder: "Enter full name", required: true, validate: "name", maxLength: 80 },
  { name: "dob", label: "Date of Birth", type: "date", required: true, validate: "dob", minAge, maxAge },
  { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS, placeholder: "Select gender", required: true },
  { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile number", required: true, validate: "mobile", maxLength: 14 },
  { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com", required: true, validate: "email", full: true, maxLength: 120 },
];

const addressFields = (): FieldDef[] => [
  { name: "address", label: "Address", type: "textarea", placeholder: "House no., street, area", required: true, validate: "address", full: true, maxLength: 250 },
  { name: "city", label: "City", type: "text", placeholder: "Enter city", required: true, validate: "text", maxLength: 60 },
  { name: "state", label: "State", type: "select", options: INDIAN_STATES, placeholder: "Select state", required: true },
  { name: "pincode", label: "Pincode", type: "text", placeholder: "6-digit pincode", required: true, validate: "pincode", maxLength: 6 },
];

const notesField = (): FieldDef => ({
  name: "notes", label: "Additional Information", type: "textarea",
  placeholder: "Anything else we should know (optional)", full: true, maxLength: 500,
});

export const APPLICATION_CONFIGS: Record<ApplicationKind, ApplicationConfig> = {
  admission: {
    kind: "admission",
    collection: "admission_applications",
    counterPrefix: "NIT-ADM",
    adminPath: "/admin/admissions",
    publicPath: "/education/admission",
    adminTitle: "Admission Applications",
    singular: "admission application",
    programFilterLabel: "Course",
    programFilterField: "course",
    pageTitle: "Student Admission",
    pageSubtitle: "Complete the application in four short steps.",
    breadcrumbHref: "/education",
    breadcrumbLabel: "Education",
    successHeading: "Application Submitted",
    successBody:
      "Thank you for applying. Our admissions counsellor will review your application and contact you on your mobile number shortly.",
    submitLabel: "Submit Admission",
    sections: [
      { key: "personal", docKey: "personal", stepLabel: "Personal", title: "Personal Information", reviewTitle: "Personal Information", fields: personalFields(14, 70, "Student Full Name") },
      {
        key: "program", docKey: "education", stepLabel: "Education", title: "Education", reviewTitle: "Education Information",
        fields: [
          { name: "course", label: "Course / Program", type: "select", options: COURSE_OPTIONS, placeholder: "Select course", required: true },
          { name: "qualification", label: "Highest Qualification", type: "select", options: QUALIFICATION_OPTIONS, placeholder: "Select qualification", required: true },
          { name: "board", label: "Board / University", type: "text", placeholder: "Enter board or university", required: true, validate: "text", maxLength: 100 },
          { name: "yearOfPassing", label: "Year of Passing", type: "select", options: "years", placeholder: "Select year", required: true, validate: "year" },
          { name: "percentage", label: "Percentage / CGPA", type: "text", placeholder: "Enter percentage or CGPA", required: true, validate: "percentage", maxLength: 6, hint: "e.g. 78.5 or 8.4" },
          { name: "courseType", label: "Course Type", type: "select", options: COURSE_TYPE_OPTIONS, placeholder: "Select course type", required: true },
          { name: "campus", label: "Preferred Campus / Location", type: "select", options: CAMPUS_OPTIONS, placeholder: "Select location", required: true, full: true },
        ],
      },
      {
        key: "additional", docKey: "additional", stepLabel: "Details", title: "Details", reviewTitle: "Additional Details",
        fields: [
          { name: "guardianName", label: "Parent / Guardian Name", type: "text", placeholder: "Enter parent or guardian name", required: true, validate: "name", maxLength: 80 },
          { name: "guardianMobile", label: "Parent / Guardian Mobile", type: "tel", placeholder: "10-digit mobile number", required: true, validate: "mobile", maxLength: 14 },
          ...addressFields(),
          notesField(),
        ],
      },
    ],
  },
  loan: {
    kind: "loan",
    collection: "loan_applications",
    counterPrefix: "NIT-LN",
    adminPath: "/admin/loans",
    publicPath: "/banking/loan/apply",
    adminTitle: "Loan Applications",
    singular: "loan application",
    programFilterLabel: "Loan type",
    programFilterField: "loanType",
    pageTitle: "Loan Application",
    pageSubtitle: "Complete the application in four short steps.",
    breadcrumbHref: "/banking/loan",
    breadcrumbLabel: "Loan",
    successHeading: "Application Submitted",
    successBody:
      "Thank you for applying. Our loan team will review your application and contact you on your mobile number shortly.",
    submitLabel: "Submit Application",
    sections: [
      { key: "personal", docKey: "personal", stepLabel: "Personal", title: "Personal Information", reviewTitle: "Personal Information", fields: personalFields(18, 70, "Applicant Full Name") },
      {
        key: "program", docKey: "loan", stepLabel: "Loan", title: "Loan", reviewTitle: "Loan Information",
        fields: [
          { name: "loanType", label: "Loan Type", type: "select", options: LOAN_TYPE_OPTIONS, placeholder: "Select loan type", required: true },
          { name: "amount", label: "Amount Required (₹)", type: "text", placeholder: "Enter amount in rupees", required: true, validate: "amount", maxLength: 12, hint: "Between ₹10,000 and ₹5,00,00,000" },
          { name: "tenure", label: "Preferred Tenure", type: "select", options: TENURE_OPTIONS, placeholder: "Select tenure", required: true },
          { name: "employmentType", label: "Employment Type", type: "select", options: EMPLOYMENT_OPTIONS, placeholder: "Select employment type", required: true },
          { name: "monthlyIncome", label: "Monthly Income (₹)", type: "text", placeholder: "Enter monthly income", required: true, validate: "income", maxLength: 10 },
          { name: "branch", label: "Preferred Branch / Location", type: "select", options: BRANCH_OPTIONS, placeholder: "Select location", required: true },
        ],
      },
      {
        key: "additional", docKey: "additional", stepLabel: "Details", title: "Details", reviewTitle: "Additional Details",
        fields: [
          { name: "guardianName", label: "Father / Spouse Name", type: "text", placeholder: "Enter father or spouse name", required: true, validate: "name", maxLength: 80 },
          { name: "guardianMobile", label: "Alternate Mobile", type: "tel", placeholder: "10-digit mobile number", required: true, validate: "mobile", maxLength: 14 },
          ...addressFields(),
          notesField(),
        ],
      },
    ],
  },
};

export function getConfig(kind: string): ApplicationConfig | null {
  return kind === "admission" || kind === "loan" ? APPLICATION_CONFIGS[kind] : null;
}

export function programSection(cfg: ApplicationConfig): SectionDef {
  return cfg.sections.find((s) => s.key === "program")!;
}

/** The option list used by the admin "course / loan type" filter. */
export function programFilterOptions(cfg: ApplicationConfig): readonly string[] {
  const f = programSection(cfg).fields.find((x) => x.name === cfg.programFilterField);
  return Array.isArray(f?.options) ? (f!.options as readonly string[]) : [];
}

export type SectionValues = Record<string, string>;
export type FormValues = Record<SectionKey, SectionValues>;

export function emptyValues(cfg: ApplicationConfig): FormValues {
  const out = {} as FormValues;
  for (const s of cfg.sections) {
    out[s.key] = Object.fromEntries(s.fields.map((f) => [f.name, ""]));
  }
  return out;
}
