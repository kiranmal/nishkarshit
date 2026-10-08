"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Handshake, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import {
  submitPartnerApplicationAction,
  type FormState,
} from "@/app/actions/forms";
import { partnershipBenefits } from "@/data/pagesFallback";

export default function PartnershipPage() {
  const [showApplication, setShowApplication] = useState(false);

  const applicationRef = useRef<HTMLElement | null>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitPartnerApplicationAction,
    null,
  );

  useEffect(() => {
    if (showApplication && applicationRef.current) {
      setTimeout(() => {
        applicationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showApplication]);

  return (
    <>
      <TopBar />
      <Header />

      <main>
        <div className="relative w-full min-h-[80vh]">
          <img
            alt="Partnership Background"
            className="absolute inset-0 w-full h-full object-cover opacity-80 z-0"
            src="https://plus.unsplash.com/premium_photo-1661771773771-a093c948ba92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFydG5lcnNoaXB8ZW58MHx8MHx8fDA%3D"
          />

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 py-10 text-white text-center bg-black/50">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-xl">
              🤝 Partnership Opportunities
            </h1>

            <p className="text-base sm:text-lg md:text-xl mb-6 drop-shadow-md max-w-2xl">
              Join us in our mission to empower businesses and individuals
              through innovative solutions. We are looking for partners who
              share our vision and values.
            </p>

            <ul className="text-left text-sm sm:text-base md:text-lg space-y-2 sm:space-y-3 mb-6 drop-shadow-md max-w-sm sm:max-w-md">
              <li>✅ Collaborate on projects</li>
              <li>✅ Share resources and expertise</li>
              <li>✅ Expand your network</li>
              <li>✅ Grow together in the digital landscape</li>
            </ul>

            {!showApplication && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setShowApplication(true)}
                  className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-bold
                      px-10
                      py-4
                      text-lg
                      shadow-lg
                      transition-all
                      duration-300
                      hover:scale-105
                    "
                >
                  Become a Partner →
                </button>

                <p className="text-gray-400 text-sm mt-3">
                  Click above to open the Bank CSP application form.
                </p>
              </div>
            )}
          </div>

          {showApplication && (
            <section
              ref={applicationRef}
              id="service-provider-registration"
              className="relative z-20 bg-[#092B45] py-16 md:py-20"
            >
              <div className="max-w-5xl mx-auto px-4 md:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* =================================================
            FORM HEADER
        ================================================== */}
                  <div className="bg-[#0b1a33] text-white px-6 md:px-10 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div>
                        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
                          Nishkarsh IT Solution Pvt. Ltd.
                        </p>

                        <h2 className="text-2xl md:text-4xl font-bold uppercase">
                          Service Provider Registration Form
                        </h2>

                        <p className="text-gray-300 mt-3">
                          Please fill in all the required details carefully.
                        </p>

                        <p className="text-sm text-yellow-300 font-semibold mt-3 uppercase">
                          All columns must be filled in CAPITAL LETTERS.
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          Fields marked with{" "}
                          <span className="text-red-400">*</span> are mandatory.
                        </p>
                      </div>

                      {/* CLOSE FORM */}
                      <button
                        type="button"
                        onClick={() => setShowApplication(false)}
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
                          Registration Submitted Successfully
                        </h3>

                        <p>
                          Thank you for submitting your Service Provider
                          Registration Form. Our team will review your details
                          and contact you regarding the next steps.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* =================================================
             COMPLETE REGISTRATION FORM
          ================================================== */

                    <form
                      action={formAction}
                      className="p-6 md:p-10 space-y-10"
                    >
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
                            <label className="form-label">Full Name *</label>

                            <input
                              name="fullName"
                              required
                              type="text"
                              autoComplete="name"
                              placeholder="ENTER FULL NAME"
                              minLength={2}
                              maxLength={100}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="form-label">Email *</label>

                            <input
                              name="email"
                              required
                              type="email"
                              autoComplete="email"
                              placeholder="ENTER EMAIL ADDRESS"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* Mobile */}
                          <div>
                            <label className="form-label">
                              Mobile Number *
                            </label>

                            <input
                              name="mobileNumber"
                              required
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              pattern="[6-9][0-9]{9}"
                              title="ENTER A VALID 10-DIGIT MOBILE NUMBER"
                              placeholder="ENTER 10-DIGIT MOBILE NUMBER"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* DOB */}
                          <div>
                            <label className="form-label">
                              Date of Birth *
                            </label>

                            <input
                              name="dateOfBirth"
                              required
                              type="date"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="form-label">
                              Gender (Please Tick) *
                            </label>

                            <div className="flex gap-8 items-center h-[46px]">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="MALE"
                                  required
                                />
                                <span>Male</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="FEMALE"
                                />
                                <span>Female</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                REGISTRATION DETAILS
            ================================================== */}

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                          Registration Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Company / Firm / Individual */}
                          <div>
                            <label className="form-label">
                              Name of Company / Firm / Individual
                            </label>

                            <input
                              name="companyFirmIndividual"
                              type="text"
                              placeholder="ENTER COMPANY / FIRM / INDIVIDUAL NAME"
                              maxLength={150}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Registration Category */}
                          <div>
                            <label className="form-label">
                              Registration Category *
                            </label>

                            <div className="flex flex-wrap gap-6 items-center min-h-[46px]">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="registrationCategory"
                                  value="PROPRIETORSHIP"
                                  required
                                />
                                <span>Proprietorship</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="registrationCategory"
                                  value="INDIVIDUAL"
                                />
                                <span>Individual</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="registrationCategory"
                                  value="OTHER"
                                />
                                <span>Other</span>
                              </label>
                            </div>
                          </div>

                          {/* Registered Office Address */}
                          <div className="md:col-span-2">
                            <label className="form-label">
                              Registered Office Address *
                            </label>

                            <textarea
                              name="registeredOfficeAddress"
                              required
                              rows={4}
                              placeholder="ENTER REGISTERED OFFICE ADDRESS"
                              maxLength={500}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Nature of Business */}
                          <div className="md:col-span-2">
                            <label className="form-label">
                              Nature of Business *
                            </label>

                            <textarea
                              name="natureOfBusiness"
                              required
                              rows={3}
                              placeholder="ENTER NATURE OF BUSINESS"
                              maxLength={300}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                KYC DETAILS
            ================================================== */}

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                          Identity &amp; Address Proof
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Aadhaar */}
                          <div>
                            <label className="form-label">
                              Identity and Address Proof Aadhaar Number *
                            </label>

                            <input
                              name="aadhaarNumber"
                              required
                              type="text"
                              inputMode="numeric"
                              maxLength={12}
                              pattern="[0-9]{12}"
                              title="AADHAAR NUMBER MUST CONTAIN EXACTLY 12 DIGITS"
                              placeholder="ENTER 12-DIGIT AADHAAR NUMBER"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* PAN */}
                          <div>
                            <label className="form-label">PAN Number *</label>

                            <input
                              name="panNumber"
                              required
                              type="text"
                              maxLength={10}
                              pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                              title="ENTER A VALID PAN NUMBER"
                              placeholder="ENTER PAN NUMBER"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                BANK DETAILS
            ================================================== */}

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                          Bank Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Account Holder */}
                          <div>
                            <label className="form-label">
                              Bank Details (Account Holder Name) *
                            </label>

                            <input
                              name="accountHolderName"
                              required
                              type="text"
                              placeholder="ENTER ACCOUNT HOLDER NAME"
                              maxLength={100}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Bank Name */}
                          <div>
                            <label className="form-label">Bank Name *</label>

                            <input
                              name="bankName"
                              required
                              type="text"
                              placeholder="ENTER BANK NAME"
                              maxLength={100}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Branch */}
                          <div>
                            <label className="form-label">Branch *</label>

                            <input
                              name="bankBranch"
                              required
                              type="text"
                              placeholder="ENTER BRANCH NAME"
                              maxLength={100}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Branch Code */}
                          <div>
                            <label className="form-label">Branch Code *</label>

                            <input
                              name="branchCode"
                              required
                              type="text"
                              placeholder="ENTER BRANCH CODE"
                              maxLength={20}
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
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
                              title="ENTER A VALID 11-CHARACTER IFSC CODE"
                              placeholder="ENTER IFSC CODE"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              onInput={(e) => {
                                e.currentTarget.value =
                                  e.currentTarget.value.toUpperCase();
                              }}
                            />
                          </div>

                          {/* Account Number */}
                          <div>
                            <label className="form-label">Account No. *</label>

                            <input
                              name="accountNumber"
                              required
                              type="text"
                              inputMode="numeric"
                              maxLength={30}
                              placeholder="ENTER ACCOUNT NUMBER"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                          </div>

                          {/* Nature of Account */}
                          <div className="md:col-span-2">
                            <label className="form-label">
                              Nature of Account *
                            </label>

                            <div className="flex flex-wrap gap-8 items-center min-h-[46px]">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="accountNature"
                                  value="SAVINGS ACCOUNT"
                                  required
                                />
                                <span>Savings Account</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="accountNature"
                                  value="CURRENT ACCOUNT"
                                />
                                <span>Current Account</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                DECLARATION
            ================================================== */}

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0b1a33] mb-6 pb-3 border-b">
                          Declaration *
                        </h3>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6">
                          <div className="space-y-4 text-sm md:text-base text-gray-700 leading-7">
                            <p>
                              I have been provided a copy of the detailed terms
                              &amp; conditions.
                            </p>

                            <p>
                              I confirm that the information(s) &amp;
                              particulars supplied by me are correct in all
                              respects.
                            </p>

                            <p>
                              I hereby declare that I do not have a Criminal
                              record.
                            </p>

                            <p>
                              I hereby agree to open an SCL wallet, along with
                              the KYC documents submitted with this form, on my
                              Mobile Number.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 mt-6 cursor-pointer">
                            <input
                              type="checkbox"
                              name="declarationAccepted"
                              value="YES"
                              required
                              className="mt-1.5 w-5 h-5"
                            />

                            <span className="text-sm md:text-base font-semibold text-[#0b1a33]">
                              I have read, understood and agree to all the above
                              declaration statements.
                            </span>
                          </label>
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
                  min-w-[260px]
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
                            ? "SUBMITTING REGISTRATION..."
                            : "SUBMIT REGISTRATION"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* =================================================
          FOOTER COPYRIGHT
      ================================================== */}

                <div className="text-center text-sm text-gray-500 mt-6">
                  2026 Copyright Nishkarsh IT Solution Pvt. Ltd.
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
