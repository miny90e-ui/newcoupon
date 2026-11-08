import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Gift, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere, storeSummaries, topBrands, type StoreSummary } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { SITE_NAME, safeHref, siteUrl } from "@/lib/utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";
import { CategoryCard } from "@/components/category-card";
import { StoreLogo } from "@/components/store-logo";
import { BrandCarousel } from "@/components/brand-carousel";
import { BrandBanner } from "@/components/brand-banner";
import { BlackFridayHero, blackFriday } from "@/components/black-friday-hero";
import { CouponHowTo } from "@/components/coupon-how-to";

// "/?c=<id>" (a revealed code) is the same page for Google.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const session = await getSession();
  const live = liveCouponWhere();

  const [banners, featured, latest, stores, categories, saved, summaries, brands] = await Promise.all([
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
    topBrands(5),
  ]);

  const slides = banners.map((b) => ({ ...b, href: safeHref(b.linkUrl) }));
  const popular = summaries.filter((s) => s.offers > 0).sort((a, b) => b.offers - a.offers);
  const friday = blackFriday();

  // Tells Google who runs the site and what it is called, for the site name shown in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: SITE_NAME, url: siteUrl("/") },
      { "@type": "Organization", name: SITE_NAME, url: siteUrl("/"), logo: siteUrl("/icon.svg") },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* On phones the title comes first, like a plain list page; from sm up the brand banners lead */}
      <div className="flex flex-col">
        {/* Top brands by coupon use; the admin banners / plain hero only show when no brand has a live offer */}
        {brands.length > 0 ? (
          <div className="pt-4 sm:pt-5">
            <BrandCarousel labels={brands.map((b) => b.name)}>
              {brands.map((b, i) => (
                <BrandBanner key={b.slug} brand={b} rank={i + 1} eager={i < 2} />
              ))}
            </BrandCarousel>
          </div>
        ) : (
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
        )}

        {/* Title panel; from 1 November to the end of Cyber Monday it wears the Black Friday look */}
        <div className="order-first sm:order-none">
          {friday ? (
            <BlackFridayHero starts={friday.starts} ends={friday.ends} offers={popular.filter((s) => s.bestOffer).slice(0, 2)} />
          ) : (
            <section className="container-page pt-6">
              <div className="relative isolate rounded-[24px] px-2 text-center sm:bg-brand-tint sm:px-10 sm:py-7">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 hidden overflow-hidden rounded-[24px] bg-[radial-gradient(rgb(12_122_128/0.16)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] sm:block"
                />
                <FloatingOffers offers={popular.filter((s) => s.bestOffer).slice(0, 2)} />

                <p className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand shadow-[var(--shadow-card)] sm:inline-flex">
                  <BadgeCheck className="size-3.5" aria-hidden /> Every code checked by our team
                </p>
                <h1 className="mx-auto max-w-4xl text-[24px] font-extrabold leading-tight tracking-tight sm:mt-2.5 sm:text-[28px] lg:text-[32px]">
                  Verified coupons from the stores you shop
                </h1>
                <p className="mx-auto mt-1.5 max-w-2xl text-sm text-muted">
                  When you buy through links on our site,{" "}
                  <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
                    we may earn a commission
                  </Link>
                  .
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {featured.length > 0 && (
        <section className="container-page pt-8 sm:pt-14" aria-labelledby="featured-title">
          <div className="flex items-baseline gap-4">
            <h2 id="featured-title" className="section-title">Featured Deals</h2>
            <Link href="/deals" className="link text-sm">View all</Link>
          </div>
          {/* Phones show the first six; the rest are a tap away on "View all" */}
          <div className="mt-4 grid grid-cols-1 gap-3 max-sm:[&>*:nth-child(n+7)]:hidden sm:mt-6 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
            {featured.map((cp) => (
              <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />
            ))}
          </div>
        </section>
      )}

      {stores.length > 0 && (
        <section className="container-page pt-10 sm:pt-16" aria-labelledby="stores-title">
          <div className="flex items-baseline gap-4">
            <h2 id="stores-title" className="section-title">Popular Stores</h2>
            <Link href="/stores" className="link text-sm">All stores</Link>
          </div>
          {/* Three full rows at most below md (3 across); the rest are on "All stores" */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 max-md:[&>*:nth-child(n+10)]:hidden sm:mt-6 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {stores.map((s) => (
              <StoreTile key={s.id} store={s} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container-page pt-10 sm:pt-16" aria-labelledby="cat-title">
          <h2 id="cat-title" className="section-title">Shop by Category</h2>
          <ul className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((cat) => (
              <li key={cat.id}>
                <CategoryCard category={cat} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {latest.length > 0 && (
        <section className="container-page pt-10 sm:pt-16" aria-labelledby="latest-title">
          <h2 id="latest-title" className="section-title">Just Added</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 max-sm:[&>*:nth-child(n+5)]:hidden sm:mt-6 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((cp) => (
              <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page pt-10 sm:pt-16" aria-label="How to use a coupon code">
        <div className="overflow-hidden rounded-[24px] bg-brand px-5 py-7 sm:px-10 sm:py-10">
          <CouponHowTo photo="/tips/cart.webp" kicker="Quick guide · 3 steps" />
        </div>
      </section>

      <CouponReveal couponId={c} />
    </>
  );
}

const SLOTS = [
  { at: "left-8 top-1/2 -translate-y-1/2 -rotate-3", delay: "0s", icon: Tag },
  { at: "right-8 top-1/2 -translate-y-1/2 rotate-3", delay: "1.2s", icon: Gift },
];

/** Decorative offer tickets floating either side of the hero title on wide screens. */
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
