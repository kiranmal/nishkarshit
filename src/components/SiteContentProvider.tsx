"use client";

import { createContext, useContext } from "react";
import type { HeaderContent, FooterContent } from "@/lib/cms/modules";
import { defaultHeader, defaultFooter } from "@/lib/cms/modules";

type SiteContent = { header: HeaderContent; footer: FooterContent; expertiseLinks?: { label: string; href: string }[] };
const Ctx = createContext<SiteContent>({ header: defaultHeader, footer: defaultFooter });

/** Supplies CMS-managed header/footer content to the (client) Header and Footer components. */
export function SiteContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSiteContent = () => useContext(Ctx);
