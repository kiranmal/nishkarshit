import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import RefundPolicy from "@/components/RefundPolicy";

export const dynamic = "force-dynamic";

export default function RefundPolicyPage() {
  return (
    <>
      <TopBar />

      <Header />

      <main className="min-h-screen bg-white">
        <RefundPolicy />
      </main>

      <Footer />

      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/refund-policy");
}
