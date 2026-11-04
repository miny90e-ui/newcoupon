import { BadgeCheck, ChevronRight, Clock } from "lucide-react";
import type { CouponWithStore } from "@/lib/queries";
import { daysLeft } from "@/lib/utils";
import { StoreLogo } from "./store-logo";
import { RevealTrigger } from "./reveal-trigger";
import { SaveButton } from "./save-button";

/**
 * Card used on the homepage, deals, category and search pages. On phones it is a compact row
 * (logo left, offer right, the whole card opens the code); from `sm` up it is a tall grid card.
 */
export function CouponCard({ coupon, saved }: { coupon: CouponWithStore; saved: boolean }) {
  const left = daysLeft(coupon.expiresAt);
  const isCode = coupon.type === "CODE" && !!coupon.code;
  return (
    <article className="card group relative flex overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-lift)] sm:flex-col">
      <RevealTrigger
        couponId={coupon.id}
        label={`${isCode ? "Get code" : "Get deal"}: ${coupon.store.name} — ${coupon.title}`}
        className="flex flex-1 cursor-pointer text-left sm:flex-col"
      >
        {coupon.tag && (
          <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:rounded-br-2xl sm:px-4 sm:py-2 sm:text-xs">
            {coupon.tag}
          </span>
        )}
        <div className="relative flex w-[38%] shrink-0 items-center justify-center px-3 py-5 sm:mx-4 sm:mt-4 sm:h-36 sm:w-auto sm:border-b sm:border-line sm:px-0 sm:pb-4 sm:pt-6">
          <StoreLogo name={coupon.store.name} logoUrl={coupon.store.logoUrl} className="size-[72px] max-w-full text-lg sm:size-24 sm:text-2xl" />
          {coupon.discountLabel && (
            <span className="absolute bottom-2 right-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-extrabold uppercase text-ink shadow-[var(--shadow-lift)] sm:-bottom-4 sm:right-0 sm:px-4 sm:py-2 sm:text-sm">
              {coupon.discountLabel}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col py-3.5 pl-1 pr-10 sm:px-4 sm:pb-4 sm:pt-6">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">{coupon.store.name}</p>
          <h3 className="mt-1 line-clamp-3 text-[15px] font-semibold leading-snug text-ink sm:mt-1.5 sm:line-clamp-none sm:text-base">
            {coupon.title}
          </h3>
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2.5 text-xs text-muted sm:pt-4">
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
            <span className="ml-auto inline-flex items-center font-bold text-brand sm:hidden">
              {isCode ? "Get Code" : "Get Deal"}
              <ChevronRight className="size-4" aria-hidden />
            </span>
          </div>
          <span className="mt-3 hidden min-h-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white transition-colors group-hover:bg-brand-hover sm:flex">
            {isCode ? "Get Code" : "Get Deal"}
          </span>
        </div>
      </RevealTrigger>
      <SaveButton couponId={coupon.id} saved={saved} className="absolute right-1 top-1 z-10 sm:right-2 sm:top-2" />
    </article>
  );
}
