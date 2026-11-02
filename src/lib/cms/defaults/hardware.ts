import { hardwareProducts } from "@/data/pagesFallback";
import type { HardwareFormField, HardwareProductDoc } from "@/lib/models";

/** Hardware catalogue as shipped in src/data/pagesFallback.ts — imported into the database by the seed. */
export function hardwareDefaults(): Omit<HardwareProductDoc, "_id" | "createdAt" | "updatedAt">[] {
  return hardwareProducts.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    image: p.image,
    images: [],
    unitPrice: p.form.unitPrice ?? "",
    formFields: p.form.fields.map((f) => ({ name: f.name, label: f.label, type: f.type as HardwareFormField["type"], required: Boolean(f.required) })),
    terms: p.form.terms ?? "",
    status: "published" as const,
    order: i,
    seo: {},
    source: "default" as const,
  }));
}
