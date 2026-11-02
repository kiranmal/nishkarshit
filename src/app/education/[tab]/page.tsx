import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EducationClient from "../EducationClient";
import { buildMetadata } from "@/lib/seo";
import { getEducationTab, getEducationTabs, plain } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tab: string }> };

/** /education/<tab-slug> — a crawlable URL for every tab (including tabs added later in the admin). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab: slug } = await params;
  const tab = await getEducationTab(slug);
  if (!tab) return {};
  return buildMetadata(`/education/${slug}`, { title: `${tab.label} | Education | Nishkarsh IT Solution`, description: tab.hero?.description?.split(/\n\s*\n/)[0] }, tab.seo);
}

export default async function EducationTabPage({ params }: Props) {
  const { tab: slug } = await params;
  const tabs = plain(await getEducationTabs());
  if (!tabs.some((t) => t.slug === slug)) notFound();
  return <EducationClient tabs={tabs} initialTab={slug} />;
}
