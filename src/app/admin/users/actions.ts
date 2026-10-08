"use server";

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type AdminUserDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";

export type UserResult = { ok: boolean; message: string } | null;
const ROLE_SET = ["super_admin", "admin", "editor"];
const col = async () => (await getDb()).collection<AdminUserDoc>(COLLECTIONS.adminUsers);

export async function createUserAction(_prev: UserResult, fd: FormData): Promise<UserResult> {
  try { await assertPermission("users"); } catch (e) { return { ok: false, message: (e as Error).message }; }
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const name = String(fd.get("name") || "").trim().slice(0, 100);
  const role = String(fd.get("role") || "editor");
  const password = String(fd.get("password") || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email." };
  if (!ROLE_SET.includes(role)) return { ok: false, message: "Choose a role." };
  if (password.length < 10) return { ok: false, message: "Password must be at least 10 characters." };
  const c = await col();
  if (await c.findOne({ email })) return { ok: false, message: "A user with that email already exists." };
  await c.insertOne({ email, name, role: role as AdminUserDoc["role"], passwordHash: await bcrypt.hash(password, 12), createdAt: new Date() });
  revalidatePath("/admin/users");
  return { ok: true, message: `Created ${email}.` };
}

async function superAdminCount() {
  const c = await col();
  return c.countDocuments({ $or: [{ role: "super_admin" }, { role: { $exists: false } }] });
}

export async function changeRoleAction(id: string, fd: FormData) {
  const me = await assertPermission("users");
  const role = String(fd.get("role") || "");
  if (!ObjectId.isValid(id) || !ROLE_SET.includes(role)) return;
  const c = await col();
  const u = await c.findOne({ _id: new ObjectId(id) });
  if (!u) return;
  if (u.email === me.email && role !== "super_admin") return; // can't demote yourself
  if ((u.role ?? "super_admin") === "super_admin" && role !== "super_admin" && (await superAdminCount()) <= 1) return;
  await c.updateOne({ _id: u._id }, { $set: { role: role as AdminUserDoc["role"] } });
  revalidatePath("/admin/users");
}

export async function resetPasswordAction(id: string, fd: FormData) {
  await assertPermission("users");
  const password = String(fd.get("password") || "");
  if (!ObjectId.isValid(id) || password.length < 10) return;
  await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { passwordHash: await bcrypt.hash(password, 12) } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(id: string) {
  const me = await assertPermission("users");
  if (!ObjectId.isValid(id)) return;
  const c = await col();
  const u = await c.findOne({ _id: new ObjectId(id) });
  if (!u || u.email === me.email) return; // can't delete yourself
  if ((u.role ?? "super_admin") === "super_admin" && (await superAdminCount()) <= 1) return;
  await c.deleteOne({ _id: u._id });
  revalidatePath("/admin/users");
}
