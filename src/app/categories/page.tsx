import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CategoryIcon } from "@/components/category-icon";

export const metadata: Metadata = {
  title: "Coupon Categories",
  description: "Find coupons and deals by category: fashion, beauty, electronics, travel, home and more.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { stores: true } } },
  });
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Categories</h1>
      <p className="mt-2 text-muted">Pick a category to see its stores and best offers.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/categories/${c.slug}`} className="card flex items-start gap-4 p-5 transition-colors hover:border-brand">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-tint text-brand">
                <CategoryIcon name={c.icon} className="size-6" />
              </span>
              <span>
                <span className="block text-lg font-bold text-ink">{c.name}</span>
                {c.description && <span className="mt-0.5 block text-sm text-muted">{c.description}</span>}
                <span className="mt-1 block text-xs font-medium text-muted">{c._count.stores} stores</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
