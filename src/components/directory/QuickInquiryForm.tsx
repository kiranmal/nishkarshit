"use client";

import { useActionState } from "react";
import { submitListingInquiryAction, type EnquiryFormState } from "@/app/actions/enquiry";

export default function QuickInquiryForm({ listingName }: { listingName: string }) {
  const action = submitListingInquiryAction.bind(null, listingName);
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    action,
    null
  );

  if (state?.success) {
    return (
      <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
        Sent! They&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input name="name" placeholder="Your name" required className="input" />
      <input name="phone" placeholder="Phone" className="input" />
      <textarea name="message" placeholder="Message" rows={3} required className="input" />
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
