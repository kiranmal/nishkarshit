"use client";

import { useActionState, useState } from "react";
import {
  submitJobApplicationAction,
  type FormState,
} from "@/app/actions/forms";

export default function JobApplyForm({ jobTitle }: { jobTitle: string }) {
  const [open, setOpen] = useState(false);

  const action = submitJobApplicationAction.bind(null, jobTitle);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    null,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-cyan transition-colors"
      >
        Apply Now
      </button>
    );
  }

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        <p className="font-semibold">Application submitted successfully.</p>

        <p className="mt-1">
          Thanks — your application for <strong>{jobTitle}</strong> has been
          received.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl mt-5">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-90 z-0, bg-[#08283F]" />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0" />

      {/* Form */}
      <form
        action={formAction}
        encType="multipart/form-data"
        className="relative z-10 p-5 sm:p-7 lg:p-8 space-y-5"
      >
        {/* Heading */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-navy">
            Job Application Form
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            Please answer all questions with accurate details.
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Applying for:{" "}
            <span className="font-semibold text-brand-navy">{jobTitle}</span>
          </p>
        </div>

        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-brand-navy mb-3">
            Personal Information
          </h4>

          <div className="space-y-3">
            <input
              name="name"
              required
              placeholder="Full Name (as per Aadhaar) *"
              className="input w-full"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="phone"
                type="tel"
                required
                placeholder="Contact Number *"
                className="input w-full"
              />

              <input
                name="email"
                type="email"
                required
                placeholder="Email ID *"
                className="input w-full"
              />
            </div>

            <input
              name="city"
              required
              placeholder="Your Current City *"
              className="input w-full"
            />
          </div>
        </div>

        {/* Job Reference */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Job Reference By *
          </label>

          <select
            name="jobReference"
            required
            defaultValue=""
            className="input w-full"
          >
            <option value="" disabled>
              Select reference source
            </option>
            <option value="Job Portal / Website">Job Portal / Website</option>
            <option value="Social Sites">Social Sites</option>
            <option value="Employee">Employee</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Job Position */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Job Position *
          </label>

          <select
            name="jobPosition"
            required
            defaultValue=""
            className="input w-full"
          >
            <option value="" disabled>
              Select job position
            </option>

            <option value="Executive & Management">
              Executive & Management
            </option>

            <option value="Administrative & HR">Administrative & HR</option>

            <option value="Finance & Accounting">Finance & Accounting</option>

            <option value="IT & Technical">IT & Technical</option>

            <option value="Marketing & Sales">Marketing & Sales</option>

            <option value="Customer Support">Customer Support</option>

            <option value="Operations & Logistics">
              Operations & Logistics
            </option>

            <option value="Creative & Design">Creative & Design</option>
          </select>
        </div>

        {/* Job Role */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            For Which Job Role Do You Want to Apply? *
          </label>

          <select
            name="jobRole"
            required
            defaultValue=""
            className="input w-full"
          >
            <option value="" disabled>
              Select job role
            </option>

            <option value="Regional Manager">Regional Manager</option>
            <option value="State Head">State Head</option>
            <option value="ASM">ASM</option>
            <option value="TSM">TSM</option>
            <option value="Marketing Team">Marketing Team</option>
            <option value="Relationship Executive">
              Relationship Executive
            </option>
            <option value="Backend Team">Backend Team</option>
            <option value="Accountant">Accountant</option>
            <option value="HR Executive / Recruiter">
              HR Executive / Recruiter
            </option>
            <option value="Office Administrator">Office Administrator</option>
            <option value="Business Development Executive (BDE)">
              Business Development Executive (BDE)
            </option>
            <option value="Telecaller – Sales & Support">
              Telecaller – Sales & Support
            </option>
            <option value="Client Relationship Manager">
              Client Relationship Manager
            </option>
            <option value="Digital Marketing Manager">
              Digital Marketing Manager
            </option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Chief Technology Officer (CTO)">
              Chief Technology Officer (CTO)
            </option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <h4 className="font-semibold text-brand-navy mb-3">
            Salary & Experience
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="currentSalary"
              required
              placeholder="Current Salary / Month *"
              className="input w-full"
            />

            <input
              name="expectedSalary"
              required
              placeholder="Expected Salary / Month *"
              className="input w-full"
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Years of Experience in Applying Job Role *
          </label>

          <select
            name="experience"
            required
            defaultValue=""
            className="input w-full"
          >
            <option value="" disabled>
              Select experience
            </option>

            <option value="Fresher">Fresher</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="From 1-3 years">From 1-3 years</option>
            <option value="More than 5 years">More than 5 years</option>
          </select>
        </div>

        {/* Notice Period */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Notice Period *
          </label>

          <select
            name="noticePeriod"
            required
            defaultValue=""
            className="input w-full"
          >
            <option value="" disabled>
              Select notice period
            </option>

            <option value="Immediate">I can join Immediately</option>

            <option value="15 Days">15 Days</option>

            <option value="30 Days">30 Days</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Highest Qualification *
          </label>

          <input
            name="qualification"
            required
            placeholder="e.g. B.Tech, BCA, MBA, M.Com..."
            className="input w-full"
          />
        </div>

        {/* Resume */}
        <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
          <h4 className="font-semibold text-brand-navy">Resume / CV *</h4>

          <p className="text-xs text-gray-500 mt-1 mb-4">
            Upload your resume or provide a publicly accessible resume URL. The
            resume will be processed to extract relevant candidate details.
          </p>

          <div className="space-y-3">
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-700
                file:mr-4 file:rounded-lg file:border-0
                file:bg-brand-navy file:px-4 file:py-2
                file:text-sm file:font-semibold file:text-white
                hover:file:bg-brand-cyan"
            />

            <div className="text-center text-xs text-gray-500">OR</div>

            <input
              name="resumeUrl"
              type="url"
              placeholder="Resume URL (Google Drive, LinkedIn, etc.)"
              className="input w-full"
            />
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Additional Information
          </label>

          <textarea
            name="message"
            rows={4}
            placeholder="Tell us anything else you would like us to know..."
            className="input w-full"
          />
        </div>

        {/* Error */}
        {state?.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-brand-navy text-white text-sm font-semibold px-7 py-3 hover:bg-brand-cyan transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Submitting Application…" : "Submit Application"}
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-semibold px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
