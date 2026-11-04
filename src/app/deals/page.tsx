import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { monthYear } from "@/lib/utils";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";

export const metadata: Metadata = {
  title: `Best Deals & Coupon Codes — ${monthYear()}`,
  description: "Today's best coupon codes and deals across every category, sorted by what shoppers use most.",
  alternates: { canonical: "/deals" },
};

const SORTS = [
  { key: "popular", label: "Most used" },
  { key: "new", label: "Newest" },
  { key: "ending", label: "Ending soon" },
] as const;

const PAGE_SIZE = 24;

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ c?: string; sort?: string; page?: string }> }) {
  const { c, sort = "popular", page = "1" } = await searchParams;
  const p = Math.max(1, Number(page) || 1);
  const session = await getSession();
  const live = liveCouponWhere();
  const orderBy =
    sort === "new"
      ? [{ createdAt: "desc" as const }]
      : sort === "ending"
        ? [{ expiresAt: { sort: "asc" as const, nulls: "last" as const } }]
        : [{ featured: "desc" as const }, { clicks: "desc" as const }];

  const [coupons, total, saved] = await Promise.all([
    db.coupon.findMany({ where: live, include: couponCardInclude, orderBy, take: PAGE_SIZE, skip: (p - 1) * PAGE_SIZE }),
    db.coupon.count({ where: live }),
    getSavedIds(session?.userId),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (s: string, pg = 1) => `/deals?sort=${s}${pg > 1 ? `&page=${pg}` : ""}`;

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Best Deals</h1>
      <p className="mt-2 text-muted">{total} active coupons and deals.</p>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Sort deals">
        {SORTS.map((s) => (
          <Link key={s.key} href={href(s.key)} aria-current={sort === s.key ? "true" : undefined} className={sort === s.key ? "btn bg-ink text-white" : "btn-outline"}>
            {s.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {coupons.map((cp) => <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />)}
      </div>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
          {p > 1 && <Link href={href(sort, p - 1)} className="btn-outline">Previous</Link>}
          <span className="text-sm text-muted">Page {p} of {pages}</span>
          {p < pages && <Link href={href(sort, p + 1)} className="btn-outline">Next</Link>}
        </nav>
      )}
      <CouponReveal couponId={c} />
    </div>
  );
}
