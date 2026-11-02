"use client";

import { useActionState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import {
  submitHomeEnquiryAction,
  type EnquiryFormState,
} from "@/app/actions/enquiry";
import type { EnquiryContent } from "@/lib/cms/home";

/** Heading, texts, WhatsApp/phone buttons and labels come from the database (Admin → Homepage → "Enquiry"). */
export default function EnquirySection({
  content,
}: {
  content: EnquiryContent;
}) {
  const [state, formAction, pending] = useActionState<
    EnquiryFormState,
    FormData
  >(submitHomeEnquiryAction, null);

  return (
    <section id="enquiry" className="py-16 md:py-10 bg-[#000000]">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-sm ">
        {/* Chat with our team */}
        <div className=" text-white p-8 md:p-10 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-3">{content.chatTitle}</h3>
          <p className="text-white/60 mb-8 leading-relaxed">
            {content.chatText}
          </p>
          <div className="space-y-3">
            <a
              href={content.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-5 py-3 transition-colors"
            >
              <MessageCircle size={18} /> {content.whatsappLabel}
            </a>
            <a
              href={content.phoneHref}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-5 py-3 transition-colors"
            >
              <Phone size={18} /> {content.phoneLabel}
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#0F1624] p-8 md:p-10">
          {state?.success ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
              {content.successText}
            </p>
          ) : (
            <form action={formAction} className="space-y-4">
              <h2
                className="text-3xl md:text-4xl font-bold text-[#FFFFFF]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {content.formTitle}
              </h2>
              <div>
                <label className="block text-sm font-medium text-[#FFFFFF] mb-1.5">
                  Name
                </label>
                <input name="name" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#FFFFFF] mb-1.5">
                  Email
                </label>
                <input type="email" name="email" required className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#FFFFFF] mb-1.5">
                  Phone
                </label>
                <input name="phone" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#FFFFFF] mb-1.5">
                  Message
                </label>
                <textarea name="message" required rows={4} className="input" />
              </div>
              {state?.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {state.error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors disabled:opacity-60"
              >
                {pending ? "Submitting…" : content.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
