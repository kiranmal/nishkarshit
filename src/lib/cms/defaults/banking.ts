import type { PageDefault } from "../sections";
import { sec, sections } from "./helpers";

const outlets = [1, 2, 3, 4, 5, 6, 7, 8, 11].map((n) => n);
const outletFiles = ["outlet1-D4N06ACz.jpg", "outlet2-CBonR_Xo.jpg", "outlet3-C_rzPI7E.jpg", "outlet4-CW7BiuNl.jpg", "outlet5-mvPRuR9Z.jpg", "outlet6-C-Ul_WgG.jpg", "outlet7-BZmCWgI-.jpg", "outlet8-c9nxy11u.jpg", "outlet11-DtRuPkPN.jpg"];

const banks = ["Allahabad Bank", "Andhra Bank", "Axis Bank", "Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Canara Bank", "Central Bank of India", "City Union Bank", "Corporation Bank", "Federal Bank", "ICICI Bank", "IDBI Bank", "Indian Bank", "Indian Overseas Bank", "IndusInd Bank", "ING Vysya Bank", "Karur Vysya Bank", "Kotak Bank", "Laxmi Vilas Bank", "Oriental Bank of Commerce", "South Indian Bank", "State Bank of Bikaner", "State Bank of Hyderabad", "State Bank of India", "State Bank of Mysore", "State Bank of Patiala", "Syndicate Bank", "UCO Bank", "Union Bank of India", "United Bank of India", "Vijaya Bank", "Yes Bank Ltd", "Jharkhand Rajya Gramin Bank", "Vananchal Gramin Bank"];

void outlets;

export const bankingDefaults: PageDefault[] = [
  {
    pageKey: "bank-csp", kind: "banking", slug: "bank-csp", label: "Bank CSP", title: "Bank CSP", path: "/banking/bank-csp", status: "published", order: 0,
    sections: sections([
      sec({ sectionKey: "csp-title", sectionType: "hero", variant: "hero-title", title: "BANK CSP" }),
      sec({ sectionKey: "csp-image", sectionType: "image", variant: "image-plain", image: "/assets/BankCSP-XdzgrlC3.webp", imageAlt: "Bank CSP" }),
      sec({ sectionKey: "csp-eligibility", sectionType: "list", variant: "list-numbered-card", title: "Eligibility for Opening & Maintaining of Bank CSP",
        bullets: [
          "उम्र कम-से-कम 18 वर्ष (At least 18 years of age)", "मैट्रिक या उससे ज्यादा पास होना (Matric or above)", "आवेदक को कंप्यूटर ज्ञान होना चाहिए (Computer literate)",
          "अपने बिजनेस प्रोजेक्ट हेतु पैसा लगाने के इच्छुक हो (Willing to invest some money in project)", "जिम्मेदार (Responsible)", "मेहनती (Laborious)", "बेरोजगार व्यक्ति (Unemployed)",
        ] }),
      sec({ sectionKey: "csp-apply", sectionType: "cta", variant: "cta-apply", buttons: [{ label: "Apply Now →", action: "openForm" }], note: "Click above to open the Bank CSP application form." }),
      sec({ sectionKey: "csp-outlets", sectionType: "gallery", variant: "gallery-snap", title: "OUR EXISTING OUTLETS", note: "← Swipe to view more outlets →",
        items: outletFiles.map((f, i) => ({ title: `Outlet ${i + 1}`, image: `/assets/${f}` })) }),
      sec({ sectionKey: "csp-application-form", sectionType: "applicationForm", variant: "form-csp", title: "CSP Application Form", subtitle: "Bank CSP",
        description: "Please fill in all the required details carefully as per your Aadhaar and proposed CSP location.",
        note: "Thank you for submitting your Bank CSP application. Our team will review your details and contact you regarding the next steps." }),
      sec({ sectionKey: "csp-enquiry", sectionType: "bankEnquiry", title: "Chat With Our Team", image: "/assets/BankCSP-XdzgrlC3.webp", imageAlt: "Bank CSP",
        description: "Our team is available to answer your questions regarding Bank CSP applications, eligibility and the onboarding process.",
        subtitle: "CREATE AN ENQUIRY", note: "Send us a message and our team will get back to you.", bullets: banks }),
    ]),
  },
  {
    pageKey: "bank-loan", kind: "banking", slug: "loan", label: "Loan", title: "Loan", path: "/banking/loan", status: "published", order: 1,
    sections: sections([
      sec({ sectionKey: "loan-hero", sectionType: "hero", variant: "hero-navy", title: "Explore Our Loan Solutions", description: "Flexible and transparent loan offers" }),
      sec({ sectionKey: "emi-calculator", sectionType: "emiCalculator" }),
      sec({ sectionKey: "loan-products", sectionType: "cards", variant: "cards-loan", buttons: [{ label: "Apply Now", href: "/banking/loan/apply" }],
        items: [
          { icon: "🏠", title: "Housing Loan", description: "Flexible and transparent home loan offers with quick, reliable loan options.", link: "/banking/loan/apply" },
          { icon: "🏠", title: "Business Loan Assistance", description: "Tailored solutions to help your business grow, with fast approvals and dedicated support.", link: "/banking/loan/apply" },
        ] }),
    ]),
  },
  {
    pageKey: "bank-hardware", kind: "banking", slug: "csp-hardware", label: "CSP Hardware (listing page)", title: "Hardware Products", path: "/banking/csp-hardware", status: "published", order: 2,
    sections: [],
  },
];
