import type { Field } from "./schema";

/**
 * Registry of editable content modules. Each has defaults (the content that
 * ships with the site), a field schema (drives the admin editor + validation)
 * and a permission. Add a module here → it gets an editor, validation, storage.
 */
export const DIRECTORY_URL = process.env.NEXT_PUBLIC_DIRECTORY_URL || "https://directory.nishkarshit.com";

const linkFields: Field[] = [
  { type: "text", name: "label", label: "Label", max: 80 },
  { type: "url", name: "href", label: "Link (URL, /path or #anchor)" },
  { type: "boolean", name: "visible", label: "Visible" },
];

/* ---------------------------------- HEADER --------------------------------- */
export interface HeaderContent {
  logo: string;
  logoAlt: string;
  items: {
    label: string;
    href: string;
    visible: boolean;
    openInNewTab: boolean;
    style: "link" | "button";
    autoChildren: "none" | "expertise" | "downloads";
    children: { label: string; href: string; visible: boolean }[];
  }[];
}

export const defaultHeader: HeaderContent = {
  logo: "https://nishkarshit.com/assets/niskashitlogo-DhjNDn8M.svg",
  logoAlt: "Nishkarsh IT Solution",
  items: [
    { label: "Home", href: "/", visible: true, openInNewTab: false, style: "link", autoChildren: "none", children: [] },
    { label: "Services", href: "/services", visible: true, openInNewTab: false, style: "link", autoChildren: "none", children: [] },
    { label: "Directory", href: DIRECTORY_URL, visible: true, openInNewTab: false, style: "link", autoChildren: "none", children: [] },
    {
      label: "Education", href: "/education", visible: true, openInNewTab: false, style: "link", autoChildren: "none",
      children: [
        { label: "Overview", href: "/education", visible: true },
        { label: "Internship", href: "/education#internship", visible: true },
        { label: "Admission", href: "/education#admission", visible: true },
        { label: "Our Partners", href: "/education#partners", visible: true },
        { label: "Events & Programs", href: "/education#events", visible: true },
      ],
    },
    {
      label: "Banking", href: "/banking/bank-csp", visible: true, openInNewTab: false, style: "link", autoChildren: "none",
      children: [
        { label: "Bank CSP", href: "/banking/bank-csp", visible: true },
        { label: "Loan", href: "/banking/loan", visible: true },
        { label: "CSP Hardware", href: "/banking/csp-hardware", visible: true },
      ],
    },
    { label: "Expertise", href: "/expertise", visible: true, openInNewTab: false, style: "link", autoChildren: "expertise", children: [] },
    { label: "Partnership", href: "/partnership", visible: true, openInNewTab: false, style: "link", autoChildren: "none", children: [] },
    { label: "Careers", href: "/careers", visible: true, openInNewTab: false, style: "link", autoChildren: "none", children: [] },
    { label: "Download", href: "/download", visible: true, openInNewTab: false, style: "link", autoChildren: "downloads", children: [] },
    {
      label: "Login / Sign Up", href: "/login", visible: true, openInNewTab: false, style: "button", autoChildren: "none",
      children: [
        { label: "Admin Login", href: "/admin/login", visible: true },
        { label: "Directory Login / Sign Up", href: DIRECTORY_URL, visible: true },
      ],
    },
  ],
};

