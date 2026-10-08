import type { Metadata } from "next";
import EducationClient from "./EducationClient";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/education");
}

export default function EducationPage() {
  return <EducationClient />;
}
