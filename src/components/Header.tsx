"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";

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
          ? (expertiseLinks ??
            expertiseItems.map((e) => ({
              label: e.title,
              href: `/expertise/${e.slug}`,
            })))
          : i.autoChildren === "downloads"
            ? downloadDocuments.map((d) => ({
                label: d.title,
                href: "/download",
              }))
            : [];
      const manual = i.children
        .filter((c) => c.visible)
        .map((c) => ({ label: c.label, href: c.href }));
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
  const pathname = usePathname();
  // The menu counts as open only on the page it was opened on, so navigating (links, back/forward) closes it without an effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const mobileOpen = openedOn === pathname;
  const setMobileOpen = (v: boolean | ((p: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(mobileOpen) : v;
    setOpenedOn(next ? pathname : null);
  };
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // While the mobile menu is open: lock page scroll behind it and let Escape close it.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="w-full bg-white sticky top-13 z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-2.5 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={header.logo}
              alt={header.logoAlt}
              className="w-[72px] h-[72px] sm:w-20 sm:h-20 object-contain"
              style={{ animation: "logo-fade-in 0.6s ease-out" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.label)
                }
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

          {/* Mobile toggle — three bars morph into an X */}
          <button
            type="button"
            className="xl:hidden relative w-12 h-12 flex items-center justify-center text-brand-navy rounded-xl border-2 border-brand-navy/20 active:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block w-7 h-[22px]" aria-hidden="true">
              <span
                className={`absolute left-0 h-[3px] w-7 rounded bg-current transition-all duration-300 ease-out ${mobileOpen ? "top-[9.5px] rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-[9.5px] h-[3px] w-7 rounded bg-current transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 h-[3px] w-7 rounded bg-current transition-all duration-300 ease-out ${mobileOpen ? "top-[9.5px] -rotate-45" : "top-[19px]"}`}
              />
            </span>
          </button>
        </div>

        {/* Mobile nav: slides open smoothly, scrolls inside itself when long (e.g. the expertise list) */}
        <div
          id="mobile-nav"
          className={`xl:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out ${mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
          aria-hidden={!mobileOpen}
        >
          <div className="overflow-hidden">
            <nav className="border-t border-gray-100 px-4 pt-2 pb-5 max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain">
              {navItems.map((item) => {
                const isOpen = expanded === item.label;
                const linkCls = item.isButton
                  ? "flex-1 text-center my-2 rounded-full bg-brand-cyan text-white font-semibold py-3"
                  : "flex-1 min-h-14 flex items-center font-semibold text-brand-navy text-lg";
                const close = () => setOpenedOn(null);
                return (
                  <div
                    key={item.label}
                    className={
                      item.isButton
                        ? ""
                        : "border-b border-gray-100 last:border-0"
                    }
                  >
                    <div className="flex items-center">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkCls}
                          onClick={close}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={linkCls}
                          onClick={close}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.children && (
                        <button
                          type="button"
                          className="w-14 h-14 flex items-center justify-center text-brand-navy shrink-0"
                          aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                          aria-expanded={isOpen}
                          onClick={() =>
                            setExpanded(isOpen ? null : item.label)
                          }
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {item.children && (
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="pl-3 pb-2 border-l-2 border-brand-cyan/30 ml-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                tabIndex={isOpen ? 0 : -1}
                                className="flex items-center min-h-12 pl-3 text-base text-gray-700 active:text-brand-cyan"
                                onClick={close}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold text-brand-navy">
                <a
                  href="tel:01169270913"
                  className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 active:bg-gray-100"
                >
                  <Phone size={18} />
                  Call
                </a>
                <a
                  href="https://wa.me/911169270913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 active:bg-gray-100"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a
                  href="mailto:info@nishkarshit.com"
                  className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 active:bg-gray-100"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Dimmed backdrop: tap outside the menu to close it */}
      <div
        className={`xl:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpenedOn(null)}
        aria-hidden="true"
      />
    </>
  );
}
