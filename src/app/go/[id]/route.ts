import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeUrl } from "@/lib/utils";

// Sends the shopper to the store through the affiliate link and counts the click.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await db.coupon.findUnique({
    where: { id },
    include: { store: { select: { affiliateUrl: true, website: true } } },
  });
  if (!coupon) return NextResponse.redirect(new URL("/", req.url));

  const target = safeUrl(coupon.affiliateUrl) ?? safeUrl(coupon.store.affiliateUrl) ?? safeUrl(coupon.store.website);
  await db.coupon.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  const res = NextResponse.redirect(target ?? new URL("/", req.url), 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
