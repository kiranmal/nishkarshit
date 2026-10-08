/** Every section on the homepage, in the app's default order. Admin can override visibility/order. */
export const homepageSectionDefaults = [
  { key: "hero", label: "1. Hero Slider" },
  { key: "peopleProcess", label: "2. People & Process" },
  { key: "turbocharge", label: "3. Turbocharge (scroll text)" },
  { key: "mission", label: "4. Mission (animated background)" },
  { key: "industries", label: "5. Major Industries We Service" },
  { key: "businessSolutions", label: "6. Business Solutions (auto slider)" },
  { key: "services", label: "Services card grid" },
  { key: "differentiator", label: "7. We Are The Differentiator" },
  { key: "publicWords", label: "8. Public Words (testimonials)" },
  { key: "gallery", label: "9. Our Gallery" },
  { key: "location", label: "10. Where We're Located" },
  { key: "enquiry", label: "11. Enquiry (chat + form)" },
] as const;

export type HomepageSectionKey = (typeof homepageSectionDefaults)[number]["key"];
