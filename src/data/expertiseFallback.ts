
export type ExpertiseSection = {
  title: string;
  description: string;
};

export type ExpertiseFormOption = {
  label: string;
};

export type ExpertiseItem = {
  slug: string;
  title: string;
  paragraph: string;
  accent: string;

  // Main hero image
  image?: string;
  introImage?: string;

  // Dynamic enquiry form
  form?: {
    title: string;
    options: ExpertiseFormOption[];
  };

  // Sections displayed below intro card
  sections?: ExpertiseSection[];
};


// ======================================================
// EXPERTISE DATA
// ======================================================

export const expertiseItems: ExpertiseItem[] = [

  // ======================================================
  // 1. CLOUD
  // ======================================================
  {
    slug: "cloud",
    title: "Cloud Computing Solutions",
    paragraph:
      "We provide scalable and secure cloud computing solutions that help businesses improve performance, reduce infrastructure costs and access their applications and data from anywhere.",

    accent: "#17b6e8",

    image: "YOUR-CLOUD-IMAGE",

    form: {
      title: "Cloud Computing",
      options: [
        { label: "SaaS Solutions" },
        { label: "PaaS Solutions" },
        { label: "IaaS Solutions" },
        { label: "Cloud Migration Services" },
        { label: "Cloud Consulting" },
        { label: "Cloud Infrastructure Management" },
        { label: "Cloud Security Solutions" },
        { label: "Cloud Backup & Disaster Recovery" },
      ],
    },

    sections: [
      {
        title: "SaaS Solutions",
        description:
          "Software as a Service solutions that allow businesses to access applications through the cloud without managing complex infrastructure.",
      },
      {
        title: "PaaS Solutions",
        description:
          "Platform as a Service solutions provide developers with scalable environments for building, testing and deploying applications.",
      },
      {
        title: "IaaS Solutions",
        description:
          "Infrastructure as a Service provides flexible computing resources including servers, storage and networking.",
      },
    ],
  },


  // ======================================================
  // 2. WEB APPLICATION DEVELOPMENT
  // ======================================================
  {
    slug: "web-application-development",
    title: "Web Application Development",
    paragraph:
      "From intuitive front-end prototyping to a full suite of robust back-end services, we specialize in delivering seamless, scalable web applications across a wide range of modern technologies. Our team ensures every line of code drives performance, innovation, and business success.",

    accent: "#0c2340",

    image: "YOUR-WEB-APPLICATION-IMAGE",

    form: {
      title: "Web Application Development",
      options: [
        { label: "Frontend Development" },
        { label: "Backend Development" },
        { label: "Full Stack Development" },
        { label: "React Development" },
        { label: "Next.js Development" },
        { label: "Node.js Development" },
        { label: "PHP Web Development" },
        { label: "API Development" },
        { label: "Web Application Maintenance" },
      ],
    },

    sections: [
      {
        title: "Frontend Development",
        description:
          "Modern, responsive and user-friendly interfaces designed for performance and accessibility.",
      },
      {
        title: "Backend Development",
        description:
          "Secure and scalable backend systems, APIs and business logic designed around your requirements.",
      },
      {
        title: "Full Stack Development",
        description:
          "Complete web application development covering frontend, backend, database and deployment.",
      },
    ],
  },


  // ======================================================
  // 3. CUSTOM SOFTWARE DEVELOPMENT
  // ======================================================
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    paragraph:
      "We specialize in delivering high-quality software development services tailored to your needs — from robust backend systems using NodeJS and .NET to dynamic front-end solutions with Angular, React and Vue.",

    accent: "#7c3aed",

    image: "YOUR-SOFTWARE-IMAGE",

    form: {
      title: "Custom Software Development",
      options: [
        { label: "Business Software Development" },
        { label: "Enterprise Software Development" },
        { label: "Custom Web Applications" },
        { label: "Desktop Software" },
        { label: "API Development" },
        { label: "Software Integration" },
        { label: "Software Maintenance" },
        { label: "Software Modernization" },
      ],
    },

    sections: [
      {
        title: "Custom Business Software",
        description:
          "Software designed specifically around your business processes and operational requirements.",
      },
      {
        title: "Enterprise Software",
        description:
          "Scalable enterprise applications designed to support complex business operations.",
      },
      {
        title: "Software Integration",
        description:
          "Integration between existing applications, APIs and third-party platforms.",
      },
    ],
  },


  // ======================================================
  // 4. OPENCART
  // ======================================================
  {
    slug: "opencart-development",
    title: "Opencart Development",
    paragraph:
      "We offer robust OpenCart development services tailored for both large and small eCommerce businesses. Our in-house team of expert developers and OpenCart specialists builds fully customized, scalable, and secure online stores — from large-scale customizations to mobile app integration.",

    accent: "#2f8f4e",

    image: "YOUR-OPENCART-IMAGE",

    form: {
      title: "Opencart Development",
      options: [
        { label: "OpenCart Store Development" },
        { label: "OpenCart Theme Development" },
        { label: "OpenCart Customization" },
        { label: "OpenCart Extension Development" },
        { label: "OpenCart Payment Gateway Integration" },
        { label: "OpenCart Migration" },
        { label: "OpenCart Maintenance" },
      ],
    },

    sections: [
      {
        title: "OpenCart Store Development",
        description:
          "Custom and scalable OpenCart stores designed for different types of eCommerce businesses.",
      },
      {
        title: "OpenCart Customization",
        description:
          "Custom themes, modules and functionality designed according to business requirements.",
      },
      {
        title: "OpenCart Integration",
        description:
          "Payment gateways, shipping systems and third-party services can be integrated into your store.",
      },
    ],
  },


  // ======================================================
  // 5. WOOCOMMERCE
  // ======================================================
  {
    slug: "woocommerce-development",
    title: "WooCommerce Development",
    paragraph:
      "Our WooCommerce experts build fast, secure and conversion-focused online stores on WordPress, with custom themes, plugin integrations and payment gateway setup tailored to your catalog.",

    accent: "#d8102e",

    image: "YOUR-WOOCOMMERCE-IMAGE",

    form: {
      title: "WooCommerce Development",
      options: [
        { label: "WooCommerce Store Development" },
        { label: "WooCommerce Theme Development" },
        { label: "WooCommerce Plugin Development" },
        { label: "WooCommerce Customization" },
        { label: "Payment Gateway Integration" },
        { label: "WooCommerce Migration" },
        { label: "WooCommerce Maintenance" },
      ],
    },

    sections: [
      {
        title: "WooCommerce Store Development",
        description:
          "Complete WooCommerce stores designed for performance, scalability and conversions.",
      },
      {
        title: "WooCommerce Customization",
        description:
          "Custom themes, plugins and functionality built around your business requirements.",
      },
      {
        title: "Payment Integration",
        description:
          "Secure payment gateway integration for smooth online transactions.",
      },
    ],
  },


  // ======================================================
  // 6. ECOMMERCE
  // ======================================================
  {
    slug: "ecommerce-website-development",
    title: "E-Commerce Website Development",
    paragraph:
      "We design and build end-to-end e-commerce platforms — product catalogs, cart and checkout, payment integration, and admin dashboards — built to convert visitors into customers.",

    accent: "#b08c2e",

    image: "YOUR-ECOMMERCE-IMAGE",

    form: {
      title: "E-Commerce Website Development",
      options: [
        { label: "E-Commerce Website Development" },
        { label: "Online Store Development" },
        { label: "Product Catalog Development" },
        { label: "Shopping Cart & Checkout" },
        { label: "Payment Gateway Integration" },
        { label: "E-Commerce Admin Panel" },
        { label: "E-Commerce Migration" },
        { label: "E-Commerce Maintenance" },
      ],
    },

    sections: [
      {
        title: "Online Store Development",
        description:
          "Complete online stores with product catalogs, shopping carts, checkout and payment integration.",
      },
      {
        title: "Payment Integration",
        description:
          "Integration with secure payment gateways to provide customers with convenient payment options.",
      },
      {
        title: "E-Commerce Administration",
        description:
          "Powerful admin functionality for products, orders, customers and inventory.",
      },
    ],
  },


  // ======================================================
  // 7. DIGITAL MARKETING
  // ======================================================
  {
    slug: "digital-marketing",
    title: "Digital-Marketing Company",

    paragraph:
      "We works Dedicated digital marketers and strategists to provide you the best digital marketing services easily. Our expert dedicated team of best-paid click analysts helps leverage the ROI of your business. Our search engine optimization experts increase your website ranking organically through effective strategies.",

    accent: "#c81f5c",

    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&auto=format&fit=crop&q=80",

    form: {
      title: "Digital-Marketing",
      options: [
        {
          label:
            "Search Engine Optimization (SEO) - On-page SEO, Off-page SEO, Technical SEO, Local SEO",
        },
        {
          label:
            "Search Engine Marketing (SEM) - Google Ads, Bing Ads, PPC campaigns",
        },
        {
          label:
            "Social Media Marketing (SMM) - Facebook, Instagram, LinkedIn, Twitter (X)",
        },
        {
          label:
            "Social Media Management - Content creation, Scheduling, Engagement, Community management",
        },
        {
          label:
            "Content Marketing - Blog writing, Infographics, E-books, Case studies",
        },
        {
          label:
            "Email Marketing - Campaign creation, Automation, Newsletter design, Lead nurturing",
        },
        {
          label:
            "Influencer Marketing - Influencer outreach, Campaign management, Affiliate marketing",
        },
        {
          label:
            "Video Marketing - YouTube marketing, Reels, Shorts, Explainer videos",
        },
        {
          label:
            "Conversion Rate Optimization (CRO) - Landing page design, A/B testing, User journey optimization",
        },
        {
          label:
            "Web Analytics & Reporting - Google Analytics, Tag Manager, Campaign performance reports",
        },
        {
          label:
            "Online Reputation Management (ORM) - Brand monitoring, Review management, Crisis handling",
        },
        {
          label:
            "E-Commerce Marketing - Product feed optimization, Marketplace ads, Retargeting campaigns",
        },
        {
          label:
            "Mobile Marketing - App store optimization (ASO), In-app advertising, Push notifications",
        },
        {
          label:
            "Marketing Automation - HubSpot, Mailchimp, Zoho Campaigns automation workflows",
        },
      ],
    },

    sections: [
      {
        title: "Search Engine Optimization (SEO)",
        description:
          "Nowadays, search engines display a variety of listings in Search Engine Results Pages (SERPs), including pay-per-click ads, paid collaborations, and organic queries. SEO is the technique of improving the ranking of web pages in search engine listings. At Nishkarsh IT Solution Pvt. Ltd., our skilled managers use SEO to increase both the number and quality of global visitors.",
      },
      {
        title: "Search Engine Marketing (SEM)",
        description:
          "We make it easy for your brand to be found online. Partnering with platforms like Google, Yahoo and Bing, we offer expert-level SEM services that help your business stand out in the competitive digital landscape.",
      },
      {
        title: "Social Media Optimization (SMO)",
        description:
          "Social Media has become one of the most powerful tools in digital marketing. At Nishkarsh IT Solution Pvt. Ltd., we leverage our expertise to help clients grow through strategic SMO services.",
      },
      {
        title: "Google AdWords Services",
        description:
          "We help you set up and manage your Google Ads account to generate instant traffic and leads for your business.",
      },
    ],
  },


  // ======================================================
  // 8. SOFTWARE TESTING
  // ======================================================
  {
    slug: "software-testing-services",
    title: "Software Testing Services",
    paragraph:
      "Our QA specialists put your software through rigorous manual and automated testing — functional, performance, security and regression — so what ships is reliable.",

    accent: "#0e8f8f",

    image: "YOUR-TESTING-IMAGE",

    form: {
      title: "Software Testing Services",
      options: [
        { label: "Manual Testing" },
        { label: "Automation Testing" },
        { label: "Functional Testing" },
        { label: "Performance Testing" },
        { label: "Security Testing" },
        { label: "Regression Testing" },
        { label: "API Testing" },
        { label: "Mobile Application Testing" },
        { label: "Web Application Testing" },
      ],
    },

    sections: [
      {
        title: "Manual Testing",
        description:
          "Detailed manual testing to identify functional and usability issues.",
      },
      {
        title: "Automation Testing",
        description:
          "Automated test suites designed to improve testing speed, reliability and coverage.",
      },
      {
        title: "Performance Testing",
        description:
          "Testing application performance, scalability and stability under different loads.",
      },
    ],
  },


  // ======================================================
  // 9. ERP
  // ======================================================
  {
    slug: "enterprise-applications-erp",
    title: "Enterprise Applications (ERP)",
    paragraph:
      "We build enterprise-grade ERP systems that unify finance, inventory, HR and operations into a single connected platform tailored to how your business actually runs.",

    accent: "#0c2340",

    image: "YOUR-ERP-IMAGE",

    form: {
      title: "Enterprise Applications (ERP)",
      options: [
        { label: "ERP Software Development" },
        { label: "Finance & Accounting" },
        { label: "Inventory Management" },
        { label: "Human Resource Management" },
        { label: "Sales Management" },
        { label: "Purchase Management" },
        { label: "Payroll Management" },
        { label: "ERP Integration" },
        { label: "ERP Maintenance & Support" },
      ],
    },

    sections: [
      {
        title: "Finance & Accounting",
        description:
          "Manage financial operations, accounting processes and business reporting through an integrated ERP system.",
      },
      {
        title: "Inventory Management",
        description:
          "Track inventory, products, purchases and stock movements from one centralized platform.",
      },
      {
        title: "Human Resource Management",
        description:
          "Manage employees, attendance, payroll and HR processes through integrated enterprise software.",
      },
    ],
  },


  // ======================================================
  // 10. CRM
  // ======================================================
  {
    slug: "crm-solutions",
    title: "CRM Solutions",
    paragraph:
      "Custom CRM software to track leads, manage customer relationships, and give your sales team a single, reliable source of truth — built around your sales process, not a generic template.",

    accent: "#17b6e8",

    image: "YOUR-CRM-IMAGE",

    form: {
      title: "CRM Solutions",
      options: [
        { label: "CRM Software Development" },
        { label: "Lead Management" },
        { label: "Customer Management" },
        { label: "Sales Pipeline Management" },
        { label: "Customer Support Management" },
        { label: "CRM Dashboard" },
        { label: "CRM Integration" },
        { label: "CRM Customization" },
      ],
    },

    sections: [
      {
        title: "Lead Management",
        description:
          "Capture, organize and track leads throughout the sales process.",
      },
      {
        title: "Customer Management",
        description:
          "Maintain a centralized view of customers, interactions and business relationships.",
      },
      {
        title: "Sales Pipeline",
        description:
          "Track opportunities and sales activities through a structured pipeline.",
      },
    ],
  },


  // ======================================================
  // 11. BLOCKCHAIN
  // ======================================================
  {
    slug: "blockchain-development",
    title: "Blockchain Development",
    paragraph:
      "From smart contracts to full decentralized applications, we help businesses explore and build on blockchain technology with a focus on security and real-world utility.",

    accent: "#7c3aed",

    image: "YOUR-BLOCKCHAIN-IMAGE",

    form: {
      title: "Blockchain Development",
      options: [
        { label: "Blockchain Application Development" },
        { label: "Smart Contract Development" },
        { label: "Decentralized Application (DApp)" },
        { label: "Blockchain Integration" },
        { label: "Private Blockchain Development" },
        { label: "Blockchain Consulting" },
        { label: "Blockchain Maintenance" },
      ],
    },

    sections: [
      {
        title: "Smart Contract Development",
        description:
          "Secure smart contracts designed to automate business rules and transactions.",
      },
      {
        title: "DApp Development",
        description:
          "Decentralized applications designed around blockchain technology and real-world business requirements.",
      },
      {
        title: "Blockchain Integration",
        description:
          "Integration of blockchain functionality with existing business systems.",
      },
    ],
  },


  // ======================================================
  // 12. BIG DATA
  // ======================================================
  {
    slug: "big-data-analysis",
    title: "Big Data Analysis",
    paragraph:
      "We help you turn raw data into decisions — building pipelines, dashboards and analytics systems that surface the insights that actually matter to your business.",

    accent: "#2f8f4e",

    image: "YOUR-BIG-DATA-IMAGE",

    form: {
      title: "Big Data Analysis",
      options: [
        { label: "Big Data Analytics" },
        { label: "Data Visualization" },
        { label: "Business Intelligence" },
        { label: "Data Processing" },
        { label: "Data Engineering" },
        { label: "Data Warehousing" },
        { label: "Analytics Dashboard" },
        { label: "Data Migration" },
      ],
    },

    sections: [
      {
        title: "Big Data Analytics",
        description:
          "Analyze large datasets to identify useful business trends and opportunities.",
      },
      {
        title: "Business Intelligence",
        description:
          "Transform business data into dashboards, reports and actionable insights.",
      },
      {
        title: "Data Visualization",
        description:
          "Present complex data through easy-to-understand visual reports and dashboards.",
      },
    ],
  },


  // ======================================================
  // 13. IT CONSULTATION
  // ======================================================
  {
    slug: "it-consultation",
    title: "IT Consultation",
    paragraph:
      "Not sure what to build or how? Our consultants help you plan technology roadmaps, choose the right stack, and avoid expensive mistakes before a single line of code is written.",

    accent: "#d8102e",

    image: "YOUR-IT-CONSULTATION-IMAGE",

    form: {
      title: "IT Consultation",
      options: [
        { label: "Technology Consulting" },
        { label: "IT Strategy Consulting" },
        { label: "Software Architecture Consulting" },
        { label: "Digital Transformation Consulting" },
        { label: "Cloud Consulting" },
        { label: "Cybersecurity Consulting" },
        { label: "IT Project Consulting" },
      ],
    },

    sections: [
      {
        title: "Technology Consulting",
        description:
          "Choose the right technology stack and architecture for your business requirements.",
      },
      {
        title: "IT Strategy",
        description:
          "Develop practical technology roadmaps aligned with business goals.",
      },
      {
        title: "Digital Transformation",
        description:
          "Modernize business processes using suitable digital technologies.",
      },
    ],
  },


  // ======================================================
  // 14. MOBILE APPLICATION
  // ======================================================
  {
    slug: "mobile-application-development",
    title: "Mobile Application Development",
    paragraph:
      "We build modern mobile applications that provide seamless user experiences, strong performance and scalable architecture across Android and iOS platforms.",

    accent: "#b08c2e",

    image: "YOUR-MOBILE-IMAGE",

    form: {
      title: "Mobile Application Development",
      options: [
        { label: "Android Application Development" },
        { label: "iOS Application Development" },
        { label: "Cross Platform Development" },
        { label: "Flutter Application Development" },
        { label: "React Native Development" },
        { label: "Mobile UI/UX Design" },
        { label: "Mobile App API Integration" },
        { label: "Mobile App Maintenance" },
      ],
    },

    sections: [
      {
        title: "Android Application Development",
        description:
          "Native and modern Android applications designed for performance and usability.",
      },
      {
        title: "iOS Application Development",
        description:
          "High-quality iOS applications designed for Apple devices.",
      },
      {
        title: "Cross Platform Development",
        description:
          "Applications that can run across multiple platforms using technologies such as Flutter and React Native.",
      },
    ],
  },


  // ======================================================
  // 15. AI CHATBOT
  // ======================================================
  {
    slug: "ai-chatbot-development",
    title: "AI Chatbot Development",
    paragraph:
      "Custom AI chatbots trained on your business context, integrated into your website or app, to handle support, lead capture and FAQs around the clock.",

    accent: "#c81f5c",

    image: "YOUR-AI-CHATBOT-IMAGE",

    form: {
      title: "AI Chatbot Development",
      options: [
        { label: "AI Chatbot Development" },
        { label: "Customer Support Chatbot" },
        { label: "AI Lead Generation Chatbot" },
        { label: "Website AI Chatbot" },
        { label: "WhatsApp AI Chatbot" },
        { label: "AI FAQ Chatbot" },
        { label: "Custom AI Assistant" },
        { label: "Chatbot Integration" },
      ],
    },

    sections: [
      {
        title: "AI Customer Support",
        description:
          "AI-powered assistants that can answer common customer questions and provide support around the clock.",
      },
      {
        title: "AI Lead Generation",
        description:
          "Chatbots designed to capture visitor information and help businesses generate qualified leads.",
      },
      {
        title: "Custom AI Assistants",
        description:
          "AI assistants trained around business-specific information and workflows.",
      },
    ],
  },


  // ======================================================
  // 16. SHOPIFY
  // ======================================================
  {
    slug: "shopify-development",
    title: "Shopify Development",
    paragraph:
      "Nishkarsh IT Solution Pvt. Ltd. delivers custom Shopify storefronts, theme customization, and app integrations to help you launch and scale a professional online store fast.",

    accent: "#2f8f4e",

    image: "YOUR-SHOPIFY-IMAGE",

    form: {
      title: "Shopify Development",
      options: [
        { label: "Shopify Store Development" },
        { label: "Shopify Theme Development" },
        { label: "Shopify Theme Customization" },
        { label: "Shopify App Integration" },
        { label: "Payment Gateway Integration" },
        { label: "Shopify Migration" },
        { label: "Shopify Maintenance" },
      ],
    },

    sections: [
      {
        title: "Shopify Store Development",
        description:
          "Professional Shopify stores designed around your products and business goals.",
      },
      {
        title: "Theme Customization",
        description:
          "Customize Shopify themes to create a unique and conversion-focused storefront.",
      },
      {
        title: "Shopify Integrations",
        description:
          "Connect your Shopify store with payment systems, apps and other business services.",
      },
    ],
  },


  // ======================================================
  // 17. PHP
  // ======================================================
  {
    slug: "php-development",
    title: "PHP Development",
    paragraph:
      "Our PHP development services cover everything from crafting stunning, custom-built websites to engineering complex, high-performance web applications — scalable, secure, and user-centric solutions tailored to your business goals.",

    accent: "#0c2340",

    image: "YOUR-PHP-IMAGE",

    form: {
      title: "PHP Development",
      options: [
        { label: "PHP Website Development" },
        { label: "PHP Web Application Development" },
        { label: "Laravel Development" },
        { label: "CodeIgniter Development" },
        { label: "Custom PHP Development" },
        { label: "PHP API Development" },
        { label: "PHP Migration" },
        { label: "PHP Maintenance & Support" },
      ],
    },

    sections: [
      {
        title: "Custom PHP Development",
        description:
          "Custom PHP applications designed according to business requirements.",
      },
      {
        title: "Laravel Development",
        description:
          "Modern PHP applications developed using the Laravel framework.",
      },
      {
        title: "PHP API Development",
        description:
          "Secure APIs for connecting PHP applications with websites, mobile applications and third-party systems.",
      },
    ],
  },

];

