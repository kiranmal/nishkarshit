import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";
import { hardwareProducts } from "@/data/pagesFallback";
import Link from "next/link";
export default function CspHardwarePage() {
  return (
    <>
      <TopBar />
      <Header />

      <main>
        <BankingTabs active="/banking/csp-hardware" />

        {/* HERO / TITLE SECTION */}
        <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900  py-10 px-4  md:px-20">
          <div className="max-w-[1300px] mx-auto">
            <h1
              className="text-3xl md:text-4xl font-bold text-center mb-10 text-amber-400"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Hardware Products
            </h1>

            {/* PRODUCTS */}
            <div className="space-y-10">
              {hardwareProducts.map((product, index) => {
                const reverse = index % 2 === 1;

                return (
                  <div
                    key={product.name}
                    className={`flex flex-col md:flex-row ${
                      reverse ? "md:flex-row-reverse" : ""
                    } items-center bg-white rounded-xl shadow-lg overflow-hidden`}
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="w-full md:w-1/2 h-64 bg-white flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-contain p-4"
                      />
                    </div>

                    {/* PRODUCT CONTENT */}
                    <div className="p-6 md:w-1/2 space-y-4">
                      <h2
                        className="text-xl md:text-2xl font-semibold text-gray-800"
                        style={{
                          fontFamily: "var(--font-poppins)",
                        }}
                      >
                        {product.name}
                      </h2>

                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>

                      {/* EXPLORE BUTTON */}
                      <Link
                        href={`/banking/csp-hardware/${product.slug}`}
                        className="inline-block"
                      >
                        <span className="px-5 py-2 border border-red-500 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition inline-block">
                          Explore Now
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/banking/csp-hardware");
}
