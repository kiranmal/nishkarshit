import Link from "next/link";
import type { CmsPageDoc } from "@/lib/models";
import { CmsSections } from "@/components/cms/CmsSections";

/** Layouts for the footer-linked pages. Content (title, banner image, sections) comes from the CMS page record. */
export default function FooterPageView({ page }: { page: CmsPageDoc }) {
  if (page.pageKey === "cloud-computing") {
    return (
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 text-white">
        <div className="w-full">
          <h1 className="text-center text-3xl md:text-4xl font-bold text-amber-500 mb-12">{page.title}</h1>
          <CmsSections sections={page.sections} theme="page" />
        </div>
      </section>
    );
  }
  return (
    <div className="w-full">
      {page.heroImage && (
        <section className="bg-white ">
          <div className="overflow-hidden rounded-bl-[50px] rounded-br-[50px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.heroImage} alt={page.title} className="w-full h-[280px] md:h-[420px] object-cover" />
          </div>
        </section>
      )}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-20">
            <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-800">
              {page.title}
              <span className="block w-16 h-1 bg-blue-500 mt-4 mx-auto rounded-full"></span>
            </h1>
            <CmsSections sections={page.sections} theme="page" />
            <div className="mt-12 text-center">
              <Link className="inline-block text-blue-600 hover:text-blue-800 font-medium transition duration-200" href="/">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
