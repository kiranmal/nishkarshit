import type { CmsSectionDoc } from "@/lib/models";
import { blankSectionDefaults, normalizeSections } from "../sections";

type SecInput = Partial<Omit<CmsSectionDoc, "items" | "bullets" | "buttons">> & {
  items?: Record<string, unknown>[];
  bullets?: string[];
  buttons?: Partial<CmsSectionDoc["buttons"][number]>[];
};

/** Builds a fully-formed section from a terse description (used only for the shipped default content). */
export function sec(input: SecInput): CmsSectionDoc {
  const base = blankSectionDefaults() as unknown as CmsSectionDoc;
  return {
    ...base,
    ...input,
    items: (input.items ?? []).map((i) => ({ visible: true, ...i })),
    bullets: (input.bullets ?? []).map((text) => ({ text })),
    buttons: (input.buttons ?? []).map((b) => ({ label: "", href: "", action: "link", newTab: false, ...b })),
  } as CmsSectionDoc;
}

export const sections = (list: CmsSectionDoc[]) => normalizeSections(list);
export const tags = (list: string[]) => list.map((label) => ({ label }));
