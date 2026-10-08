import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ServicesDetailed from "@/components/ServicesDetailed";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type ServiceSectionDoc } from "@/lib/models";
import { servicesDetailed, type ServiceBlock } from "@/data/servicesDetailed";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMetadata("/services", {
    title: "Our Services",
    description:
      "IT, software, cloud, and business solution services from Nishkarsh IT Solution.",
  });
}

async function getSections(): Promise<ServiceBlock[]> {
  if (!isDbConfigured()) return servicesDetailed;
  try {
    const db = await getDb();
    const docs = await db
      .collection<ServiceSectionDoc>(COLLECTIONS.serviceSections)
      .find({ status: "published" })
      .sort({ order: 1 })
      .toArray();
    if (docs.length === 0) return servicesDetailed;
    const slugOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return docs.map((d) => ({
      label: d.label,
      heading: d.heading,
      paragraph: d.paragraph,
      ctaLabel: d.ctaLabel,
      ctaHref: d.ctaHref,
      imageSide: d.imageSide,
      // keep the original icon for default sections; new ones get a generic icon until they have a photo
      icon: servicesDetailed.find((x) => slugOf(x.label) === d.slug || slugOf(x.label) === slugOf(d.label))?.icon ?? ("code" as const),
      accent: d.accent,
      imageUrl: d.imageUrl || undefined,
    }));
  } catch {
    return servicesDetailed;
  }
}

export default async function ServicesPage() {
  const sections = await getSections();
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">
        <ServicesDetailed sections={sections} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
