import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, User } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { formatBlogDate } from "@/components/Blogs";
import { optimizeImage } from "@/lib/img";
import { findBlog } from "@/lib/cms/store";
import { htmlToText } from "@/lib/cms/html";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await findBlog(slug);
  if (!found || !("post" in found)) return { title: "Blog | Nishkarsh IT Solution", robots: { index: false } };
  const p = found.post;
  return buildMetadata(`/blogs/${p.slug}`, { title: `${p.title} | Nishkarsh IT Solution`, description: p.tagline || htmlToText(p.content, 155), image: p.bannerImage || undefined, keywords: p.tags.join(", ") }, p.seo);
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const found = await findBlog(slug);
  if (found && "redirectTo" in found) redirect(`/blogs/${found.redirectTo}`); // slug renamed in the admin
  if (!found || !("post" in found)) notFound();
  const post = found.post;
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen bg-white">
        <article>
          {post.bannerImage && (
            <div className="overflow-hidden rounded-bl-[50px] rounded-br-[50px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img decoding="async" src={optimizeImage(post.bannerImage, 1600)} alt={post.title} className="w-full h-[240px] md:h-[400px] object-cover" />
            </div>
          )}
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <Link href="/blogs" className="text-sm text-blue-600 hover:underline">← All blogs</Link>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">{post.title}</h1>
            {post.tagline && <p className="mt-3 text-lg text-gray-600">{post.tagline}</p>}
            <div className="mt-5 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              {post.author && <span className="flex items-center gap-1"><User size={15} />{post.author}</span>}
              <span className="flex items-center gap-1"><Clock size={15} />{formatBlogDate(post.publishedAt)}</span>
              {post.featured && <span className="text-xs font-semibold text-white bg-orange-600 rounded px-2 py-0.5 uppercase">Featured</span>}
            </div>
            <div className="cms-rich mt-8 text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => <span key={t} className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">#{t}</span>)}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
