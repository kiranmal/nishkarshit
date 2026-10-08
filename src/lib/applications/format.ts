import type { FieldDef } from "./config";

/** Human-readable value for review / admin screens. */
export function formatFieldValue(field: FieldDef, value: string | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "—";
  if (field.type === "date") {
    const d = new Date(`${v}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  if (field.validate === "amount" || field.validate === "income") {
    return `₹${Number(v).toLocaleString("en-IN")}`;
  }
  if (field.validate === "mobile") return `+91 ${v}`;
  return v;
}
