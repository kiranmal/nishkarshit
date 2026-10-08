import ContentEditorPage from "@/components/admin/ContentEditorPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return <ContentEditorPage moduleKey="header" active="/admin/header" />;
}
