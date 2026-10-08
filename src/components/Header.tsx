"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { expertiseItems } from "@/data/expertiseFallback";
import { downloadDocuments } from "@/data/pagesFallback";
import { useSiteContent } from "@/components/SiteContentProvider";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  isButton?: boolean;
  children?: { label: string; href: string }[];
  mega?: boolean;
};

export default function Header() {
  const { header, expertiseLinks } = useSiteContent();
  const navItems: NavItem[] = header.items
    .filter((i) => i.visible)
    .map((i) => {
      const auto =
        i.autoChildren === "expertise"
          ? expertiseLinks ?? expertiseItems.map((e) => ({ label: e.title, href: `/expertise/${e.slug}` }))
          : i.autoChildren === "downloads"
            ? downloadDocuments.map((d) => ({ label: d.title, href: "/download" }))
            : [];
      const manual = i.children.filter((c) => c.visible).map((c) => ({ label: c.label, href: c.href }));
      const children = [...auto, ...manual];
      return {
        label: i.label,
        href: i.href || "/",
        external: i.openInNewTab,
        isButton: i.style === "button",
        mega: i.autoChildren === "expertise",
        children: children.length ? children : undefined,
      };
    });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full bg-white sticky top-10 z-40 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={header.logo}
            alt={header.logoAlt}
            className="w-16 h-16 object-contain"
            style={{ animation: "logo-fade-in 0.6s ease-out" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    item.isButton
                      ? "flex items-center gap-1 text-[15px] font-semibold text-white bg-brand-cyan hover:bg-brand-navy transition-colors py-2.5 px-5 rounded-full"
                      : "flex items-center gap-1 text-[15px] font-semibold text-brand-navy hover:text-brand-cyan transition-colors py-2"
                  }
                >
                  {item.label}
                  {item.children && <ChevronDown size={15} />}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={
                    item.isButton
                      ? "flex items-center gap-1 text-[15px] font-semibold text-white bg-brand-cyan hover:bg-brand-navy transition-colors py-2.5 px-5 rounded-full"
                      : "flex items-center gap-1 text-[15px] font-semibold text-brand-navy hover:text-brand-cyan transition-colors py-2"
                  }
                >
                  {item.label}
                  {item.children && <ChevronDown size={15} />}
                </Link>
              )}

              {item.children && openDropdown === item.label && (
                <div
                  className={`absolute top-full left-0 bg-white shadow-xl rounded-md border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1 duration-150 ${
                    item.mega
                      ? "min-w-[280px] max-h-80 overflow-y-auto"
                      : "min-w-[220px]"
                  }`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-cyan/10 hover:text-brand-cyan"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="xl:hidden text-brand-navy"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-gray-100 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 font-semibold text-brand-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2 font-semibold text-brand-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
              {item.children && (
                <div className="pl-4 space-y-1 pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-1 text-sm text-gray-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
