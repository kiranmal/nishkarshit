import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";

import { hardwareProducts } from "@/data/pagesFallback";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function HardwareProductPage({ params }: Props) {
  const { slug } = await params;

  const product = hardwareProducts.find((item) => item.slug === slug);

  if (!product) {
    return (
      <>
        <TopBar />
        <Header />

        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Product Not Found
            </h1>

            <Link
              href="/banking/csp-hardware"
              className="mt-5 inline-block text-red-600 font-semibold"
            >
              ← Back to Hardware Products
            </Link>
          </div>
        </main>

        <Footer />
        <FloatingButtons />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Header />

      <main>
        <BankingTabs active="/banking/csp-hardware" />

        <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 mt-30 pt-30 pb-16 px-4 md:px-20">
          <div className="max-w-[1200px] mx-auto">
            {/* BACK */}
            <Link
              href="/banking/csp-hardware"
              className="text-white/80 hover:text-white mb-6 inline-block"
            >
              ← Back to Hardware Products
            </Link>

            {/* PRODUCT */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* IMAGE */}
                <div className="min-h-[350px] flex items-center justify-center bg-gray-50 p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[400px] w-full object-contain"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-8 md:p-12">
                  <h1
                    className="text-3xl md:text-4xl font-bold text-gray-900"
                    style={{
                      fontFamily: "var(--font-poppins)",
                    }}
                  >
                    {product.name}
                  </h1>

                  <p className="mt-5 text-gray-600 leading-7">
                    {product.description}
                  </p>

                  {product.form.unitPrice && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-500">Unit Price</p>

                      <p className="text-2xl font-bold text-red-600">
                        ₹{product.form.unitPrice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FORM */}
              <div className="border-t bg-gray-50 p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Enquire About This Product
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Please fill in the details below to enquire about{" "}
                    <strong>{product.name}</strong>.
                  </p>

                  <form
                    action="/api/hardware-enquiry"
                    method="POST"
                    className="space-y-6"
                  >
                    {/* PRODUCT INFO */}
                    <input type="hidden" name="product" value={product.name} />

                    <input type="hidden" name="slug" value={product.slug} />

                    <div className="grid md:grid-cols-2 gap-6">
                      {product.form.fields.map((field) => (
                        <div
                          key={field.name}
                          className={
                            field.type === "textarea" ? "md:col-span-2" : ""
                          }
                        >
                          <label
                            htmlFor={field.name}
                            className="block mb-2 font-medium text-gray-700"
                          >
                            {field.label}

                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              id={field.name}
                              name={field.name}
                              required={field.required}
                              rows={4}
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                            />
                          ) : (
                            <input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              required={field.required}
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* TERMS */}
                    {product.form.terms && (
                      <div className="border rounded-lg bg-white p-5">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            name="terms"
                            value="accepted"
                            required
                            className="mt-1"
                          />

                          <span className="text-sm text-gray-600">
                            {product.form.terms}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* SUBMIT */}
                    <div className="text-center pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                      >
                        Submit Enquiry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = hardwareProducts.find((item) => item.slug === slug);

  return {
    title: product
      ? `${product.name} | Nishkarsh IT Solution`
      : "Hardware Product | Nishkarsh IT Solution",

    description:
      product?.description ||
      "Explore hardware products from Nishkarsh IT Solution.",
  };
}

export const dynamic = "force-dynamic";
