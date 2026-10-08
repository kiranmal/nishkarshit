"use client";

import Link from "next/link";
import { User, MessageCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type BlogPost = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  comments?: number;
  date?: string;
  publishedAt?: string;
  readTime?: string;
  active?: boolean;
  slug?: string;
  url?: string;
  category?: string;
};

type BlogProps = {
  heading?: string;
  description?: string;
};

const defaultPost: BlogPost = {
  title: "Future–Proofing Your Business with Cloud Modernization",
  description:
    "As technology evolves rapidly, cloud modernization is no longer optional—it's a necessity. Discover how businesses are leveraging modern cloud architecture, containerization, and microservices to stay competitive, reduce costs, and enhance scalability. Learn from Groot Software's thought leaders as they outline real-world use cases and strategic frameworks to help future-proof your enterprise.",
  image:
    "https://plus.unsplash.com/premium_photo-1752231846149-ddd0a41c479e?w=600&auto=format&fit=crop&q=60",
  author: "satnamkhowal",
  comments: 0,
  date: "November 13, 2024",
  readTime: "5 min read",
  active: true,
  url: "https://crm.nishkarshit.com/knowledge-base",
};

export default function Blogs({
  heading = "Latest Blogs",
  description = "",
}: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const activePosts = data.filter(
            (post: BlogPost) => post && post.active !== false,
          );

          setPosts(activePosts);
        } else {
          setPosts([defaultPost]);
        }
      } catch (error) {
        console.error("Error loading blogs:", error);

        // Keep existing blog visible if API is unavailable
        setPosts([defaultPost]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-[#072E48]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {(heading || description) && (
            <div className="text-center max-w-3xl mx-auto mb-12">
              {heading && (
                <h2 className="text-5xl md:text-6xl font-bold text-orange-600">
                  {heading}
                </h2>
              )}

              {description && (
                <p className="mt-4 text-gray-600 text-base md:text-lg">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="text-center text-white py-10">Loading blogs...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-[#072E48]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADING */}
        {(heading || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {heading && (
              <h2 className="text-5xl md:text-6xl font-bold text-orange-600">
                {heading}
              </h2>
            )}

            {description && (
              <p className="mt-4 text-gray-600 text-base md:text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            /*
             * If admin provides URL, use it.
             *
             * Otherwise automatically create:
             *
             * /blog/post-slug
             */
            const postUrl =
              post.url || (post.slug ? `/blog/${post.slug}` : "#");

            /*
             * Support both:
             *
             * description
             * excerpt
             */
            const description = post.description || post.excerpt || "";

            /*
             * Support both:
             *
             * date
             * publishedAt
             */
            const displayDate =
              post.date ||
              (post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "");

            return (
              <article
                key={post._id || post.id || post.slug || index}
                className="
                  bg-white
                  rounded-xl
                  shadow-md
                  p-4
                  flex
                  flex-col
                  h-full
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                {/* IMAGE */}
                <div className="overflow-hidden rounded-xl mb-4">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title || "Blog post"}
                      className="
                        rounded-xl
                        w-full
                        h-48
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-full
                        h-48
                        rounded-xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        text-gray-400
                      "
                    >
                      No image
                    </div>
                  )}
                </div>

                {/* META INFORMATION */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-gray-600
                    mb-3
                    flex-wrap
                  "
                >
                  {post.author && (
                    <span className="flex items-center gap-1">
                      <User size={15} />
                      {post.author}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <MessageCircle size={15} />
                    {post.comments ?? 0}
                  </span>

                  {displayDate && (
                    <span className="flex items-center gap-1">
                      <Clock size={15} />
                      {displayDate}
                    </span>
                  )}
                </div>

                {/* CATEGORY */}
                {post.category && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-orange-600 uppercase">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* TITLE */}
                <h2
                  className="
                    text-lg
                    font-bold
                    text-blue-900
                    mb-2
                  "
                >
                  {post.title || "Untitled Blog"}
                </h2>

                {/* DESCRIPTION */}
                {description && (
                  <p
                    className="
                      text-gray-700
                      text-sm
                      leading-relaxed
                      mb-5
                    "
                  >
                    {description}
                  </p>
                )}

                {/* READ MORE */}
                <div className="mt-auto pt-2">
                  {postUrl.startsWith("http") ? (
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        font-semibold
                        rounded-full
                        shadow-md
                        transition-all
                        duration-300
                      "
                    >
                      READ MORE
                      <span className="text-lg">→</span>
                    </a>
                  ) : (
                    <Link
                      href={postUrl}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        font-semibold
                        rounded-full
                        shadow-md
                        transition-all
                        duration-300
                      "
                    >
                      READ MORE
                      <span className="text-lg">→</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
