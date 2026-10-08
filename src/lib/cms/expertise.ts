import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type ExpertiseItemDoc } from "@/lib/models";
import { expertiseItems, type ExpertiseItem } from "@/data/expertiseFallback";
import type { EntitySeo } from "./seo-fields";

export type ExpertiseView = ExpertiseItem & { seo?: EntitySeo };

function fromDoc(doc: ExpertiseItemDoc): ExpertiseView {
  const base = expertiseItems.find((e) => e.slug === doc.slug);
  const options = doc.formOptions?.length ? doc.formOptions.map((label) => ({ label })) : base?.form?.options ?? [];
  return {
    slug: doc.slug,
    title: doc.title || base?.title || doc.slug,
    paragraph: doc.paragraph || base?.paragraph || "",
    accent: doc.accent || base?.accent || "#17b6e8",
    image: doc.image || (base?.image && !/^YOUR-/i.test(base.image) ? base.image : undefined),
    introImage: doc.introImage || base?.introImage || undefined,
    sections: doc.sections?.length ? doc.sections : base?.sections,
    form: { title: doc.formTitle || base?.form?.title || doc.title, options },
    seo: doc.seo,
  };
}

/**
 * Published expertise pages. Once the collection has any record the database is the source of truth
 * (so deleting/unpublishing a page really hides it); until then the code defaults are shown.
 */
export async function getExpertiseList(): Promise<ExpertiseView[]> {
  if (isDbConfigured()) {
    try {
      const col = (await getDb()).collection<ExpertiseItemDoc>(COLLECTIONS.expertiseItems);
      if ((await col.estimatedDocumentCount()) > 0) {
        const docs = await col.find({ status: "published" }).sort({ order: 1 }).toArray();
        return docs.map(fromDoc);
      }
    } catch (err) {
      console.error("[expertise] DB read failed, using defaults:", err);
    }
  }
  return expertiseItems;
}

export async function getExpertise(slug: string): Promise<ExpertiseView | null> {
  const list = await getExpertiseList();
  return list.find((e) => e.slug === slug) ?? null;
}
