import { NextResponse } from "next/server";
import { storeSummaries } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Every store, for the search box suggestions. The browser filters it, so typing feels instant.
export async function GET() {
  const stores = await storeSummaries();
  return NextResponse.json(
    { stores },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
