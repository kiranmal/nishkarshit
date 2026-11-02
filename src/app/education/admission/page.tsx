import type { Metadata } from "next";
import EducationClient from "../EducationClient";
import { buildMetadata } from "@/lib/seo";
import { getEducationTab, getEducationTabs, plain } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tab = await getEducationTab("admission");
  return buildMetadata("/education/admission", undefined, tab?.seo);
}

// /education/admission renders the SAME tabbed page, opened on the Admission tab with the form showing.
export default async function StudentAdmissionPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course } = await searchParams;
  const tabs = plain(await getEducationTabs());
  return <EducationClient tabs={tabs} initialTab="admission" initialShowForm initialCourse={course} />;
}
