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

/** One row per store: what the A–Z directory and the search suggestions show. */
export type StoreSummary = {
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string | null;
  offers: number;
  bestOffer: string | null;
};

export async function storeSummaries(): Promise<StoreSummary[]> {
  const live = liveCouponWhere();
  const rows = await db.store.findMany({
    select: {
      name: true,
      slug: true,
      logoUrl: true,
      category: { select: { name: true } },
      _count: { select: { coupons: { where: live } } },
      coupons: {
        where: { ...live, discountLabel: { not: null } },
        select: { discountLabel: true },
        orderBy: [{ featured: "desc" }, { clicks: "desc" }],
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({
    name: r.name,
    slug: r.slug,
    logoUrl: r.logoUrl,
    category: r.category?.name ?? null,
    offers: r._count.coupons,
    bestOffer: r.coupons[0]?.discountLabel ?? null,
  }));
}
