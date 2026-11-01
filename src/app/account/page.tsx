import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { couponCardInclude } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";

export const metadata: Metadata = { title: "My saved coupons", robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const user = await requireUser("/account");
  const saved = await db.savedCoupon.findMany({
    where: { userId: user.id, coupon: { active: true } },
    include: { coupon: { include: couponCardInclude } },
    orderBy: { createdAt: "desc" },
  });
  const now = Date.now();
  const live = saved.filter((s) => !s.coupon.expiresAt || s.coupon.expiresAt.getTime() > now);
  const expiredCount = saved.length - live.length;

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Saved coupons</h1>
          <p className="mt-1 text-muted">Signed in as {user.email}</p>
        </div>
        <form action={logout}>
          <button className="btn-outline">Sign out</button>
        </form>
      </div>
      {live.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-muted">You haven&apos;t saved any coupons yet. Tap the heart on any offer to keep it here.</p>
          <Link href="/deals" className="btn-primary mt-5">Browse best deals</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {live.map((s) => <CouponCard key={s.couponId} coupon={s.coupon} saved />)}
        </div>
      )}
      {expiredCount > 0 && <p className="mt-6 text-sm text-muted">{expiredCount} saved coupon(s) have expired and are hidden.</p>}
      <CouponReveal couponId={c} />
    </div>
  );
}
