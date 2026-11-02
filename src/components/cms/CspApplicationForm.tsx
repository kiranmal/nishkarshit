"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitBankCspApplicationAction, type FormState } from "@/app/actions/forms";

/**
 * Bank CSP application form (functional KYC form — its fields are validated by the server action).
 * The surrounding copy (eyebrow, heading, intro, success message) comes from the CMS section.
 */
export default function CspApplicationForm({ eyebrow, title, intro, successText, onClose }: { eyebrow: string; title: string; intro: string; successText: string; onClose: () => void }) {
  const applicationRef = useRef<HTMLElement | null>(null);
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitBankCspApplicationAction, null);

  useEffect(() => {
    const t = setTimeout(() => applicationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
            ref={applicationRef}
            id="csp-application"
            className="bg-gray-50 py-16 md:py-20 scroll-mt-24"
          >
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* =================================================
                    FORM HEADER
                ================================================== */}

                <div className="bg-[#0b1a33] text-white px-6 md:px-10 py-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                      <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
                        {eyebrow}
                      </p>

                      <h2 className="text-2xl md:text-4xl font-bold">
                        {title}
                      </h2>

                      <p className="text-gray-300 mt-3">
                        {intro}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        Fields marked with{" "}
                        <span className="text-red-400">*</span> are mandatory.
                      </p>
                    </div>

                    {/* CLOSE FORM */}
                    <button
                      type="button"
                      onClick={() => onClose()}
                      className="
                        self-start
                        md:self-center
                        rounded-full
                        border
                        border-white/20
                        px-5
                        py-2
                        text-sm
                        text-gray-300
                        hover:bg-white/10
                        hover:text-white
                        transition
                      "
                    >
                      Close Form
                    </button>
                  </div>
                </div>

                {/* =================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {state?.success ? (
                  <div className="p-8 md:p-12">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-700">
                      <h3 className="text-xl font-bold mb-2">
                        Application Submitted Successfully
                      </h3>

                      <p>
                        {successText}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* =================================================
                     COMPLETE APPLICATION FORM
                  ================================================== */

                  <form action={formAction} className="p-6 md:p-10 space-y-10">
                    {/* =================================================
                        PERSONAL DETAILS
                    ================================================== */}

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                        Personal Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div>
                          <label className="form-label">
                            Full Name (as per Aadhaar) *
                          </label>

                          <input
                            name="fullName"
                            required
                            type="text"
                            autoComplete="name"
                            placeholder="Enter full name"
                            className="input w-full"
                            minLength={2}
                            maxLength={100}
                          />
                        </div>

                        {/* Father / Spouse */}
                        <div>
                          <label className="form-label">
                            Father / Spouse Name *
                          </label>

                          <input
                            name="fatherOrSpouseName"
                            required
                            type="text"
                            placeholder="Enter father / spouse name"
                            className="input w-full"
                            minLength={2}
                            maxLength={100}
                          />
                        </div>

                        {/* DOB */}
                        <div>
                          <label className="form-label">
                            Date of Birth (DD/MM/YYYY) *
                          </label>

                          <input
                            name="dob"
                            required
                            type="text"
                            placeholder="DD/MM/YYYY"
                            pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
                            title="Please enter date in DD/MM/YYYY format"
                            className="input w-full"
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="form-label">Gender *</label>

                          <div className="flex gap-6 items-center h-[46px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value="Male"
                                required
                              />
                              <span>Male</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value="Female"
                              />
                              <span>Female</span>
                            </label>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div>
                          <label className="form-label">Nationality *</label>

                          <input
                            name="nationality"
                            required
                            type="text"
                            defaultValue="Indian"
                            className="input w-full"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="form-label">Email ID *</label>

                          <input
                            name="email"
                            required
                            type="email"
                            placeholder="example@email.com"
                            autoComplete="email"
                            className="input w-full"
                          />
                        </div>

                        {/* Mobile */}
                        <div>
                          <label className="form-label">Mobile Number *</label>

                          <input
                            name="phone"
                            required
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            pattern="[6-9][0-9]{9}"
                            title="Enter a valid 10-digit mobile number"
                            placeholder="10-digit mobile number"
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        PERMANENT ADDRESS
                    ================================================== */}

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                        Permanent Address
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Ward */}
                        <div>
                          <label className="form-label">
                            Ward No (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarWardNo"
                            required
                            type="text"
                            placeholder="Ward No"
                            className="input w-full"
                          />
                        </div>

                        {/* Village */}
                        <div>
                          <label className="form-label">
                            Village (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarVillage"
                            required
                            type="text"
                            placeholder="Village"
                            className="input w-full"
                          />
                        </div>

                        {/* Gram Panchayat */}
                        <div>
                          <label className="form-label">
                            Gram Panchayat (As per Aadhaar)
                          </label>

                          <input
                            name="aadhaarGramPanchayat"
                            type="text"
                            placeholder="Gram Panchayat"
                            className="input w-full"
                          />
                        </div>

                        {/* Post */}
                        <div>
                          <label className="form-label">
                            Post (As per Aadhaar)
                          </label>

                          <input
                            name="aadhaarPost"
                            type="text"
                            placeholder="Post"
                            className="input w-full"
                          />
                        </div>

                        {/* Police Station */}
                        <div>
                          <label className="form-label">
                            Police Station (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarPoliceStation"
                            required
                            type="text"
                            placeholder="Police Station"
                            className="input w-full"
                          />
                        </div>

                        {/* Block */}
                        <div>
                          <label className="form-label">
                            Block (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarBlock"
                            required
                            type="text"
                            placeholder="Block"
                            className="input w-full"
                          />
                        </div>

                        {/* District */}
                        <div>
                          <label className="form-label">
                            Dist. (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarDistrict"
                            required
                            type="text"
                            placeholder="District"
                            className="input w-full"
                          />
                        </div>

                        {/* State */}
                        <div>
                          <label className="form-label">
                            State (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarState"
                            required
                            type="text"
                            placeholder="State"
                            className="input w-full"
                          />
                        </div>

                        {/* PIN */}
                        <div>
                          <label className="form-label">
                            PIN (As per Aadhaar) *
                          </label>

                          <input
                            name="aadhaarPin"
                            required
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            pattern="[1-9][0-9]{5}"
                            title="Enter a valid 6-digit PIN code"
                            placeholder="6-digit PIN"
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        CSP LOCATION
                    ================================================== */}

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                        Proposed CSP Location
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Village */}
                        <div>
                          <label className="form-label">
                            Village (As per CSP Location)
                          </label>

                          <input
                            name="cspVillage"
                            type="text"
                            placeholder="Village"
                            className="input w-full"
                          />
                        </div>

                        {/* Ward */}
                        <div>
                          <label className="form-label">
                            Ward No (As per CSP Location)
                          </label>

                          <input
                            name="cspWardNo"
                            type="text"
                            placeholder="Ward No"
                            className="input w-full"
                          />
                        </div>

                        {/* Gram Panchayat */}
                        <div>
                          <label className="form-label">
                            Gram Panchayat (As per CSP Location) *
                          </label>

                          <input
                            name="cspGramPanchayat"
                            required
                            type="text"
                            placeholder="Gram Panchayat"
                            className="input w-full"
                          />
                        </div>

                        {/* Post */}
                        <div>
                          <label className="form-label">
                            Post (As per CSP Location) *
                          </label>

                          <input
                            name="cspPost"
                            required
                            type="text"
                            placeholder="Post"
                            className="input w-full"
                          />
                        </div>

                        {/* Police Station */}
                        <div>
                          <label className="form-label">
                            Police Station (As per CSP Location) *
                          </label>

                          <input
                            name="cspPoliceStation"
                            required
                            type="text"
                            placeholder="Police Station"
                            className="input w-full"
                          />
                        </div>

                        {/* Block */}
                        <div>
                          <label className="form-label">
                            Block (As per CSP Location) *
                          </label>

                          <input
                            name="cspBlock"
                            required
                            type="text"
                            placeholder="Block"
                            className="input w-full"
                          />
                        </div>

                        {/* District */}
                        <div>
                          <label className="form-label">
                            Dist. (As per CSP Location) *
                          </label>

                          <input
                            name="cspDistrict"
                            required
                            type="text"
                            placeholder="District"
                            className="input w-full"
                          />
                        </div>

                        {/* State */}
                        <div>
                          <label className="form-label">
                            State (As per CSP Location) *
                          </label>

                          <input
                            name="cspState"
                            required
                            type="text"
                            placeholder="State"
                            className="input w-full"
                          />
                        </div>

                        {/* PIN */}
                        <div>
                          <label className="form-label">
                            PIN (As per CSP Location) *
                          </label>

                          <input
                            name="cspPin"
                            required
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            pattern="[1-9][0-9]{5}"
                            title="Enter a valid 6-digit PIN code"
                            placeholder="6-digit PIN"
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        BRANCH & BANK DETAILS
                    ================================================== */}

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                        Branch &amp; Bank Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Distance */}
                        <div>
                          <label className="form-label">
                            Distance from Branch *
                          </label>

                          <div className="relative">
                            <input
                              name="branchDistance"
                              required
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter distance"
                              className="input w-full pr-16"
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                              KM
                            </span>
                          </div>
                        </div>

                        {/* Branch Name */}
                        <div>
                          <label className="form-label">
                            Link Branch Name *
                          </label>

                          <input
                            name="linkBranchName"
                            required
                            type="text"
                            placeholder="Link Branch Name"
                            className="input w-full"
                          />
                        </div>

                        {/* IFSC */}
                        <div>
                          <label className="form-label">IFSC Code *</label>

                          <input
                            name="ifscCode"
                            required
                            type="text"
                            maxLength={11}
                            pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}"
                            title="Enter a valid 11-character IFSC code"
                            placeholder="Example: SBIN0001234"
                            className="input w-full uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        KYC DETAILS
                    ================================================== */}

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                        KYC Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Aadhaar */}
                        <div>
                          <label className="form-label">Aadhaar Number *</label>

                          <input
                            name="aadhaarNumber"
                            required
                            type="text"
                            inputMode="numeric"
                            maxLength={12}
                            pattern="[0-9]{12}"
                            title="Aadhaar number must contain exactly 12 digits"
                            placeholder="12-digit Aadhaar number"
                            className="input w-full"
                          />
                        </div>

                        {/* PAN */}
                        <div>
                          <label className="form-label">
                            PAN Card Number *
                          </label>

                          <input
                            name="panNumber"
                            required
                            type="text"
                            maxLength={10}
                            pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                            title="Enter a valid PAN number"
                            placeholder="Example: ABCDE1234F"
                            className="input w-full uppercase"
                          />
                        </div>

                        {/* DS / CS / EMP */}
                        <div>
                          <label className="form-label">
                            Name Of DS/CS/EMP.
                          </label>

                          <input
                            name="dsCsEmpName"
                            type="text"
                            placeholder="Name of DS / CS / EMP"
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {state?.error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
                        {state.error}
                      </div>
                    )}

                    {/* =================================================
                        SUBMIT
                    ================================================== */}

                    <div className="pt-5 border-t">
                      <button
                        type="submit"
                        disabled={pending}
                        className="
                          w-full
                          md:w-auto
                          min-w-[240px]
                          rounded-full
                          bg-[#0b1a33]
                          hover:bg-blue-600
                          disabled:bg-gray-400
                          disabled:cursor-not-allowed
                          text-white
                          font-semibold
                          px-10
                          py-4
                          transition-all
                          duration-300
                        "
                      >
                        {pending
                          ? "Submitting Application..."
                          : "Submit CSP Application"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
  );
}
