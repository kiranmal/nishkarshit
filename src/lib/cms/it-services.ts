import { companies, projects, testimonials, workExperience } from "@/data/it-services";
import type { Field } from "./schema";
import { seoGroup } from "./seo-fields";

/** Content of the /it-services page (stored with the existing `site_content` module system under key "itServices"). */
export interface ITServicesContent {
  hero: { eyebrow: string; heading: string; tagline: string };
  experience: { heading: string; accent: string; intro: string; cards: { title: string; desc: string; thumbnail: string }[] };
  projects: { heading: string; accent: string; items: { title: string; des: string; img: string; link: string; icons: { image: string }[] }[] };
  clients: { heading: string; accent: string; testimonials: { quote: string; name: string; title: string }[]; companies: { name: string; img: string; nameImg: string }[] };
  seo?: Record<string, unknown>;
}

export const defaultITServices: ITServicesContent = {
  hero: { eyebrow: "Grow Your Business With Niskarsh", heading: "Niskarsh IT Solution\nTransforming Concepts into Seamless User Experiences", tagline: "The next generation Technology" },
  experience: {
    heading: "Our", accent: "Tech Stack",
    intro: "We Are Pioneers In Web, Mobile App, And Software Services. Our Experienced And Highly Skilled Professionals Are Always Ready To Tackle Challenges And Fulfill Customer Requirements",
    cards: workExperience.map((w) => ({ title: w.title, desc: w.desc, thumbnail: w.thumbnail })),
  },
  projects: { heading: "A small selection of", accent: "recent projects", items: projects.map((p) => ({ title: p.title, des: p.des, img: p.img, link: p.link, icons: p.iconLists.map((image) => ({ image })) })) },
  clients: { heading: "Kind words from", accent: "satisfied clients", testimonials: testimonials.map((t) => ({ quote: t.quote, name: t.name, title: t.title })), companies: companies.map((c) => ({ name: c.name, img: c.img, nameImg: c.nameImg })) },
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "", twitterDescription: "", twitterImage: "", noIndex: false, noFollow: false },
};

export const itServicesFields: Field[] = [
  { type: "group", name: "hero", label: "Hero", fields: [
    { type: "text", name: "eyebrow", label: "Small text above heading", max: 120 },
    { type: "textarea", name: "heading", label: "Main heading (new line = line break)", max: 300 },
    { type: "text", name: "tagline", label: "Tagline", max: 200 },
  ] },
  { type: "group", name: "experience", label: "Tech stack / services cards", fields: [
    { type: "text", name: "heading", label: "Heading", max: 100 }, { type: "text", name: "accent", label: "Heading (coloured part)", max: 100 },
    { type: "textarea", name: "intro", label: "Intro paragraph", max: 800 },
    { type: "list", name: "cards", label: "Cards", itemTitle: "title", addLabel: "Add card", max: 12, fields: [
      { type: "text", name: "title", label: "Title", max: 100 }, { type: "textarea", name: "desc", label: "Description", max: 800 }, { type: "image", name: "thumbnail", label: "Thumbnail" } ] },
  ] },
  { type: "group", name: "projects", label: "Recent projects", fields: [
    { type: "text", name: "heading", label: "Heading", max: 100 }, { type: "text", name: "accent", label: "Heading (coloured part)", max: 100 },
    { type: "list", name: "items", label: "Projects", itemTitle: "title", addLabel: "Add project", max: 20, fields: [
      { type: "text", name: "title", label: "Title", max: 150 }, { type: "textarea", name: "des", label: "Description", max: 500 }, { type: "image", name: "img", label: "Image" }, { type: "url", name: "link", label: "Link" },
      { type: "list", name: "icons", label: "Technology icons", itemTitle: "image", addLabel: "Add icon", max: 10, fields: [{ type: "image", name: "image", label: "Icon" }] } ] },
  ] },
  { type: "group", name: "clients", label: "Testimonials & client logos", fields: [
    { type: "text", name: "heading", label: "Heading", max: 100 }, { type: "text", name: "accent", label: "Heading (coloured part)", max: 100 },
    { type: "list", name: "testimonials", label: "Testimonials", itemTitle: "name", addLabel: "Add testimonial", max: 20, fields: [
      { type: "textarea", name: "quote", label: "Quote", max: 800 }, { type: "text", name: "name", label: "Name", max: 100 }, { type: "text", name: "title", label: "Designation", max: 150 } ] },
    { type: "list", name: "companies", label: "Client logos", itemTitle: "name", addLabel: "Add logo", max: 20, fields: [
      { type: "text", name: "name", label: "Name", max: 100 }, { type: "image", name: "img", label: "Logo icon" }, { type: "image", name: "nameImg", label: "Logo name image" } ] },
  ] },
  seoGroup,
];
