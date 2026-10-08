"use client";

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
import WhyChooseUs from "@/components/it-services/WhyChooseUs";
import IndustriesUi from "@/components/it-services/WhyChooseUs";
import BusinessModelSection from "@/components/it-services/BusinessModelSection";
import RoadWithIcons from "@/components/it-services/RocketPathSection";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden  sm:px-10 px-5">
      <div className=" w-screen ">
        <Hero />
      </div>
      <div className=" w-screen  mx-4 px-9">
        <IconCloudDemo />
        <Experience />
        <Technologies />
        <IndustriesUi />
        <RecentProjects />
        <BusinessModelSection />
        <Approach />
        <AnimatedTestimonialsDemo />
        <Grid />
        <Clients />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
