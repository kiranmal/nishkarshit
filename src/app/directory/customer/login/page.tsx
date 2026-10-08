"use client";

import Link from "next/link";
import { useActionState } from "react";
import DirectoryAuthCard from "@/components/directory/DirectoryAuthCard";
import { customerLoginAction, type CustomerAuthState } from "@/app/directory/customer/actions";

export default function CustomerLoginPage() {
  const [state, formAction, pending] = useActionState<CustomerAuthState, FormData>(
    customerLoginAction,
    null
  );

  return (
    <DirectoryAuthCard
      title="Customer Login"
      subtitle="Login to manage your product cart and inquiries."
      footer={
        <span className="text-gray-500">
          New customer?{" "}
          <Link href="/directory/customer/signup" className="text-indigo-600 font-semibold">
            Create account
          </Link>
        </span>
      }
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
          <input type="email" name="email" required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
          <input type="password" name="password" required className="input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300" />
          Remember me
        </label>
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
          {pending ? "Signing in…" : "Login"}
        </button>
      </form>
    </DirectoryAuthCard>
  );
}
