"use client";

import { useRouter } from "next/navigation";
import ContentEditor from "@/components/admin/ContentEditor";
import type { Field } from "@/lib/cms/schema";

type SaveResult = { ok: true; data: Record<string, unknown>; id?: string } | { ok: false; error: string };

/** ContentEditor for records that live in their own collection; after creating a new record it jumps to its edit page. */
export default function EntityEditor({ fields, initial, save, id, editBase, publicPath, resetAction }: {
  fields: Field[]; initial: Record<string, unknown>; save: (id: string, json: string) => Promise<SaveResult>; id: string; editBase: string; publicPath?: string;
  resetAction?: () => Promise<SaveResult>;
}) {
  const router = useRouter();
  return (
    <ContentEditor
      wide
      fields={fields}
      initial={initial}
      publicPath={publicPath}
      resetAction={resetAction}
      saveAction={async (json) => {
        const r = await save(id, json);
        if (r.ok && id === "new" && r.id) router.replace(`${editBase}/${r.id}`);
        return r;
      }}
    />
  );
}
