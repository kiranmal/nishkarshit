"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type AdminUserDoc } from "@/lib/models";
import { setSessionCookie, clearSessionCookie, type Role } from "@/lib/auth";

export type LoginState = { error?: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }

  if (!isDbConfigured()) {
    return {
      error:
        "MONGODB_URI is not configured yet. Add it to .env.local, run the seed script, then try again.",
    };
  }

  const db = await getDb();
  const admin = await db
    .collection<AdminUserDoc>(COLLECTIONS.adminUsers)
    .findOne({ email });

  if (!admin) {
    return { error: "No admin account with that email." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Incorrect password." };
  }

  await setSessionCookie(email, (admin.role as Role | undefined) ?? "super_admin");
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
