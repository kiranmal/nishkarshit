import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Blogs from "@/components/Blogs";
import { getPublishedBlogs, plain } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = plain(await getPublishedBlogs());
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen bg-white">
        <Blogs heading="Blogs" posts={posts} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/blogs");
}
