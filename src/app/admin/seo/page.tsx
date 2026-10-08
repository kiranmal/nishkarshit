import AdminShell from "@/components/admin/AdminShell";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { requirePermission } from "@/lib/auth";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type SeoMetaDoc } from "@/lib/models";
import { deleteSeoAction, upsertSeoAction } from "@/app/admin/seo/actions";
import { SEO_PAGES } from "@/lib/seo-pages";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requirePermission("seo");
  let seoMap: Record<string, SeoMetaDoc> = {};
  if (isDbConfigured()) {
    const docs = await (await getDb()).collection<SeoMetaDoc>(COLLECTIONS.seoMeta).find().toArray();
    seoMap = Object.fromEntries(docs.map((d) => [d.pageSlug, d]));
  }
  const groups = [...new Set(SEO_PAGES.map((p) => p.group))];

  return (
    <AdminShell active="/admin/seo">
      <h1 className="text-2xl font-bold text-brand-navy mb-1" style={{ fontFamily: "var(--font-poppins)" }}>SEO</h1>
      <p className="text-gray-500 text-sm mb-2 max-w-2xl">
        Meta title, description, keywords, canonical URL, Open Graph, Twitter/X and robots for every public page. Blank fields fall back to the
        built-in default, then to the global defaults in <Link href="/admin/settings" className="text-blue-600">Site Settings</Link>.
        Expertise pages also have their own SEO panel inside <Link href="/admin/expertise" className="text-blue-600">Expertise</Link>.
      </p>
      {!isDbConfigured() && <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">MongoDB isn&apos;t connected — SEO can&apos;t be saved.</div>}

      {groups.map((g) => (
        <div key={g} className="mt-6">
          <h2 className="font-bold text-gray-800 mb-2">{g}</h2>
          <div className="space-y-3">
            {SEO_PAGES.filter((p) => p.group === g).map((page) => {
              const e = seoMap[page.slug];
              return (
                <details key={page.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <summary className="cursor-pointer font-semibold text-brand-navy">
                    {page.label} <span className="text-gray-400 font-normal text-sm">{page.slug}</span>
                    {e ? <span className="ml-2 text-xs font-normal text-green-600">customised</span> : <span className="ml-2 text-xs font-normal text-gray-400">using defaults</span>}
                    {e?.noIndex && <span className="ml-2 text-xs font-normal text-red-600">noindex</span>}
                  </summary>
                  <form action={upsertSeoAction} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="hidden" name="pageSlug" value={page.slug} />
                    <div className="md:col-span-2"><label className="lbl">Meta title</label><input name="title" defaultValue={e?.title} maxLength={120} className="input" placeholder={page.title} /></div>
                    <div className="md:col-span-2"><label className="lbl">Meta description</label><textarea name="description" defaultValue={e?.description} rows={2} maxLength={400} className="input" placeholder={page.description} /></div>
                    <div className="md:col-span-2"><label className="lbl">Meta keywords (comma separated)</label><input name="keywords" defaultValue={e?.keywords} className="input" /></div>
                    <div className="md:col-span-2"><label className="lbl">Canonical URL (optional)</label><input name="canonicalUrl" defaultValue={e?.canonicalUrl} className="input" placeholder={page.slug} /></div>
                    <div><label className="lbl">Open Graph title</label><input name="ogTitle" defaultValue={e?.ogTitle} className="input" /></div>
                    <div><label className="lbl">Twitter/X title</label><input name="twitterTitle" defaultValue={e?.twitterTitle} className="input" /></div>
                    <div><label className="lbl">Open Graph description</label><textarea name="ogDescription" defaultValue={e?.ogDescription} rows={2} className="input" /></div>
                    <div><label className="lbl">Twitter/X description</label><textarea name="twitterDescription" defaultValue={e?.twitterDescription} rows={2} className="input" /></div>
                    <ImageUploadField name="ogImage" label="Open Graph image" defaultValue={e?.ogImage} />
                    <ImageUploadField name="twitterImage" label="Twitter/X image" defaultValue={e?.twitterImage} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noIndex" defaultChecked={e?.noIndex} /> Hide from search engines (noindex, also removed from sitemap)</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noFollow" defaultChecked={e?.noFollow} /> Don&apos;t follow links (nofollow)</label>
                    <div className="md:col-span-2 flex items-center gap-4">
                      <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">Save</button>
                      {e && <button formAction={deleteSeoAction.bind(null, String(e._id))} className="text-sm text-red-600">Reset to defaults</button>}
                    </div>
                  </form>
                </details>
              );
            })}
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
