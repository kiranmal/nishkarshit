"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type TeamMemberDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { sanitize } from "@/lib/cms/schema";
import { externalizeImages } from "@/lib/cms/persist-images";
import { teamFields } from "@/lib/cms/entities";
import { DEFAULT_MEMBERS } from "@/data/teamFallback";

type R = { ok: true; data: Record<string, unknown> } | { ok: false; error: string };
const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function refresh() {
  revalidatePath("/admin/management-team");
  revalidatePath("/management-team");
}

async function col() {
  return (await getDb()).collection<TeamMemberDoc>(COLLECTIONS.managementTeam);
}

/** Imports the shipped default members once. Existing slugs are never touched. */
export async function syncTeamDefaultsAction() {
  await assertPermission("content");
  const c = await col();
  let added = 0, existing = 0;
  for (const m of DEFAULT_MEMBERS) {
    const now = new Date();
    const r = await c.updateOne(
      { slug: m.slug },
      { $setOnInsert: { name: m.name, slug: m.slug, role: m.role, image: m.image, description: m.description ?? "", section: m.section, order: m.order, active: m.active, source: "default", createdAt: now, updatedAt: now } },
      { upsert: true }
    );
    if (r.upsertedCount) added++; else existing++;
  }
  refresh();
  return { added, existing };
}

export async function addMemberAction(formData: FormData) {
  await assertPermission("content");
  const name = String(formData.get("name") || "").trim().slice(0, 100);
  const section = String(formData.get("section") || "management");
  if (!name) return;
  const c = await col();
  // Database becomes source of truth once it has a record: bring the defaults along first.
  if ((await c.estimatedDocumentCount()) === 0) await syncTeamDefaultsAction();
  let slug = slugify(name) || "member";
  if (await c.findOne({ slug })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  const last = await c.find({ section: section as TeamMemberDoc["section"] }).sort({ order: -1 }).limit(1).toArray();
  const now = new Date();
  const r = await c.insertOne({
    name, slug, role: "", image: "", description: "",
    section: (["hod", "legal", "management", "our-team"].includes(section) ? section : "management") as TeamMemberDoc["section"],
    order: (last[0]?.order ?? 0) + 1, active: false, source: "custom", createdAt: now, updatedAt: now,
  });
  refresh();
  redirect(`/admin/management-team/${r.insertedId}`);
}

export async function saveMemberAction(id: string, payload: string): Promise<R> {
  let admin;
  try { admin = await assertPermission("content"); } catch (e) { return { ok: false, error: (e as Error).message }; }
  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid member." };
  if (payload.length > 3_000_000) return { ok: false, error: "Content is too large — upload big images instead of pasting them." };
  let parsed: unknown;
  try { parsed = JSON.parse(payload); } catch { return { ok: false, error: "Invalid data." }; }
  const d = await externalizeImages(sanitize(teamFields, parsed), admin.email);
  if (!d.name) return { ok: false, error: "Name is required." };
  await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { ...(d as object), updatedAt: new Date() } as never });
  refresh();
  return { ok: true, data: d };
}

export async function setMemberActiveAction(id: string, active: boolean) {
  await assertPermission("content");
  if (!ObjectId.isValid(id)) return;
  await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { active, updatedAt: new Date() } });
  refresh();
}

export async function moveMemberAction(id: string, dir: -1 | 1) {
  await assertPermission("content");
  if (!ObjectId.isValid(id)) return;
  const c = await col();
  const me = await c.findOne({ _id: new ObjectId(id) });
  if (!me) return;
  const peers = await c.find({ section: me.section }).sort({ order: 1, createdAt: 1 }).toArray();
  const i = peers.findIndex((p) => p._id!.equals(me._id!));
  const j = i + dir;
  if (i < 0 || j < 0 || j >= peers.length) return;
  [peers[i], peers[j]] = [peers[j], peers[i]];
  await Promise.all(peers.map((p, idx) => c.updateOne({ _id: p._id }, { $set: { order: idx + 1 } })));
  refresh();
}

export async function deleteMemberAction(id: string) {
  await assertPermission("delete");
  if (!ObjectId.isValid(id)) return;
  await (await col()).deleteOne({ _id: new ObjectId(id) });
  refresh();
}
