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
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type HomepageSectionConfigDoc } from "@/lib/models";
import { homepageSectionDefaults } from "@/data/homepageSections";
import { getActiveFestival } from "@/lib/festival";

export const dynamic = "force-dynamic";

async function getSectionConfig(): Promise<
  Record<string, HomepageSectionConfigDoc>
> {
  if (!isDbConfigured()) return {};
  try {
    const db = await getDb();
    const docs = await db
      .collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections)
      .find()
      .toArray();
    return Object.fromEntries(docs.map((d) => [d.key, d]));
  } catch {
    return {};
  }
}

export default async function Home() {
  const config = await getSectionConfig();
  const activeFestival = await getActiveFestival();

  // Build the ordered, filtered list of section keys. Falls back to the
  // built-in default order when a section has no admin override yet.
  const order = homepageSectionDefaults
    .map((s, i) => ({
      key: s.key,
      order: config[s.key]?.order ?? i,
      visible: config[s.key]?.visible ?? true,
    }))
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s): string => s.key);

  const isVisible = (key: string) => order.includes(key);
  const override = (key: string) => ({
    heading: config[key]?.heading,
    description: config[key]?.description,
  });

  return (
    <>
      {activeFestival && <FestivalOverlay festival={JSON.parse(JSON.stringify(activeFestival))} />}
      <TopBar />
      <Header />
      <main className="flex-1">
        {isVisible("hero") && <Hero />}
        {isVisible("peopleProcess") && (
          <PeopleProcess {...override("peopleProcess")} />
        )}
        {isVisible("turbocharge") && <Turbocharge />}
        {isVisible("mission") && <MissionSection {...override("mission")} />}
        {isVisible("industries") && (
          <IndustriesGrid {...override("industries")} />
        )}
        {isVisible("businessSolutions") && (
          <BusinessSolutionsSlider {...override("businessSolutions")} />
        )}

        {isVisible("differentiator") && (
          <Differentiator {...override("differentiator")} />
        )}
        {isVisible("publicWords") && (
          <PublicWords {...override("publicWords")} />
        )}
        {isVisible("gallery") && <Gallery />}
        {isVisible("location") && <LocationSection {...override("location")} />}
        {isVisible("enquiry") && <EnquirySection />}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/");
}
