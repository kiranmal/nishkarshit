import type { Metadata } from "next";
import ApplicationPageShell from "@/components/applications/ApplicationPageShell";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/banking/loan/apply");
}

export default async function LoanApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <ApplicationPageShell kind="loan" initialProgram={type} />;
}
