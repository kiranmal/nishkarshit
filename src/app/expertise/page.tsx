import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getExpertiseList } from "@/lib/cms/expertise";

export const dynamic = "force-dynamic";

const getItems = getExpertiseList;

export default async function ExpertiseIndexPage() {
  const items = await getItems();

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <section className="bg-white border-b border-gray-100 py-14 text-center">
          <h1
            className="text-4xl font-bold text-[#1b2430]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Expertise
          </h1>
          <p className="text-gray-500 mt-2">
            Deep specialization across every layer of modern software
          </p>
        </section>

        <section className="bg-[#f7f8fa] py-16">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((e) => (
              <Link
                key={e.slug}
                href={`/expertise/${e.slug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4"
                  style={{ background: e.accent }}
                />
                <h3 className="font-bold text-brand-navy mb-2">{e.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{e.paragraph}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/expertise");
}
