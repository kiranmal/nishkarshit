"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BankingTabs from "@/components/banking/BankingTabs";

import {
  submitBankCspApplicationAction,
  type FormState,
} from "@/app/actions/forms";

/* =========================================================
   EXISTING OUTLETS
========================================================= */

const outlets = [
  {
    name: "Outlet 1",
    image: "/assets/outlet1-D4N06ACz.jpg",
  },
  {
    name: "Outlet 2",
    image: "/assets/outlet2-CBonR_Xo.jpg",
  },
  {
    name: "Outlet 3",
    image: "/assets/outlet3-C_rzPI7E.jpg",
  },
  {
    name: "Outlet 4",
    image: "/assets/outlet4-CW7BiuNl.jpg",
  },
  {
    name: "Outlet 5",
    image: "/assets/outlet5-mvPRuR9Z.jpg",
  },
  {
    name: "Outlet 6",
    image: "/assets/outlet6-C-Ul_WgG.jpg",
  },
  {
    name: "Outlet 7",
    image: "/assets/outlet7-BZmCWgI-.jpg",
  },
  {
    name: "Outlet 8",
    image: "/assets/outlet8-c9nxy11u.jpg",
  },
  {
    name: "Outlet 9",
    image: "/assets/outlet11-DtRuPkPN.jpg",
  },
];

/* =========================================================
   ELIGIBILITY
========================================================= */

const eligibility = [
  "उम्र कम-से-कम 18 वर्ष (At least 18 years of age)",
  "मैट्रिक या उससे ज्यादा पास होना (Matric or above)",
  "आवेदक को कंप्यूटर ज्ञान होना चाहिए (Computer literate)",
  "अपने बिजनेस प्रोजेक्ट हेतु पैसा लगाने के इच्छुक हो (Willing to invest some money in project)",
  "जिम्मेदार (Responsible)",
  "मेहनती (Laborious)",
  "बेरोजगार व्यक्ति (Unemployed)",
];

/* =========================================================
   BANK LIST
========================================================= */

const banks = [
  "Allahabad Bank",
  "Andhra Bank",
  "Axis Bank",
  "Bank of Baroda",
  "Bank of India",
  "Bank of Maharashtra",
  "Canara Bank",
  "Central Bank of India",
  "City Union Bank",
  "Corporation Bank",
  "Federal Bank",
  "ICICI Bank",
  "IDBI Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "IndusInd Bank",
  "ING Vysya Bank",
  "Karur Vysya Bank",
  "Kotak Bank",
  "Laxmi Vilas Bank",
  "Oriental Bank of Commerce",
  "South Indian Bank",
  "State Bank of Bikaner",
  "State Bank of Hyderabad",
  "State Bank of India",
  "State Bank of Mysore",
  "State Bank of Patiala",
  "Syndicate Bank",
  "UCO Bank",
  "Union Bank of India",
  "United Bank of India",
  "Vijaya Bank",
  "Yes Bank Ltd",
  "Jharkhand Rajya Gramin Bank",
  "Vananchal Gramin Bank",
];

/* =========================================================
   PAGE
========================================================= */

