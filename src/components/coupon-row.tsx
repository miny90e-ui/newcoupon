import { BadgeCheck, Clock, Users } from "lucide-react";
import type { CouponWithStore } from "@/lib/queries";
import { cn, daysLeft, formatDate } from "@/lib/utils";
import { RevealTrigger } from "./reveal-trigger";
import { CodePeek } from "./code-peek";
import { SaveButton } from "./save-button";

/** Wide list item used on store pages. */
export function CouponRow({ coupon, saved, expired = false }: { coupon: CouponWithStore; saved: boolean; expired?: boolean }) {
  const left = daysLeft(coupon.expiresAt);
  const isCode = coupon.type === "CODE" && !!coupon.code;
  return (
    <article className={cn("card relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5", expired && "opacity-70")}>
      <div className="flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-tint px-3 py-4 text-center sm:w-28 sm:flex-col sm:py-5">
        <span className="text-xl font-extrabold leading-tight text-ink">{coupon.discountLabel || (isCode ? "CODE" : "DEAL")}</span>
        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-brand sm:ml-0 sm:mt-1">{isCode ? "Code" : "Deal"}</span>
      </div>
      <div className="min-w-0 flex-1 pr-10 sm:pr-0">
        <div className="flex flex-wrap items-center gap-2">
          {coupon.exclusive && <span className="rounded bg-brand-tint px-2 py-0.5 text-xs font-bold uppercase text-brand">Exclusive</span>}
          {coupon.tag && <span className="rounded bg-canvas px-2 py-0.5 text-xs font-bold uppercase text-ink">{coupon.tag}</span>}
        </div>
        <h3 className="mt-1.5 text-lg font-bold leading-snug">{coupon.title}</h3>
        {coupon.description && <p className="mt-1 text-sm text-muted">{coupon.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          {coupon.verified && !expired && (
            <span className="inline-flex items-center gap-1 font-medium text-brand">
              <BadgeCheck className="size-4" aria-hidden /> Verified
            </span>
          )}
          {coupon.clicks > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden /> {coupon.clicks.toLocaleString("en-US")} used
            </span>
          )}
          {coupon.expiresAt && (
            <span className={cn("inline-flex items-center gap-1", !expired && left !== null && left <= 3 && "font-medium text-danger")}>
              <Clock className="size-3.5" aria-hidden />
              {expired ? `Expired ${formatDate(coupon.expiresAt)}` : `Expires ${formatDate(coupon.expiresAt)}`}
            </span>
          )}
        </div>
      </div>
      <RevealTrigger
        couponId={coupon.id}
        label={`${isCode ? "Get code" : "Get deal"}: ${coupon.title}`}
        className="group shrink-0 cursor-pointer self-stretch sm:self-center"
      >
        <CodePeek type={coupon.type} code={coupon.code} className="w-full sm:w-44" />
      </RevealTrigger>
      <SaveButton couponId={coupon.id} saved={saved} className="absolute right-3 top-3 sm:static" />
    </article>
  );
}
