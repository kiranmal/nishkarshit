import type { ObjectId } from "@/lib/db";

/** A "Why Choose Us" highlight card on a business page. */
export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string; // emoji, kept simple — no icon library coupling in stored data
}

/** One row in a business's Services list (distinct from the site-wide ServiceSectionDoc). */
export interface BusinessServiceItem {
  title: string;
  description: string;
  image?: string;
}

/** One product a business sells, shown in its Products section. */
export interface ProductItem {
  _id?: ObjectId; // present once saved, lets admin edit/delete a specific product
  name: string;
  description: string;
  price?: number;
  oldPrice?: number; // shown struck-through as the discount reference
  mainImage?: string;
  additionalImages?: string[];
  order: number;
  published: boolean;
}

export interface BusinessHoursRow {
  day: string;
  time: string; // "9:00 AM – 7:00 PM" or "Closed"
}

export interface ReviewItem {
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

/**
 * A single business/listing in the Directory (nishkarshit.com/directory/ equivalent).
 * Deliberately organized to mirror the public listing page's own section order:
 * Basic Info → About → Why Choose Us → Services → Products → Gallery → Video →
 * Location → Business Hours → Reviews → Plan/Status → SEO.
 */
export interface DirectoryListing {
  _id?: ObjectId;

  // Basic Information
  name: string;
  slug: string;
  category: string;
  city: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  logoColor?: string; // fallback badge color when no logoUrl

  // About
  description: string;
  tagline?: string;

  // Why Choose Us
  whyChooseUs?: WhyChooseUsItem[];

  // Services (this business's own service list — separate from site-wide Services page)
  services?: BusinessServiceItem[];

  // Products
  products?: ProductItem[];

  // Gallery
  gallery?: string[]; // image URLs

  // Video
  videoUrl?: string;

  // Location
  latitude?: number;
  longitude?: number;
  mapUrl?: string;

  // Business Hours
  hours?: BusinessHoursRow[];

  // Reviews
  reviews?: ReviewItem[];
  rating?: number; // 1-5, average/display rating shown on cards

