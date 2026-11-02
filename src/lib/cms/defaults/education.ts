import type { PageDefault } from "../sections";
import { sec, sections, tags } from "./helpers";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=9219572223&text&type=phone_number&app_absent=0";

const stats = () =>
  sec({
    sectionKey: "stats", sectionType: "stats", title: "Statistics",
    items: [
      { value: "30", suffix: "+", title: "University Partners", color: "#17b6e8" },
      { value: "100", suffix: "+", title: "Programs Available", color: "#22c55e" },
      { value: "100", suffix: "%", title: "Placement Assistance", color: "#eab308" },
      { value: "UGC", suffix: "", title: "Approved Degrees", color: "#17b6e8" },
    ],
  });

const course = (icon: string, subtitle: string, badge: string, title: string, description: string, t: string[], meta: string) => ({ icon, subtitle, badge, title, description, tags: tags(t), meta });
const small = (title: string, description: string) => ({ title, description });
const courseImg = (title: string, description: string, image: string) => ({ title, description, image });

const topCourses = () => [
  courseImg("Web Development", "Learn modern web development skills.", "/images/courses/web-development.jpg"),
  courseImg("Programming with Python", "Master Python from basics to advanced concepts.", "/images/courses/python.jpg"),
  courseImg("Java Programming", "Build a strong foundation in Java programming.", "/images/courses/java.jpg"),
  courseImg("Data Science", "Learn data analysis and practical data science.", "/images/courses/data-science.jpg"),
];

