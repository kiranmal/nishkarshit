import type { BlogPostDoc } from "@/lib/models";

/** The one hardcoded post the old /blogs page showed. Imported as the first real blog post. */
export const blogDefaults: Omit<BlogPostDoc, "_id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Future–Proofing Your Business with Cloud Modernization",
    slug: "future-proofing-your-business-with-cloud-modernization",
    author: "satnamkhowal",
    tagline: "How cloud architecture, containers and microservices keep enterprises competitive.",
    bannerImage: "https://plus.unsplash.com/premium_photo-1752231846149-ddd0a41c479e?w=600&auto=format&fit=crop&q=60",
    content:
      "<p>As technology evolves rapidly, cloud modernization is no longer optional—it's a necessity. Discover how businesses are leveraging modern cloud architecture, containerization, and microservices to stay competitive, reduce costs, and enhance scalability. Learn from Groot Software's thought leaders as they outline real-world use cases and strategic frameworks to help future-proof your enterprise.</p>",
    tags: ["cloud", "modernization", "devops"],
    featured: true,
    status: "published",
    publishedAt: new Date("2024-11-13T00:00:00.000Z"),
    seo: {},
    source: "default",
  },
];
