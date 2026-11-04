import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { couponCardInclude, getSavedIds, liveCouponWhere } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { monthYear } from "@/lib/utils";
import { CouponCard } from "@/components/coupon-card";
import { CouponReveal } from "@/components/coupon-reveal";
import { StoreTile } from "@/components/store-tile";
import { CategoryIcon } from "@/components/category-icon";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ c?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await db.category.findUnique({ where: { slug }, select: { name: true } });
  if (!cat) return {};
  return {
    title: `${cat.name} Coupons & Deals — ${monthYear()}`,
    description: `Save on ${cat.name.toLowerCase()} with the latest coupon codes and deals from top stores.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { c }] = await Promise.all([params, searchParams]);
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();
  const session = await getSession();
  const live = liveCouponWhere();

  const [coupons, stores, saved] = await Promise.all([
    db.coupon.findMany({
      where: { ...live, store: { categoryId: category.id } },
      include: couponCardInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 40,
    }),
    db.store.findMany({
      where: { categoryId: category.id },
      include: { _count: { select: { coupons: { where: live } } } },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    getSavedIds(session?.userId),
  ]);

  return (
    <div className="container-page py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/categories" className="hover:text-ink">Categories</Link> / <span className="text-ink">{category.name}</span>
      </nav>
      <div className="mt-5 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand">
          <CategoryIcon name={category.icon} className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">{category.name} Coupons &amp; Deals</h1>
          {category.description && <p className="mt-1 text-muted">{category.description}</p>}
        </div>
      </div>

      {stores.length > 0 && (
        <section className="mt-10" aria-labelledby="cat-stores">
          <h2 id="cat-stores" className="section-title">Stores</h2>
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {stores.map((s) => <StoreTile key={s.id} store={s} />)}
          </div>
        </section>
      )}

      <section className="mt-12" aria-labelledby="cat-offers">
        <h2 id="cat-offers" className="section-title">Top offers</h2>
        {coupons.length === 0 ? (
          <p className="card mt-4 p-8 text-center text-muted">No active offers in this category yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {coupons.map((cp) => <CouponCard key={cp.id} coupon={cp} saved={saved.has(cp.id)} />)}
          </div>
        )}
      </section>
      <CouponReveal couponId={c} />
    </div>
  );
}
