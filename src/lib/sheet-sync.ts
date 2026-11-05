import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { GOOGLE_SHEET_URL } from "@/config/site";
import { importXlsx } from "./importer";
import { refreshShowcases } from "./store-showcase";

const URL_KEY = "google_sheet_url";
const STATUS_KEY = "google_sheet_last_sync";
const LOCK_KEY = "google_sheet_lock";
const LOCK_MAX_AGE_MS = 3 * 60_000;

export type SyncStatus = { at: string; ok: boolean; message: string; errors: string[] };

export function sheetIdFromUrl(url: string) {
  return url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/)?.[1] ?? null;
}

export async function getSheetUrl() {
  const saved = (await db.setting.findUnique({ where: { key: URL_KEY } }))?.value;
  return saved || process.env.GOOGLE_SHEET_URL || GOOGLE_SHEET_URL || null;
}

export async function setSheetUrl(url: string | null) {
  if (!url) {
    await db.setting.deleteMany({ where: { key: URL_KEY } });
    return;
  }
  await db.setting.upsert({ where: { key: URL_KEY }, update: { value: url }, create: { key: URL_KEY, value: url } });
}

export async function getLastSync(): Promise<SyncStatus | null> {
  const row = await db.setting.findUnique({ where: { key: STATUS_KEY } });
  try {
    return row ? (JSON.parse(row.value) as SyncStatus) : null;
  } catch {
    return null;
  }
}

/**
 * Downloads the linked Google Sheet as .xlsx and imports its "stores" and "coupons" tabs.
 * The sheet must be shared as "Anyone with the link can view".
 */
export async function syncFromSheet(): Promise<SyncStatus> {
  // Only one sync at a time, so two at once can't both create the same new coupon.
  if (!(await acquireLock())) {
    return (await getLastSync()) ?? { at: new Date().toISOString(), ok: false, message: "A sync is already running.", errors: [] };
  }
  try {
    return await runSync();
  } finally {
    await db.setting.deleteMany({ where: { key: LOCK_KEY } });
  }
}

/** Syncs in the background when the last sync is older than maxAgeMs. Called after page responses. */
export async function syncIfStale(maxAgeMs = 2 * 60_000) {
  if (!(await getSheetUrl())) return;
  const last = await getLastSync();
  if (last && Date.now() - new Date(last.at).getTime() < maxAgeMs) return;
  await syncFromSheet();
}

async function acquireLock(): Promise<boolean> {
  try {
    await db.setting.create({ data: { key: LOCK_KEY, value: new Date().toISOString() } });
    return true;
  } catch {
    const lock = await db.setting.findUnique({ where: { key: LOCK_KEY } });
    if (lock && Date.now() - lock.updatedAt.getTime() > LOCK_MAX_AGE_MS) {
      await db.setting.deleteMany({ where: { key: LOCK_KEY, updatedAt: lock.updatedAt } });
      return acquireLock();
    }
    return false;
  }
}

async function runSync(): Promise<SyncStatus> {
  let status: SyncStatus;
  try {
    const url = await getSheetUrl();
    const id = url && sheetIdFromUrl(url);
    if (!id) throw new Error("No Google Sheet is linked yet.");
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`, {
      cache: "no-store",
      redirect: "follow",
    });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || type.includes("text/html")) {
      throw new Error(
        'Could not download the sheet. In Google Sheets click Share → General access → "Anyone with the link" → Viewer.'
      );
    }
    const { stores, coupons } = await importXlsx(Buffer.from(await res.arrayBuffer()));
    const errors = [...stores.errors, ...coupons.errors];
    // The sheet is the source of truth: whatever is no longer in it comes off the site.
    // Coupons are hidden (re-adding the row brings them back); stores are deleted.
    // Skipped when the sheet yields no stores at all, so an empty/broken export can't wipe the site.
    let removed = "";
    if (stores.ids.length > 0) {
      const hidden = await db.coupon.updateMany({ where: { active: true, id: { notIn: coupons.ids } }, data: { active: false } });
      const deleted = await db.store.deleteMany({ where: { id: { notIn: stores.ids } } });
      removed = ` Removed: ${deleted.count} stores, ${hidden.count} coupons.`;
    }
    status = { at: new Date().toISOString(), ok: true, message: `${stores.msg} ${coupons.msg}${removed}`, errors: errors.slice(0, 20) };
    // New brands get their own product photos for the home page banner.
    await refreshShowcases().catch((e) => console.error("Banner photos failed", e));
    try {
      revalidatePath("/", "layout");
    } catch {
      // Not allowed in every context (e.g. after a page render); pages are dynamic anyway.
    }
  } catch (e) {
    status = { at: new Date().toISOString(), ok: false, message: e instanceof Error ? e.message : "Sync failed.", errors: [] };
  }
  const value = JSON.stringify(status);
  await db.setting.upsert({ where: { key: STATUS_KEY }, update: { value }, create: { key: STATUS_KEY, value } });
  return status;
}
