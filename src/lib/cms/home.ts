import type { Field } from "./schema";

/**
 * Homepage content model. One entry per homepage section: the editable fields (drives the admin editor +
 * validation) and the defaults (= what the site shipped with; imported into the database by the seed/sync).
 * Specialised React components keep their animation; every word, image, link, card and the order comes from here.
 */

const vis: Field = { type: "boolean", name: "visible", label: "Visible" };
const heading = (label = "Heading", def?: string): Field => ({ type: "text", name: "heading", label, max: 200, ...(def ? { placeholder: def } : {}) });
const description = (label = "Description / sub-heading", max = 1500): Field => ({ type: "textarea", name: "description", label, max });

/* ----------------------------- content shapes ---------------------------- */
export interface HeroSlide { image: string; title: string; subtitle: string; description: string; button1Label: string; button1Href: string; button2Label: string; button2Href: string; visible: boolean }
export interface HeroContent { slideSeconds: number; slides: HeroSlide[] }
export interface PillarCard { icon: string; color: string; title: string; description: string; visible: boolean }
export interface PeopleProcessContent { heading: string; description: string; cards: PillarCard[] }
export interface TurbochargeContent { heading: string; text: string }
export interface MissionContent { heading: string; text: string }
export interface IndustryItem { icon: string; title: string; description: string; link: string; visible: boolean }
export interface IndustriesContent { heading: string; description: string; items: IndustryItem[] }
export interface SolutionItem { title: string; description: string; image: string; link: string; visible: boolean }
export interface BusinessSolutionsContent { heading: string; description: string; items: SolutionItem[] }
export interface ServiceItem { title: string; description: string; visible: boolean }
export interface ServicesContent { eyebrow: string; heading: string; buttonLabel: string; buttonHref: string; items: ServiceItem[] }
export interface DifferentiatorContent { eyebrow: string; heading: string; description: string; items: ServiceItem[] }
export interface TestimonialItem { quote: string; name: string; role: string; image: string; visible: boolean }
export interface PublicWordsContent { heading: string; description: string; items: TestimonialItem[] }
export interface GalleryItem { image: string; alt: string; title: string; visible: boolean }
export interface GalleryContent { heading: string; items: GalleryItem[] }
export interface LocationCard { icon: string; title: string; text: string; visible: boolean }
export interface LocationContent { description: string; cards: LocationCard[] }
export interface EnquiryContent { chatTitle: string; chatText: string; whatsappLabel: string; whatsappHref: string; phoneLabel: string; phoneHref: string; formTitle: string; submitLabel: string; successText: string }

export interface HomeContentMap {
  hero: HeroContent; peopleProcess: PeopleProcessContent; turbocharge: TurbochargeContent; mission: MissionContent;
  industries: IndustriesContent; businessSolutions: BusinessSolutionsContent; services: ServicesContent;
  differentiator: DifferentiatorContent; publicWords: PublicWordsContent; gallery: GalleryContent;
  location: LocationContent; enquiry: EnquiryContent;
}
export type HomeKey = keyof HomeContentMap;

/* -------------------------------- defaults -------------------------------- */
const slide = (image: string): HeroSlide => ({ image, title: "", subtitle: "", description: "", button1Label: "", button1Href: "", button2Label: "", button2Href: "", visible: true });

