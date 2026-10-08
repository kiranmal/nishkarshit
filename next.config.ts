import type { NextConfig } from "next";

/**
 * The Directory is a separate application. Every /directory URL on this site
 * redirects to it. Override with DIRECTORY_REDIRECT_URL if it ever moves.
 */
const DIRECTORY_URL = (process.env.DIRECTORY_REDIRECT_URL || "https://directory.nishkarshit.com").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/directory", destination: DIRECTORY_URL, permanent: false },
      { source: "/directory/:path*", destination: DIRECTORY_URL, permanent: false },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