export const headerFields: Field[] = [
  { type: "image", name: "logo", label: "Logo" },
  { type: "text", name: "logoAlt", label: "Logo alt text", max: 100 },
  {
    type: "list", name: "items", label: "Navigation items", itemTitle: "label", addLabel: "Add menu item", max: 20,
    help: "Order here = order in the menu. Use the dropdown list for sub-menus.",
    fields: [
      { type: "text", name: "label", label: "Label", max: 60 },
      { type: "url", name: "href", label: "Link (URL, /path or #anchor)" },
      { type: "boolean", name: "visible", label: "Visible" },
      { type: "boolean", name: "openInNewTab", label: "Open in new tab (use for external sites)" },
      { type: "select", name: "style", label: "Style", options: [{ value: "link", label: "Plain link" }, { value: "button", label: "Highlighted button (CTA)" }] },
      {
        type: "select", name: "autoChildren", label: "Automatic sub-menu",
        options: [{ value: "none", label: "None" }, { value: "expertise", label: "List all Expertise pages" }, { value: "downloads", label: "List all Download documents" }],
      },
      { type: "list", name: "children", label: "Dropdown items", itemTitle: "label", addLabel: "Add dropdown item", max: 30, fields: linkFields },
    ],
  },
];

/* ---------------------------------- FOOTER --------------------------------- */
export interface FooterContent {
  brandName: string;
  about: string;
  columns: { title: string; links: { label: string; href: string; visible: boolean }[] }[];
  contactTitle: string;
  contactLines: { text: string; href: string }[];
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  copyrightText: string;
  poweredBy: string;
}

export const defaultFooter: FooterContent = {
  brandName: "Nishkarsh IT Solution Pvt Limited",
  about:
    "Top Business Solutions Provider Company in India - NIS. We connect the best talent to the best businesses, dream teams to leaders, and change agents to visionaries. We take your growth to new heights with the next generation of technology.",
  columns: [
    {
      title: "ABOUT US",
      links: [
        { label: "OUR TEAM", href: "/management-team", visible: true },
        { label: "Privacy Policy", href: "/privacy-policy", visible: true },
        { label: "Refund Policy", href: "/refund-policy", visible: true },
        { label: "Teams & Conditions", href: "/terms-conditions/", visible: true },
        { label: "Blogs", href: "/blogs", visible: true },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Cloud Computing", href: "/cloud-computing", visible: true },
        { label: "IT Services", href: "/it-services", visible: true },
        { label: "Loans Services", href: "/banking/loan", visible: true },
        { label: "Finance Services", href: "/banking/bank-csp", visible: true },
      ],
    },
  ],
  contactTitle: "Contact Us",
  contactLines: [
    { text: "+91-9219572223", href: "tel:+919219572223" },
    { text: "info@nishkarshit.com", href: "mailto:info@nishkarshit.com" },
    { text: "nishkarshitsolution@gmail.com", href: "mailto:nishkarshitsolution@gmail.com" },
  ],
  facebook: "https://www.facebook.com/profile.php?id=61556237244104",
  instagram: "https://www.instagram.com/nishkarsh_it/",
  linkedin: "https://www.linkedin.com/company/nishkarsh-it-solution-private-limited",
  youtube: "",
  copyrightText: "All Rights Reserved | Powered by",
  poweredBy: "Nishkarsh IT Solution Pvt Limited",
};

export const footerFields: Field[] = [
  { type: "text", name: "brandName", label: "Company name (heading)", max: 120 },
  { type: "textarea", name: "about", label: "Company description", max: 800 },
  {
    type: "list", name: "columns", label: "Link columns", itemTitle: "title", addLabel: "Add column", max: 4,
    help: "The footer is designed for up to 2 link columns beside About and Contact; extra columns wrap to a new row.",
    fields: [
      { type: "text", name: "title", label: "Column title", max: 60 },
      { type: "list", name: "links", label: "Links", itemTitle: "label", addLabel: "Add link", max: 20, fields: linkFields },
    ],
  },
  { type: "text", name: "contactTitle", label: "Contact heading", max: 60 },
  {
    type: "list", name: "contactLines", label: "Contact lines (phone, email, address)", itemTitle: "text", addLabel: "Add line", max: 8,
    fields: [
      { type: "text", name: "text", label: "Text", max: 200 },
      { type: "url", name: "href", label: "Link (optional, e.g. tel:+91… or mailto:…)" },
    ],
  },
  { type: "url", name: "facebook", label: "Facebook URL" },
  { type: "url", name: "instagram", label: "Instagram URL" },
  { type: "url", name: "linkedin", label: "LinkedIn URL" },
  { type: "url", name: "youtube", label: "YouTube URL" },
  { type: "text", name: "copyrightText", label: "Copyright text (after the © year)", max: 200 },
  { type: "text", name: "poweredBy", label: "Powered-by name", max: 120 },
];

