import { cache } from "react";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type SiteContentDoc } from "@/lib/models";
import { mergeDefaults } from "./schema";
import { CMS_MODULES, defaultHeader, defaultFooter, defaultSettings, type HeaderContent, type FooterContent, type SettingsContent } from "./modules";

/** Reads stored content for a module, merged over its shipped defaults. Never throws — falls back to defaults. */
async function readContent<T>(key: string, defaults: T): Promise<T> {
  if (!isDbConfigured()) return defaults;
  try {
    const db = await getDb();
    const doc = await db.collection<SiteContentDoc>(COLLECTIONS.siteContent).findOne({ _id: key });
    return doc ? mergeDefaults(defaults, doc.data) : defaults;
  } catch (err) {
    console.error(`[cms] could not read "${key}", using defaults:`, err);
    return defaults;
  }
}

export const getContent = cache(<T,>(key: string, defaults: T) => readContent(key, defaults));

export const getHeader = () => getContent<HeaderContent>("header", defaultHeader);
export const getFooter = () => getContent<FooterContent>("footer", defaultFooter);
export const getSettings = () => getContent<SettingsContent>("settings", defaultSettings);

export async function getStoredContent(key: string) {
  const def = CMS_MODULES[key];
  if (!def) return null;
  const merged = await readContent(key, def.defaults);
  let customised = false;
  if (isDbConfigured()) {
    try {
      const db = await getDb();
      customised = Boolean(await db.collection<SiteContentDoc>(COLLECTIONS.siteContent).findOne({ _id: key }, { projection: { _id: 1 } }));
    } catch { /* ignore */ }
  }
  return { data: merged, customised };
}
