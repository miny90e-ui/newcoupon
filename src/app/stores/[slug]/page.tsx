import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame } from "lucide-react";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { shopItems } from "@/lib/store-showcase";
import { STORE_INTROS } from "@/config/store-intros";
import { monthYear, siteUrl } from "@/lib/utils";
import { StoreLogo } from "@/components/store-logo";
import { CouponRow } from "@/components/coupon-row";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ c?: string; type?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await db.store.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!store) return {};
  const title = `${store.name} Coupons & Promo Codes — ${monthYear()}`;
  return {
    title,
    description: store.description ?? `The latest ${store.name} coupon codes, promo codes and deals, verified by Offers Coupon.`,
    alternates: { canonical: `/stores/${slug}` },
    openGraph: { title },
  };
}

export default async function StorePage({ params, searchParams }: Props) {
  const [{ slug }, { c, type }] = await Promise.all([params, searchParams]);
  const store = await db.store.findUnique({ where: { slug }, include: { category: true } });
  if (!store) notFound();

  const session = await getSession();
  const live = liveCouponWhere();
  const typeFilter = type === "code" ? { type: "CODE" as const } : type === "deal" ? { type: "DEAL" as const } : {};

  const [coupons, expired, related, saved, counts, items] = await Promise.all([
    db.coupon.findMany({
      where: { ...live, storeId: store.id, ...typeFilter },
      include: couponCardInclude,
      orderBy: [{ featured: "desc" }, { exclusive: "desc" }, { createdAt: "desc" }],
    }),
    db.coupon.findMany({
      where: { storeId: store.id, active: true, expiresAt: { lte: new Date() } },
      include: couponCardInclude,
      orderBy: { expiresAt: "desc" },
      take: 5,
    }),
    store.categoryId
      ? db.store.findMany({ where: { categoryId: store.categoryId, NOT: { id: store.id } }, take: 6, orderBy: { featured: "desc" } })
      : Promise.resolve([]),
    getSavedIds(session?.userId),
    db.coupon.groupBy({ by: ["type"], where: { ...live, storeId: store.id }, _count: true }),
    shopItems(store),
  ]);
  const intro = STORE_INTROS[store.slug] ?? store.description;

  const nCodes = counts.find((x) => x.type === "CODE")?._count ?? 0;
  const nDeals = counts.find((x) => x.type === "DEAL")?._count ?? 0;
  const tabs = [
    { key: undefined, label: `All (${nCodes + nDeals})` },
    { key: "code", label: `Codes (${nCodes})` },
    { key: "deal", label: `Deals (${nDeals})` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Stores", item: siteUrl("/stores") },
      { "@type": "ListItem", position: 2, name: store.name, item: siteUrl(`/stores/${store.slug}`) },
    ],
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/stores" className="hover:text-ink">Stores</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-ink">{store.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="min-w-0 space-y-6">
          <div className="card flex flex-col items-center p-5 text-center">
            <StoreLogo name={store.name} logoUrl={store.logoUrl} className="size-20 text-2xl lg:size-28 lg:text-3xl" />
            {intro && <p className="mt-4 text-sm leading-relaxed text-body">{intro}</p>}
            {items.length > 0 && (
              <section aria-labelledby="best-sellers" className="mt-5 w-full text-left">
                <h2 id="best-sellers" className="flex items-center gap-1.5 text-sm font-extrabold">
                  <Flame className="size-4 text-brand" aria-hidden />
                  {store.name} best sellers
                </h2>
                {/* A strip to swipe on phones, a grid in the desktop sidebar. */}
                <ul className="-mx-5 mt-2.5 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0">
                  {items.map((it) => (
                    <li key={it.image} className="w-32 shrink-0 snap-start overflow-hidden rounded-xl bg-brand-tint lg:w-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} loading="lazy" className="aspect-square w-full bg-white object-contain p-1" />
                      <div className="p-2">
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink">{it.title}</p>
                        {it.price && <p className="mt-0.5 text-xs font-bold text-brand">{it.price}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {store.category && (
              <Link href={`/categories/${store.category.slug}`} className="mt-4 text-sm text-muted hover:text-ink">
                More {store.category.name} stores
              </Link>
            )}
          </div>
        </aside>

        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">{store.name} Coupons &amp; Promo Codes</h1>
          <p className="mt-2 text-muted">
            {nCodes + nDeals} active offers · Updated {monthYear()}
          </p>

          <div role="tablist" aria-label="Filter offers" className="mt-6 flex gap-2 overflow-x-auto">
            {tabs.map((t) => {
              const active = (type ?? undefined) === t.key || (!t.key && !["code", "deal"].includes(type ?? ""));
              return (
                <Link
                  key={t.label}
                  role="tab"
                  aria-selected={active}
                  href={t.key ? `/stores/${store.slug}?type=${t.key}` : `/stores/${store.slug}`}
                  scroll={false}
                  className={active ? "btn bg-ink text-white" : "btn-outline"}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 space-y-4">
            {coupons.length === 0 ? (
              <p className="card p-8 text-center text-muted">No active offers right now. Check back soon.</p>
            ) : (
              coupons.map((cp) => <CouponRow key={cp.id} coupon={cp} saved={saved.has(cp.id)} />)
            )}
          </div>

          {expired.length > 0 && (
            <details className="mt-10">
              <summary className="cursor-pointer text-lg font-bold text-ink">Recently expired {store.name} coupons</summary>
              <p className="mt-1 text-sm text-muted">These may no longer work, but some stores still accept them.</p>
              <div className="mt-4 space-y-4">
                {expired.map((cp) => <CouponRow key={cp.id} coupon={cp} saved={saved.has(cp.id)} expired />)}
              </div>
            </details>
          )}

          {related.length > 0 && (
            <section className="mt-12" aria-labelledby="related-title">
              <h2 id="related-title" className="section-title">Similar stores</h2>
              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4 xl:grid-cols-6">
                {related.map((s) => <StoreTile key={s.id} store={s} />)}
              </div>
            </section>
          )}
        </div>
      </div>
      <CouponReveal couponId={c} />
    </div>
  );
}
