import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { put } from "@vercel/blob";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
export const MIME_BY_EXT = Object.fromEntries(Object.entries(ALLOWED).map(([m, e]) => [e, m]));
const MAX_BYTES = 4 * 1024 * 1024;

export function uploadDir() {
  // turbopackIgnore stops the bundler from tracing the whole project for this runtime path.
  return path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || "./uploads");
}

/**
 * Saves an uploaded image and returns its public URL, or null if no file was chosen.
 * On Vercel (BLOB_READ_WRITE_TOKEN set) files go to Vercel Blob; on a VPS they go to UPLOAD_DIR.
 */
export async function saveImage(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Logo must be a PNG, JPG, WebP, GIF or AVIF image.");
  if (file.size > MAX_BYTES) throw new Error("Image must be 4 MB or smaller.");
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
