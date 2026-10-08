import { redirect } from "next/navigation";

/** Superseded by the unified Forms & Enquiries screen. */
export default function LegacyEnquiries() {
  redirect("/admin/forms");
}
