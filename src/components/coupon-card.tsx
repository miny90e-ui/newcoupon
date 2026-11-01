import { BadgeCheck, Clock } from "lucide-react";
import type { CouponWithStore } from "@/lib/queries";
import { daysLeft } from "@/lib/utils";
import { StoreLogo } from "./store-logo";
import { RevealTrigger } from "./reveal-trigger";
import { SaveButton } from "./save-button";

/** Grid card used on the homepage, deals, category and search pages. */
export function CouponCard({ coupon, saved }: { coupon: CouponWithStore; saved: boolean }) {
  const left = daysLeft(coupon.expiresAt);
  const isCode = coupon.type === "CODE" && !!coupon.code;
  return (
    <article className="card group relative flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]">
      <RevealTrigger
        couponId={coupon.id}
        label={`${isCode ? "Get code" : "Get deal"}: ${coupon.store.name} — ${coupon.title}`}
        className="flex flex-1 cursor-pointer flex-col text-left"
      >
        {coupon.tag && (
          <span className="absolute left-0 top-0 z-10 rounded-br-2xl bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            {coupon.tag}
          </span>
        )}
        <div className="relative mx-4 mt-4 flex h-32 items-center justify-center border-b sm:h-36 border-line pb-4 pt-6">
          <StoreLogo name={coupon.store.name} logoUrl={coupon.store.logoUrl} className="h-24 w-24 max-w-full text-2xl" />
          {coupon.discountLabel && (
            <span className="absolute -bottom-4 right-0 rounded-full bg-surface px-4 py-2 text-sm font-extrabold uppercase text-ink shadow-[var(--shadow-lift)]">
              {coupon.discountLabel}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-4 pb-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{coupon.store.name}</p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-ink">{coupon.title}</h3>
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-muted">
            {coupon.verified && (
              <span className="inline-flex items-center gap-1 font-medium text-brand">
                <BadgeCheck className="size-4" aria-hidden /> Verified
              </span>
            )}
            {left !== null && left <= 7 && (
              <span className="inline-flex items-center gap-1 font-medium text-danger">
                <Clock className="size-3.5" aria-hidden /> {left <= 1 ? "Ends today" : `Ends in ${left} days`}
              </span>
            )}
          </div>
          <span className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white transition-colors group-hover:bg-brand-hover">
            {isCode ? "Get Code" : "Get Deal"}
          </span>
        </div>
      </RevealTrigger>
      <SaveButton couponId={coupon.id} saved={saved} className="absolute right-2 top-2 z-10" />
    </article>
  );
}
