"use server";

import { assertPermission } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DirectoryListing,
  type WhyChooseUsItem,
  type BusinessServiceItem,
  type ProductItem,
  type BusinessHoursRow,
} from "@/lib/models";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateListing(slug: string) {
  revalidatePath("/admin/directory");
  revalidatePath(`/admin/directory/${slug}`);
  revalidatePath("/directory");
  revalidatePath(`/directory/listings/${slug}`);
}

// ---------- Basic Information (create + core fields) ----------

function readBasicInfo(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  return {
    name,
    slug: slugify(rawSlug || name),
    category: String(formData.get("category") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    address: String(formData.get("address") || "").trim() || undefined,
    phone: String(formData.get("phone") || "").trim() || undefined,
    whatsapp: String(formData.get("whatsapp") || "").trim() || undefined,
    email: String(formData.get("email") || "").trim() || undefined,
    website: String(formData.get("website") || "").trim() || undefined,
    logoUrl: String(formData.get("logoUrl") || "").trim() || undefined,
    logoColor: String(formData.get("logoColor") || "").trim() || undefined,
    description: String(formData.get("description") || "").trim(),
    tagline: String(formData.get("tagline") || "").trim() || undefined,
    plan: (String(formData.get("plan") || "standard") as DirectoryListing["plan"]),
    status: (String(formData.get("status") || "draft") as DirectoryListing["status"]),
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
  };
}

export async function createListingAction(formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const data = readBasicInfo(formData);
  const now = new Date();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidateListing(data.slug);
}

export async function updateBasicInfoAction(id: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  const data = readBasicInfo(formData);
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
  revalidateListing(data.slug);
}

export async function deleteListingAction(id: string, slug: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).deleteOne({
    _id: new ObjectId(id),
  });
  revalidateListing(slug);
}

// ---------- SEO ----------

export async function updateSeoAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        metaTitle: String(formData.get("metaTitle") || "").trim() || undefined,
        metaDescription: String(formData.get("metaDescription") || "").trim() || undefined,
        metaKeywords: String(formData.get("metaKeywords") || "").trim() || undefined,
        updatedAt: new Date(),
      },
    }
  );
  revalidateListing(slug);
}

// ---------- Why Choose Us (whole-array replace — small, fixed-shape list) ----------

export async function addWhyChooseUsAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const item: WhyChooseUsItem = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    icon: String(formData.get("icon") || "✅").trim(),
  };
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $push: { whyChooseUs: item }, $set: { updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

export async function removeWhyChooseUsAction(id: string, slug: string, index: number) {
  await assertPermission("delete");
  const db = await getDb();
  const doc = await db
    .collection<DirectoryListing>(COLLECTIONS.directoryListings)
    .findOne({ _id: new ObjectId(id) });
  const items = (doc?.whyChooseUs || []).filter((_, i) => i !== index);
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $set: { whyChooseUs: items, updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

// ---------- Services ----------

export async function addBusinessServiceAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const item: BusinessServiceItem = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    image: String(formData.get("image") || "").trim() || undefined,
  };
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $push: { services: item }, $set: { updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

export async function removeBusinessServiceAction(id: string, slug: string, index: number) {
  await assertPermission("delete");
  const db = await getDb();
  const doc = await db
    .collection<DirectoryListing>(COLLECTIONS.directoryListings)
    .findOne({ _id: new ObjectId(id) });
  const items = (doc?.services || []).filter((_, i) => i !== index);
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $set: { services: items, updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

// ---------- Products (each has its own _id so it can be edited/deleted individually) ----------

export async function addProductAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const additionalRaw = String(formData.get("additionalImages") || "").trim();
  const product: ProductItem = {
    _id: new ObjectId(),
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    oldPrice: formData.get("oldPrice") ? Number(formData.get("oldPrice")) : undefined,
    mainImage: String(formData.get("mainImage") || "").trim() || undefined,
    additionalImages: additionalRaw
      ? additionalRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    order: formData.get("order") ? Number(formData.get("order")) : 0,
    published: formData.get("published") === "on",
  };
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $push: { products: product }, $set: { updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

export async function updateProductAction(
  id: string,
  slug: string,
  productId: string,
  formData: FormData
) {
  await assertPermission("content");
  const additionalRaw = String(formData.get("additionalImages") || "").trim();
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id), "products._id": new ObjectId(productId) },
    {
      $set: {
        "products.$.name": String(formData.get("name") || "").trim(),
        "products.$.description": String(formData.get("description") || "").trim(),
        "products.$.price": formData.get("price") ? Number(formData.get("price")) : undefined,
        "products.$.oldPrice": formData.get("oldPrice")
          ? Number(formData.get("oldPrice"))
          : undefined,
        "products.$.mainImage": String(formData.get("mainImage") || "").trim() || undefined,
        "products.$.additionalImages": additionalRaw
          ? additionalRaw.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        "products.$.order": formData.get("order") ? Number(formData.get("order")) : 0,
        "products.$.published": formData.get("published") === "on",
        updatedAt: new Date(),
      },
    }
  );
  revalidateListing(slug);
}

export async function deleteProductAction(id: string, slug: string, productId: string) {
  await assertPermission("delete");
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $pull: { products: { _id: new ObjectId(productId) } }, $set: { updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

// ---------- Gallery ----------

export async function addGalleryImageAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const url = String(formData.get("image") || "").trim();
  if (!url) return;
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $push: { gallery: url }, $set: { updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

export async function removeGalleryImageAction(id: string, slug: string, index: number) {
  await assertPermission("delete");
  const db = await getDb();
  const doc = await db
    .collection<DirectoryListing>(COLLECTIONS.directoryListings)
    .findOne({ _id: new ObjectId(id) });
  const items = (doc?.gallery || []).filter((_, i) => i !== index);
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $set: { gallery: items, updatedAt: new Date() } }
  );
  revalidateListing(slug);
}

// ---------- Video ----------

export async function updateVideoAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        videoUrl: String(formData.get("videoUrl") || "").trim() || undefined,
        updatedAt: new Date(),
      },
    }
  );
  revalidateListing(slug);
}

// ---------- Location ----------

export async function updateLocationAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        latitude: formData.get("latitude") ? Number(formData.get("latitude")) : undefined,
        longitude: formData.get("longitude") ? Number(formData.get("longitude")) : undefined,
        mapUrl: String(formData.get("mapUrl") || "").trim() || undefined,
        updatedAt: new Date(),
      },
    }
  );
  revalidateListing(slug);
}

// ---------- Business Hours (whole-array replace, 7 fixed rows) ----------

export async function updateHoursAction(id: string, slug: string, formData: FormData) {
  await assertPermission("content");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours: BusinessHoursRow[] = days.map((day) => ({
    day,
    time: String(formData.get(`hours_${day}`) || "Closed").trim(),
  }));
  const db = await getDb();
  await db.collection<DirectoryListing>(COLLECTIONS.directoryListings).updateOne(
    { _id: new ObjectId(id) },
    { $set: { hours, updatedAt: new Date() } }
  );
  revalidateListing(slug);
}
