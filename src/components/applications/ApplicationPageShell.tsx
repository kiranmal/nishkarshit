import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { APPLICATION_CONFIGS, type ApplicationKind } from "@/lib/applications/config";

/**
 * Page chrome shared by /education/admission and /banking/loan/apply.
 * Uses the same TopBar / Header / Footer / FloatingButtons, 1300px container
 * and navy banner as the existing banking pages.
 */
export default function ApplicationPageShell({
  kind,
  initialProgram,
}: {
  kind: ApplicationKind;
  initialProgram?: string;
}) {
  const cfg = APPLICATION_CONFIGS[kind];
  const banner = kind === "admission" ? "bg-[#050b16]" : "bg-[#0b1a33]";

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">
        {kind === "loan" && <BankingTabs active="/banking/loan" />}

        <section className={`${banner} text-white py-12`}>
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <Link
              href={cfg.breadcrumbHref}
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
            >
              <ArrowLeft size={14} /> {cfg.breadcrumbLabel}
            </Link>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {cfg.pageTitle}
            </h1>
            <p className="text-white/60 mt-2">{cfg.pageSubtitle}</p>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-10 md:py-16">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <ApplicationForm kind={kind} initialProgram={initialProgram} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
