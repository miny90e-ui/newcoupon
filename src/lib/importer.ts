import "server-only";
import readXlsxFile from "read-excel-file/node";
import { z } from "zod";
import { db } from "./db";
import { slugify } from "./utils";

// Shared by the admin upload (CSV / Excel) and the Google Sheet sync.

const url = z.url({ protocol: /^https?$/ });

export type ImportResult = { msg: string; errors: string[] };

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

/** Accepts 2026-12-31, 31/12/2026 or 31-12-2026. */
function parseDate(v: string): Date | null | "invalid" {
  if (!v) return null;
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  const d = dmy ? new Date(Date.UTC(+dmy[3], +dmy[2] - 1, +dmy[1], 23, 59, 59)) : new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T23:59:59Z` : v);
  return Number.isNaN(d.getTime()) ? "invalid" : d;
}

export async function applyStores(rows: Row[]) {
  const categories = await db.category.findMany();
  const errors: string[] = [];
  let created = 0, updated = 0;
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
    if (existing) { await db.store.update({ where: { slug }, data }); updated++; }
    else { await db.store.create({ data: { ...data, slug } }); created++; }
  }
  return { msg: `Stores: ${created} added, ${updated} updated.`, errors };
}

/**
 * A row updates the existing coupon with the same store + code (or same store + title for deals),
 * so the same sheet can be imported again and again without creating duplicates.
 */
export async function applyCoupons(rows: Row[]) {
  const stores = await db.store.findMany({ select: { id: true, slug: true, name: true } });
  const errors: string[] = [];
  let created = 0, updated = 0;
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
    if (existing) { await db.coupon.update({ where: { id: existing.id }, data }); updated++; }
    else { await db.coupon.create({ data }); created++; }
  }
  return { msg: `Coupons: ${created} added, ${updated} updated.`, errors };
}

/** Imports an .xlsx that has a "stores" tab and/or a "coupons" tab (stores first). */
export async function importXlsx(buffer: Buffer): Promise<{ stores: ImportResult; coupons: ImportResult }> {
  const sheets = await readXlsxFile(buffer);
  const find = (name: string) => sheets.find((s) => s.sheet.trim().toLowerCase() === name)?.data;
  const storesSheet = find("stores");
  const couponsSheet = find("coupons");
  if (!storesSheet && !couponsSheet) throw new Error('The spreadsheet needs a tab named "stores" and/or a tab named "coupons".');
  const stores = await applyStores(sheetRows(storesSheet));
  const coupons = await applyCoupons(sheetRows(couponsSheet));
  return { stores, coupons };
}
