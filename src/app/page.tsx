import Link from "next/link";
import { BadgeCheck, Gift, MousePointerClick, Percent, ShieldCheck, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere, storeSummaries, type StoreSummary } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { safeHref } from "@/lib/utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";
import { CategoryCard } from "@/components/category-card";
import { StoreSearch } from "@/components/store-search";
import { StoreLogo } from "@/components/store-logo";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const session = await getSession();
  const live = liveCouponWhere();

  const [banners, featured, latest, stores, categories, saved, summaries] = await Promise.all([
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
    storeSummaries(),
  ]);

  const slides = banners.map((b) => ({ ...b, href: safeHref(b.linkUrl) }));
  const popular = summaries.filter((s) => s.offers > 0).sort((a, b) => b.offers - a.offers);
  const examples = [...popular.slice(0, 4).map((s) => s.name), ...categories.slice(0, 3).map((cat) => cat.name)];

  return (
    <>
      <div className="container-page pt-6 sm:pt-8">
        {slides.length > 0 ? (
          <HeroCarousel slides={slides} />
        ) : (
          <section className="rounded-[24px] bg-brand px-8 py-14 text-white sm:px-14">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Save on everything you buy</h2>
            <p className="mt-3 text-white/80">Coupon codes and deals from stores across every category.</p>
          </section>
        )}
      </div>

      <section className="container-page pt-10 sm:pt-14">
        <div className="relative isolate rounded-[28px] bg-brand-tint px-4 py-10 text-center sm:px-10 sm:py-14">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 overflow-hidden rounded-[28px] bg-[radial-gradient(rgb(12_122_128/0.16)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          />
          <FloatingOffers offers={popular.filter((s) => s.bestOffer).slice(0, 4)} />

          <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand shadow-[var(--shadow-card)]">
            <BadgeCheck className="size-3.5" aria-hidden /> Every code checked by our team
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
            Verified coupons from the stores you shop
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Hand-picked promo codes and deals, checked by our team.{" "}
            <span className="text-sm">
              When you buy through links on our site,{" "}
              <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
                we may earn a commission
              </Link>
              .
            </span>
          </p>
          <StoreSearch
            examples={examples}
            placeholder="Type a store name, e.g. My Cluck Hut"
            className="mx-auto mt-7 max-w-2xl"
          />
          {popular.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="font-semibold text-muted">Popular:</span>
              {popular.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  href={`/stores/${s.slug}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white pl-1.5 pr-4 font-semibold text-ink ring-1 ring-line transition-[color,box-shadow] duration-200 hover:text-brand hover:ring-brand"
                >
                  <StoreLogo name={s.name} logoUrl={s.logoUrl} className="size-8 rounded-full text-[10px]" />
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>
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

const SLOTS = [
  { at: "left-6 top-10 -rotate-3", delay: "0s", icon: Tag },
  { at: "left-14 bottom-10 rotate-2", delay: "1.6s", icon: Percent },
  { at: "right-6 top-12 rotate-3", delay: "0.8s", icon: Gift },
  { at: "right-14 bottom-12 -rotate-2", delay: "2.4s", icon: BadgeCheck },
];

/** Decorative offer tickets floating beside the hero search on wide screens. */
function FloatingOffers({ offers }: { offers: StoreSummary[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      {SLOTS.map(({ at, delay, icon: Icon }, i) => {
        const s = offers[i];
        return (
          <div key={at} className={`absolute ${at}`}>
            <div className="motion-safe:animate-[nc-float_6s_ease-in-out_infinite]" style={{ animationDelay: delay }}>
              {s ? (
                <div className="flex items-center gap-2.5 rounded-2xl bg-white py-2 pl-2 pr-4 text-left shadow-[var(--shadow-lift)]">
                  <StoreLogo name={s.name} logoUrl={s.logoUrl} className="size-9 rounded-lg text-[11px]" />
                  <span>
                    <span className="block text-sm font-extrabold text-brand">{s.bestOffer}</span>
                    <span className="block max-w-28 truncate text-xs text-muted">{s.name}</span>
                  </span>
                </div>
              ) : (
                <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand shadow-[var(--shadow-lift)]">
                  <Icon className="size-5" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
