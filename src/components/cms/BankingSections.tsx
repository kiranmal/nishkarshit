"use client";

import { useState } from "react";
import type { CmsSectionDoc } from "@/lib/models";
import { CmsSections, type FormCtx } from "@/components/cms/CmsSections";

/** Client wrapper for banking pages: owns the "application form open" state shared by the Apply button and the form section. */
export default function BankingSections({ sections }: { sections: CmsSectionDoc[] }) {
  const [open, setOpen] = useState(false);
  const ctx: FormCtx = { open, openForm: () => setOpen(true), closeForm: () => setOpen(false) };
  return <CmsSections sections={sections} theme="banking" ctx={ctx} />;
}
