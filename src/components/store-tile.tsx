import Link from "next/link";
import { StoreLogo } from "./store-logo";

export function StoreTile({ store }: { store: { name: string; slug: string; logoUrl: string | null; _count?: { coupons: number } } }) {
  return (
    <Link
      href={`/stores/${store.slug}`}
      className="card flex flex-col items-center gap-2 p-3 text-center transition-shadow duration-200 hover:shadow-[var(--shadow-lift)] sm:gap-3 sm:p-4"
    >
      <StoreLogo name={store.name} logoUrl={store.logoUrl} className="size-12 text-sm sm:size-16 sm:text-lg" />
      <span className="line-clamp-2 text-xs font-semibold text-ink sm:text-sm">{store.name}</span>
      {store._count && <span className="-mt-1.5 text-[11px] text-muted sm:-mt-2 sm:text-xs">{store._count.coupons} {store._count.coupons === 1 ? "offer" : "offers"}</span>}
    </Link>
  );
}