export const HOME_DEFAULTS: HomeContentMap = {
  hero: {
    slideSeconds: 5,
    slides: [
      slide("https://nishkarshit.com/assets/Slide1-BBF71Zne.jpeg"),
      slide("https://nishkarshit.com/assets/Slide2-DkvPjqCE.jpeg"),
      slide("https://nishkarshit.com/assets/Slide3-DLaXhvIz.jpeg"),
    ],
  },
  peopleProcess: {
    heading: "", description: "",
    cards: [
      { icon: "👥", color: "#e11d8f", title: "PEOPLE", description: "We connect the best talent to the best businesses, dream teams to leaders, and change agents to visionaries. Explore more about our Award-Winning Recruitment, Professional Staffing and other leading services like Compliance.", visible: true },
      { icon: "⚙️", color: "#c026d3", title: "PROCESS", description: "Navigate everyday operational challenges at ease with our strategic, innovative and tech-powered Contact Center and Back Office (Domestic and International), Field Services Management and Background Verification services.", visible: true },
      { icon: "💠", color: "#7c3aed", title: "TECHNOLOGY", description: "Discover transformative technology solutions that drive your business to the next level. Our flexible and adaptable product and services suite includes AI, Automation and the likes, tailored to your business needs.", visible: true },
    ],
  },
  turbocharge: {
    heading: "Turbocharge Your Growth Potential",
    text: "The company's resource staff and members of the founding team have continuously offered dependable support services and consulting in the roles of executive, business partner, and consultant to a wide range of corporate houses. The company's core values are centred around establishing enduring business partnerships with its clients, of which target-oriented modern technology, dependability, ensured quality, and human relationships are the fundamental building blocks.",
  },
  mission: {
    heading: "Our Mission",
    text: "At Nishkarsh IT Solution Pvt. Ltd., our mission is to deliver innovative, scalable, and cost-effective IT and business solutions through collaborative teamwork, integrity, and a client‑centric approach. We empower organizations across Banking, Education, Information Technology, Business Solutions, Software Development, Cloud Services, Digital Marketing, Startup Support, Cyber Security, Fintech Services, B2b & B2c Solutions, Government Projects, Manpower, Insurance, Healthcare, Retail, Pharma, and beyond by integrating advanced AI applications, automation, and digital technologies to solve complex challenges and catalyze sustainable growth. By establishing enduring partnerships grounded in trust, quality, and transparency, we build future-ready ecosystems that uplift communities and elevate business performance nationwide.",
  },
  industries: {
    heading: "Major Industries We Service", description: "",
    items: [
      ["💻", "Information Technology"], ["🏦", "Banking & Finance"], ["🏥", "Healthcare"], ["🎓", "Education"],
      ["🏛️", "Government"], ["💊", "Pharma"], ["🛍️", "Retail"], ["📰", "Publishing"],
    ].map(([icon, title]) => ({ icon, title, description: "", link: "", visible: true })),
  },
  businessSolutions: {
    heading: "Bringing Transformation to Every Business", description: "",
    items: [
      { title: "Business Solutions", description: "End-to-end technology solutions built around how your business runs.", image: "https://nishkarshit.com/assets/business-ZsSXwq_Y.jpg", link: "", visible: true },
      { title: "Infrastructure", description: "Reliable IT infrastructure and cloud setup that scales with you.", image: "https://nishkarshit.com/assets/infra-CZsnXnNs.jpg", link: "", visible: true },
      { title: "Loans", description: "Fast, transparent loan facilitation for individuals and businesses.", image: "https://nishkarshit.com/assets/loans-YGZ8EeNz.jpg", link: "", visible: true },
      { title: "Manpower", description: "Skilled workforce solutions and staffing support across sectors.", image: "https://nishkarshit.com/assets/manpower-KZfVqRy-.jpg", link: "", visible: true },
    ],
  },
  services: {
    eyebrow: "What We Do", heading: "Our Services", buttonLabel: "View All Services", buttonHref: "/services",
    items: [
      ["Website Design & Development", "Responsive, fast, SEO-ready websites built for growth."], ["Digital Marketing", "SEO, social media, and performance campaigns that convert."],
      ["Software & Mobile Apps", "Custom software and cross-platform mobile applications."], ["CRM & ERP Development", "Streamline operations with tailored business systems."],
      ["E-commerce Solutions", "End-to-end online store design, build, and integration."], ["Manpower & Staffing", "Skilled resourcing across IT, banking, and retail sectors."],
      ["Banking & Fintech", "Loan facilitation, insurance, and financial technology services."], ["Healthcare & Pharma IT", "Digital systems built for healthcare and pharma operations."],
    ].map(([title, description]) => ({ title, description, visible: true })),
  },
  differentiator: {
    eyebrow: "What we done", heading: "We Are The Differentiator You Need", description: "",
    items: [
      { title: "End-to-end delivery", description: "From strategy to support, one team owns the outcome.", visible: true },
      { title: "Industry expertise", description: "Deep experience across IT, banking, healthcare and more.", visible: true },
      { title: "Transparent process", description: "Clear timelines, honest updates, no surprises.", visible: true },
    ],
  },
  publicWords: {
    heading: "Public Words For This NIS", description: "",
    items: [
      { quote: "Nishkarsh IT turned our idea into a working product in weeks, not months.", name: "Rohit Sharma", role: "Founder, Retail Startup", image: "/images/rohit.jpg", visible: true },
      { quote: "Reliable, responsive, and genuinely invested in our growth.", name: "Priya Verma", role: "Operations Head", image: "/images/priya.jpg", visible: true },
      { quote: "Their support team feels like an extension of ours.", name: "Amit Gupta", role: "Director, Healthcare Group", image: "/images/amit.jpg", visible: true },
      { quote: "From banking CSPs to our website — one trusted partner for everything.", name: "Sunita Rao", role: "Business Owner", image: "/images/sunita.jpg", visible: true },
    ],
  },
  gallery: {
    heading: "Our Gallery",
    items: ["Software-B9q3P1k-.jpg", "business-ZsSXwq_Y.jpg", "infra-CZsnXnNs.jpg", "loans-YGZ8EeNz.jpg", "manpower-KZfVqRy-.jpg", "Software-B9q3P1k-.jpg"].map((f, i) => ({ image: `https://nishkarshit.com/assets/${f}`, alt: `Gallery ${i + 1}`, title: "", visible: true })),
  },

location: {
  description: "",
  cards: [
    {
      icon: "📍",
      title: "Head Office",
      text: "Mahavir Colony, Varanasi, Uttar Pradesh 221010",
      visible: true,
    },
    {
      icon: "🏢",
      title: "Branch Office",
      text: "First Floor, B Block, Sector 2, Noida, Uttar Pradesh 201301, India",
      visible: true,
    },
    {
      icon: "✉️",
      title: "Email Us",
      text: "nishkarshitsolution@gmail.com\ninfo@nishkarshit.com",
      visible: true,
    },
    {
      icon: "📞",
      title: "Helpline No.",
      text: "+91-9219572223",
      visible: true,
    },
  ],
},

  enquiry: {
    chatTitle: "Chat With Our Team", chatText: "Our team are available to answer all your questions.",
    whatsappLabel: "Chat on WhatsApp", whatsappHref: "https://wa.me/919219572223", phoneLabel: "+91 9219572223", phoneHref: "tel:+919219572223",
    formTitle: "Create An Enquiry", submitLabel: "Submit Enquiry", successText: "Thanks — your enquiry has been submitted. We'll be in touch soon.",
  },
};

