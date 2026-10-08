"use client";

import { useActionState } from "react";
import { createUserAction, type UserResult } from "./actions";

export default function CreateUserForm() {
  const [state, action, pending] = useActionState<UserResult, FormData>(createUserAction, null);
  return (
    <form action={action} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid sm:grid-cols-2 gap-3">
      <h2 className="font-bold sm:col-span-2">Add user</h2>
      <input name="name" placeholder="Full name" className="input" />
      <input name="email" type="email" placeholder="Email" required className="input" />
      <select name="role" defaultValue="editor" className="input">
        <option value="editor">Editor — content &amp; images</option>
        <option value="admin">Admin — content, forms, SEO</option>
        <option value="super_admin">Super Admin — everything</option>
      </select>
      <input name="password" type="password" minLength={10} placeholder="Password (min 10 characters)" required className="input" autoComplete="new-password" />
      <button disabled={pending} className="sm:col-span-2 justify-self-start bg-brand-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">{pending ? "Creating…" : "Create user"}</button>
      {state && <p className={`sm:col-span-2 text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
    </form>
  );
}
