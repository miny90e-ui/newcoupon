import readXlsxFile from "read-excel-file/node";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "./db";
import { slugify } from "./utils";
import { guessCategorySlug, shopHost, storeMeta } from "./store-meta";

// Shared by the admin upload (CSV / Excel), the Google Sheet sync and the deploy seed (prisma/seed.ts),
// so it must not import "server-only".

const url = z.url({ protocol: /^https?$/ });

/** ids = every store / coupon the file mentioned (used by the sheet sync to remove the rest). */
export type ImportResult = { msg: string; errors: string[]; ids: string[] };

export type Row = Record<string, string>;

export function normalizeRows(rows: Record<string, unknown>[]): Row[] {
  return rows
    .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim().toLowerCase(), String(v ?? "").trim()])))
    .filter((r) => Object.values(r).some(Boolean));
}

/** Turns an Excel cell (text, number, date, boolean) into plain text. */
function cellText(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
}

function sheetRows(data: unknown[][] | undefined): Row[] {
  if (!data?.length) return [];
  const headers = data[0].map(cellText);
  return normalizeRows(
    data.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [h, cellText(row[i])]).filter(([h]) => h)))
  );
}

const yes = (v?: string) => ["1", "true", "yes", "y", "x", "có", "co"].includes((v ?? "").toLowerCase());

