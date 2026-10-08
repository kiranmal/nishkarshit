import { notFound } from "next/navigation";
import { Star, Phone, Mail, MapPin, Clock, CheckCircle2, QrCode } from "lucide-react";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import QuickInquiryForm from "@/components/directory/QuickInquiryForm";
import ReviewForm from "@/components/directory/ReviewForm";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryListing } from "@/lib/models";
import { fallbackListings, type FallbackListing } from "@/data/directoryFallback";

export const dynamic = "force-dynamic";

async function getListing(
  slug: string
): Promise<{ doc: DirectoryListing | null; fallback: FallbackListing | null }> {
  if (isDbConfigured()) {
    try {
      const db = await getDb();
      const doc = await db
        .collection<DirectoryListing>(COLLECTIONS.directoryListings)
        .findOne({ slug, status: "published" });
      if (doc) return { doc, fallback: null };
    } catch {
      // fall through to fallback data
    }
  }
  return { doc: null, fallback: fallbackListings.find((l) => l.slug === slug) || null };
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { doc, fallback } = await getListing(slug);
  const listing = doc || fallback;
  if (!listing) notFound();

  const rating = listing.rating ?? 5;
  const accent = listing.logoColor || "#0c2340";
  const whyChooseUs = listing.whyChooseUs || [];
  const services = listing.services || [];
  const products = doc?.products?.filter((p) => p.published) || [];
  const gallery = doc?.gallery || [];
  const videoUrl = doc?.videoUrl;
  const hours = listing.hours || [];
  const reviews = doc?.reviews || [];
  const mapSrc = doc?.mapUrl
    ? doc.mapUrl
    : `https://www.google.com/maps?q=${encodeURIComponent(listing.city)}&output=embed`;

  return (
    <>
      <DirectoryHeader />
      <main>
        {/* Header banner — Basic Information */}
        <section
          className="relative text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-14 flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center text-3xl font-bold shrink-0 overflow-hidden">
              {listing.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.logoUrl} alt={listing.name} className="w-full h-full object-cover" />
              ) : (
                initials(listing.name)
              )}
            </div>
            <div className="text-center md:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full mb-2">
                {listing.category}
              </span>
              <h1
                className="text-2xl md:text-4xl font-bold"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {listing.name}
              </h1>
              {listing.tagline && <p className="text-white/70 mt-1">{listing.tagline}</p>}
              <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    className={i < rating ? "text-amber-300" : "text-white/30"}
                  />
                ))}
                <span className="text-sm text-white/70 ml-2 flex items-center gap-1">
                  <MapPin size={13} /> {listing.city}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Main column */}
          <div className="space-y-12">
            {/* About */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-500 leading-relaxed">{listing.description}</p>
            </div>

            {/* Why Choose Us */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(whyChooseUs.length > 0
                  ? whyChooseUs
                  : [
                      { title: "Trusted Partnership", icon: "🤝", description: "" },
                      { title: "Competitive Pricing", icon: "💰", description: "" },
                      { title: "Reliable Service", icon: "⭐", description: "" },
                    ]
                ).map((f, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-5 text-center">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                    {f.description && (
                      <p className="text-xs text-gray-400 mt-1">{f.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            {services.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{s.title}</p>
                        {s.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {products
                    .sort((a, b) => a.order - b.order)
                    .map((p) => (
                      <div
                        key={String(p._id)}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                      >
                        {p.mainImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.mainImage} alt={p.name} className="w-full h-40 object-cover" />
                        ) : (
                          <div className="w-full h-40 bg-gray-100" />
                        )}
                        <div className="p-4">
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          {p.description && (
                            <p className="text-xs text-gray-400 mt-1">{p.description}</p>
                          )}
                          {(p.price || p.oldPrice) && (
                            <div className="flex items-center gap-2 mt-2">
                              {p.price && (
                                <span className="font-bold text-emerald-600">₹{p.price}</span>
                              )}
                              {p.oldPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{p.oldPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-full aspect-square object-cover rounded-lg border border-gray-100"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {videoUrl && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Video</h2>
                <div className="rounded-xl overflow-hidden border border-gray-100 aspect-video">
                  <iframe
                    src={videoUrl}
                    title={`${listing.name} video`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Business Hours */}
            {hours.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} /> Business Hours
                </h2>
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                  {hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <span className="text-gray-600">{h.day}</span>
                      <span className="font-medium text-gray-900">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="rounded-xl overflow-hidden border border-gray-100 h-64">
                <iframe
                  title={`${listing.name} location`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                />
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4 mb-6">
                {reviews.map((r, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                      <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-sm text-gray-400">Be the first to leave a review.</p>
                )}
              </div>
              {doc && <ReviewForm listingId={String(doc._id)} listingSlug={listing.slug} />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {listing.phone && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} /> {listing.phone}
                  </p>
                )}
                {"email" in listing && listing.email && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} /> {listing.email}
                  </p>
                )}
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} /> {listing.city}
                </p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <QrCode size={80} className="mx-auto text-gray-800 mb-3" />
              <p className="text-xs text-gray-400">Scan to save this business's contact</p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-1">Quick Inquiry</h3>
              <p className="text-xs text-gray-400 mb-4">
                Send a message directly to {listing.name}.
              </p>
              <QuickInquiryForm listingName={listing.name} />
            </div>
          </aside>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
