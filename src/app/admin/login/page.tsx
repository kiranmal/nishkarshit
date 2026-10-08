"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/auth-actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6f8] px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-lg bg-brand-navy text-white font-bold flex items-center justify-center">
          NIS
        </div>
        <span className="text-2xl font-bold text-gray-900">NIS</span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="input"
              placeholder="admin@nishkarshit.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Password
            </label>
            <input type="password" name="password" required className="input" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-gray-500 underline">
              Forgot your password?
            </a>
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-gray-900 text-white text-sm font-bold uppercase tracking-wide py-3 hover:bg-brand-navy transition-colors disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Log In"}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-400 mt-8">© 2026 NIS System. All rights reserved.</p>
      <p className="text-xs text-gray-400 mt-2 max-w-sm text-center">
        First time here? Run <code>npm run seed:admin</code> after setting{" "}
        <code>MONGODB_URI</code> and <code>ADMIN_SESSION_SECRET</code> in{" "}
        <code>.env.local</code>.
      </p>
    </div>
  );
}