export default function BankCspPage() {
  const [showApplication, setShowApplication] = useState(false);

  const applicationRef = useRef<HTMLElement | null>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitBankCspApplicationAction,
    null,
  );

  /* =========================================================
     SCROLL TO FORM WHEN APPLY NOW IS CLICKED
  ========================================================= */

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
        <BankingTabs active="/banking/bank-csp" />

        {/* =====================================================
            BANK CSP INTRODUCTION
        ====================================================== */}

        <section className="bg-[#0b1a33] text-white py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            {/* Heading */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-amber-400 uppercase tracking-wide">
                BANK CSP
              </h1>
            </div>

            {/* Main CSP Image */}
            <div className="mb-12">
              <img
                src="/assets/BankCSP-XdzgrlC3.webp"
                alt="Bank CSP"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* =================================================
                ELIGIBILITY
            ================================================== */}

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-6">
                Eligibility for Opening &amp; Maintaining of Bank CSP
              </h2>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <ol className="list-decimal list-inside space-y-3 text-white text-base md:text-lg">
                  {eligibility.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* =================================================
                  APPLY NOW BUTTON
              ================================================== */}

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
                    Apply Now →
                  </button>

                  <p className="text-gray-400 text-sm mt-3">
                    Click above to open the Bank CSP application form.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            EXISTING OUTLETS
        ====================================================== */}

        <section className="bg-[#0b1a33] text-white pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold uppercase">
                OUR EXISTING OUTLETS
              </h2>
            </div>

            {/* Outlet Slider */}
            <div className="relative">
              <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-5 scrollbar-hide">
                {outlets.map((outlet) => (
                  <div
                    key={outlet.name}
                    className="
                      flex-shrink-0
                      w-[85%]
                      sm:w-[60%]
                      md:w-[45%]
                      lg:w-[32%]
                      snap-center
                      overflow-hidden
                      rounded-xl
                      bg-white/5
                      border
                      border-white/10
                      shadow-xl
                    "
                  >
                    <img
                      src={outlet.image}
                      alt={outlet.name}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-400 text-sm mt-2">
                ← Swipe to view more outlets →
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CSP APPLICATION FORM
            HIDDEN UNTIL APPLY NOW IS CLICKED
        ====================================================== */}

        {showApplication && (
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
                        Bank CSP
                      </p>

                      <h2 className="text-2xl md:text-4xl font-bold">
                        CSP Application Form
                      </h2>

                      <p className="text-gray-300 mt-3">
                        Please fill in all the required details carefully as per
                        your Aadhaar and proposed CSP location.
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
                        Application Submitted Successfully
                      </h3>

                      <p>
                        Thank you for submitting your Bank CSP application. Our
                        team will review your details and contact you regarding
                        the next steps.
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
        )}

        {/* =====================================================
            BANK ENQUIRY
        ====================================================== */}

        <section className="bg-[#0f1624] text-white py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
              {/* =================================================
                  INFORMATION
              ================================================== */}

              <div className="relative min-h-[450px] flex items-center">
                <img
                  src="/assets/BankCSP-XdzgrlC3.webp"
                  alt="Bank CSP"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-[#07152b]/90" />

                <div className="relative z-10 p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-5">
                    Chat With Our Team
                  </h2>

                  <p className="text-gray-300 leading-7 max-w-md">
                    Our team is available to answer your questions regarding
                    Bank CSP applications, eligibility and the onboarding
                    process.
                  </p>
                </div>
              </div>

              {/* =================================================
                  ENQUIRY FORM
              ================================================== */}

              <div className="bg-[#0f1624] p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  CREATE AN ENQUIRY
                </h2>

                <p className="text-gray-400 mb-7">
                  Send us a message and our team will get back to you.
                </p>

                <form className="space-y-5">
                  <input
                    required
                    name="name"
                    placeholder="Full Name"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-transparent
                      border
                      border-gray-600
                      text-white
                      placeholder-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-transparent
                      border
                      border-gray-600
                      text-white
                      placeholder-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <select
                    name="bank"
                    required
                    defaultValue=""
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-[#0f1624]
                      border
                      border-gray-600
                      text-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>

                    {banks.map((bank) => (
                      <option key={bank} value={bank} className="text-black">
                        {bank}
                      </option>
                    ))}
                  </select>

                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-transparent
                      border
                      border-gray-600
                      text-white
                      placeholder-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <input
                    required
                    name="address"
                    placeholder="Address"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-transparent
                      border
                      border-gray-600
                      text-white
                      placeholder-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <textarea
                    required
                    name="comments"
                    rows={4}
                    placeholder="Message"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-lg
                      bg-transparent
                      border
                      border-gray-600
                      text-white
                      placeholder-gray-500
                      resize-none
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <button
                    type="submit"
                    className="
                      w-full
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-semibold
                      py-3.5
                      rounded-lg
                      transition
                    "
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <FloatingButtons />
    </>
  );
}
