import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CategoryCard } from "@/components/category-card";

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
            <CategoryCard category={c} large />
          </li>
        ))}
      </ul>
    </div>
  );
}
