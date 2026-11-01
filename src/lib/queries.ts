import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "./db";

/** Coupons that are switched on, already started and not expired. */
export function liveCouponWhere(): Prisma.CouponWhereInput {
  const now = new Date();
  return {
    active: true,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }],
  };
}

export const couponCardInclude = {
  store: { select: { id: true, name: true, slug: true, logoUrl: true } },
} satisfies Prisma.CouponInclude;

export type CouponWithStore = Prisma.CouponGetPayload<{ include: typeof couponCardInclude }>;

export async function getSavedIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const rows = await db.savedCoupon.findMany({ where: { userId }, select: { couponId: true } });
  return new Set(rows.map((r) => r.couponId));
}
