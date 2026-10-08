import type { Metadata } from "next";
import EducationClient from "../EducationClient";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/education/admission");
}

// /education/admission now renders the SAME tabbed page, opened on the
// Admission tab with the form showing — so tabs work on both URLs.
export default async function StudentAdmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  return (
    <EducationClient
      initialTab="admission"
      initialShowForm
      initialCourse={course}
    />
  );
}
