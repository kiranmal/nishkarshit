import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ManagementTeam from "@/components/ManagementTeam";

import { getDb, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/* =========================================================
   TYPES
========================================================= */

import { DEFAULT_MEMBERS, type TeamMember } from "@/data/teamFallback";

/* =========================================================
   DEFAULT MEMBERS
   These are shown when MongoDB is not connected
========================================================= */


/* =========================================================
   GET MANAGEMENT TEAM
========================================================= */

async function getManagementTeam(): Promise<TeamMember[]> {
  /* -------------------------------------------------------
     MongoDB NOT configured
     → Return 16 default members
  ------------------------------------------------------- */

  if (!isDbConfigured()) {
    console.warn("MongoDB is not configured. Showing default team members.");

    return DEFAULT_MEMBERS;
  }

  try {
    const db = await getDb();

    const members = await db
      .collection("management_team")
      .find({
        active: true,
      })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .toArray();

    /* -----------------------------------------------------
       MongoDB connected but collection is empty
       → Return default members
    ----------------------------------------------------- */

    if (members.length === 0) {
      console.warn(
        "No management team members found. Showing default members.",
      );

      return DEFAULT_MEMBERS;
    }

    /* -----------------------------------------------------
       Convert MongoDB documents
    ----------------------------------------------------- */

    return members.map((member) => ({
      _id: member._id.toString(),

      name: member.name || "",

      slug: member.slug || "",

      role: member.role || "",

      image: member.image || "",

      description: member.description || "",

      section:
        member.section === "legal"
          ? "legal"
          : member.section === "management"
            ? "management"
            : member.section === "our-team"
              ? "our-team"
              : "hod",

      order: member.order ?? 0,

      active: member.active !== false,
    }));
  } catch (error) {
    console.error("Management team loading error:", error);

    /* -----------------------------------------------------
       Database error
       → Still show default members
    ----------------------------------------------------- */

    return DEFAULT_MEMBERS;
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function ManagementTeamPage() {
  const members = await getManagementTeam();

  /* =======================================================
     SEPARATE MEMBERS BY SECTION
  ======================================================= */

  const hodMembers = members
    .filter((member) => member.active && member.section === "hod")
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const legalMembers = members
    .filter((member) => member.active && member.section === "legal")
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const managementMembers = members
    .filter((member) => member.active && member.section === "management")
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const ourTeamMembers = members
    .filter((member) => member.active && member.section === "our-team")
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <>
      <TopBar />

      <Header />

      <main className="min-h-screen bg-white">
        {/*HOB */}

        <ManagementTeam members={hodMembers} heading="HOD" />

        {/* =================================================
            LEGAL TEAM
        ================================================= */}

        <ManagementTeam members={legalMembers} heading="Legal Team" />

        {/* =================================================
            MANAGEMENT TEAM
        ================================================= */}

        <ManagementTeam members={managementMembers} heading="Management Team" />

        {/* =================================================
            OUR TEAM
        ================================================= */}

        <ManagementTeam members={ourTeamMembers} heading="Our Team" />
      </main>

      <Footer />

      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/management-team");
}
