import { readFile } from "node:fs/promises";
import path from "node:path";
import { MIME_BY_EXT, uploadDir } from "@/lib/uploads";

// Serves admin-uploaded images. (Nginx can also serve this folder directly — see DEPLOY.md.)
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]+\.[a-z]+$/i.test(file)) return new Response("Not found", { status: 404 });
  const mime = MIME_BY_EXT[file.split(".").pop()!.toLowerCase()];
  if (!mime) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(uploadDir(), file));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": mime, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
