"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Papa from "papaparse";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { saveImage } from "@/lib/uploads";
import { applyCoupons, applyStores, importXlsx, normalizeRows } from "@/lib/importer";
import { setSheetUrl, sheetIdFromUrl, syncFromSheet } from "@/lib/sheet-sync";
import { slugify } from "@/lib/utils";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
const url = z.url({ protocol: /^https?$/, message: "Must be a full link starting with https://" });
const date = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

function fail(e: unknown): FormState {
  if (e instanceof z.ZodError) return { error: e.issues.map((i) => `${String(i.path[0] ?? "")}: ${i.message}`).join(" · ") };
  if (e && typeof e === "object" && "code" in e && e.code === "P2002") return { error: "That slug is already used. Choose another." };
  return { error: e instanceof Error ? e.message : "Something went wrong." };
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* ---------------- Stores ---------------- */

const storeSchema = z.object({
  name: z.string().min(1, "Required").max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only").max(80),
  website: url.nullable(),
  affiliateUrl: url,
  logoUrl: z.string().nullable(),
  description: z.string().max(2000).nullable(),
  featured: z.boolean(),
  categoryId: z.string().nullable(),
});

export async function saveStore(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(f, "id");
  try {
    const uploaded = await saveImage(f.get("logoFile"));
    const data = storeSchema.parse({
      name: str(f, "name") ?? "",
      slug: str(f, "slug") ?? slugify(str(f, "name") ?? ""),
      website: str(f, "website"),
      affiliateUrl: str(f, "affiliateUrl") ?? "",
      logoUrl: uploaded ?? str(f, "logoUrl"),
      description: str(f, "description"),
      featured: bool(f, "featured"),
      categoryId: str(f, "categoryId"),
    });
    if (id) await db.store.update({ where: { id }, data });
    else await db.store.create({ data });
  } catch (e) {
    return fail(e);
  }
  refreshPublic();
  redirect("/admin/stores?saved=1");
}

export async function deleteStore(f: FormData) {
  await requireAdmin();
  await db.store.delete({ where: { id: String(f.get("id")) } });
  refreshPublic();
  redirect("/admin/stores");
}

/* ---------------- Coupons ---------------- */

const couponSchema = z.object({
  storeId: z.string().min(1, "Choose a store"),
  type: z.enum(["CODE", "DEAL"]),
  title: z.string().min(1, "Required").max(200),
  description: z.string().max(1000).nullable(),
  code: z.string().max(60).nullable(),
  discountLabel: z.string().max(24).nullable(),
  tag: z.string().max(24).nullable(),
  affiliateUrl: url.nullable(),
  featured: z.boolean(),
  exclusive: z.boolean(),
  verified: z.boolean(),
  active: z.boolean(),
  startsAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
});

export async function saveCoupon(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(f, "id");
  try {
    const data = couponSchema.parse({
      storeId: str(f, "storeId") ?? "",
      type: str(f, "code") ? "CODE" : "DEAL",
      title: str(f, "title") ?? "",
      description: str(f, "description"),
      code: str(f, "code"),
      discountLabel: str(f, "discountLabel")?.toUpperCase() ?? null,
      tag: str(f, "tag")?.toUpperCase() ?? null,
      affiliateUrl: str(f, "affiliateUrl"),
      featured: bool(f, "featured"),
      exclusive: bool(f, "exclusive"),
      verified: bool(f, "verified"),
      active: bool(f, "active"),
      startsAt: date(f, "startsAt"),
      expiresAt: date(f, "expiresAt"),
    });
    if (id) await db.coupon.update({ where: { id }, data });
    else await db.coupon.create({ data });
  } catch (e) {
    return fail(e);
  }
  refreshPublic();
  redirect(`/admin/coupons?saved=1`);
}

export async function deleteCoupon(f: FormData) {
  await requireAdmin();
  await db.coupon.delete({ where: { id: String(f.get("id")) } });
  refreshPublic();
  redirect("/admin/coupons");
}

export async function toggleCouponActive(f: FormData) {
  await requireAdmin();
  const id = String(f.get("id"));
  const c = await db.coupon.findUniqueOrThrow({ where: { id }, select: { active: true } });
  await db.coupon.update({ where: { id }, data: { active: !c.active } });
  refreshPublic();
}

/* ---------------- Categories ---------------- */

export async function saveCategory(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(f, "id");
  try {
    const data = z
      .object({
        name: z.string().min(1, "Required").max(80),
        slug: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
        description: z.string().max(300).nullable(),
        icon: z.string().nullable(),
        sortOrder: z.number().int(),
      })
      .parse({
        name: str(f, "name") ?? "",
        slug: str(f, "slug") ?? slugify(str(f, "name") ?? ""),
        description: str(f, "description"),
        icon: str(f, "icon"),
        sortOrder: Number(str(f, "sortOrder") ?? 0) || 0,
      });
    if (id) await db.category.update({ where: { id }, data });
    else await db.category.create({ data });
  } catch (e) {
    return fail(e);
  }
  refreshPublic();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(f: FormData) {
  await requireAdmin();
  await db.category.delete({ where: { id: String(f.get("id")) } });
  refreshPublic();
  redirect("/admin/categories");
}

/* ---------------- Banners ---------------- */

export async function saveBanner(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(f, "id");
  try {
    const uploaded = await saveImage(f.get("imageFile"));
    const link = str(f, "linkUrl") ?? "";
    const data = z
      .object({
        title: z.string().min(1, "Required").max(120),
        subtitle: z.string().max(200).nullable(),
        ctaLabel: z.string().max(40).nullable(),
        linkUrl: z.string().refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Use /a-page or https://…"),
        imageUrl: z.string().nullable(),
        bgColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #0C7A80").nullable(),
        sortOrder: z.number().int(),
        active: z.boolean(),
      })
      .parse({
        title: str(f, "title") ?? "",
        subtitle: str(f, "subtitle"),
        ctaLabel: str(f, "ctaLabel"),
        linkUrl: link,
        imageUrl: f.get("removeImage") === "on" ? null : (uploaded ?? str(f, "imageUrl")),
        bgColor: str(f, "bgColor"),
        sortOrder: Number(str(f, "sortOrder") ?? 0) || 0,
        active: bool(f, "active"),
      });
    if (id) await db.banner.update({ where: { id }, data });
    else await db.banner.create({ data });
  } catch (e) {
    return fail(e);
  }
  refreshPublic();
  redirect("/admin/banners?saved=1");
}

export async function deleteBanner(f: FormData) {
  await requireAdmin();
  await db.banner.delete({ where: { id: String(f.get("id")) } });
  refreshPublic();
  redirect("/admin/banners");
}

/* ---------------- Users ---------------- */

export async function setUserRole(f: FormData) {
  const me = await requireAdmin();
  const id = String(f.get("id"));
  if (id === me.id) return; // never demote yourself
  await db.user.update({ where: { id }, data: { role: f.get("role") === "ADMIN" ? "ADMIN" : "USER" } });
  revalidatePath("/admin/users");
}

/* ---------------- CSV / Excel import ---------------- */

function readUpload(f: FormData) {
  const file = f.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("File must be 5 MB or smaller.");
  return file;
}

async function readCsv(f: FormData) {
  const file = readUpload(f);
  const parsed = Papa.parse<Record<string, string>>(await file.text(), { header: true, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error(`CSV problem on row ${(parsed.errors[0].row ?? 0) + 2}: ${parsed.errors[0].message}`);
  return normalizeRows(parsed.data);
}

function report(...parts: { msg: string; errors: string[] }[]): FormState {
  refreshPublic();
  const errors = parts.flatMap((p) => p.errors);
  return { ok: parts.map((p) => p.msg).join(" "), error: errors.length ? errors.slice(0, 20).join("\n") : undefined };
}

export async function importStores(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    return report(await applyStores(await readCsv(f)));
  } catch (e) {
    return fail(e);
  }
}

export async function importCoupons(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    return report(await applyCoupons(await readCsv(f)));
  } catch (e) {
    return fail(e);
  }
}

/** One Excel file with a "stores" tab and a "coupons" tab. */
export async function importWorkbook(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const file = readUpload(f);
    if (!/\.xlsx$/i.test(file.name)) throw new Error("Upload an Excel .xlsx file (in Google Sheets: File → Download → Microsoft Excel).");
    const { stores, coupons } = await importXlsx(Buffer.from(await file.arrayBuffer()));
    return report(stores, coupons);
  } catch (e) {
    return fail(e);
  }
}

/* ---------------- Google Sheet sync ---------------- */

export async function saveSheetUrl(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const value = str(f, "sheetUrl");
  if (value && !sheetIdFromUrl(value)) {
    return { error: "Paste the full Google Sheets link, e.g. https://docs.google.com/spreadsheets/d/…/edit" };
  }
  await setSheetUrl(value);
  revalidatePath("/admin/google-sheet");
  if (!value) return { ok: "Google Sheet unlinked." };
  const s = await syncFromSheet();
  return s.ok ? { ok: `Linked and synced. ${s.message}`, error: s.errors.join("\n") || undefined } : { error: s.message };
}

export async function syncSheetNow(_: FormState): Promise<FormState> {
  await requireAdmin();
  const s = await syncFromSheet();
  revalidatePath("/admin/google-sheet");
  return s.ok ? { ok: s.message, error: s.errors.join("\n") || undefined } : { error: s.message };
}
