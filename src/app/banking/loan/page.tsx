import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";
import EmiCalculator from "@/components/banking/EmiCalculator";
import { loanProducts } from "@/data/pagesFallback";

export default function LoanPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <BankingTabs active="/banking/loan" />

        <section className="bg-[#0b1a33] text-white py-14 text-center">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Explore Our Loan Solutions
            </h1>
            <p className="text-white/60 mt-2">
              Flexible and transparent loan offers
            </p>
          </div>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-16">
          <EmiCalculator />
        </section>

        <section className="bg-[#f7f8fa] py-16">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {loanProducts.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-2xl mb-5">
                  🏠
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {p.description}
                </p>
                <Link
                  href="/banking/loan/apply"
                  className="inline-block rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors"
                >
                  Apply Now
                </Link>
              </div>
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
  return buildMetadata("/banking/loan");
}