/* --------------------------------- schemas -------------------------------- */
const items = <T extends string>(name: string, label: string, itemTitle: T, addLabel: string, fields: Field[], max = 40): Field => ({ type: "list", name, label, itemTitle, addLabel, max, fields });

export const HOME_FIELDS: Record<HomeKey, Field[]> = {
  hero: [
    { type: "number", name: "slideSeconds", label: "Seconds per slide", min: 2, max: 30 },
    items("slides", "Slides", "title", "Add slide", [
      { type: "image", name: "image", label: "Background image" },
      { type: "text", name: "title", label: "Title (leave empty for an image-only slide)", max: 200 },
      { type: "text", name: "subtitle", label: "Subtitle", max: 300 },
      { type: "textarea", name: "description", label: "Description", max: 800 },
      { type: "text", name: "button1Label", label: "Button 1 label", max: 60 }, { type: "url", name: "button1Href", label: "Button 1 link" },
      { type: "text", name: "button2Label", label: "Button 2 label", max: 60 }, { type: "url", name: "button2Href", label: "Button 2 link" },
      vis,
    ], 20),
  ],
  peopleProcess: [heading("Heading (optional — shown above the cards)"), description("Intro text (optional)"),
    items("cards", "Cards", "title", "Add card", [{ type: "text", name: "icon", label: "Icon (emoji)", max: 10 }, { type: "text", name: "color", label: "Title colour (hex)", max: 20 }, { type: "text", name: "title", label: "Title", max: 80 }, { type: "textarea", name: "description", label: "Description", max: 800 }, vis], 9)],
  turbocharge: [heading("Heading"), { type: "textarea", name: "text", label: "Scroll-reveal paragraph", max: 3000 }],
  mission: [heading("Label (e.g. Our Mission)"), { type: "textarea", name: "text", label: "Mission text", max: 4000 }],
  industries: [heading(), description("Sub-heading (optional)"),
    items("items", "Industries", "title", "Add industry", [{ type: "text", name: "icon", label: "Icon (emoji)", max: 10 }, { type: "text", name: "title", label: "Name", max: 100 }, { type: "textarea", name: "description", label: "Description (optional, shown under the name)", max: 300 }, { type: "url", name: "link", label: "Link (optional)" }, vis])],
  businessSolutions: [heading(), description("Sub-heading (optional)"),
    items("items", "Slides / cards", "title", "Add card", [{ type: "text", name: "title", label: "Title", max: 120 }, { type: "textarea", name: "description", label: "Description", max: 500 }, { type: "image", name: "image", label: "Image" }, { type: "url", name: "link", label: "Link (optional)" }, vis])],
  services: [{ type: "text", name: "eyebrow", label: "Small heading above", max: 80 }, heading(), { type: "text", name: "buttonLabel", label: "Button label", max: 60 }, { type: "url", name: "buttonHref", label: "Button link" },
    items("items", "Service cards", "title", "Add service", [{ type: "text", name: "title", label: "Title", max: 120 }, { type: "textarea", name: "description", label: "Description", max: 400 }, vis])],
  differentiator: [{ type: "text", name: "eyebrow", label: "Small heading above", max: 80 }, heading(), description("Sub-heading (optional)"),
    items("items", "Cards", "title", "Add card", [{ type: "text", name: "title", label: "Title", max: 120 }, { type: "textarea", name: "description", label: "Description", max: 500 }, vis], 12)],
  publicWords: [heading(), description("Sub-heading (optional)"),
    items("items", "Testimonials", "name", "Add testimonial", [{ type: "textarea", name: "quote", label: "Message", max: 600 }, { type: "text", name: "name", label: "Name", max: 100 }, { type: "text", name: "role", label: "Designation / company", max: 150 }, { type: "image", name: "image", label: "Photo" }, vis])],
  gallery: [heading(),
    items("items", "Gallery images", "alt", "Add image", [{ type: "image", name: "image", label: "Image" }, { type: "text", name: "alt", label: "Alt text", max: 200 }, { type: "text", name: "title", label: "Title (optional)", max: 200 }, vis], 60)],
  location: [description("Intro text (optional)"),
    items("cards", "Location / contact cards", "title", "Add card", [{ type: "text", name: "icon", label: "Icon (emoji)", max: 10 }, { type: "text", name: "title", label: "Title", max: 80 }, { type: "textarea", name: "text", label: "Text (new line = line break)", max: 400 }, vis], 8)],
  enquiry: [
    { type: "text", name: "chatTitle", label: "Left panel heading", max: 100 }, { type: "textarea", name: "chatText", label: "Left panel text", max: 400 },
    { type: "text", name: "whatsappLabel", label: "WhatsApp button label", max: 60 }, { type: "url", name: "whatsappHref", label: "WhatsApp link" },
    { type: "text", name: "phoneLabel", label: "Phone button label", max: 60 }, { type: "url", name: "phoneHref", label: "Phone link (tel:…)" },
    { type: "text", name: "formTitle", label: "Form heading", max: 100 }, { type: "text", name: "submitLabel", label: "Submit button label", max: 60 }, { type: "textarea", name: "successText", label: "Thank-you message", max: 300 },
  ],
};

export const HOME_LABELS: Record<HomeKey, string> = {
  hero: "1. Hero Slider", peopleProcess: "2. People & Process", turbocharge: "3. Turbocharge (scroll text)", mission: "4. Mission (animated background)",
  industries: "5. Major Industries We Service", businessSolutions: "6. Business Solutions (auto slider)", services: "Services card grid",
  differentiator: "7. We Are The Differentiator", publicWords: "8. Public Words (testimonials)", gallery: "9. Our Gallery",
  location: "10. Where We're Located", enquiry: "11. Enquiry (chat + form)",
};
export const HOME_KEYS = Object.keys(HOME_LABELS) as HomeKey[];
