"use client";

import { useState } from "react";
import type { ExpertiseItem } from "@/data/expertiseFallback";
import { submitExpertiseEnquiryAction } from "@/app/actions/expertise";

export default function ExpertiseEnquiryForm({
  item,
}: {
  item: ExpertiseItem;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const values: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      if (typeof v === "string") values[k] = v;
    });
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitExpertiseEnquiryAction(item.slug, item.form?.title || item.title, values);
      if (res.success) setSubmitted(true);
      else setError(res.error);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-gray-900 px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>

          <p className="text-gray-600">
            Your enquiry for <strong>{item.form?.title || item.title}</strong>{" "}
            has been submitted successfully.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8">
          {/* COMPANY */}
          <div className="text-center mb-6">
            <a
              href="/"
              className="text-xl md:text-2xl font-semibold text-gray-800"
            >
              Nishkarsh IT Solution Pvt. Ltd.
            </a>
          </div>

          {/* EXPERTISE TITLE */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {item.form?.title || item.title}
          </h2>

          <hr className="my-5 border-gray-200" />

          {error && (
            <p role="alert" className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* honeypot — hidden from people, bots fill it */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            {/* FULL NAME */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Email
              </label>

              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* MOBILE */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Mobile number
              </label>

              <input
                type="tel"
                name="mobile"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* COMPANY */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Name of Company/ Firm/
                Individual
              </label>

              <input
                type="text"
                name="company"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* REGISTRATION CATEGORY */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-3">
                <span className="text-red-500">*</span> Registration Category
              </label>

              <div className="space-y-3">
                {["Proprietorship", "Individual", "Other"].map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <input
                      type="radio"
                      name="registrationCategory"
                      value={category}
                      required
                    />

                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Address
              </label>

              <input
                type="text"
                name="address"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SERVICE OPTIONS */}
            {item.form?.options && item.form.options.length > 0 && (
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-3">
                  <span className="text-red-500">*</span> Service
                </label>

                <div className="space-y-4">
                  {item.form.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-start gap-3 text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="service"
                        value={option.label}
                        className="mt-1"
                      />

                      <span className="text-sm leading-relaxed">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGE */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Message
              </label>

              <textarea
                name="message"
                rows={6}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SUBMIT */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="col-md-12 text-center">
        <span className="copyright-footer">
          2026 Copyright Nishkarsh IT Solution Pvt. Ltd.{" "}
        </span>
      </div>
    </main>
  );
}