/* ---------------------------------- SETTINGS ------------------------------- */
export interface SettingsContent {
  siteName: string;
  siteUrl: string;
  directoryUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  defaultTwitterImage: string;
  googleVerification: string;
  bingVerification: string;
  orgPhone: string;
  orgEmail: string;
  orgAddress: string;
}

export const defaultSettings: SettingsContent = {
  siteName: "Nishkarsh IT Solution",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.nishkarshit.com",
  directoryUrl: DIRECTORY_URL,
  defaultTitle: "Nishkarsh IT Solution Pvt. Ltd. | Complete IT, Software & Digital Services",
  defaultDescription:
    "Nishkarsh IT Solution offers complete IT, software, digital marketing, and business services across banking, education, healthcare, retail, and pharma sectors.",
  defaultKeywords: "IT services, software development, digital marketing, banking CSP, education, Nishkarsh IT",
  defaultOgImage: "",
  defaultTwitterImage: "",
  googleVerification: "",
  bingVerification: "",
  orgPhone: "+91-9219572223",
  orgEmail: "info@nishkarshit.com",
  orgAddress: "",
};

export const settingsFields: Field[] = [
  { type: "text", name: "siteName", label: "Website name", max: 100 },
  { type: "url", name: "siteUrl", label: "Site URL (used for canonical URLs, sitemap)", help: "e.g. https://www.nishkarshit.com — no trailing slash" },
  { type: "url", name: "directoryUrl", label: "External Directory URL" },
  { type: "text", name: "defaultTitle", label: "Default meta title", max: 70 },
  { type: "textarea", name: "defaultDescription", label: "Default meta description", max: 300 },
  { type: "textarea", name: "defaultKeywords", label: "Default meta keywords (comma separated)", max: 400 },
  { type: "image", name: "defaultOgImage", label: "Default Open Graph image", noData: true },
  { type: "image", name: "defaultTwitterImage", label: "Default Twitter/X image", noData: true },
  { type: "text", name: "googleVerification", label: "Google Search Console verification code", max: 120 },
  { type: "text", name: "bingVerification", label: "Bing verification code", max: 120 },
  { type: "text", name: "orgPhone", label: "Organization phone (structured data)", max: 40 },
  { type: "email", name: "orgEmail", label: "Organization email (structured data)" },
  { type: "text", name: "orgAddress", label: "Organization address (structured data)", max: 300 },
];

/* --------------------------------- REGISTRY -------------------------------- */
export interface ModuleDef {
  key: string;
  title: string;
  description: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  permission: "content" | "settings";
  publicPath?: string;
}

export const CMS_MODULES: Record<string, ModuleDef> = {
  header: {
    key: "header", title: "Header & Navigation",
    description: "Logo, menu items, dropdowns, external links (including the Directory) and the highlighted CTA button.",
    fields: headerFields, defaults: defaultHeader as unknown as Record<string, unknown>, permission: "content", publicPath: "/",
  },
  footer: {
    key: "footer", title: "Footer",
    description: "Company description, link columns, contact details, social links and copyright text.",
    fields: footerFields, defaults: defaultFooter as unknown as Record<string, unknown>, permission: "content", publicPath: "/",
  },
  settings: {
    key: "settings", title: "Site Settings & Global SEO",
    description: "Site URL, default SEO values used when a page has none of its own, verification codes and organization details.",
    fields: settingsFields, defaults: defaultSettings as unknown as Record<string, unknown>, permission: "settings",
  },
};
