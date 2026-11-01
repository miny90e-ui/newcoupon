import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { liveCouponWhere } from "@/lib/queries";

export const metadata: Metadata = {
  title: "All Stores A–Z",
  description: "Browse every store on New Coupon and find their latest coupon codes and deals.",
  alternates: { canonical: "/stores" },
};

export default async function StoresPage() {
  const stores = await db.store.findMany({
    select: { name: true, slug: true, _count: { select: { coupons: { where: liveCouponWhere() } } } },
    orderBy: { name: "asc" },
  });

  const groups = new Map<string, typeof stores>();
  for (const s of stores) {
    const first = s.name[0]?.toUpperCase() ?? "#";
    const key = /[A-Z]/.test(first) ? first : "#";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  const letters = [...groups.keys()].sort();

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Stores</h1>
      <p className="mt-2 text-muted">{stores.length} stores with coupons and deals.</p>

      <nav aria-label="Jump to letter" className="sticky top-16 z-10 -mx-4 mt-6 overflow-x-auto bg-canvas/95 px-4 py-2 backdrop-blur">
        <ul className="flex gap-1">
          {letters.map((l) => (
            <li key={l}>
              <a href={`#letter-${l}`} className="grid size-10 place-items-center rounded-lg text-sm font-bold text-ink hover:bg-surface">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 space-y-8">
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="scroll-mt-32" aria-labelledby={`h-${l}`}>
            <h2 id={`h-${l}`} className="border-b border-line pb-2 text-2xl font-extrabold">{l}</h2>
            <ul className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {groups.get(l)!.map((s) => (
                <li key={s.slug}>
                  <Link href={`/stores/${s.slug}`} className="flex min-h-11 items-center justify-between gap-2 text-[15px] hover:text-brand">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted">{s._count.coupons}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
