"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/app/admin/auth-actions";
import { can, type Permission, type Role } from "@/lib/auth-shared";

type NavLink = { href: string; label: string; permission?: Permission };
const navGroups: { label: string; links: NavLink[] }[] = [
  { label: "Overview", links: [{ href: "/admin", label: "Dashboard" }] },
  {
    label: "Website",
    links: [
      { href: "/admin/homepage", label: "Homepage Sections" },
      { href: "/admin/header", label: "Header & Navigation" },
      { href: "/admin/footer", label: "Footer" },
      { href: "/admin/expertise", label: "Expertise Pages" },
      { href: "/admin/management-team", label: "Management Team" },
      { href: "/admin/services", label: "Services Page" },
      { href: "/admin/blogs", label: "Blogs" },
      { href: "/admin/careers", label: "Careers / Jobs" },
      { href: "/admin/events", label: "Festivals / Events" },
    ],
  },
  {
    label: "Leads",
    links: [{ href: "/admin/forms", label: "Forms & Enquiries", permission: "forms" }],
  },
  {
    label: "Assets",
    links: [{ href: "/admin/media", label: "Media Library", permission: "media" }],
  },
  {
    label: "Site",
    links: [
      { href: "/admin/seo", label: "SEO", permission: "seo" },
      { href: "/admin/settings", label: "Site Settings", permission: "settings" },
      { href: "/admin/users", label: "Users & Roles", permission: "users" },
    ],
  },
];

function SidebarContent({ active, role, onNavigate }: { active: string; role: Role; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-6 py-5 border-b border-white/10">
        <div className="font-bold text-lg" style={{ fontFamily: "var(--font-poppins)" }}>
          Nishkarsh IT
        </div>
        <div className="text-xs text-white/50">Admin panel</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => ({ ...group, links: group.links.filter((l) => !l.permission || can(role, l.permission)) })).filter((g) => g.links.length > 0).map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wide text-white/30 mb-1">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active === link.href
                      ? "bg-brand-cyan text-brand-navy"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <form action={logoutAction} className="px-3 py-4 border-t border-white/10">
        <button
          type="submit"
          className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:bg-white/10"
        >
          Log out
        </button>
      </form>
    </>
  );
}

export default function AdminShellClient({
  active,
  role,
  children,
}: {
  active: string;
  role: Role;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f5f6f8]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-brand-navy text-white flex-col">
        <SidebarContent active={active} role={role} />
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-brand-navy text-white flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/70"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <SidebarContent active={active} role={role} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} className="text-brand-navy" />
          </button>
          <span className="font-bold text-brand-navy text-sm">Admin panel</span>
          <span className="w-[22px]" />
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
