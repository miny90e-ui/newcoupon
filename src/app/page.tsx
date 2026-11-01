import Link from "next/link";
import { BadgeCheck, MousePointerClick, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { safeHref } from "@/lib/utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";
import { CategoryCard } from "@/components/category-card";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const session = await getSession();
  const live = liveCouponWhere();

  const [banners, featured, latest, stores, categories, saved] = await Promise.all([
    db.banner.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.coupon.findMany({ where: { ...live, featured: true }, include: couponCardInclude, orderBy: { updatedAt: "desc" }, take: 10 }),
    db.coupon.findMany({ where: live, include: couponCardInclude, orderBy: { createdAt: "desc" }, take: 8 }),
    db.store.findMany({
      where: { featured: true },
      include: { _count: { select: { coupons: { where: live } } } },
      orderBy: { name: "asc" },
      take: 12,
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, take: 12, include: { _count: { select: { stores: true } } } }),
    getSavedIds(session?.userId),
  ]);

  const slides = banners.map((b) => ({ ...b, href: safeHref(b.linkUrl) }));

  return (
    <>
      <div className="container-page pt-6 sm:pt-8">
        {slides.length > 0 ? (
          <HeroCarousel slides={slides} />
        ) : (
          <section className="rounded-[24px] bg-ink px-8 py-14 text-white sm:px-14">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Save on everything you buy</h2>
            <p className="mt-3 text-white/80">Coupon codes and deals from stores across every category.</p>
          </section>
        )}
      </div>

      <section className="container-page pt-12 text-center sm:pt-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Verified coupons from the stores you shop</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Hand-picked promo codes and deals, checked by our team.{" "}
          <span className="text-sm">
            When you buy through links on our site,{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
              we may earn a commission
            </Link>
            .
          </span>
        </p>
        <form action="/search" role="search" className="mx-auto mt-6 flex max-w-xl gap-2">
          <label htmlFor="q-hero" className="sr-only">Search stores and coupons</label>
          <input id="q-hero" name="q" type="search" placeholder="Search a store or product, e.g. laptops" className="input h-12 rounded-full px-5" />
          <button className="btn-primary h-12 px-6">Search</button>
        </form>
      </section>

      {featured.length > 0 && (
        <section className="container-page pt-14" aria-labelledby="featured-title">
          <div className="flex items-baseline gap-4">
            <h2 id="featured-title" className="section-title">Featured Deals</h2>
            <Link href="/deals" className="link text-sm">View all</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {featured.map((cp) => (
              <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />
            ))}
          </div>
        </section>
      )}

      {stores.length > 0 && (
        <section className="container-page pt-16" aria-labelledby="stores-title">
          <div className="flex items-baseline gap-4">
            <h2 id="stores-title" className="section-title">Popular Stores</h2>
            <Link href="/stores" className="link text-sm">All stores</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {stores.map((s) => (
              <StoreTile key={s.id} store={s} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container-page pt-16" aria-labelledby="cat-title">
          <h2 id="cat-title" className="section-title">Shop by Category</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((cat) => (
              <li key={cat.id}>
                <CategoryCard category={cat} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {latest.length > 0 && (
        <section className="container-page pt-16" aria-labelledby="latest-title">
          <h2 id="latest-title" className="section-title">Just Added</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((cp) => (
              <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page pt-16" aria-labelledby="how-title">
        <div className="card grid gap-8 p-8 sm:p-10 md:grid-cols-3">
          <h2 id="how-title" className="sr-only">How New Coupon works</h2>
          {[
            { icon: MousePointerClick, t: "Pick an offer", d: "Browse codes and deals by store or category, or search for what you need." },
            { icon: BadgeCheck, t: "Copy the code", d: "Click Get Code. We show the code and open the store in one step." },
            { icon: ShieldCheck, t: "Save at checkout", d: "Paste the code at checkout. Deals apply automatically — no code needed." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-tint text-brand">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CouponReveal couponId={c} />
    </>
  );
}
