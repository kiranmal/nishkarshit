import Hero from "@/components/it-services/Hero";
import Grid from "@/components/it-services/Grid";
import Footer from "@/components/it-services/Footer";
import Clients from "@/components/it-services/Clients";
import Approach from "@/components/it-services/Approach";
import Experience from "@/components/it-services/Experience";
import RecentProjects from "@/components/it-services/RecentProjects";
import IconCloudDemo from "@/components/it-services/IconCloudDemo";
import { AnimatedTestimonialsDemo } from "@/components/it-services/AnimatedTestimonialsDemo";
import Technologies from "@/components/it-services/Technologies";
import IndustriesUi from "@/components/it-services/WhyChooseUs";
import BusinessModelSection from "@/components/it-services/BusinessModelSection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { EntitySeo } from "@/lib/cms/seo-fields";
import { getContent } from "@/lib/cms/content";
import { defaultITServices, type ITServicesContent } from "@/lib/cms/it-services";

export const dynamic = "force-dynamic";

/** Layout/animation stay in the components; hero text, tech-stack cards, projects, testimonials and client logos come from MongoDB. */
export default async function ITServicesPage() {
  const c = await getContent<ITServicesContent>("itServices", defaultITServices);
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden  sm:px-10 px-5">
      <div className=" w-screen ">
        <Hero content={c.hero} />
      </div>
      <div className=" w-screen  mx-4 px-9">
        <IconCloudDemo />
        <Experience content={c.experience} />
        <Technologies />
        <IndustriesUi />
        <RecentProjects content={c.projects} />
        <BusinessModelSection />
        <Approach />
        <AnimatedTestimonialsDemo />
        <Grid />
        <Clients content={c.clients} />
        <Footer />
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent<ITServicesContent>("itServices", defaultITServices);
  return buildMetadata("/it-services", undefined, c.seo as EntitySeo | undefined);
}
