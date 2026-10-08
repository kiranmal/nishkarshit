"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/directory" },
  { label: "Listings", href: "/directory/listings" },
  { label: "Categories", href: "/directory/categories" },
  { label: "Pricing", href: "/directory/pricing" },
  { label: "Contact", href: "/directory/contact-us" },
  { label: "Blogs", href: "/directory/blogs" },
  { label: "Magazine", href: "/directory/magazine" },
];

const loginOptions = [
  { label: "Admin Login", href: "/admin/login" },
  { label: "Client Login", href: "/directory/client/login" },
  { label: "Customer Login", href: "/directory/customer/login" },
  { label: "Create Customer Account", href: "/directory/customer/signup" },
];

export default function DirectoryHeader() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 h-[76px] flex items-center justify-between">
        <Link href="/directory" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://directory.nishkarshit.com/srm.jpeg"
            alt="Social Route Media"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <div className="font-bold text-lg leading-tight text-gray-900">
              Social Route Media
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              Business Directory Platform
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block relative">
          <button
            onClick={() => setLoginOpen((v) => !v)}
            onBlur={() => setTimeout(() => setLoginOpen(false), 150)}
            className="flex items-center gap-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-blue-700 transition-colors"
          >
            Login <ChevronDown size={15} />
          </button>
          {loginOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {loginOptions.map((o) => (
                <Link
                  key={o.href}
                  href={o.href}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {o.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2">
            {loginOptions.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="block py-2 text-sm font-medium text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
