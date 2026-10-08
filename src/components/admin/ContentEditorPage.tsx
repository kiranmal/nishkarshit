import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { CMS_MODULES } from "@/lib/cms/modules";
import { getStoredContent } from "@/lib/cms/content";
import { isDbConfigured } from "@/lib/mongodb";
import { saveContentAction, resetContentAction } from "@/app/admin/content-actions";

/** Shared page body for every schema-driven content module (/admin/header, /admin/footer, …). */
export default async function ContentEditorPage({ moduleKey, active }: { moduleKey: string; active: string }) {
  const mod = CMS_MODULES[moduleKey];
  await requirePermission(mod.permission);
  const stored = await getStoredContent(moduleKey);
  return (
    <AdminShell active={active}>
      <h1 className="text-2xl font-bold text-brand-navy mb-1" style={{ fontFamily: "var(--font-poppins)" }}>{mod.title}</h1>
      <p className="text-gray-500 mb-6 text-sm max-w-2xl">{mod.description}</p>
      {!isDbConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          MongoDB isn&apos;t connected — you can view the defaults but saving is disabled until <code>MONGODB_URI</code> is set.
        </div>
      )}
      <ContentEditor saveAction={saveContentAction.bind(null, moduleKey)} resetAction={resetContentAction.bind(null, moduleKey)} fields={mod.fields} initial={stored!.data} customised={stored!.customised} publicPath={mod.publicPath} />
    </AdminShell>
  );
}
