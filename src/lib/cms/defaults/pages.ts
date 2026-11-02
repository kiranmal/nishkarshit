import type { PageDefault } from "../sections";
import { sec, sections } from "./helpers";
import { policyDefaults } from "./policies.generated";

const policy = (key: "privacy-policy" | "refund-policy" | "terms-conditions", label: string, order: number): PageDefault => {
  const p = policyDefaults[key];
  return {
    pageKey: key, kind: "footer-page", slug: key, label, title: p.title, path: `/${key}`, status: "published", order, heroImage: p.heroImage,
    sections: sections([sec({ sectionKey: "content", sectionType: "richText", variant: "rich-card", html: p.html })]),
  };
};

const cloud = (cat: string, items: [string, string, string][]) =>
  sec({ sectionKey: cat, sectionType: "cards", variant: "cards-cloud", title: cat, items: items.map(([title, description, icon]) => ({ title, description, icon })) });

export const footerPageDefaults: PageDefault[] = [
  policy("privacy-policy", "Privacy Policy", 0),
  policy("refund-policy", "Refund Policy", 1),
  policy("terms-conditions", "Terms & Conditions", 2),
  {
    pageKey: "cloud-computing", kind: "footer-page", slug: "cloud-computing", label: "Cloud Computing", title: "Powerful Server & Cloud Solutions", path: "/cloud-computing", status: "published", order: 3,
    sections: sections([
      cloud("Cloud & Dedicated Servers", [
        ["Windows Cloud Server", "Scale Smarter, Powered by Windows Confidence", "server"], ["Linux Cloud Server", "Fast, Flexible, and Reliable Linux Cloud Power", "cloud"],
        ["Windows Dedicated Server", "Dedicated Windows Servers for Maximum Efficiency", "monitor"], ["Linux Dedicated Server", "Maximize Performance with Linux Dedicated Servers", "harddrive"],
      ]),
      cloud("DevOps & Infrastructure", [
        ["CI/CD Pipeline", "Speed up delivery without compromising quality", "settings"], ["Infrastructure as Code", "Manage infra using code (Terraform, AWS CloudFormation)", "code"],
        ["Infrastructure Monitoring", "Track health and uptime with real-time monitoring", "activity"],
      ]),
      cloud("Cloud & Software Services", [
        ["AWS Compute", "Accelerate business growth with AWS DevOps", "cloud"], ["AWS Storage", "Reinvent your business model with scalable cloud adoption", "database"],
        ["Microsoft Office 365", "Affordable Pricing, Premium Productivity", "briefcase"], ["Microsoft Azure Cloud", "Seamless Cloud Management with Azure Services", "boxes"],
      ]),
      cloud("Security & Protection", [
        ["SSL Certificate", "Secure your website - In Just INR 999/year", "lock"], ["Sophos Endpoint", "Endpoint protection for systems & servers", "shield"],
        ["Application Security", "CI/CD-integrated DevSecOps security testing", "shield"],
      ]),
    ]),
  },
];
