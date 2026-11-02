import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ContentEditor from "@/components/admin/ContentEditor";
import { requirePermission } from "@/lib/auth";
import { getCmsPage } from "@/lib/cms/store";
import { bankingPageFields } from "@/lib/cms/sections";
import { pageToForm } from "@/lib/cms/form-map";
import { resetPageAction, savePageAction } from "../../cms-actions";

export const dynamic = "force-dynamic";

export default async function BankingCspAdmin() {
  await requirePermission("content");
  const page = await getCmsPage("bank-csp");
  if (!page) return null;
  return (
    <AdminShell active="/admin/banking/csp">
      <h1 className="text-2xl font-bold text-brand-navy mb-1" style={{ fontFamily: "var(--font-poppins)" }}>Banking · Bank CSP</h1>
      <p className="text-gray-500 text-sm mb-6">Public page: <Link href="/banking/bank-csp" target="_blank" className="text-blue-600">/banking/bank-csp ↗</Link>. Add, hide, reorder or edit any section — new sections appear automatically.</p>
      <ContentEditor wide fields={bankingPageFields} initial={pageToForm(page)} publicPath="/banking/bank-csp"
        saveAction={savePageAction.bind(null, "bank-csp")} resetAction={resetPageAction.bind(null, "bank-csp")} />
    </AdminShell>
  );
}
