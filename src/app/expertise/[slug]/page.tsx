import { notFound } from "next/navigation";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ExpertiseDetail from "@/components/expertise/ExpertiseDetail";
import type { Metadata } from "next";
import { getExpertise } from "@/lib/cms/expertise";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const getItem = getExpertise;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Not found", robots: { index: false } };
  const seo = item.seo;
  const base = await buildMetadata(`/expertise/${slug}`, {
    title: seo?.metaTitle || `${item.title} | Nishkarsh IT Solution`,
    description: seo?.metaDescription || item.paragraph.slice(0, 155).trim(),
    keywords: seo?.metaKeywords,
    image: seo?.ogImage || item.image,
  });
  return {
    ...base,
    ...(seo?.canonicalUrl ? { alternates: { canonical: seo.canonicalUrl } } : {}),
    ...(seo?.noIndex || seo?.noFollow ? { robots: { index: !seo.noIndex, follow: !seo.noFollow } } : {}),
  };
}

export default async function ExpertiseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ExpertiseDetail item={item} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
