import type {
  WhyChooseUsItem,
  BusinessServiceItem,
  BusinessHoursRow,
} from "@/lib/models";

export type FallbackListing = {
  slug: string;
  name: string;
  category: string;
  city: string;
  description: string;
  tagline?: string;
  logoColor: string;
  logoUrl?: string;
  plan: "standard" | "featured" | "premium" | "supreme";
  phone?: string;
  rating?: number;
  whyChooseUs?: WhyChooseUsItem[];
  services?: BusinessServiceItem[];
  hours?: BusinessHoursRow[];
  videoUrl?: string;
};

const defaultHours: BusinessHoursRow[] = [
  { day: "Monday", time: "9:00 AM – 7:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 7:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 7:00 PM" },
  { day: "Thursday", time: "9:00 AM – 7:00 PM" },
  { day: "Friday", time: "9:00 AM – 7:00 PM" },
  { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const defaultWhyChooseUs: WhyChooseUsItem[] = [
  { title: "Trusted Partnership", description: "Verified and reliable local business.", icon: "🤝" },
  { title: "Competitive Pricing", description: "Fair, transparent pricing on every order.", icon: "💰" },
  { title: "Reliable Service", description: "Consistent quality, every time.", icon: "⭐" },
];

function services(...titles: string[]): BusinessServiceItem[] {
  return titles.map((title) => ({ title, description: "", image: undefined }));
}

export const fallbackListings: FallbackListing[] = [
  // Premium
  {
    slug: "comvic-impex",
    name: "Comvic Impex",
    category: "Interior Decorator",
    city: "Noida",
    description:
      "COMVIC IMPEX is a leading supplier of premium interior and decorative solutions, committed to empowering commerce through digital connectivity.",
    tagline: "Elevate every space with quality, style, durability.",
    logoColor: "#0f172a",
    plan: "premium",
    phone: "9313626114",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Interior Design Consultation", "PVC Sheets & Louvers", "Wall Stickers", "Ceiling & Wooden Flooring"),
    hours: defaultHours,
  },
  // Featured
  {
    slug: "nirmal-trading-co",
    name: "Nirmal Trading Co.",
    category: "Multi Product Trading Company",
    city: "Noida",
    description:
      "Nirmal Trading Co. is a diversified multi-product trading house and wholesale supplier based in Noida, catering to retail...",
    tagline: "Soft White Imported Facial",
    logoColor: "#c026d3",
    plan: "featured",
    phone: "9313626114",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Wholesale Trading", "Tissue & Paper Products", "Bulk Supply", "Doorstep Delivery"),
    hours: defaultHours,
  },
  {
    slug: "bade-se-bada-photostate",
    name: "Bade Se Bada Photostate",
    category: "Digital Printing",
    city: "Noida",
    description:
      "Bade Se Bada Photostate is a specialized large-format reprographics and high-speed document printing center based in Noida, offering copy, print, scan, laminate, bind and stationery services.",
    tagline: "Bigger Documents, Better Service",
    logoColor: "#2563eb",
    plan: "featured",
    phone: "9717153045",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Large Format Printing", "Copy, Print & Scan", "Binding & Lamination", "Same-day Delivery"),
    hours: defaultHours,
  },
  {
    slug: "maha-laxmi-plywood",
    name: "Maha Laxmi Plywood",
    category: "Plywood Supplier",
    city: "Noida",
    description:
      "Maha Laxmi Plywood is a leading wholesale trader and distributor of premium architectural timber, surface decor, and interior fit-out materials.",
    tagline: "Stronger Spaces Brighter Future",
    logoColor: "#92400e",
    plan: "featured",
    phone: "7082068057",
    rating: 4,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Premium Plywood", "Decorative Laminates", "Flush Doors", "Wide Product Range"),
    hours: defaultHours,
  },
  {
    slug: "fauji-property-reality",
    name: "Fauji Property & Reality",
    category: "Real Estate & Property",
    city: "Greater Noida West",
    description:
      "Fauji Property & Reality is a premier, trust-backed real estate consultancy based in Noida, providing transparent and reliable property services.",
    tagline: "Your Trusted Property Partner",
    logoColor: "#166534",
    plan: "featured",
    phone: "9997100591",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Residential Sales", "Rental Assistance", "Property Consultation", "Site Visits"),
    hours: defaultHours,
  },
  // Supreme
  {
    slug: "sakshiomni-group",
    name: "Sakshiomni Group",
    category: "Loan agency",
    city: "Noida",
    description: "A trusted loan facilitation agency helping individuals and businesses access fast, reliable financing.",
    logoColor: "#1d4ed8",
    plan: "supreme",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Personal Loans", "Business Loans", "Loan Consultation"),
    hours: defaultHours,
  },
  {
    slug: "noida-property-house",
    name: "Noida Property House",
    category: "Real Estate & Property",
    city: "Noida",
    description: "Your trusted property partner for buying, selling and renting across Noida.",
    logoColor: "#b45309",
    plan: "supreme",
    rating: 4,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Buy & Sell", "Rentals", "Property Management"),
    hours: defaultHours,
  },
  {
    slug: "sky-fabrication",
    name: "Sky Fabrication",
    category: "Multi Product Trading Company",
    city: "Noida",
    description: "Aluminium & interior works — precision fabrication for residential and commercial spaces.",
    logoColor: "#0ea5e9",
    plan: "supreme",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Aluminium Fabrication", "Interior Fit-outs", "Custom Metalwork"),
    hours: defaultHours,
  },
  {
    slug: "sai-aashiyana",
    name: "Sai Aashiyana",
    category: "Real Estate & Property",
    city: "Noida",
    description: "Sale, purchase and renting — \"Quality is Remembered.\"",
    logoColor: "#b91c1c",
    plan: "supreme",
    rating: 5,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Sale & Purchase", "Renting", "Property Advisory"),
    hours: defaultHours,
  },
  // Standard
  {
    slug: "lakhani-publishers-stationers",
    name: "Lakhani Publishers & Stationers",
    category: "Printing & Publishing",
    city: "Meerut",
    description: "Publishing, printing and stationery supply since 1977.",
    logoColor: "#7f1d1d",
    plan: "standard",
    rating: 4,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Publishing", "Printing", "Stationery Supply"),
    hours: defaultHours,
  },
  {
    slug: "united-office-systems",
    name: "United Office Systems",
    category: "Office Supplies",
    city: "Kanpur",
    description: "India's trusted office and stationery systems dealer.",
    logoColor: "#1e3a8a",
    plan: "standard",
    rating: 4,
    whyChooseUs: defaultWhyChooseUs,
    services: services("Office Supplies", "Stationery Systems", "Corporate Orders"),
    hours: defaultHours,
  },
];

export const fallbackCategories: { name: string; icon: string }[] = [
  { name: "Exporter", icon: "🏢" },
  { name: "Plywood Supplier", icon: "🏢" },
  { name: "Manufacturer & Fabricator", icon: "🏢" },
  { name: "FMCG Manufacturer", icon: "🏢" },
  { name: "Real Estate & Property", icon: "🏢" },
  { name: "Digital Printing", icon: "🏢" },
  { name: "Loan agency", icon: "🏢" },
  { name: "Multi Product Trading Company", icon: "🏢" },
];

export const testimonials = [
  {
    quote:
      "Our restaurant received better visibility after getting listed with Social Route Media. It has helped us reach local customers and strengthen our online presence.",
    rating: 5,
  },
  {
    quote:
      "Partnering with Social Route Media has been a great experience. Their platform helped improve our online visibility and made it easier for potential customers to discover our business. The support team is professional and always ready to assist.",
    rating: 5,
  },
  {
    quote:
      "Social Route Media ke saath kaam karne ka experience positive raha. Platform businesses ko online discoverability badhane mein help karta hai aur local market reach improve karta hai. Professional approach aur timely support inki strength hai.",
    rating: 5,
  },
];

export const howItWorksSteps = [
  { icon: "📝", title: "Register Your Business", description: "Create your free listing in just a few minutes." },
  { icon: "📦", title: "Add Your Listing Details", description: "Add photos, categories, tags and contact info." },
  { icon: "🚀", title: "Grow & Get Discovered", description: "Get found by the right customers and grow faster." },
];

export const fallbackBlogs = [
  {
    title: "Print & Electronic Directory 2025-26 — 16th Edition",
    excerpt: "Our flagship printing & electronic directory is back — India's No.1 Directory of Media, 2021-32.",
    coverColor: "#1d4ed8",
    slug: "print-electronic-directory-2025-26",
  },
  {
    title: "5 Ways a Directory Listing Grows Local Discovery",
    excerpt: "How a well-optimised directory profile turns local searches into real footfall and enquiries.",
    coverColor: "#0f766e",
    slug: "directory-listing-local-discovery",
  },
  {
    title: "Premium vs Featured vs Supreme — Which Plan Fits You?",
    excerpt: "A quick breakdown of what each listing tier unlocks for growing businesses.",
    coverColor: "#7c3aed",
    slug: "premium-featured-supreme-explained",
  },
];
