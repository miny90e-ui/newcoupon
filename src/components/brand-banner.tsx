import Link from "next/link";
import { BadgeCheck, Flame } from "lucide-react";
import type { TopBrand } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { categoryPhoto } from "./category-card";
import { RevealTrigger } from "./reveal-trigger";
import { StoreLogo } from "./store-logo";

/** One home page banner for a top brand: category photo, logo, its most-used offer and Get Code. */
export function BrandBanner({ brand, rank, eager }: { brand: TopBrand; rank: number; eager?: boolean }) {
  const { coupon } = brand;
  const isCode = coupon.type === "CODE";
  const photo = categoryPhoto(brand.category?.slug) ?? "/tips/cart.webp";
  const headline = coupon.discountLabel ?? (isCode ? "Promo code" : "Special deal");

  return (
    <article className="grid h-full grid-rows-[116px_1fr] overflow-hidden rounded-[24px] bg-brand shadow-[0_14px_34px_-16px_rgb(15_46_51/0.45)] sm:grid-cols-[1.08fr_1fr] sm:grid-rows-1 sm:rounded-[28px]">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={720} height={480} loading={eager ? "eager" : "lazy"} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink shadow sm:left-5 sm:top-5">
          <Flame className="size-3.5 text-brand" aria-hidden />#{rank} top brand
          {brand.uses > 0 && <span className="font-medium text-muted">· {brand.uses.toLocaleString("en-US")} uses</span>}
        </span>
        {brand.category && (
          <span className="absolute bottom-3 left-4 hidden text-sm font-semibold text-white sm:bottom-5 sm:left-6 sm:block">
            {brand.category.name}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-col">
        <Link
          href={`/stores/${brand.slug}`}
          className="flex h-16 shrink-0 items-center justify-center gap-3 bg-white px-6 sm:h-28"
          aria-label={`${brand.name} coupons`}
        >
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="h-11 w-auto max-w-[65%] object-contain sm:h-20" />
          ) : (
            <StoreLogo name={brand.name} className="size-11 rounded-xl text-sm sm:size-14" />
          )}
          <span className="sr-only">{brand.name}</span>
        </Link>
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-4 text-center text-white sm:px-8">
          <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-white/80 sm:tracking-[0.18em]">
            <BadgeCheck className="size-4 shrink-0" aria-hidden />
            {coupon.exclusive ? "Exclusive code" : isCode ? "Verified code" : "Hot deal"}
          </p>
          <p
            className={cn(
              "mt-1.5 max-w-full break-words font-extrabold leading-none tracking-tight",
              headline.length > 10 ? "text-3xl sm:text-4xl lg:text-5xl" : "text-[40px] sm:text-5xl lg:text-6xl"
            )}
          >
            {headline}
          </p>
          <p className="mt-2 line-clamp-1 max-w-md text-sm text-white/85 sm:text-base">{coupon.title}</p>
          <div className="mt-3 flex items-center gap-4 sm:mt-4">
            <RevealTrigger
              couponId={coupon.id}
              label={`${isCode ? "Get code" : "Get deal"}: ${coupon.title}`}
              className="btn min-w-36 cursor-pointer bg-white font-bold uppercase tracking-wider text-ink hover:bg-brand-tint"
            >
              {isCode ? "Get Code" : "Get Deal"}
            </RevealTrigger>
            {brand.offers > 1 && (
              <Link href={`/stores/${brand.slug}`} className="hidden text-sm font-semibold text-white underline underline-offset-4 hover:text-white/80 sm:inline">
                All {brand.offers} offers
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
