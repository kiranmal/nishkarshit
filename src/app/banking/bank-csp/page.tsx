import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";
import BankingSections from "@/components/cms/BankingSections";
import { getCmsPage, plain } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("bank-csp");
  return buildMetadata("/banking/bank-csp", undefined, page?.seo);
}

export default async function Page() {
  const page = await getCmsPage("bank-csp");
  if (!page || page.status !== "published") notFound();
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <BankingTabs active="/banking/bank-csp" />
        <BankingSections sections={plain(page.sections)} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
