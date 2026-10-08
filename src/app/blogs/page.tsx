import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Blogs from "@/components/Blogs";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <>
      <TopBar />

      <Header />

      <main className="min-h-screen bg-white">
        <Blogs heading="Blogs" />
      </main>

      <Footer />

      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/blogs");
}