/** Accepts 2026-12-31, 31/12/2026 or 31-12-2026; "Không thời hạn" / "No expiry" / "-" mean no end date. */
function parseDate(v: string): Date | null | "invalid" {
  if (!v || /^(-+|—|không.*|khong.*|vô thời hạn|vo thoi han|no expir.*|never|ongoing|none)$/i.test(v.trim())) return null;
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  const d = dmy ? new Date(Date.UTC(+dmy[3], +dmy[2] - 1, +dmy[1], 23, 59, 59)) : new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T23:59:59Z` : v);
  return Number.isNaN(d.getTime()) ? "invalid" : d;
}

export async function applyStores(rows: Row[]) {
  const categories = await db.category.findMany();
  const errors: string[] = [];
  let created = 0, updated = 0;
  const ids: string[] = [];
  for (const [i, r] of rows.entries()) {
    const line = i + 2;
    if (!r.name || !r.affiliate_url) { errors.push(`stores row ${line}: name and affiliate_url are required`); continue; }
    if (!url.safeParse(r.affiliate_url).success) { errors.push(`stores row ${line}: affiliate_url is not a valid https link`); continue; }
    const slug = r.slug ? slugify(r.slug) : slugify(r.name);
    const cat = r.category
      ? categories.find((c) => c.slug === slugify(r.category) || c.name.toLowerCase() === r.category.toLowerCase())
      : undefined;
    if (r.category && !cat) errors.push(`stores row ${line}: category "${r.category}" not found, store saved without category`);
    const data = {
      name: r.name,
      affiliateUrl: r.affiliate_url,
      website: r.website && url.safeParse(r.website).success ? r.website : null,
      logoUrl: r.logo_url && url.safeParse(r.logo_url).success ? r.logo_url : null,
      description: r.description || null,
      featured: yes(r.featured),
      categoryId: cat?.id ?? null,
    };
    const existing = await db.store.findUnique({ where: { slug }, select: { id: true } });
    const saved = existing ? await db.store.update({ where: { slug }, data }) : await db.store.create({ data: { ...data, slug } });
    if (existing) updated++; else created++;
    ids.push(saved.id);
  }
  return { msg: `Stores: ${created} added, ${updated} updated.`, errors, ids };
}

/**
 * A row updates the existing coupon with the same store + code (or same store + title for deals),
 * so the same sheet can be imported again and again without creating duplicates.
 */
export async function applyCoupons(rows: Row[]) {
  const stores = await db.store.findMany({ select: { id: true, slug: true, name: true } });
  const errors: string[] = [];
  let created = 0, updated = 0;
  const ids: string[] = [];
  for (const [i, r] of rows.entries()) {
    const line = i + 2;
    const key = r.store ?? "";
    const store = stores.find((s) => s.slug === slugify(key) || s.name.toLowerCase() === key.toLowerCase());
    if (!store) { errors.push(`coupons row ${line}: store "${key}" not found — add it to stores first`); continue; }
    if (!r.title) { errors.push(`coupons row ${line}: title is required`); continue; }
    const expires = parseDate(r.expires_at ?? "");
    if (expires === "invalid") { errors.push(`coupons row ${line}: expires_at should look like 2026-12-31 or 31/12/2026`); continue; }
    const code = r.code ? r.code.toUpperCase() : null;
    const data = {
      storeId: store.id,
      type: code ? ("CODE" as const) : ("DEAL" as const),
      title: r.title.slice(0, 200),
      description: r.description || null,
      code,
      discountLabel: r.discount ? r.discount.toUpperCase().slice(0, 24) : null,
      tag: r.tag ? r.tag.toUpperCase().slice(0, 24) : null,
      affiliateUrl: r.affiliate_url && url.safeParse(r.affiliate_url).success ? r.affiliate_url : null,
      featured: yes(r.featured),
      exclusive: yes(r.exclusive),
      active: r.active === undefined || r.active === "" ? true : yes(r.active),
      expiresAt: expires,
    };
    const existing = await db.coupon.findFirst({
      where: code
        ? { storeId: store.id, code: { equals: code, mode: "insensitive" } }
        : { storeId: store.id, type: "DEAL", title: { equals: data.title, mode: "insensitive" } },
      select: { id: true },
    });
    const saved = existing ? await db.coupon.update({ where: { id: existing.id }, data }) : await db.coupon.create({ data });
    if (existing) updated++; else created++;
    ids.push(saved.id);
  }
  return { msg: `Coupons: ${created} added, ${updated} updated.`, errors, ids };
}

/* ---------- One-tab format: each row = store + affiliate link (+ optional coupon) ---------- */

// Column headers accepted for the one-tab sheet, compared without accents, case or "(…)" notes.
const FLAT_COLUMNS: Record<string, string[]> = {
  store: ["cua hang", "store", "ten cua hang", "thuong hieu", "name"],
  affiliate_url: ["link affiliate", "link aff", "affiliate link", "affiliate_url", "link"],
  code: ["ma coupon", "ma giam gia", "coupon", "code", "ma"],
  title: ["uu dai", "tieu de", "title", "noi dung uu dai"],
  discount: ["giam", "muc giam", "discount"],
  expires_at: ["het han", "ngay het han", "expires_at", "expires"],
  category: ["nganh hang", "category", "danh muc"],
  logo_url: ["logo", "logo_url", "link logo"],
  website: ["website", "trang web"],
  description: ["ghi chu", "dieu kien", "description", "mo ta"],
  tag: ["nhan", "tag"],
  featured: ["noi bat", "featured"],
  exclusive: ["doc quyen", "exclusive"],
  active: ["hien", "active", "dang chay"],
};

function headerKey(h: string) {
  const plain = h
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .replace(/\(.*?\)|\*/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return Object.entries(FLAT_COLUMNS).find(([, names]) => names.includes(plain))?.[0] ?? null;
}

function flatRows(data: unknown[][]): Row[] {
  const keys = data[0].map((h) => headerKey(cellText(h)));
  return normalizeRows(
    data.slice(1).map((row) => Object.fromEntries(keys.map((k, i) => [k, cellText(row[i])]).filter(([k]) => k)))
  );
}

function isFlatSheet(data: unknown[][] | undefined) {
  if (!data?.length) return false;
  const keys = new Set(data[0].map((h) => headerKey(cellText(h))));
  return keys.has("store") && keys.has("affiliate_url");
}

async function applyFlat(rows: Row[]) {
  const errors: string[] = [];
  const categories = await db.category.findMany();
  const stores = new Map<string, { id: string; link: string }>();
  let storesAdded = 0, storesUpdated = 0;
  const couponRows: Row[] = [];

  for (const [i, r] of rows.entries()) {
    const line = i + 2;
    let name = r.store;
    if (!name && r.affiliate_url) name = (await storeMeta(r.website || r.affiliate_url))?.name ?? "";
    if (!name) { errors.push(`Dòng ${line}: thiếu tên cửa hàng (không tự đọc được từ link)`); continue; }
    const key = name.toLowerCase();
    if (!stores.has(key)) {
      if (!r.affiliate_url || !url.safeParse(r.affiliate_url).success) {
        errors.push(`Dòng ${line}: link affiliate của "${name}" phải bắt đầu bằng https://`);
        continue;
      }
      const slug = slugify(name);
      let cat = r.category
        ? categories.find((c) => c.slug === slugify(r.category) || c.name.toLowerCase() === r.category.toLowerCase())
        : undefined;
      if (r.category && !cat) errors.push(`Dòng ${line}: không có ngành hàng "${r.category}"`);
      const select = { id: true, logoUrl: true, categoryId: true, description: true, website: true } as const;
      // A store renamed in the sheet keeps its page, coupons and click counts: same shop link, same store.
      const host = shopHost(r.website || r.affiliate_url);
      const taken = new Set([...stores.values()].map((s) => s.id));
      const existing =
        (await db.store.findUnique({ where: { slug }, select })) ??
        (host
          ? (await db.store.findMany({ select: { ...select, affiliateUrl: true } })).find(
              (s) => !taken.has(s.id) && shopHost(s.website || s.affiliateUrl) === host
            )
          : undefined);
      // Only overwrite what the sheet actually fills in, so details set in the admin panel survive.
      const data: Prisma.StoreUncheckedUpdateInput & { name: string; affiliateUrl: string } = {
        name,
        affiliateUrl: r.affiliate_url,
        ...(r.website && url.safeParse(r.website).success && { website: r.website }),
        ...(r.logo_url && url.safeParse(r.logo_url).success && { logoUrl: r.logo_url }),
        ...(cat && { categoryId: cat.id }),
      };
      // Anything still missing (logo, category, description, website) is read from the store's homepage.
      const needsLogo = !data.logoUrl && !existing?.logoUrl;
      const needsCategory = !cat && !existing?.categoryId;
      if (needsLogo || needsCategory || !existing?.description || !(data.website || existing?.website)) {
        const m = await storeMeta(r.website || r.affiliate_url);
        if (m) {
          if (needsLogo && m.logo) data.logoUrl = m.logo;
          if (needsCategory) {
            const slugGuess = guessCategorySlug(`${name} ${m.description ?? ""}`);
            cat = categories.find((c) => c.slug === slugGuess);
            if (cat) data.categoryId = cat.id;
          }
          if (!existing?.description && m.description) data.description = m.description;
          if (!data.website && !existing?.website) data.website = m.origin;
        }
      }
      const store = existing
        ? await db.store.update({ where: { id: existing.id }, data })
        : await db.store.create({ data: { ...data, slug, featured: true } as Prisma.StoreUncheckedCreateInput });
      if (existing) storesUpdated++; else storesAdded++;
      stores.set(key, { id: store.id, link: r.affiliate_url });
    }
    const store = stores.get(key)!;
    if (!r.code && !r.title && !r.discount) continue; // store-only row
    const code = r.code?.toUpperCase();
    // "10%" → "10% off", "$5" → "$5 off"; labels like "10% OFF" or "FREE SHIP" are kept as they are.
    const d = r.discount;
    const label = !d ? "Save" : /^[\d$€£]/.test(d) && !/off/i.test(d) ? `${d} off` : d;
    const title = r.title || (code ? `${label} with code ${code}` : `${label} at ${name}`);
    couponRows.push({
      store: name,
      title,
      code: code ?? "",
      discount: r.discount ?? "",
      tag: r.tag ?? "",
      expires_at: r.expires_at ?? "",
      affiliate_url: r.affiliate_url && r.affiliate_url !== store.link ? r.affiliate_url : "",
      description: r.description ?? "",
      featured: r.featured || "yes",
      exclusive: r.exclusive || (code ? "yes" : "no"),
      active: r.active ?? "",
    });
  }
  const coupons = await applyCoupons(couponRows);
  return {
    stores: { msg: `Stores: ${storesAdded} added, ${storesUpdated} updated.`, errors, ids: [...stores.values()].map((s) => s.id) },
    coupons,
  };
}

/**
 * Imports an .xlsx. Either a "stores" tab and/or a "coupons" tab,
 * or a single tab where each row is a store + affiliate link (+ coupon).
 */
export async function importXlsx(buffer: Buffer): Promise<{ stores: ImportResult; coupons: ImportResult }> {
  const sheets = await readXlsxFile(buffer);
  const find = (name: string) => sheets.find((s) => s.sheet.trim().toLowerCase() === name)?.data;
  const storesSheet = find("stores");
  const couponsSheet = find("coupons");
  if (storesSheet || couponsSheet) {
    const stores = await applyStores(sheetRows(storesSheet));
    const coupons = await applyCoupons(sheetRows(couponsSheet));
    return { stores, coupons };
  }
  const flat = sheets.find((s) => isFlatSheet(s.data));
  if (!flat) {
    throw new Error('Không đọc được sheet: cần một tab có cột "Cửa hàng" và "Link affiliate" (hoặc hai tab "stores" và "coupons").');
  }
  return applyFlat(flatRows(flat.data));
}
