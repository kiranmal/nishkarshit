import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import FooterPageView from "@/components/cms/FooterPageView";
import { getCmsPage } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("terms-conditions");
  return buildMetadata("/terms-conditions", page ? { title: `${page.title} | Nishkarsh IT Solution` } : undefined, page?.seo);
}

export default async function Page() {
  const page = await getCmsPage("terms-conditions");
  if (!page || page.status !== "published") notFound();
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen bg-white">
        <FooterPageView page={page} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
