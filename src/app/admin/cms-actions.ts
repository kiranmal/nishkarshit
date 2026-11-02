"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId, type Db } from "@/lib/db";
import { getDb } from "@/lib/db";
import { COLLECTIONS, type BlogPostDoc, type CmsPageDoc, type HardwareProductDoc, type HomepageSectionConfigDoc } from "@/lib/models";
import { assertPermission } from "@/lib/auth";
import { sanitize } from "@/lib/cms/schema";
import { sanitizeRichFields } from "@/lib/cms/html";
import { externalizeImages } from "@/lib/cms/persist-images";
import { ALL_PAGE_DEFAULTS, ensureCmsIndexes, pageDefaultGroup, seedBlogs, seedCms, seedHardware, seedHome, seedPages, type SeedGroup } from "@/lib/cms/seed";
import { bankingPageFields, educationTabFields, footerPageFields, normalizeSections, slugify } from "@/lib/cms/sections";
import { blogFields, hardwareFields } from "@/lib/cms/entity-fields";
import { HOME_DEFAULTS, HOME_FIELDS, HOME_KEYS, HOME_LABELS, type HomeKey } from "@/lib/cms/home";
import type { Field } from "@/lib/cms/schema";
import { pageToForm } from "@/lib/cms/form-map";

type Obj = Record<string, unknown>;
type R = { ok: true; data: Obj } | { ok: false; error: string };

/* ------------------------------------------------------------ helpers --- */
async function guard(permission: "content" | "delete" = "content") {
  return assertPermission(permission);
}
async function parse(payload: string, fields: Field[], adminEmail: string): Promise<{ ok: true; data: Obj } | { ok: false; error: string }> {
  if (payload.length > 6_000_000) return { ok: false, error: "Content is too large — upload big images instead of pasting them." };
  let parsed: unknown;
  try { parsed = JSON.parse(payload); } catch { return { ok: false, error: "Invalid data." }; }
  const clean = sanitizeRichFields(fields, sanitize(fields, parsed));
  return { ok: true, data: (await externalizeImages(clean, adminEmail)) as Obj };
}
const isPlainSeo = (s: unknown) => (s && typeof s === "object" ? s : {});

/** The database becomes the source of truth after the first write: import the defaults of that group first, so nothing disappears. */
async function ensureSeeded(db: Db, group: SeedGroup) {
  await ensureCmsIndexes(db);
  const marker = await db.collection(COLLECTIONS.cmsMeta).findOne({ _id: `seeded:${group}` as never });
  if (marker) return;
  if (group === "education" || group === "banking" || group === "footer-pages") await seedPages(db, group);
  else if (group === "blog") await seedBlogs(db);
  else if (group === "hardware") await seedHardware(db);
  else if (group === "home") await seedHome(db);
}

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}
const pagePaths: Record<string, string[]> = {
  "education-tab": ["/education", "/education/[tab]", "/education/admission"],
  banking: ["/banking/bank-csp", "/banking/loan", "/banking/csp-hardware"],
  "footer-page": ["/privacy-policy", "/refund-policy", "/terms-conditions", "/cloud-computing"],
};
function refreshPages(kind: CmsPageDoc["kind"]) {
  for (const p of pagePaths[kind] ?? []) revalidatePath(p, p.includes("[") ? "page" : undefined);
  revalidatePath("/", "layout"); // header/footer/sitemap
  refreshAdmin();
}

/* ------------------------------------------------- generic CMS pages --- */
const fieldsFor = (kind: CmsPageDoc["kind"]) => (kind === "education-tab" ? educationTabFields : kind === "banking" ? bankingPageFields : footerPageFields);

