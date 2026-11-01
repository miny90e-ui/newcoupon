import { NextResponse } from "next/server";
import { syncFromSheet } from "@/lib/sheet-sync";

// Called once a day by Vercel Cron (see vercel.json). If CRON_SECRET is set on Vercel,
// Vercel sends it as a Bearer token and other callers are refused.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = await syncFromSheet();
  return NextResponse.json(status, { status: status.ok ? 200 : 500 });
}
