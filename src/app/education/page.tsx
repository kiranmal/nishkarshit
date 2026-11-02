import type { Metadata } from "next";
import EducationClient from "./EducationClient";
import { buildMetadata } from "@/lib/seo";
import { getEducationTabs, plain } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/education");
}

export default async function EducationPage() {
  const tabs = plain(await getEducationTabs());
  return <EducationClient tabs={tabs} />;
}
