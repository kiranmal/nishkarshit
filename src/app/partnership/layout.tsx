import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/partnership");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
