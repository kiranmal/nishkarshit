"use client";

import { useActionState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";
import {
  submitDirectoryContactAction,
  type EnquiryFormState,
} from "@/app/actions/enquiry";

export default function DirectoryContactPage() {
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    submitDirectoryContactAction,
    null
  );

  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="bg-gray-50 border-b border-gray-100 py-14 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Contact Us
          </h1>
          <p className="text-gray-500 mt-2">We&apos;d love to hear from you</p>
        </section>

        <section className="max-w-[1100px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Message</h2>

            {state?.success ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                Thanks — your message has been sent. We&apos;ll get back to you soon.
              </p>
            ) : (
              <form action={formAction} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Name
                  </label>
                  <input name="name" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Email
                  </label>
                  <input type="email" name="email" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Mobile Number
                  </label>
                  <input name="phone" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Message
                  </label>
                  <textarea name="message" required rows={5} className="input" />
                </div>
                {state?.error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {state.error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-blue-600 text-white font-semibold px-8 py-3 hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Contact Information
              </h2>
              <p className="font-semibold text-gray-900 mb-1">Any Questions?</p>
              <p className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                <Phone size={14} /> 01169270913
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-2 mb-5">
                <Mail size={14} /> info@nishkarshit.com
              </p>
              <p className="font-semibold text-gray-900 mb-1">Address</p>
              <p className="text-gray-500 text-sm flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                First Floor, B Block, Sector 2, Noida, Uttar Pradesh 201301, India
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64">
              <iframe
                title="Location map"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Sector+2,+Noida,+Uttar+Pradesh+201301&output=embed"
              />
            </div>
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
