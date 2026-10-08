export type TeamMember = {
  _id: string;
  name: string;
  slug: string;
  role: string;
  image: string;
  description?: string;
  section: "hod" | "legal" | "management" | "our-team";
  order: number;
  active: boolean;
};

export const DEFAULT_MEMBERS: TeamMember[] = [
  /* =======================================================
     HOD - 4 MEMBERS
  ======================================================= */

  {
    _id: "default-hod-1",
    name: "John Doe",
    slug: "john-doe",
    role: "Head of Department",
    image: "/images/team/member-1.jpg",

    section: "hod",
    order: 1,
    active: true,
  },

  {
    _id: "default-hod-2",
    name: "Jane Smith",
    slug: "jane-smith",
    role: "Deputy Head of Department",
    image: "/images/team/member-2.jpg",

    section: "hod",
    order: 2,
    active: true,
  },

  {
    _id: "default-hod-3",
    name: "Michael Kumar",
    slug: "michael-kumar",
    role: "Senior Department Head",
    image: "/images/team/member-3.jpg",

    section: "hod",
    order: 3,
    active: true,
  },

  {
    _id: "default-hod-4",
    name: "Sarah Sharma",
    slug: "sarah-sharma",
    role: "Department Manager",
    image: "/images/team/member-4.jpg",

    section: "hod",
    order: 4,
    active: true,
  },

  /* =======================================================
     LEGAL TEAM - 4 MEMBERS
  ======================================================= */

  {
    _id: "default-legal-1",
    name: "Robert Wilson",
    slug: "robert-wilson",
    role: "Legal Advisor",
    image: "/images/team/member-5.jpg",

    section: "legal",
    order: 1,
    active: true,
  },

  {
    _id: "default-legal-2",
    name: "Emily Johnson",
    slug: "emily-johnson",
    role: "Senior Legal Consultant",
    image: "/images/team/member-6.jpg",

    section: "legal",
    order: 2,
    active: true,
  },

  {
    _id: "default-legal-3",
    name: "David Martin",
    slug: "david-martin",
    role: "Legal Consultant",
    image: "/images/team/member-7.jpg",

    section: "legal",
    order: 3,
    active: true,
  },

  {
    _id: "default-legal-4",
    name: "Priya Verma",
    slug: "priya-verma",
    role: "Legal Executive",
    image: "/images/team/member-8.jpg",

    section: "legal",
    order: 4,
    active: true,
  },

  /* =======================================================
     MANAGEMENT TEAM - 4 MEMBERS
  ======================================================= */

  {
    _id: "default-management-1",
    name: "Daniel Brown",
    slug: "daniel-brown",
    role: "Managing Director",
    image: "/images/team/member-9.jpg",

    section: "management",
    order: 1,
    active: true,
  },

  {
    _id: "default-management-2",
    name: "Anita Gupta",
    slug: "anita-gupta",
    role: "Operations Director",
    image: "/images/team/member-10.jpg",

    section: "management",
    order: 2,
    active: true,
  },

  {
    _id: "default-management-3",
    name: "Rahul Mehta",
    slug: "rahul-mehta",
    role: "Business Manager",
    image: "/images/team/member-11.jpg",
    section: "management",
    order: 3,
    active: true,
  },

  {
    _id: "default-management-4",
    name: "Neha Kapoor",
    slug: "neha-kapoor",
    role: "Project Manager",
    image: "/images/team/member-12.jpg",
    section: "management",
    order: 4,
    active: true,
  },

  /* =======================================================
     OUR TEAM - 4 MEMBERS
  ======================================================= */

  {
    _id: "default-team-1",
    name: "Alex Thomas",
    slug: "alex-thomas",
    role: "Senior Team Member",
    image: "/images/team/member-13.jpg",
    section: "our-team",
    order: 1,
    active: true,
  },

  {
    _id: "default-team-2",
    name: "Riya Singh",
    slug: "riya-singh",
    role: "Team Member",
    image: "/images/team/member-14.jpg",

    section: "our-team",
    order: 2,
    active: true,
  },

  {
    _id: "default-team-3",
    name: "Aman Verma",
    slug: "aman-verma",
    role: "Technical Team Member",
    image: "/images/team/member-15.jpg",

    section: "our-team",
    order: 3,
    active: true,
  },

  {
    _id: "default-team-4",
    name: "Pooja Sharma",
    slug: "pooja-sharma",
    role: "Team Member",
    image: "/images/team/member-16.jpg",

    section: "our-team",
    order: 4,
    active: true,
  },
];
