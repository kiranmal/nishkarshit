"use client";

import { useActionState } from "react";
import DirectoryAuthCard from "@/components/directory/DirectoryAuthCard";
import { clientLoginAction, type CustomerAuthState } from "@/app/directory/customer/actions";

export default function ClientLoginPage() {
  const [state, formAction, pending] = useActionState<CustomerAuthState, FormData>(
    clientLoginAction,
    null
  );

  return (
    <DirectoryAuthCard title="Client Login">
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
          <input type="email" name="email" required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
          <input type="password" name="password" required className="input" />
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
          {pending ? "Signing in…" : "Login"}
        </button>
        <p className="text-xs text-gray-400 text-center pt-2">
          Client accounts are created by an admin — contact us if you need access.
        </p>
      </form>
    </DirectoryAuthCard>
  );
}
