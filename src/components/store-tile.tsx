import Link from "next/link";
import { StoreLogo } from "./store-logo";

export function StoreTile({ store }: { store: { name: string; slug: string; logoUrl: string | null; _count?: { coupons: number } } }) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className="card flex flex-col items-center gap-3 p-4 text-center transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]"
    >
      <StoreLogo name={store.name} logoUrl={store.logoUrl} className="size-16 text-lg" />
      <span className="text-sm font-semibold text-ink">{store.name}</span>
      {store._count && <span className="-mt-2 text-xs text-muted">{store._count.coupons} {store._count.coupons === 1 ? "offer" : "offers"}</span>}
    </Link>
  );
}