export const educationDefaults: PageDefault[] = [
  {
    pageKey: "education:overview", kind: "education-tab", slug: "overview", label: "Overview", title: "Overview", path: "/education#overview", status: "published", order: 0, spacing: "16",
    hero: {
      enabled: true, badge: "", title: "Smart Education for a Smarter Future",
      description: "Nishkarsh IT Solution Pvt. Ltd. is an official enrollment partner for 30+ leading Indian universities, offering fully accredited online degree programs and skill certifications.",
      image: "",
      buttons: [{ label: "Explore Programs", href: "#courses", action: "link", newTab: false }, { label: "View Highlights", href: "#highlights", action: "link", newTab: false }],
    },
    sections: sections([
      stats(),
      sec({ sectionKey: "education-reimagined", sectionType: "text", variant: "text-plain", title: "Education, Reimagined",
        description: "We partner with UGC-approved Indian universities to offer fully accredited online degree programs and skill certifications, giving learners flexible access to quality higher education." }),
      sec({ sectionKey: "courses", sectionType: "cards", variant: "cards-accordion", title: "Courses for Every Career Goal", description: "Tap a program to see what's inside.",
        buttons: [{ label: "Apply Online →", action: "openForm" }],
        items: [
          course("cpu", "ENGINEERING & TECH", "100% ONLINE", "B.Tech / M.Tech", "Engineering degrees in Computer Science, AI & ML, Cloud Computing, and Data Science — fully accredited with industry labs.", ["Live Virtual Labs", "AI & Cloud Specializations", "Industry Mentorship"], "2 – 4 Years"),
          course("briefcase", "BUSINESS & MANAGEMENT", "GLOBAL DEGREE", "MBA / PGDM", "India's highest-ROI management degrees from NMIMS, Manipal, and Amity. Specializations in Marketing, Finance, HR & Analytics.", ["Harvard Case Studies", "Executive Networking", "C-Suite Mentorship"], "2 Years"),
          course("scale", "CORPORATE LAW & ETHICS", "BAR COUNCIL ALIGNED", "LLB / Law Programs", "Pursue premier legal education online from OP Jindal and leading law schools for careers in corporate compliance and cyber jurisprudence.", ["Moot Court Simulators", "Corporate Compliance", "Cyber Law Focus"], "3 – 5 Years"),
          course("graduation", "APPLIED COMPUTER SCIENCE", "PROJECT-DRIVEN", "BCA / MCA", "Computer applications degrees focused on programming, systems design and modern software development practices.", ["Live Coding Labs", "Capstone Projects", "Placement Prep"], "3 Years"),
          course("health", "HEALTHCARE & PHARMA", "ACCREDITED", "Health Sciences", "Accredited healthcare and pharma programs built for clinical and allied-health careers, with hands-on lab components.", ["Clinical Practicals", "Pharma Compliance", "Accredited Faculty"], "2 – 4 Years"),
          course("cloud", "SHORT-TERM UPSKILLING", "SELF-PACED", "IT & Cloud Certifications", "Short, self-paced certification tracks in cloud platforms, DevOps and cybersecurity — built to get you job-ready fast.", ["Self-Paced", "Industry Certification", "No Prior Degree Needed"], "1 – 6 Months"),
        ] }),
      sec({ sectionKey: "journey", sectionType: "cards", variant: "cards-steps", title: "Simple 4-Step Journey",
        items: [
          { title: "Explore Programs", description: "Browse courses across our 30+ university partners." },
          { title: "Apply Online", description: "Submit your application digitally — no paperwork runaround." },
          { title: "Get Counselled", description: "A dedicated counsellor walks you through the right fit." },
          { title: "Enroll & Learn", description: "Start learning with full placement and internship support." },
        ] }),
      sec({ sectionKey: "highlights", sectionType: "list", variant: "list-pills", title: "Key Program Highlights",
        bullets: ["Flexible & Accessible for All", "Affordable Fee Structures", "Flexible Duration & Batch Options", "Industry-Aligned Curriculum"] }),
    ]),
  },
  {
    pageKey: "education:internship", kind: "education-tab", slug: "internship", label: "Internship", title: "Internship", path: "/education#internship", status: "published", order: 1, spacing: "14",
    hero: {
      enabled: true, badge: "", title: "Empowering India's Youth Through IT",
      description: "Welcome to the Complete IT Internship Program, presented by Nishkarsh IT Solution Pvt. Ltd. A golden opportunity for students, graduates, and freshers to kick-start their careers! Our internship program is specially designed for young minds who want to gain real-world experience, enhance their skills, and take confident steps toward a successful future.",
      image: "",
      buttons: [{ label: "Apply Now →", href: "", action: "openForm", newTab: false }, { label: "WhatsApp Us", href: WHATSAPP_URL, action: "link", newTab: true }],
    },
    sections: sections([
      stats(),
      sec({ sectionKey: "internship-banner", sectionType: "image", variant: "image-banner", image: "https://www.naukri.com/campus/career-guidance/wp-content/uploads/2023/10/internship-resume.jpg", imageAlt: "Internship program" }),
      sec({ sectionKey: "program-overview", sectionType: "cards", variant: "cards-white", title: "Program Overview: Learn, Build, and Get Placed!",
        items: [
          { title: "For Everyone", description: "Designed for students, freshers, and job seekers across PAN India." },
          { title: "Comprehensive Training", description: "Full training covering essential IT skills, from basics to advanced." },
          { title: "Hands-on Experience", description: "Engage in live projects to build a strong portfolio." },
          { title: "Certified & Get Placed", description: "Receive valuable certification along with placement assistance to help you move confidently toward your career." },
        ] }),
      sec({ sectionKey: "top-courses", sectionType: "cards", variant: "cards-image", title: "Our Top Courses", items: topCourses() }),
      sec({ sectionKey: "placement-courses", sectionType: "cards", variant: "cards-image", title: "Placement Guarantee Courses", items: topCourses() }),
      sec({ sectionKey: "internship-highlights", sectionType: "cards", variant: "cards-icon", title: "Key Program Highlights",
        items: [
          { icon: "✓", title: "100% Job Placement Assistance" }, { icon: "</>", title: "Hands-on Training with Real Projects" },
          { icon: "👥", title: "Industry Expert Mentors" }, { icon: "◉", title: "Live Workshops & Doubt Sessions" },
          { icon: "★", title: "Government & NGO-Supported Certification" }, { icon: "☑", title: "Daily Task Sheets & Personalized Feedback" },
          { icon: "▤", title: "Resume Building & Interview Prep" }, { icon: "⌂", title: "Flexible Online + Offline Modes" },
          { icon: "♢", title: "Scholarships for Needy Students" },
        ] }),
      sec({ sectionKey: "affordable", sectionType: "text", variant: "text-amber", title: "Affordable & Accessible for All",
        description: "We believe quality IT education should be accessible to everyone. Our program offers the lowest cost internship fees in India.",
        bullets: ["Nominal Registration Fees", "Discounts for Groups / College Tie-ups", "Special Offers for Women, SC/ST, and Rural Candidates"],
        note: "Thanks to the generous support from leading NGOs and CSR initiatives, special subsidies are being offered to make this program more affordable and accessible for deserving candidates." }),
      sec({ sectionKey: "flexible-duration", sectionType: "cards", variant: "cards-purple", title: "Flexible Duration & Batch Options",
        items: [
          { title: "Duration", description: "Choose from 1 to 3 months to suit your learning pace." },
          { title: "Modes", description: "Hybrid learning with Online + Offline (where available) options." },
          { title: "Batch Options", description: "Weekday (Mon–Fri), Weekend (Sat–Sun), or Evening Flexible Timing." },
          { title: "Location", description: "Accessible PAN India (Online) with physical centers in key locations." },
        ],
        note: "Our flexible structure allows you to balance your studies with other commitments, making professional development achievable." }),
      sec({ sectionKey: "workshops", sectionType: "cards", variant: "cards-small", width: "half", title: "Specialized Workshops for Career Growth",
        items: [
          small("Web Development Mastery", "From HTML basics to advanced hosting techniques."),
          small("App Development & Backend APIs", "Learn to build mobile apps and integrate with robust databases."),
          small("Deployment Strategies", "Master deploying applications on platforms like AWS and Firebase."),
          small("Interview & HR Readiness", "Prepare for success with resume building and mock interviews."),
          small("Freelancing & Startup Guidance", "Explore entrepreneurial pathways and independent work."),
        ],
        note: "These workshops are designed to give you practical and soft skills crucial for a thriving IT career." }),
      sec({ sectionKey: "who-should-join", sectionType: "list", variant: "list-check-red", width: "half", title: "Who Should Seize This Opportunity?",
        bullets: ["B.Tech / BCA / MCA / M.Sc IT Students", "Diploma Holders", "10th / 12th Pass Students Interested in IT", "Working Professionals Looking to Upskill", "Anyone with a strong desire to learn coding!"],
        note: "If you have a passion for coding and a desire to build a career in IT, this program is for you. No prior experience is required—just a keen interest and willingness to learn!" }),
      sec({ sectionKey: "deliverables", sectionType: "list", variant: "list-numbered", title: "Your Internship Deliverables",
        description: "Upon successful completion of your internship, you will receive:",
        bullets: ["Internship Offer Letter", "Daily Assignments & Feedback", "Final Project Code + Report", "Internship Completion Certificate", "Project Completion Certificate", "Placement Letter (Post Internship)"],
        note: "These documents will significantly enhance your resume and open doors to exciting career opportunities." }),
      sec({ sectionKey: "internship-cta", sectionType: "cta", variant: "cta-gradient", buttons: [{ label: "Apply Now", action: "openForm" }, { label: "WhatsApp Us", href: WHATSAPP_URL, newTab: true }] }),
    ]),
  },
  {
    pageKey: "education:admission", kind: "education-tab", slug: "admission", label: "Admission", title: "Admission", path: "/education/admission", status: "published", order: 2, spacing: "14",
    hero: {
      enabled: true, badge: "", title: "Student Admission",
      description: "Begin your journey with UGC-approved online degree programs through our university partners.\n\nApply digitally, get your documents verified, and talk to a dedicated counsellor who will help you pick the right program.",
      image: "",
      buttons: [{ label: "Apply Now →", href: "", action: "openForm", newTab: false }, { label: "WhatsApp Us", href: WHATSAPP_URL, action: "link", newTab: true }],
    },
    sections: sections([
      stats(),
      sec({ sectionKey: "admission-process", sectionType: "text", variant: "text-centered", title: "Admission Process", description: "Start your journey with a simple, fully digital admission process." }),
      sec({ sectionKey: "admission-checklist", sectionType: "list", variant: "list-checklist",
        bullets: ["Fill out the online application form", "Submit your academic documents", "Attend a short online interview", "Receive your confirmation email", "100% scholarship opportunity on the basis of skill"] }),
      sec({ sectionKey: "eligibility-deadlines", sectionType: "cards", variant: "cards-info",
        items: [
          { title: "Eligibility", lines: [{ label: "", text: "10+2 or equivalent for undergraduate programs" }, { label: "", text: "Graduation required for postgraduate programs" }] },
          { title: "Deadlines", lines: [{ label: "Early Bird:", text: "April 30" }, { label: "Regular:", text: "June 30" }] },
        ] }),
      sec({ sectionKey: "new-admission-program", sectionType: "cards", variant: "cards-program", title: "New Admission Program",
        description: "A comprehensive admission program covering all levels, from graduation to Ph.D.",
        items: [
          { title: "Program Introduction", description: "Discover our mission to foster talent and our commitment to student success." },
          { title: "Courses Offered", description: "Explore a diverse range of IT and management courses that fit your career goals." },
          { title: "Admission Process", description: "Understand our simplified admission journey. We guide you every step of the way." },
          { title: "How to Apply", description: "Get detailed instructions for a smooth application and start your journey today." },
        ] }),
      sec({ sectionKey: "streamlined-process", sectionType: "cards", variant: "cards-steps-labelled", title: "Streamlined Admission Process",
        items: [
          { title: "Apply Online", description: "Fill out the digital application form in minutes." },
          { title: "Document Verification", description: "Upload documents — verified within 24-72 hours." },
          { title: "Counselling Call", description: "Get matched to the right program for your goals." },
          { title: "Confirm & Enroll", description: "Secure your seat and get your student portal access." },
        ] }),
      sec({ sectionKey: "program-banner", sectionType: "banner", title: "Admission Program –", subtitle: "Nishkarsh IT Solution Pvt. Ltd.",
        html: "<p>Direct admission for <strong>BCA, BBA, MBA, MCA, Ph.D.</strong> and more. Apply online with full career guidance.</p>",
        bullets: ["Admission 2026", "Graduation courses", "Postgraduate", "IT Education", "B.Tech Admission", "M.Tech Admission"] }),
      sec({ sectionKey: "admission-cta", sectionType: "cta", variant: "cta-cyan", buttons: [{ label: "Student Admission →", action: "openForm" }, { label: "Need Help with Admission? WhatsApp Us", href: WHATSAPP_URL, newTab: true }] }),
      sec({ sectionKey: "admission-form", sectionType: "applicationForm", variant: "form-admission", title: "Student Admission" }),
    ]),
  },
  {
    pageKey: "education:partners", kind: "education-tab", slug: "partners", label: "Our Partners", title: "Our Partners", path: "/education#partners", status: "published", order: 3, spacing: "14",
    hero: { enabled: false, badge: "", title: "", description: "", image: "", buttons: [] },
    sections: sections([
      sec({ sectionKey: "university-partners", sectionType: "slider", title: "University Partners",
        items: [
          { title: "NMIMS", subtitle: "Business & Management", image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80" },
          { title: "Manipal University", subtitle: "Multi-disciplinary", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80" },
          { title: "Amity University", subtitle: "Multi-disciplinary", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80" },
          { title: "OP Jindal Global University", subtitle: "Law & Corporate Compliance", image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80" },
          { title: "IGNOU", subtitle: "Distance & Open Learning", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80" },
          { title: "Chandigarh University", subtitle: "Engineering & Tech", image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80" },
          { title: "Lovely Professional University", subtitle: "Engineering & Tech", image: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=800&q=80" },
          { title: "Sikkim Manipal University", subtitle: "IT & Cloud Certifications", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" },
        ] }),
    ]),
  },
  {
    pageKey: "education:events", kind: "education-tab", slug: "events", label: "Events & Programs", title: "Events & Programs", path: "/education#events", status: "published", order: 4, spacing: "14",
    hero: { enabled: false, badge: "", title: "", description: "", image: "", buttons: [] },
    sections: sections([
      sec({ sectionKey: "events-programs", sectionType: "events", title: "Events & Programs",
        description: "Go beyond the curriculum. Join immersive experiences designed to prepare you for the tech world — led by experts, driven by innovation.",
        buttons: [{ label: "Explore Event", action: "openForm" }],
        items: [
          { title: "TechTalks 2025", meta: "Aug 15, 2025", description: "Engage with engineers, product leaders, and CTOs discussing the latest in Web3, GenAI, and cloud infrastructure.", image: "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=800&q=60" },
          { title: "AI Bootcamp", meta: "Sep 5–10, 2025", description: "Intensive hands-on workshop on machine learning, LLMs, prompt engineering, and production-ready AI pipelines.", image: "https://images.unsplash.com/photo-1653412453468-3001356894e4?w=600&auto=format&fit=crop&q=60" },
          { title: "Startup Showcase", meta: "Oct 2, 2025", description: "Student-founded startups pitch to investors and alumni founders. Witness real innovation in action.", image: "https://images.unsplash.com/photo-1586764921336-8b37580c7aea?w=600&auto=format&fit=crop&q=60" },
          { title: "Cybersecurity Week", meta: "Nov 12–18, 2025", description: "From ethical hacking labs to CISO guest lectures — dive deep into securing tomorrow's digital world.", image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=60" },
          { title: "Career Connect Fair", meta: "Dec 5, 2025", description: "Network with hiring managers from Google, Microsoft, TCS, and more. Resume reviews, mock interviews, and offers await.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" },
        ] }),
    ]),
  },
];
