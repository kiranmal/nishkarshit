import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import PeopleProcess from "@/components/home/PeopleProcess";
import Turbocharge from "@/components/home/Turbocharge";
import MissionSection from "@/components/home/MissionSection";
import IndustriesGrid from "@/components/home/IndustriesGrid";
import BusinessSolutionsSlider from "@/components/home/BusinessSolutionsSlider";
import Differentiator from "@/components/home/Differentiator";
import PublicWords from "@/components/home/PublicWords";
import Gallery from "@/components/home/Gallery";
import LocationSection from "@/components/home/LocationSection";
import EnquirySection from "@/components/home/EnquirySection";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import FestivalOverlay from "@/components/home/FestivalOverlay";
import { getHomeSections, plain } from "@/lib/cms/store";
import type { HomeContentMap, HomeKey } from "@/lib/cms/home";
import { getActiveFestival } from "@/lib/festival";

export const dynamic = "force-dynamic";

/** One renderer per homepage section. Layout + animation live in the components; ALL content comes from the database. */
const RENDER: { [K in HomeKey]: (content: HomeContentMap[K]) => React.ReactNode } = {
  hero: (c) => <Hero content={c} />,
  peopleProcess: (c) => <PeopleProcess content={c} />,
  turbocharge: (c) => <Turbocharge content={c} />,
  mission: (c) => <MissionSection content={c} />,
  industries: (c) => <IndustriesGrid content={c} />,
  businessSolutions: (c) => <BusinessSolutionsSlider content={c} />,
  services: (c) => <Services content={c} />,
  differentiator: (c) => <Differentiator content={c} />,
  publicWords: (c) => <PublicWords content={c} />,
  gallery: (c) => <Gallery content={c} />,
  location: (c) => <LocationSection content={c} />,
  enquiry: (c) => <EnquirySection content={c} />,
};

export default async function Home() {
  const [sections, activeFestival] = await Promise.all([getHomeSections(), getActiveFestival()]);
  return (
    <>
      {activeFestival && <FestivalOverlay festival={JSON.parse(JSON.stringify(activeFestival))} />}
      <TopBar />
      <Header />
      <main className="flex-1">
        {sections
          .filter((s) => s.visible)
          .map((s) => (
            <div key={s.key} style={{ display: "contents" }}>
              {(RENDER[s.key] as (c: unknown) => React.ReactNode)(plain(s.content))}
            </div>
          ))}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/");
}
