import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getHeader, getFooter, getSettings } from "@/lib/cms/content";
import { getExpertiseList } from "@/lib/cms/expertise";

/** Site-wide default metadata, driven by Admin → Site Settings. Pages override it. */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const keywords = s.defaultKeywords.split(",").map((k) => k.trim()).filter(Boolean);
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(s.siteUrl);
  } catch {
    metadataBase = undefined;
  }
  return {
    metadataBase,
    title: s.defaultTitle,
    description: s.defaultDescription,
    ...(keywords.length ? { keywords } : {}),
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title: s.defaultTitle,
      description: s.defaultDescription,
      ...(s.defaultOgImage ? { images: [s.defaultOgImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.defaultTitle,
      description: s.defaultDescription,
      ...(s.defaultTwitterImage || s.defaultOgImage ? { images: [s.defaultTwitterImage || s.defaultOgImage] } : {}),
    },
    verification: {
      ...(s.googleVerification ? { google: s.googleVerification } : {}),
      ...(s.bingVerification ? { other: { "msvalidate.01": s.bingVerification } } : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [header, footer, settings, expertise] = await Promise.all([getHeader(), getFooter(), getSettings(), getExpertiseList()]);
  const expertiseLinks = expertise.map((e) => ({ label: e.title, href: `/expertise/${e.slug}` }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.siteName,
        url: settings.siteUrl,
        logo: header.logo,
        ...(settings.orgPhone ? { telephone: settings.orgPhone } : {}),
        ...(settings.orgEmail ? { email: settings.orgEmail } : {}),
        ...(settings.orgAddress ? { address: settings.orgAddress } : {}),
        sameAs: [footer.facebook, footer.instagram, footer.linkedin, footer.youtube].filter(Boolean),
      },
      { "@type": "WebSite", name: settings.siteName, url: settings.siteUrl },
    ],
  };

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white" suppressHydrationWarning>
        <script
          type="application/ld+json"
          // Content is JSON.stringify output of CMS strings; "<" is escaped to prevent </script> injection.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Preloader />
        <SiteContentProvider value={{ header, footer, expertiseLinks }}>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
