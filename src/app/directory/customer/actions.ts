"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type DirectoryCustomerDoc } from "@/lib/models";
import { createSessionToken } from "@/lib/auth";

export type CustomerAuthState = { error?: string } | null;

const CUSTOMER_COOKIE = "nis_directory_customer";

export async function customerSignupAction(
  _prevState: CustomerAuthState,
  formData: FormData
): Promise<CustomerAuthState> {
  const name = String(formData.get("name") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !mobile || !email || !password) {
    return { error: "Please fill out this field." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (!isDbConfigured()) {
    return {
      error: "MONGODB_URI is not configured yet — set it in .env.local first.",
    };
  }

  const db = await getDb();
  const customers = db.collection<DirectoryCustomerDoc>(
    COLLECTIONS.directoryCustomers
  );
  const existing = await customers.findOne({ email });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await customers.insertOne({
    name,
    email,
    mobile: mobile || undefined,
    address: address || undefined,
    passwordHash,
    createdAt: new Date(),
  });

  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/directory");
}

export async function customerLoginAction(
  _prevState: CustomerAuthState,
  formData: FormData
): Promise<CustomerAuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }
  if (!isDbConfigured()) {
    return {
      error: "MONGODB_URI is not configured yet — set it in .env.local first.",
    };
  }

  const db = await getDb();
  const customer = await db
    .collection<DirectoryCustomerDoc>(COLLECTIONS.directoryCustomers)
    .findOne({ email });

  if (!customer) return { error: "No account with that email." };

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) return { error: "Incorrect password." };

  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/directory");
}

const CLIENT_COOKIE = "nis_directory_client";

export async function clientLoginAction(
  _prevState: CustomerAuthState,
  formData: FormData
): Promise<CustomerAuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }
  if (!isDbConfigured()) {
    return {
      error: "MONGODB_URI is not configured yet — set it in .env.local first.",
    };
  }

  const db = await getDb();
  const client = await db
    .collection<import("@/lib/models").DirectoryClientDoc>(COLLECTIONS.directoryClients)
    .findOne({ email });

  if (!client) return { error: "No client account with that email." };

  const valid = await bcrypt.compare(password, client.passwordHash);
  if (!valid) return { error: "Incorrect password." };

  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/directory");
}
