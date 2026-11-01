import Link from "next/link";
import { db } from "@/lib/db";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryForm } from "./category-form";

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { stores: true } } } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Categories</h1>
      {saved && <p role="status" className="mt-4 rounded-lg bg-brand-tint px-3 py-2.5 text-sm font-medium">Category saved.</p>}
      <ul className="card mt-4 divide-y divide-line">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/admin/categories/${c.id}`} className="flex min-h-14 items-center gap-3 px-4 hover:bg-canvas">
              <CategoryIcon name={c.icon} className="size-5 text-brand" />
              <span className="flex-1 font-semibold text-ink">{c.name}</span>
              <span className="text-sm text-muted">{c._count.stores} stores · order {c.sortOrder}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 mt-10 text-lg font-bold">Add a category</h2>
      <CategoryForm />
    </div>
  );
}
