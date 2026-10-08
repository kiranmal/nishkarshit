import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { ShieldCheck, Users, User, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const options = [
  {
    label: "Admin Login",
    href: "/admin/login",
    icon: ShieldCheck,
    desc: "For Nishkarsh IT Solution staff managing the site.",
  },
  {
    label: "Client Login",
    href: "/directory/client/login",
    icon: Users,
    desc: "For business clients working with our team.",
  },
  {
    label: "Customer Login",
    href: "/directory/customer/login",
    icon: User,
    desc: "Manage your directory listing and inquiries.",
  },
  {
    label: "Create Customer Account",
    href: "/directory/customer/signup",
    icon: UserPlus,
    desc: "New here? Create a customer account.",
  },
];

export default function LoginLandingPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <section className="bg-white border-b border-gray-100 py-14 text-center">
          <h1
            className="text-4xl font-bold text-[#1b2430]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Login / Sign Up
          </h1>
          <p className="text-gray-500 mt-2">Choose how you&apos;d like to sign in</p>
        </section>

        <section className="max-w-[900px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {options.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <o.icon size={28} className="text-brand-cyan mb-3" />
              <h3 className="font-bold text-brand-navy mb-1">{o.label}</h3>
              <p className="text-sm text-gray-500">{o.desc}</p>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/login");
}
