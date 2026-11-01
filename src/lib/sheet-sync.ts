import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { importXlsx } from "./importer";

const URL_KEY = "google_sheet_url";
const STATUS_KEY = "google_sheet_last_sync";

export type SyncStatus = { at: string; ok: boolean; message: string; errors: string[] };

export function sheetIdFromUrl(url: string) {
  return url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/)?.[1] ?? null;
}

export async function getSheetUrl() {
  return (await db.setting.findUnique({ where: { key: URL_KEY } }))?.value ?? null;
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
    status = { at: new Date().toISOString(), ok: true, message: `${stores.msg} ${coupons.msg}`, errors: errors.slice(0, 20) };
    revalidatePath("/", "layout");
  } catch (e) {
    status = { at: new Date().toISOString(), ok: false, message: e instanceof Error ? e.message : "Sync failed.", errors: [] };
  }
  const value = JSON.stringify(status);
  await db.setting.upsert({ where: { key: STATUS_KEY }, update: { value }, create: { key: STATUS_KEY, value } });
  return status;
}
