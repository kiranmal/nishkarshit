export const bankCspEligibility = [
  { hi: "उम्र कम-से-कम 18 वर्ष", en: "At least 18 years of age" },
  { hi: "मैट्रिक या उससे ज्यादा पास होना", en: "Matric or above" },
  { hi: "आवेदक को कंप्यूटर ज्ञान होना चाहिए", en: "Computer literate" },
  {
    hi: "अपने बिज़नेस प्रोजेक्ट हेत पैसा लगाने के इच्छुक हों",
    en: "Willing to invest some money in business project",
  },
];

export const loanProducts = [
  {
    title: "Housing Loan",
    description:
      "Flexible and transparent home loan offers with quick, reliable loan options.",
  },
  {
    title: "Business Loan Assistance",
    description:
      "Tailored solutions to help your business grow, with fast approvals and dedicated support.",
  },
];

export const hardwareProducts = [
  {
    slug: "pax-d180-c-mpos-pinpad",
    name: "Pax D180 C++ MPOS Pinpad Blank",

    description:
      "Pax D180 Contactless pinpad device with efficient card reader and easy NFC payment options. Ideal for secure transactions.",

    image:
      "https://static.wixstatic.com/media/991ade_ea23abdd84cd45f8b860dd7789f96cbe~mv2.webp/v1/fill/w_520,h_484,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/991ade_ea23abdd84cd45f8b860dd7789f96cbe~mv2.webp",

    form: {
      quantity: "",
      unitPrice: "5000",

      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: false,
        },
        {
          name: "companyName",
          label: "Company Name (if applicable)",
          type: "text",
          required: false,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
        },
        {
          name: "billingAddress",
          label: "Billing Address",
          type: "textarea",
          required: true,
        },
        {
          name: "billingCity",
          label: "City",
          type: "text",
          required: true,
        },
        {
          name: "billingState",
          label: "State",
          type: "text",
          required: true,
        },
        {
          name: "billingPinCode",
          label: "PIN Code",
          type: "text",
          required: true,
        },
        {
          name: "shippingAddress",
          label: "Shipping Address (if different)",
          type: "textarea",
          required: false,
        },
        {
          name: "shippingCity",
          label: "City",
          type: "text",
          required: false,
        },
        {
          name: "shippingState",
          label: "State",
          type: "text",
          required: false,
        },
        {
          name: "shippingPinCode",
          label: "PIN Code",
          type: "text",
          required: false,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],

      terms:
        "Prices are exclusive of taxes and shipping charges unless specified. Payment must be made in full before dispatch. Product warranty as per manufacturer’s policy.",
    },
  },

  {
    slug: "epson-plq-35-passbook-printer",
    name: "Epson PLQ-35 Passbook Printer",

    description:
      "The Epson PLQ-35 offers reliable passbook printing with fast speed and consistent quality for financial institutions.",

    image:
      "https://mediaserver.goepson.com/ImConvServlet/imconv/d78042880997836905a8d3b15af47218c283d564/1200Wx1200H?use=banner&hybrisId=B2C&assetDescr=PLQ-35_right%20-%20PB-1",

    form: {
      quantity: "",
      unitPrice: "",

      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
        },
        {
          name: "companyName",
          label: "Company Name (if applicable)",
          type: "text",
          required: false,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          required: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          required: true,
        },
        {
          name: "state",
          label: "State",
          type: "text",
          required: true,
        },
        {
          name: "pinCode",
          label: "PIN Code",
          type: "text",
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],

      terms:
        "Prices are exclusive of taxes and shipping charges unless specified. Payment must be made in full before dispatch. Product warranty as per manufacturer’s policy.",
    },
  },

  {
    slug: "mantra-mfs110-l1-biometric",
    name: "MANTRA MFS110 L1 Biometric Finger Capture Device",

    description:
      "Secure biometric fingerprint scanner for government and banking verifications. Certified and high precision.",

    image: "YOUR_MANTRA_IMAGE_URL",

    form: {
      quantity: "",
      unitPrice: "",

      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          required: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          required: true,
        },
        {
          name: "state",
          label: "State",
          type: "text",
          required: true,
        },
        {
          name: "pinCode",
          label: "PIN Code",
          type: "text",
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],

      terms:
        "Prices are exclusive of taxes and shipping charges unless specified. Payment must be made in full before dispatch. Product warranty as per manufacturer’s policy.",
    },
  },

  {
    slug: "mso-1300-e3-rd-l1",
    name: "MSO 1300 E3 RD L1",

    description:
      "High-quality fingerprint scanner with RD compliance, suitable for eKYC and secure verifications.",

    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk1Yscw_SoS4H0J_Ti0KpDDVCR18ycru31Iw&s",

    form: {
      quantity: "",
      unitPrice: "",

      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          required: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          required: true,
        },
        {
          name: "state",
          label: "State",
          type: "text",
          required: true,
        },
        {
          name: "pinCode",
          label: "PIN Code",
          type: "text",
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],

      terms:
        "Prices are exclusive of taxes and shipping charges unless specified. Payment must be made in full before dispatch. Product warranty as per manufacturer’s policy.",
    },
  },

  {
    slug: "mix-note-counting-machine",
    name: "Mix Note Counting Machine",

    description:
      "An efficient note counter with fake note detection and fast processing. Perfect for banks and offices.",

    image:
      "https://m.media-amazon.com/images/I/719oqL5pfcL._UF1000,1000_QL80_.jpg",

    form: {
      quantity: "",
      unitPrice: "",

      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
        },
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          required: false,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          required: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          required: true,
        },
        {
          name: "state",
          label: "State",
          type: "text",
          required: true,
        },
        {
          name: "pinCode",
          label: "PIN Code",
          type: "text",
          required: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],

      terms:
        "Prices are exclusive of taxes and shipping charges unless specified. Payment must be made in full before dispatch. Product warranty as per manufacturer’s policy.",
    },
  },
];

export const partnershipBenefits = [
  "Collaborate on projects",
  "Shared resources and expertise",
  "Expand your network",
  "Grow together in the digital ecosystem",
];

export const jobPostingsFallback = [
  {
    title: "Software Development Engineer",
    location: "Noida, Uttar Pradesh",
    type: "Full-time",
    description:
      "Build and ship features across our web and mobile products, working closely with design and product.",
  },
  {
    title: "Business Correspondent Agent",
    location: "Pan India",
    type: "Field",
    description:
      "Deliver doorstep banking services to rural and semi-urban customers as part of our BC network.",
  },
  {
    title: "Digital Marketing Executive",
    location: "Noida, Uttar Pradesh",
    type: "Full-time",
    description: "Plan and run SEO, social, and paid campaigns across client accounts.",
  },
];

export const downloadDocuments = [
  {
    title: "NIS Business Correspondent Proposal",
    description: "Our Business Correspondent partnership offering for banks — B2B & B2C.",
    file: "/assets/downloads/business-correspondent-proposal.pdf",
  },
  {
    title: "NISPAY API Proposal",
    description: "India's largest API provider — AePS, money transfer, PAN, and more.",
    file: "/assets/downloads/nispay-api-proposal.pdf",
  },
  {
    title: "NIS Core View Proposal",
    description: "Company overview — who we are, our services, and our portfolio.",
    file: "/assets/downloads/nis-core-view.pdf",
  },
  {
    title: "Directory Proposal (The Zentra Media)",
    description: "Commercial Business Directory listing proposal powered by Nishkarsh IT.",
    file: "/assets/downloads/directory-proposal.pdf",
  },
];
