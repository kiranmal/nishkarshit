import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, can } from "@/lib/auth";
import { listLeads, STATUS_LABEL } from "@/lib/forms/registry";

export const runtime = "nodejs";

/** Spreadsheet formula injection guard: a leading = + - @ would execute in Excel. */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin.role, "forms")) return new NextResponse("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(req.nextUrl.searchParams);
  const { leads } = await listLeads(sp, 1, 5000);

  const header = ["Date", "Form", "Reference", "Name", "Email", "Phone", "Status", "Notes", "Details"];
  const rows = leads.map((l) => [
    l.createdAt.toISOString(), l.formLabel, l.reference ?? "", l.name, l.email, l.phone, STATUS_LABEL[l.status], l.notes,
    l.fields.map((f) => `${f.label}: ${f.value}`).join(" | "),
  ]);
  const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
