import Link from "next/link";
import { User, Clock } from "lucide-react";
import { optimizeImage } from "@/lib/img";

export type BlogCardPost = {
  slug: string;
  title: string;
  author: string;
  tagline: string;
  bannerImage: string;
  publishedAt: string | Date;
  featured: boolean;
  tags: string[];
};

type BlogProps = { heading?: string; description?: string; posts: BlogCardPost[] };

export const formatBlogDate = (d: string | Date) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Public /blogs grid. Posts come from the database (Admin → Blogs); layout is unchanged from the original design. */
export default function Blogs({ heading = "Latest Blogs", description = "", posts }: BlogProps) {
  return (
    <section className="py-16 md:py-24 bg-[#072E48]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {(heading || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {heading && <h2 className="text-5xl md:text-6xl font-bold text-orange-600">{heading}</h2>}
            {description && <p className="mt-4 text-gray-600 text-base md:text-lg">{description}</p>}
          </div>
        )}
        {posts.length === 0 ? (
          <div className="text-center text-white/80 py-10">No blog posts have been published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const href = `/blogs/${post.slug}`;
              return (
                <article key={post.slug} className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link href={href} className="overflow-hidden rounded-xl mb-4 block">
                    {post.bannerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img loading="lazy" decoding="async" src={optimizeImage(post.bannerImage, 800)} alt={post.title} className="rounded-xl w-full h-48 object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3 flex-wrap">
                    {post.author && <span className="flex items-center gap-1"><User size={15} />{post.author}</span>}
                    <span className="flex items-center gap-1"><Clock size={15} />{formatBlogDate(post.publishedAt)}</span>
                  </div>
                  {(post.featured || post.tags[0]) && (
                    <div className="mb-2 flex gap-2 flex-wrap">
                      {post.featured && <span className="text-xs font-semibold text-white bg-orange-600 rounded px-2 py-0.5 uppercase">Featured</span>}
                      {post.tags[0] && <span className="text-xs font-semibold text-orange-600 uppercase">{post.tags[0]}</span>}
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-blue-900 mb-2"><Link href={href}>{post.title}</Link></h2>
                  {post.tagline && <p className="text-gray-700 text-sm leading-relaxed mb-5">{post.tagline}</p>}
                  <div className="mt-auto pt-2">
                    <Link href={href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md transition-all duration-300">
                      READ MORE <span className="text-lg">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
