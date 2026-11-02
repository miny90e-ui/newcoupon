import type { Metadata } from "next";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";
import { StoreSearch } from "@/components/store-search";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; c?: string }> }) {
  const { q = "", c } = await searchParams;
  const query = q.trim().slice(0, 80);
  const session = await getSession();
  const live = liveCouponWhere();
  const contains = { contains: query, mode: "insensitive" as const };

  const [stores, coupons, saved] = query
    ? await Promise.all([
        db.store.findMany({
          where: { OR: [{ name: contains }, { category: { name: contains } }] },
          include: { _count: { select: { coupons: { where: live } } } },
          take: 12,
          orderBy: { featured: "desc" },
        }),
        db.coupon.findMany({
          where: { AND: [live, { OR: [{ title: contains }, { description: contains }, { store: { name: contains } }] }] },
          include: couponCardInclude,
          orderBy: [{ featured: "desc" }, { clicks: "desc" }],
          take: 24,
        }),
        getSavedIds(session?.userId),
      ])
    : [[], [], new Set<string>()];

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">{query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}</h1>
      <StoreSearch key={query} defaultValue={query} autoFocus={!query} placeholder="Store, brand or product" className="mt-5 max-w-xl" />

      {query && stores.length === 0 && coupons.length === 0 && (
        <p className="card mt-8 p-8 text-center text-muted">No stores or coupons match &ldquo;{query}&rdquo;. Try a shorter word or a store name.</p>
      )}

      {stores.length > 0 && (
        <section className="mt-10" aria-labelledby="s-stores">
          <h2 id="s-stores" className="section-title">Stores</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {stores.map((s) => <StoreTile key={s.id} store={s} />)}
          </div>
        </section>
      )}
      {coupons.length > 0 && (
        <section className="mt-10" aria-labelledby="s-coupons">
          <h2 id="s-coupons" className="section-title">Coupons &amp; deals</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {coupons.map((cp) => <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />)}
          </div>
        </section>
      )}
      <CouponReveal couponId={c} />
    </div>
  );
}
