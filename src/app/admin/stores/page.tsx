import Link from "next/link";
import { db } from "@/lib/db";
import { StoreLogo } from "@/components/store-logo";

export default async function AdminStores({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string }> }) {
  const { q, saved } = await searchParams;
  const stores = await db.store.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    include: { category: { select: { name: true } }, _count: { select: { coupons: true } } },
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Stores ({stores.length})</h1>
        <Link href="/admin/stores/new" className="btn-primary">Add store</Link>
      </div>
      {saved && <p role="status" className="mt-4 rounded-lg bg-brand-tint px-3 py-2.5 text-sm font-medium">Store saved.</p>}
      <form className="mt-4 flex max-w-md gap-2">
        <label htmlFor="q" className="sr-only">Search stores</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search stores" className="input" />
        <button className="btn-outline">Search</button>
      </form>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Store</th><th className="p-3">Category</th><th className="p-3">Coupons</th><th className="p-3">Featured</th><th className="p-3"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stores.map((s) => (
              <tr key={s.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <StoreLogo name={s.name} logoUrl={s.logoUrl} className="size-9 rounded-lg text-xs" />
                    <div>
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="text-xs text-muted">/stores/{s.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{s.category?.name ?? "—"}</td>
                <td className="p-3 tabular-nums">{s._count.coupons}</td>
                <td className="p-3">{s.featured ? "Yes" : "—"}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/coupons/new?store=${s.id}`} className="mr-3 text-brand hover:underline">+ Coupon</Link>
                  <Link href={`/admin/stores/${s.id}`} className="font-semibold text-ink hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
