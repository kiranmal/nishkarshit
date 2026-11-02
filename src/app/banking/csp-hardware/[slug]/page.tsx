import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";
import HardwareEnquiryForm from "@/components/cms/HardwareEnquiryForm";
import { optimizeImage } from "@/lib/img";
import { buildMetadata } from "@/lib/seo";
import { findHardware, plain } from "@/lib/cms/store";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export default async function HardwareProductPage({ params }: Props) {
  const { slug } = await params;
  const found = await findHardware(slug);
  if (found && "redirectTo" in found) redirect(`/banking/csp-hardware/${found.redirectTo}`); // slug was renamed in the admin
  const product = found && "product" in found ? plain(found.product) : null;

  if (!product) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Product Not Found</h1>
            <Link href="/banking/csp-hardware" className="mt-5 inline-block text-red-600 font-semibold">← Back to Hardware Products</Link>
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
            <Link href="/banking/csp-hardware" className="text-white/80 hover:text-white mb-6 inline-block">← Back to Hardware Products</Link>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="min-h-[240px] md:min-h-[350px] flex flex-col items-center justify-center bg-gray-50 p-8 gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img decoding="async" src={optimizeImage(product.image, 900)} alt={product.name} className="max-h-[400px] w-full object-contain" />
                  {product.images.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3">
                      {product.images.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} loading="lazy" src={optimizeImage(src, 300)} alt={`${product.name} ${i + 2}`} className="h-20 w-20 object-contain rounded border border-gray-200 bg-white p-1" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>{product.name}</h1>
                  <p className="mt-5 text-gray-600 leading-7">{product.description}</p>
                  {product.unitPrice && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-500">Unit Price</p>
                      <p className="text-2xl font-bold text-red-600">₹{product.unitPrice}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t bg-gray-50 p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Enquire About This Product</h2>
                  <p className="text-gray-600 mb-8">Please fill in the details below to enquire about <strong>{product.name}</strong>.</p>
                  <HardwareEnquiryForm slug={product.slug} name={product.name} fields={product.formFields} terms={product.terms} />
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
  const found = await findHardware(slug);
  if (!found || !("product" in found)) return { title: "Hardware Product | Nishkarsh IT Solution", robots: { index: false } };
  const p = found.product;
  return buildMetadata(`/banking/csp-hardware/${p.slug}`, { title: `${p.name} | Nishkarsh IT Solution`, description: p.description, image: p.image }, p.seo);
}
