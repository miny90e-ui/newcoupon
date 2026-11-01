import type { Metadata } from "next";
import { db } from "@/lib/db";
import { liveCouponWhere } from "@/lib/queries";
import { StoresDirectory, type DirectoryStore } from "@/components/stores-directory";

export const metadata: Metadata = {
  title: "All Stores A–Z",
  description: "Browse every store on New Coupon and find their latest coupon codes and deals.",
  alternates: { canonical: "/stores" },
};

export default async function StoresPage() {
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

  const stores: DirectoryStore[] = rows.map((r) => ({
    name: r.name,
    slug: r.slug,
    logoUrl: r.logoUrl,
    category: r.category?.name ?? null,
    offers: r._count.coupons,
    bestOffer: r.coupons[0]?.discountLabel ?? null,
  }));
  const offers = stores.reduce((n, s) => n + s.offers, 0);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Stores</h1>
      <p className="mt-2 text-muted">
        {stores.length} {stores.length === 1 ? "store" : "stores"} · {offers} active {offers === 1 ? "offer" : "offers"}, checked by our team.
      </p>
      <StoresDirectory stores={stores} />
    </div>
  );
}
