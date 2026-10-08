import { notFound } from "next/navigation";
import { getExpertise } from "@/lib/cms/expertise";
import ExpertiseEnquiryForm from "@/components/ExpertiseEnquiryForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ExpertiseEnquiryPage({ params }: Props) {
  const { slug } = await params;

  const item = await getExpertise(slug);

  if (!item) {
    notFound();
  }

  return <ExpertiseEnquiryForm item={item} />;
}

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
