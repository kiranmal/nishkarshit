import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "nis_admin_session";
const SESSION_TTL = "7d";

import { can, type Role, type Permission } from "@/lib/auth-shared";
export { can, ROLES, PERMISSIONS } from "@/lib/auth-shared";
export type { Role, Permission } from "@/lib/auth-shared";

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to .env.local (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string, role: Role = "super_admin"): Promise<string> {
  return new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey());
}

export type AdminSession = { email: string; role: Role };

function normalizeRole(value: unknown): Role {
  // Sessions issued before roles existed belong to the original (bootstrap) admin.
  return value === "admin" || value === "editor" || value === "super_admin" ? value : "super_admin";
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.email === "string") {
      return { email: payload.email, role: normalizeRole(payload.role) };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string, role: Role = "super_admin") {
  const token = await createSessionToken(email, role);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Server-side guard for admin pages, server actions and API routes.
 * Pages: redirects to login / dashboard. Use `requirePermissionOrThrow` in actions.
 */
export async function requirePermission(permission: Permission): Promise<AdminSession> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (!can(admin.role, permission)) redirect("/admin?denied=1");
  return admin;
}

/** Same check for server actions / route handlers — throws instead of redirecting. */
export async function assertPermission(permission: Permission): Promise<AdminSession> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Not authenticated");
  if (!can(admin.role, permission)) throw new Error("You do not have permission to do that");
  return admin;
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
