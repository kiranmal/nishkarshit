"use client";

import Link from "next/link";
import { useActionState } from "react";
import DirectoryAuthCard from "@/components/directory/DirectoryAuthCard";
import { customerSignupAction, type CustomerAuthState } from "@/app/directory/customer/actions";

export default function CustomerSignupPage() {
  const [state, formAction, pending] = useActionState<CustomerAuthState, FormData>(
    customerSignupAction,
    null
  );

  return (
    <DirectoryAuthCard
      title="Create Customer Account"
      subtitle="Your email will be verified with a one-time code."
      footer={
        <span className="text-gray-500">
          Already have an account?{" "}
          <Link href="/directory/customer/login" className="text-indigo-600 font-semibold">
            Log in
          </Link>
        </span>
      }
    >
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
            <input name="name" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Mobile</label>
            <input name="mobile" required className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
          <input type="email" name="email" required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Address</label>
          <input name="address" className="input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
            <input type="password" name="password" required minLength={6} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Confirm Password</label>
            <input type="password" name="confirmPassword" required minLength={6} className="input" />
          </div>
        </div>
        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg text-white font-semibold py-3 transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#4f46e5" }}
        >
          {pending ? "Creating account…" : "Send Verification Code"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          (Account is created immediately in this build — SMS/email OTP delivery
          needs a provider like Twilio or SES wired in before this step is real.)
        </p>
      </form>
    </DirectoryAuthCard>
  );
}
