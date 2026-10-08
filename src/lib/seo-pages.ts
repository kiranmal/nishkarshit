import { expertiseItems } from "@/data/expertiseFallback";

/**
 * Every public page whose meta title / description / keywords the admin can
 * edit. `title` and `description` are the built-in defaults used until the
 * admin saves their own values (stored in the `seo_meta` collection).
 */
export interface SeoPageDef {
  slug: string;
  label: string;
  group: string;
  title: string;
  description: string;
}

const SITE = "Nishkarsh IT Solution";

const base: SeoPageDef[] = [
  { slug: "/", label: "Home", group: "Main", title: `${SITE} Pvt. Ltd. | Complete IT, Software & Digital Services`, description: "Nishkarsh IT Solution offers complete IT, software, digital marketing, and business services across banking, education, healthcare, retail, and pharma sectors." },
  { slug: "/services", label: "Services", group: "Main", title: `Services | ${SITE}`, description: "Explore IT, cloud, banking, healthcare, education, retail and pharma services from Nishkarsh IT Solution." },
  { slug: "/expertise", label: "Expertise", group: "Main", title: `Our Expertise | ${SITE}`, description: "The industries and technologies Nishkarsh IT Solution delivers expertise in." },
  { slug: "/partnership", label: "Partnership", group: "Main", title: `Partnership | ${SITE}`, description: "Partner with Nishkarsh IT Solution to collaborate on projects and grow together." },
  { slug: "/careers", label: "Careers", group: "Main", title: `Careers | ${SITE}`, description: "Current job openings at Nishkarsh IT Solution." },
  { slug: "/download", label: "Download", group: "Main", title: `Downloads | ${SITE}`, description: "Company proposals and documents from Nishkarsh IT Solution." },
  { slug: "/login", label: "Login / Sign Up", group: "Main", title: `Login | ${SITE}`, description: "Log in or sign up to your Nishkarsh IT account." },
  { slug: "/education", label: "Education", group: "Education", title: `Education | ${SITE}`, description: "UGC-approved online degree programs, certifications and internships with admission support." },
  { slug: "/education/admission", label: "Student Admission", group: "Education", title: `Student Admission | ${SITE}`, description: "Apply online for admission to our partner university programs in four simple steps." },
  { slug: "/banking/bank-csp", label: "Bank CSP", group: "Banking", title: `Bank CSP | ${SITE}`, description: "Become a Bank Customer Service Point (CSP) partner with Nishkarsh IT." },
  { slug: "/banking/loan", label: "Loan", group: "Banking", title: `Loan Solutions | ${SITE}`, description: "Flexible and transparent loan offers — housing, business, payday and car loans." },
  { slug: "/banking/loan/apply", label: "Loan Application", group: "Banking", title: `Apply for a Loan | ${SITE}`, description: "Apply online for a loan in four simple steps." },
  { slug: "/banking/csp-hardware", label: "CSP Hardware", group: "Banking", title: `CSP Hardware | ${SITE}`, description: "POS devices, biometric scanners, printers and counting machines for banking outlets." },
  { slug: "/management-team", label: "Management Team", group: "Main", title: `Our Team | ${SITE}`, description: "Meet the leadership, legal and management team behind Nishkarsh IT Solution." },
  { slug: "/blogs", label: "Blogs", group: "Main", title: `Blogs | ${SITE}`, description: "News, insights and updates from Nishkarsh IT Solution." },
  { slug: "/it-services", label: "IT Services", group: "Main", title: `IT Services | ${SITE}`, description: "Software development, web, mobile, cloud and IT consulting services from Nishkarsh IT Solution." },
  { slug: "/cloud-computing", label: "Cloud Computing", group: "Main", title: `Cloud Computing | ${SITE}`, description: "Cloud migration, hosting and managed cloud services from Nishkarsh IT Solution." },
  { slug: "/privacy-policy", label: "Privacy Policy", group: "Legal", title: `Privacy Policy | ${SITE}`, description: "How Nishkarsh IT Solution collects, uses and protects your information." },
  { slug: "/terms-conditions", label: "Terms & Conditions", group: "Legal", title: `Terms & Conditions | ${SITE}`, description: "Terms and conditions for using Nishkarsh IT Solution services." },
  { slug: "/refund-policy", label: "Refund Policy", group: "Legal", title: `Refund Policy | ${SITE}`, description: "Refund and cancellation policy of Nishkarsh IT Solution." },
];

const expertise: SeoPageDef[] = expertiseItems.map((e) => ({
  slug: `/expertise/${e.slug}`,
  label: e.title,
  group: "Expertise pages",
  title: `${e.title} | ${SITE}`,
  description: e.paragraph.slice(0, 155).trim(),
}));

export const SEO_PAGES: SeoPageDef[] = [...base, ...expertise];

export function getSeoDefault(slug: string): SeoPageDef | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}
