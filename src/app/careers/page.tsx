import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import JobApplyForm from "@/components/careers/JobApplyForm";
import { MapPin, Briefcase } from "lucide-react";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type JobPostingDoc } from "@/lib/models";
import { jobPostingsFallback } from "@/data/pagesFallback";

export const dynamic = "force-dynamic";

async function getJobs() {
  if (!isDbConfigured()) return jobPostingsFallback;
  try {
    const db = await getDb();
    const docs = await db
      .collection<JobPostingDoc>(COLLECTIONS.jobPostings)
      .find({ status: "published" })
      .toArray();
    return docs.length > 0 ? docs : jobPostingsFallback;
  } catch {
    return jobPostingsFallback;
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <section className="relative py-8 text-center bg-white text-black">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            We Are Hiring!
          </h1>
          <p className="text-gray-600/70 mb-2">Join us.</p>
          <p className="text-gray-600/70">
            Explore, collaborate, and grow together with us.
          </p>
        </section>
        <section
          className="w-full mx-auto px-4 md:px-8 py-16 space-y-6 flex flex-col items-end"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {jobs.map((j) => (
            <div
              key={j.title}
              className="w-full max-w-3xl bg-white/20 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">
                    {j.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-white/80 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {j.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Briefcase size={13} />
                      {j.type}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4">
                {j.description}
              </p>

              <JobApplyForm jobTitle={j.title} />
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
  return buildMetadata("/careers");
}
