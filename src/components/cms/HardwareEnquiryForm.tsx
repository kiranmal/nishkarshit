"use client";

import { useActionState } from "react";
import { submitHardwareEnquiryAction } from "@/app/actions/cms-forms";
import type { FormState } from "@/app/actions/forms";
import type { HardwareFormField } from "@/lib/models";

/** Enquiry form of a hardware product — its fields and terms are defined per product in the admin. */
export default function HardwareEnquiryForm({ slug, name, fields, terms }: { slug: string; name: string; fields: HardwareFormField[]; terms: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitHardwareEnquiryAction.bind(null, slug), null);
  if (state?.success) {
    return <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-emerald-700"><h3 className="text-xl font-bold mb-1">Enquiry submitted</h3><p>Thank you — our team will contact you about {name} shortly.</p></div>;
  }
  const cls = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500";
  return (
    <form action={action} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <label htmlFor={field.name} className="block mb-2 font-medium text-gray-700">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === "textarea"
              ? <textarea id={field.name} name={field.name} required={field.required} rows={4} className={cls} />
              : <input id={field.name} name={field.name} type={field.type} required={field.required} className={cls} />}
          </div>
        ))}
      </div>
      {terms && (
        <div className="border rounded-lg bg-white p-5">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="terms" value="accepted" required className="mt-1" />
            <span className="text-sm text-gray-600">{terms}</span>
          </label>
        </div>
      )}
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <div className="text-center pt-4">
        <button type="submit" disabled={pending} className="px-8 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 transition">{pending ? "Submitting…" : "Submit Enquiry"}</button>
      </div>
    </form>
  );
}
