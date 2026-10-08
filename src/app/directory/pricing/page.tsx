import { Check } from "lucide-react";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";

const plans = [
  {
    name: "Business / Company Watchlist (Premium)",
    tagline: "Professional Business Package",
    price: "₹4,999",
    period: "/ 365 Days",
    stats: [
      { label: "Listings", value: "2" },
      { label: "Categories", value: "5" },
      { label: "Photos", value: "5" },
      { label: "Tags", value: "4" },
    ],
    features: [
      "Contact Form Access",
      "Video Upload Support",
      "Priority placement in search",
      "Featured badge on listing",
    ],
  },
  {
    name: "Pincode Wise Business / Companies",
    tagline: "Professional Business Package",
    price: "₹999",
    period: "/ 365 Days",
    stats: [
      { label: "Listings", value: "1" },
      { label: "Categories", value: "1" },
      { label: "Photos", value: "2" },
      { label: "Tags", value: "1" },
    ],
    features: ["Contact Form Access", "Video Upload Support"],
  },
];

export default function PricingPage() {
  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="bg-gray-50 border-b border-gray-100 py-14 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Choose Your Plan
          </h1>
          <p className="text-gray-500 mt-2">
            Simple, transparent pricing to grow your business visibility
          </p>
        </section>

        <section className="max-w-[1000px] mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((p) => (
              <div
                key={p.name}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
              >
                <span className="absolute top-8 right-8 bg-emerald-500 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full">
                  Most Popular
                </span>
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-5">
                  🚀
                </div>
                <h3 className="text-xl font-bold text-gray-900 pr-24 mb-1">
                  {p.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{p.tagline}</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {p.price}
                  </span>
                  <span className="text-gray-400 text-sm">{p.period}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 border-t border-gray-100 pt-6 mb-6">
                  {p.stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between text-sm pr-4"
                    >
                      <span className="text-gray-500">{s.label}</span>
                      <span className="font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <button className="w-full rounded-full bg-emerald-500 text-white font-semibold py-3 hover:bg-emerald-600 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