export async function savePageAction(pageKey: string, payload: string): Promise<R> {
  let admin;
  try { admin = await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const def = ALL_PAGE_DEFAULTS.find((p) => p.pageKey === pageKey);
  const db = await getDb();
  const col = db.collection<CmsPageDoc>(COLLECTIONS.cmsPages);
  const existing = await col.findOne({ pageKey });
  const kind = existing?.kind ?? def?.kind ?? (pageKey.startsWith("education:") ? "education-tab" : null);
  if (!kind) return { ok: false, error: "Unknown page." };
  const r = await parse(payload, fieldsFor(kind), admin.email);
  if (!r.ok) return r;
  const d = r.data;
  const set: Obj = { sections: normalizeSections(d.sections), seo: isPlainSeo(d.seo), updatedAt: new Date() };

  if (kind === "education-tab") {
    const label = String(d.label || "").trim();
    const slug = slugify(String(d.slug || label));
    if (!label) return { ok: false, error: "Tab name is required." };
    if (!slug) return { ok: false, error: "Tab key / slug is required (letters, numbers, dashes)." };
    if (["admission-form", "student-admission"].includes(slug)) return { ok: false, error: `"${slug}" is reserved — choose another key.` };
    const clash = await col.findOne({ kind: "education-tab", slug, pageKey: { $ne: pageKey } });
    if (clash) return { ok: false, error: `Another tab already uses the key "${slug}".` };
    Object.assign(set, { label, title: label, slug, path: slug === "admission" ? "/education/admission" : `/education#${slug}`, status: d.status === "draft" ? "draft" : "published", order: Number(d.order) || 0, spacing: d.spacing === "16" ? "16" : "14", hero: d.hero });
  } else if (kind === "footer-page") {
    const title = String(d.title || "").trim();
    if (!title) return { ok: false, error: "Page title is required." };
    Object.assign(set, { title, heroImage: String(d.heroImage || ""), status: d.status === "draft" ? "draft" : "published" });
  } else {
    const title = String(d.title || "").trim();
    if (!title) return { ok: false, error: "Page title is required." };
    Object.assign(set, { title });
  }

  await ensureSeeded(db, kind === "education-tab" ? "education" : kind === "banking" ? "banking" : "footer-pages");
  const upd = await col.updateOne({ pageKey }, { $set: set as never });
  if (!upd.matchedCount && def) await col.insertOne({ ...def, ...set, seo: set.seo, source: "default", createdAt: new Date() } as never);
  else if (!upd.matchedCount) return { ok: false, error: "Page not found." };
  const saved = await col.findOne({ pageKey });
  refreshPages(kind);
  if (kind === "education-tab") return { ok: true, data: { ...d, slug: saved?.slug ?? d.slug, sections: saved?.sections ?? d.sections } };
  return { ok: true, data: { ...d, sections: saved?.sections ?? d.sections } };
}

/** Explicit "restore defaults" for one page — the only place that overwrites admin content, and only on request. */
export async function resetPageAction(pageKey: string): Promise<R> {
  try { await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const def = ALL_PAGE_DEFAULTS.find((p) => p.pageKey === pageKey);
  if (!def) return { ok: false, error: "This page has no default content." };
  const db = await getDb();
  await ensureSeeded(db, pageDefaultGroup(def));
  const { pageKey: _k, ...rest } = def; // eslint-disable-line @typescript-eslint/no-unused-vars
  await db.collection<CmsPageDoc>(COLLECTIONS.cmsPages).updateOne({ pageKey }, { $set: { ...rest, seo: {}, source: "default", updatedAt: new Date() } as never }, { upsert: true });
  refreshPages(def.kind);
  return { ok: true, data: pageToForm(def as unknown as CmsPageDoc) };
}

/* ----------------------------------------------- education tab CRUD --- */
export async function addEducationTabAction(formData: FormData) {
  await guard();
  const label = String(formData.get("label") || "").trim().slice(0, 60);
  const slug = slugify(String(formData.get("slug") || label));
  if (!label || !slug) return;
  const db = await getDb();
  await ensureSeeded(db, "education");
  const col = db.collection<CmsPageDoc>(COLLECTIONS.cmsPages);
  if (await col.findOne({ kind: "education-tab", slug })) return;
  const last = await col.find({ kind: "education-tab" }).sort({ order: -1 }).limit(1).toArray();
  const now = new Date();
  const pageKey = `education:${slug}`;
  await col.insertOne({
    pageKey, kind: "education-tab", slug, label, title: label, path: `/education#${slug}`, status: "published", order: (last[0]?.order ?? 0) + 1, spacing: "14",
    hero: { enabled: true, badge: "", title: label, description: "Edit this tab in Admin → Education.", image: "", buttons: [] },
    sections: normalizeSections([{ sectionKey: "intro", sectionType: "text", variant: "text-plain", title: label, description: "Add your content from Admin → Education." }]),
    seo: {}, source: "custom", createdAt: now, updatedAt: now,
  });
  refreshPages("education-tab");
  redirect(`/admin/education/${slug}`);
}

export async function deleteEducationTabAction(pageKey: string) {
  await assertPermission("delete");
  const db = await getDb();
  await ensureSeeded(db, "education");
  await db.collection(COLLECTIONS.cmsPages).deleteOne({ pageKey, kind: "education-tab" });
  refreshPages("education-tab");
}
export async function toggleEducationTabAction(pageKey: string, publish: boolean) {
  await guard();
  const db = await getDb();
  await ensureSeeded(db, "education");
  await db.collection(COLLECTIONS.cmsPages).updateOne({ pageKey }, { $set: { status: publish ? "published" : "draft", updatedAt: new Date() } });
  refreshPages("education-tab");
}
export async function moveEducationTabAction(pageKey: string, dir: -1 | 1) {
  await guard();
  const db = await getDb();
  await ensureSeeded(db, "education");
  const col = db.collection<CmsPageDoc>(COLLECTIONS.cmsPages);
  const tabs = await col.find({ kind: "education-tab" }).sort({ order: 1 }).toArray();
  const i = tabs.findIndex((t) => t.pageKey === pageKey);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= tabs.length) return;
  [tabs[i], tabs[j]] = [tabs[j], tabs[i]];
  await Promise.all(tabs.map((t, idx) => col.updateOne({ _id: t._id }, { $set: { order: idx } })));
  refreshPages("education-tab");
}

/* ------------------------------------------------------------- blogs --- */
const dateOrNow = (v: unknown) => { const d = typeof v === "string" && v ? new Date(v.length === 16 ? `${v}:00Z` : v) : new Date(); return Number.isNaN(+d) ? new Date() : d; };

export async function saveBlogAction(id: string, payload: string): Promise<R & { id?: string }> {
  let admin;
  try { admin = await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const r = await parse(payload, blogFields, admin.email);
  if (!r.ok) return r;
  const d = r.data;
  const title = String(d.title || "").trim();
  if (!title) return { ok: false, error: "Blog title is required." };
  const slug = slugify(String(d.slug || title)).slice(0, 100);
  if (!slug) return { ok: false, error: "Slug is invalid." };
  const db = await getDb();
  await ensureSeeded(db, "blog");
  const col = db.collection<BlogPostDoc>(COLLECTIONS.blogPosts);
  const oid = id !== "new" && ObjectId.isValid(id) ? new ObjectId(id) : null;
  const clash = await col.findOne({ slug, ...(oid ? { _id: { $ne: oid } } : {}) });
  if (clash) return { ok: false, error: `Another blog already uses the slug "${slug}".` };
  const tags = String(d.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20);
  const fields = { title, slug, author: String(d.author || ""), tagline: String(d.tagline || ""), bannerImage: String(d.bannerImage || ""), content: String(d.content || ""), tags, featured: d.featured === true, status: d.status === "published" ? "published" : "draft", publishedAt: dateOrNow(d.publishedAt), seo: isPlainSeo(d.seo), updatedAt: new Date() };
  let savedId = id;
  if (oid) {
    const prev = await col.findOne({ _id: oid });
    if (!prev) return { ok: false, error: "Blog not found." };
    const previousSlugs = Array.from(new Set([...(prev.previousSlugs ?? []), ...(prev.slug !== slug ? [prev.slug] : [])])).filter((s) => s !== slug);
    await col.updateOne({ _id: oid }, { $set: { ...fields, previousSlugs } as never });
  } else {
    const ins = await col.insertOne({ ...fields, previousSlugs: [], source: "custom", createdAt: new Date() } as never);
    savedId = String(ins.insertedId);
  }
  revalidatePath("/blogs");
  revalidatePath("/blogs/[slug]", "page");
  refreshAdmin();
  return { ok: true, id: savedId, data: { ...d, slug, tags: tags.join(", ") } };
}
export async function deleteBlogAction(id: string) {
  await assertPermission("delete");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await ensureSeeded(db, "blog");
  await db.collection(COLLECTIONS.blogPosts).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/blogs"); revalidatePath("/blogs/[slug]", "page"); refreshAdmin();
}
export async function toggleBlogAction(id: string, field: "status" | "featured", value: boolean) {
  await guard();
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await ensureSeeded(db, "blog");
  await db.collection(COLLECTIONS.blogPosts).updateOne({ _id: new ObjectId(id) }, { $set: { [field]: field === "status" ? (value ? "published" : "draft") : value, updatedAt: new Date() } });
  revalidatePath("/blogs"); revalidatePath("/blogs/[slug]", "page"); refreshAdmin();
}

/* ---------------------------------------------------------- hardware --- */
export async function saveHardwareAction(id: string, payload: string): Promise<R & { id?: string }> {
  let admin;
  try { admin = await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const r = await parse(payload, hardwareFields, admin.email);
  if (!r.ok) return r;
  const d = r.data;
  const name = String(d.name || "").trim();
  if (!name) return { ok: false, error: "Product name is required." };
  const slug = slugify(String(d.slug || name)).slice(0, 100);
  if (!slug) return { ok: false, error: "Slug is invalid." };
  const formFields = ((d.formFields as Obj[]) ?? []).map((f) => ({ label: String(f.label || ""), name: String(f.name || "").replace(/[^A-Za-z0-9_]/g, "") || slugify(String(f.label || "field")).replace(/-/g, "_"), type: String(f.type || "text"), required: f.required === true })).filter((f) => f.label && f.name);
  if (new Set(formFields.map((f) => f.name)).size !== formFields.length) return { ok: false, error: "Each enquiry field needs a unique key." };
  const db = await getDb();
  await ensureSeeded(db, "hardware");
  const col = db.collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts);
  const oid = id !== "new" && ObjectId.isValid(id) ? new ObjectId(id) : null;
  const clash = await col.findOne({ slug, ...(oid ? { _id: { $ne: oid } } : {}) });
  if (clash) return { ok: false, error: `Another product already uses the slug "${slug}".` };
  const fields = { name, slug, description: String(d.description || ""), image: String(d.image || ""), images: ((d.images as Obj[]) ?? []).map((i) => String(i.image || "")).filter(Boolean), unitPrice: String(d.unitPrice || ""), formFields, terms: String(d.terms || ""), status: d.status === "published" ? "published" : "draft", seo: isPlainSeo(d.seo), updatedAt: new Date() };
  let savedId = id;
  if (oid) {
    const prev = await col.findOne({ _id: oid });
    if (!prev) return { ok: false, error: "Product not found." };
    const previousSlugs = Array.from(new Set([...(prev.previousSlugs ?? []), ...(prev.slug !== slug ? [prev.slug] : [])])).filter((s) => s !== slug);
    await col.updateOne({ _id: oid }, { $set: { ...fields, previousSlugs } as never });
  } else {
    const last = await col.find().sort({ order: -1 }).limit(1).toArray();
    const ins = await col.insertOne({ ...fields, order: (last[0]?.order ?? -1) + 1, previousSlugs: [], source: "custom", createdAt: new Date() } as never);
    savedId = String(ins.insertedId);
  }
  revalidatePath("/banking/csp-hardware"); revalidatePath("/banking/csp-hardware/[slug]", "page"); refreshAdmin();
  return { ok: true, id: savedId, data: { ...d, slug } };
}
export async function deleteHardwareAction(id: string) {
  await assertPermission("delete");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await ensureSeeded(db, "hardware");
  await db.collection(COLLECTIONS.hardwareProducts).deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/banking/csp-hardware"); revalidatePath("/banking/csp-hardware/[slug]", "page"); refreshAdmin();
}
export async function toggleHardwareAction(id: string, publish: boolean) {
  await guard();
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await ensureSeeded(db, "hardware");
  await db.collection(COLLECTIONS.hardwareProducts).updateOne({ _id: new ObjectId(id) }, { $set: { status: publish ? "published" : "draft", updatedAt: new Date() } });
  revalidatePath("/banking/csp-hardware"); revalidatePath("/banking/csp-hardware/[slug]", "page"); refreshAdmin();
}
export async function moveHardwareAction(id: string, dir: -1 | 1) {
  await guard();
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await ensureSeeded(db, "hardware");
  const col = db.collection<HardwareProductDoc>(COLLECTIONS.hardwareProducts);
  const list = await col.find().sort({ order: 1 }).toArray();
  const i = list.findIndex((p) => String(p._id) === id), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((p, idx) => col.updateOne({ _id: p._id }, { $set: { order: idx } })));
  revalidatePath("/banking/csp-hardware"); refreshAdmin();
}

/* ---------------------------------------------------------- homepage --- */
export async function saveHomeSectionAction(key: HomeKey, payload: string): Promise<R> {
  let admin;
  try { admin = await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  if (!HOME_KEYS.includes(key)) return { ok: false, error: "Unknown section." };
  const r = await parse(payload, HOME_FIELDS[key], admin.email);
  if (!r.ok) return r;
  const db = await getDb();
  await ensureSeeded(db, "home");
  const rawVisible = (JSON.parse(payload) as Obj).__visible;
  const $set: Obj = { data: r.data, label: HOME_LABELS[key], updatedAt: new Date() };
  if (typeof rawVisible === "boolean") $set.visible = rawVisible;
  await db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections).updateOne(
    { key },
    { $set: $set as never, $unset: { heading: "", description: "" } }, // legacy single-field overrides are now part of `data`
    { upsert: true }
  );
  revalidatePath("/"); refreshAdmin();
  return { ok: true, data: r.data };
}
export async function resetHomeSectionAction(key: HomeKey): Promise<R> {
  try { await guard(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const db = await getDb();
  await ensureSeeded(db, "home");
  await db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections).updateOne({ key }, { $set: { data: HOME_DEFAULTS[key] as unknown as Obj, updatedAt: new Date() } });
  revalidatePath("/"); refreshAdmin();
  return { ok: true, data: HOME_DEFAULTS[key] as unknown as Obj };
}
export async function toggleHomeSectionAction(key: HomeKey, visible: boolean) {
  await guard();
  const db = await getDb();
  await ensureSeeded(db, "home");
  await db.collection(COLLECTIONS.homepageSections).updateOne({ key }, { $set: { visible, updatedAt: new Date() } });
  revalidatePath("/"); refreshAdmin();
}
export async function moveHomeSectionAction(key: HomeKey, dir: -1 | 1) {
  await guard();
  const db = await getDb();
  await ensureSeeded(db, "home");
  const col = db.collection<HomepageSectionConfigDoc>(COLLECTIONS.homepageSections);
  const list = (await col.find().toArray()).sort((a, b) => a.order - b.order);
  const i = list.findIndex((s) => s.key === key), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((s, idx) => col.updateOne({ key: s.key }, { $set: { order: idx } })));
  revalidatePath("/"); refreshAdmin();
}

/* ---------------------------------------------------------- sync ------ */
/** Imports missing defaults only. Never overwrites or deletes anything. */
export async function syncCmsDefaultsAction(groups?: SeedGroup[]) {
  await guard();
  const db = await getDb();
  const report = await seedCms(db, groups);
  revalidatePath("/", "layout");
  return report;
}
