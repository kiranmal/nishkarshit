export type ServiceBlock = {
  label: string;
  heading: string;
  paragraph: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide: "left" | "right";
  icon: "code" | "cloud" | "loan" | "bank" | "health" | "publish" | "gov" | "education" | "retail" | "pharma";
  accent: string; // hex accent used for the image-panel gradient
  imageUrl?: string; // optional photo (set in Admin → Services Page); falls back to the icon panel
};

// Content and order transcribed 1:1 from nishkarshit.com/#/services
export const servicesDetailed: ServiceBlock[] = [
  {
    label: "IT SERVICES",
    heading: "Empowering digital growth with smart IT solutions",
    paragraph:
      "From cutting-edge Web and Mobile App Development to advanced AI-driven solutions, we specialize in building scalable, secure, and high-performance technology tailored for enterprises. Our expert team delivers end-to-end digital transformation—designing, developing, and deploying innovative platforms that enhance user experiences, boost efficiency, and drive business growth in today's competitive, tech-driven landscape..",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "left",
    icon: "code",
    accent: "#0c2340",
  },
  {
    label: "SERVER & CLOUD",
    heading: "High-performance cloud & server infrastructure",
    paragraph:
      "We provide robust cloud hosting, seamless database management, advanced DevOps solutions, and scalable server infrastructure tailored to meet all types of business needs. Our services ensure high availability, security, and performance—empowering startups, enterprises, and agencies to deploy, monitor, and scale their applications effortlessly in a cost-effective and reliable cloud environment",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "right",
    icon: "cloud",
    accent: "#17b6e8",
  },
  {
    label: "LOAN SERVICES",
    heading: "Affordable Loans Tailored to Your Needs",
    paragraph:
      "Unlock financial freedom with our affordable loan solutions, customized to match your unique needs and lifestyle. Whether it's for personal goals, business expansion, education, or emergencies, we provide flexible repayment options, low-interest rates, and fast approvals. Experience stress-free borrowing with a trusted partner dedicated to helping you achieve more—secure, reliable, and customer-focused support.",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "left",
    icon: "loan",
    accent: "#b08c2e",
  },
  {
    label: "FINANCE & BANKING",
    heading: "Bank CSP's & Financial inclusion at your doorstep",
    paragraph:
      "NIS is One stop solution for banking facilitation center is a small physical Business setup where neighboring Business Owner or Individual can come and file their banking related Services like New Account Opening, IMPS/Money Transfer, Cash Deposit, Social Security Schemes, Cash Withdrawal, ATM Transactions, RD Account, Aadhar Seeding, Fixed Deposit, Loan A/C Deposit etc...",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "right",
    icon: "bank",
    accent: "#c81f5c",
  },
  {
    label: "HEALTHCARE",
    heading: "Empowering care through digital health",
    paragraph:
      "NIS is one stop solution for healthcare facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their healthcare related services like such as Community Health, Hospitals, Nursing homes, Pharmaceutical Services, Ambulatory Surgical Centers, Dentistry, Urgent care, ambulance service etc.",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "left",
    icon: "health",
    accent: "#0e8f8f",
  },
  {
    label: "PUBLISHING",
    heading: "Publishing to bring ideas to light",
    paragraph:
      "NIS is one stop solution for publishing facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their publishing related services like Website Development, Publishing Services, On Demand Services, Software, Technical support, Mobile Applications etc..",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "left",
    icon: "publish",
    accent: "#d8432a",
  },
  {
    label: "GOVERNMENT",
    heading: "Government startup and MSME support",
    paragraph:
      "NIS is one stop solution for government facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their government related services like Multiplier Grant, Government-to-Business, NewGen, Credit Guarantee, MSME, Rural Development, Startup India Initiative, Market Access Promotion Scheme (MAPS) etc.",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "right",
    icon: "gov",
    accent: "#c98a13",
  },
  {
    label: "EDUCATION",
    heading: "Smart education for a smarter future",
    paragraph:
      "NIS is one stop solution for education facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their education related services like such as Informal education, Secondary Education, Legal education, Literacy, Special Education etc. …",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "right",
    icon: "education",
    accent: "#2f8f4e",
  },
  {
    label: "RETAIL",
    heading: "Retail made digital & efficient",
    paragraph:
      "NIS is one stop solution for retail facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their retail related services The B2C model sells finished products and services directly to consumers like such as small businesses and entrepreneurs, retail stores, restaurants and doctor's offices etc.",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "left",
    icon: "retail",
    accent: "#7a3fc9",
  },
  {
    label: "PHARMA",
    heading: "Wherever the art of Medicine is loved, there is also a love of Humanity.",
    paragraph:
      "NIS is one stop solution for pharma facilitation center is a small physical business setup where neighboring business owner or Individual can come and file their pharma related services like Doctors, Nurses, Hospitals, Nursing Homes, Clinics etc.",
    ctaLabel: "Explore Now",
    ctaHref: "/services#enquiry",
    imageSide: "right",
    icon: "pharma",
    accent: "#2e6fb0",
  },
];
