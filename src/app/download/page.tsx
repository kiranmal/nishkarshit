import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Download, FileText } from "lucide-react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { downloadDocuments } from "@/data/pagesFallback";

export default function DownloadPage() {
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
            Download
          </h1>
          <p className="text-gray-500 mt-2">
            Proposals and resources from Nishkarsh IT Solution
          </p>
        </section>

        <section className="max-w-[900px] mx-auto px-4 md:px-8 py-16 space-y-5">
          {downloadDocuments.map((d) => (
            <div
              key={d.file}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{d.title}</h3>
                  <p className="text-sm text-gray-500">{d.description}</p>
                </div>
              </div>
              <a
                href={d.file}
                download
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
              >
                <Download size={15} /> Download PDF
              </a>
            </div>
          ))}
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/download");
}