  // Plan & Status
  plan: "standard" | "featured" | "premium" | "supreme";
  status: "draft" | "published";

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  createdAt: Date;
  updatedAt: Date;
}

/** One alternating image/text block on the Services page. Mirrors servicesDetailed.ts. */
export interface ServiceSectionDoc {
  _id?: ObjectId;
  slug: string; // stable key, e.g. "it-services"
  order: number;
  label: string;
  heading: string;
  paragraph: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide: "left" | "right";
  imageUrl?: string;
  accent: string;
  status: "draft" | "published";
  updatedAt: Date;
}

/** A person on /management-team. */
export interface TeamMemberDoc {
  _id?: ObjectId;
  name: string;
  slug: string;
  role: string;
  image: string;
  description?: string;
  email?: string;
  linkedin?: string;
  section: "hod" | "legal" | "management" | "our-team";
  order: number;
  active: boolean;
  source?: "default" | "custom";
  createdAt: Date;
  updatedAt: Date;
}

/** SEO metadata for one route in the site, editable from /admin/seo. */
export interface SeoMetaDoc {
  _id?: ObjectId;
  pageSlug: string; // e.g. "/", "/services", "/directory"
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  updatedAt: Date;
}

/** Status values used by the multi-step Admission / Loan applications. */
export type ApplicationStatus = "pending" | "under_review" | "accepted" | "rejected";

/** Atomic counters (application numbers). */
export interface CounterDoc {
  _id: string;
  seq: number;
}

/** Lead workflow shared by every form in /admin/forms. */
export const LEAD_STATUSES = [
  "new",
  "read",
  "in_progress",
  "contacted",
  "approved",
  "rejected",
  "closed",
  "spam",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Fields added to every lead/application document by the Forms admin. */
export interface LeadMeta {
  crmStatus?: LeadStatus;
  adminNotes?: string;
  updatedAt?: Date;
}

/** Generic form submission (forms that have no dedicated collection). */
export interface FormSubmissionDoc extends LeadMeta {
  _id?: ObjectId;
  formType: string; // e.g. "expertise-enquiry"
  formLabel: string;
  name?: string;
  email?: string;
  phone?: string;
  data: Record<string, string>;
  sourceUrl?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

/** One editable content document (header, footer, …) — see lib/cms. */
export interface SiteContentDoc {
  _id: string; // module key, e.g. "header"
  data: Record<string, unknown>;
  updatedAt: Date;
  updatedBy?: string;
}

/** A file in the Media Library (stored on Cloudinary). */
export interface MediaDoc {
  _id?: ObjectId;
  url: string;
  publicId: string;
  filename: string;
  alt?: string;
  title?: string;
  mimeType: string;
  bytes: number;
  width?: number;
  height?: number;
  folder?: string;
  uploadedBy?: string;
  createdAt: Date;
}

/** Admin login account. Passwords are bcrypt hashes, never plaintext. */
export interface AdminUserDoc {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role?: "super_admin" | "admin" | "editor"; // missing = super_admin (legacy accounts)
  name?: string;
  createdAt: Date;
}

/** A general "contact us" style form submission. `source` says which form it came from. */
export interface EnquiryDoc {
  _id?: ObjectId;
  source: "home" | "directory-contact" | "services";
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  createdAt: Date;
  status: "new" | "read" | "responded";
}

/** A directory.nishkarshit.com blog/news post. */
export interface DirectoryBlogDoc {
  _id?: ObjectId;
  title: string;
  excerpt: string;
  coverColor: string;
  slug: string;
  publishedAt: Date;
  status: "draft" | "published";
}

/** A registered end-customer of the directory platform (separate from admin_users). */
export interface DirectoryCustomerDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  passwordHash: string;
  createdAt: Date;
}

/** A registered "client" account (distinct role from customer — see directory/client/login). */
export interface DirectoryClientDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/** One alternating detail page under /expertise/[slug]. Mirrors the real site's Expertise mega-menu. */
export interface ExpertiseItemDoc {
  _id?: ObjectId;
  slug: string;
  order: number;
  title: string;
  paragraph: string;
  accent: string;
  image?: string;
  introImage?: string;
  sections?: { title: string; description: string }[];
  formTitle?: string;
  formOptions?: string[];
  seo?: import("@/lib/cms/seo-fields").EntitySeo;
  source?: "default" | "custom"; // "default" = imported from code defaults by Sync
  status: "draft" | "published";
  updatedAt: Date;
}

/** A job opening shown on /careers. */
export interface JobPostingDoc {
  _id?: ObjectId;
  title: string;
  location: string;
  type: string; // e.g. "Full-time"
  postedAt: Date;
  description: string;
  status: "draft" | "published";
}

/** A submitted job application from /careers. */
export interface JobApplicationDoc {
  _id?: ObjectId;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  resumeNote?: string; // no file upload backend yet — free-text link/note
  createdAt: Date;
  status: "new" | "reviewed";
}

/** A submitted "Become a Partner" application from /partnership. */
export interface PartnerApplicationDoc {
  _id?: ObjectId;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessCategory: string;
  notes?: string;
  createdAt: Date;
  status: "new" | "reviewed";
}

/** A submitted Bank CSP application from /banking/bank-csp. */
export interface BankCspApplicationDoc {
  _id?: ObjectId;
  fullName: string;
  fatherOrSpouseName?: string;
  dob?: string;
  gender?: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
  status: "new" | "reviewed";
}

/** Controls which homepage sections show, and in what order — edited from /admin/homepage. */
export interface HomepageSectionConfigDoc {
  _id?: ObjectId;
  key: string; // stable key matching the section component, e.g. "peopleProcess"
  label: string; // human-readable name shown in the admin UI
  visible: boolean;
  order: number;
  heading?: string;
  description?: string;
  image?: string;
  buttonLabel?: string;
  buttonHref?: string;
  /** Structured, section-specific content (cards, slides, testimonials…) — shape defined in lib/cms/home.ts. */
  data?: Record<string, unknown>;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Generic CMS page engine (education tabs, banking pages, footer pages) */
/* ------------------------------------------------------------------ */

export type CmsPageKind = "education-tab" | "banking" | "footer-page";

/** One block of a page. `sectionType` + `variant` pick a renderer; everything else is plain content. */
export interface CmsSectionDoc {
  sectionKey: string; // stable id inside the page
  sectionType: string; // text | richText | cards | list | image | gallery | slider | events | stats | cta | banner | hero | applicationForm | …
  variant: string;
  width: "full" | "half";
  visible: boolean;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  html: string;
  note: string;
  image: string;
  imageAlt: string;
  items: Record<string, unknown>[];
  bullets: { text: string }[];
  buttons: { label: string; href: string; action: "link" | "openForm"; newTab: boolean }[];
}

/** A page of the generic engine: one document per page (education tab, CSP page, Privacy Policy …). */
export interface CmsPageDoc {
  _id?: ObjectId;
  pageKey: string; // unique, e.g. "education:overview", "bank-csp", "privacy-policy"
  kind: CmsPageKind;
  slug: string; // tab id / URL segment
  label: string; // tab label / admin label
  title: string; // <h1> / main heading
  path: string; // public URL
  status: "draft" | "published";
  order: number;
  spacing?: "14" | "16"; // vertical rhythm between sections of an education tab
  hero?: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string; // paragraphs separated by a blank line
    image: string;
    buttons: { label: string; href: string; action: "link" | "openForm"; newTab: boolean }[];
  };
  heroImage?: string; // footer-pages banner image
  sections: CmsSectionDoc[];
  seo?: import("@/lib/cms/seo-fields").EntitySeo;
  source: "default" | "custom";
  createdAt: Date;
  updatedAt: Date;
}

/** A post on the public /blogs page (NOT the directory blog). */
export interface BlogPostDoc {
  _id?: ObjectId;
  title: string;
  slug: string;
  author: string;
  tagline: string;
  bannerImage: string;
  content: string; // sanitized HTML
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  publishedAt: Date;
  previousSlugs?: string[];
  seo?: import("@/lib/cms/seo-fields").EntitySeo;
  source: "default" | "custom";
  createdAt: Date;
  updatedAt: Date;
}

export interface HardwareFormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea";
  required: boolean;
}

/** A product under /banking/csp-hardware/[slug]. */
export interface HardwareProductDoc {
  _id?: ObjectId;
  slug: string;
  name: string;
  description: string;
  image: string;
  images: string[]; // extra gallery images
  unitPrice: string;
  formFields: HardwareFormField[];
  terms: string;
  status: "draft" | "published";
  order: number;
  previousSlugs?: string[];
  seo?: import("@/lib/cms/seo-fields").EntitySeo;
  source: "default" | "custom";
  createdAt: Date;
  updatedAt: Date;
}

/** Bookkeeping: remembers which default datasets were imported so deleted defaults never come back. */
export interface CmsMetaDoc {
  _id: string; // e.g. "seeded:education"
  at: Date;
}

/** Site-wide festive/seasonal theme, toggled from /admin/theme. */
export interface SiteThemeDoc {
  _id?: ObjectId;
  key: "site-theme"; // singleton document
  enabled: boolean;
  presetName: string; // e.g. "Diwali", "Christmas", "Custom"
  primaryColor: string;
  accentColor: string;
  bannerText?: string;
  decoration?: "diyas" | "snow" | "confetti" | "none";
  updatedAt: Date;
}

/** A directory category shown on /directory/categories and used in filters. */
export interface DirectoryCategoryDoc {
  _id?: ObjectId;
  name: string;
  icon: string; // emoji
  order: number;
  status: "draft" | "published";
}

/** A festival/seasonal event — replaces the old singleton SiteThemeDoc with a real CMS. */
export interface FestivalDoc {
  _id?: ObjectId;
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  active: boolean; // manual on/off switch, independent of the date range
  bannerText?: string;
  background: string; // hex or css gradient
  primaryColor: string;
  accentColor: string;
  decoration: "diyas" | "snow" | "confetti" | "hearts" | "none";
  popupText?: string;
  popupImage?: string; // optional image shown in the one-time popup
  priority: number; // when multiple festivals are in range, highest priority wins
  createdAt: Date;
  updatedAt: Date;
}

export const COLLECTIONS = {
  directoryListings: "directory_listings",
  serviceSections: "service_sections",
  seoMeta: "seo_meta",
  adminUsers: "admin_users",
  enquiries: "enquiries",
  directoryBlogs: "directory_blogs",
  directoryCustomers: "directory_customers",
  directoryClients: "directory_clients",
  expertiseItems: "expertise_items",
  jobPostings: "job_postings",
  jobApplications: "job_applications",
  partnerApplications: "partner_applications",
  bankCspApplications: "bank_csp_applications",
  homepageSections: "homepage_sections",
  siteTheme: "site_theme",
  directoryCategories: "directory_categories",
  festivals: "festivals",
  admissionApplications: "admission_applications",
  loanApplications: "loan_applications",
  counters: "counters",
  formSubmissions: "form_submissions",
  siteContent: "site_content",
  media: "media",
  managementTeam: "management_team",
  cmsPages: "cms_pages",
  blogPosts: "blog_posts",
  hardwareProducts: "hardware_products",
  cmsMeta: "cms_meta",
} as const;
