import Link from "next/link";
import { BadgeCheck, Flame } from "lucide-react";
import type { Showcase } from "@/config/brand-showcase";
import type { TopBrand } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { RevealTrigger } from "./reveal-trigger";
import { StoreLogo } from "./store-logo";

// Stock photo per category, only for a brand whose shop photos can't be read (free Unsplash licence), 1120px wide.
const PHOTOS = new Set(["beauty", "fashion", "electronics", "travel", "home-garden", "food-dining", "sports-outdoors", "health-wellness"]);

/** One home page banner for a top brand: its own product photos, logo, its most-used offer and Get Code. */
export function BrandBanner({ brand, rank, eager }: { brand: TopBrand; rank: number; eager?: boolean }) {
  const { coupon } = brand;
  const isCode = coupon.type === "CODE";
  const slug = brand.category?.slug;
  const photo = `/banners/${slug && PHOTOS.has(slug) ? slug : "shopping"}.webp`;
  const { showcase } = brand;
  const headline = coupon.discountLabel ?? (isCode ? "Promo code" : "Special deal");

  return (
    <article className="grid h-full grid-cols-[1fr_1.05fr] overflow-hidden rounded-[20px] bg-brand shadow-[0_14px_34px_-16px_rgb(15_46_51/0.45)] sm:grid-cols-[1.08fr_1fr] sm:rounded-[28px]">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showcase?.backdrop ?? photo}
          alt=""
          width={1120}
          height={720}
          loading={eager ? "eager" : "lazy"}
          className={cn(
            "size-full object-cover transition-transform duration-[3600ms] ease-out motion-safe:group-data-[current=true]:scale-110",
            showcase && "blur-[2px]"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            showcase ? "from-ink/70 via-ink/30 to-ink/10" : "from-ink/45 via-transparent to-transparent"
          )}
        />
        {showcase && <ProductFan showcase={showcase} eager={eager} />}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-ink shadow sm:left-5 sm:top-5 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
          <Flame className="size-3 text-brand sm:size-3.5" aria-hidden />#{rank} top brand
          {brand.uses > 0 && <span className="hidden font-medium text-muted sm:inline">· {brand.uses.toLocaleString("en-US")} uses</span>}
        </span>
        {showcase ? (
          <span className="absolute bottom-5 left-5 hidden items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3.5 text-sm font-bold text-ink shadow-lg sm:inline-flex">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt="" className="size-8 rounded-full object-contain" />
            ) : (
              <StoreLogo name={brand.name} className="size-8 rounded-full text-[10px]" />
            )}
            {brand.name}
          </span>
        ) : (
          brand.category && (
            <span className="absolute bottom-3 left-4 hidden text-sm font-semibold text-white sm:bottom-5 sm:left-6 sm:block">
              {brand.category.name}
            </span>
          )
        )}
      </div>

      <div className="flex min-h-0 flex-col">
        <Link
          href={`/stores/${brand.slug}`}
          className="flex h-12 shrink-0 items-center justify-center gap-3 bg-white px-3 sm:h-28 sm:px-6"
          aria-label={`${brand.name} coupons`}
        >
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="h-8 w-auto max-w-[75%] object-contain sm:h-20 sm:max-w-[65%]" />
          ) : (
            <StoreLogo name={brand.name} className="size-9 rounded-xl text-xs sm:size-14 sm:text-sm" />
          )}
          <span className="sr-only">{brand.name}</span>
        </Link>
        <div className="flex flex-1 flex-col items-center justify-center px-3 py-2 text-center text-white sm:px-8 sm:py-4">
          <p className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 sm:gap-1.5 sm:text-xs sm:tracking-[0.18em]">
            <BadgeCheck className="size-3.5 shrink-0 sm:size-4" aria-hidden />
            {coupon.exclusive ? "Exclusive code" : isCode ? "Verified code" : "Hot deal"}
          </p>
          <p
            className={cn(
              "mt-1 max-w-full break-words font-extrabold leading-none tracking-tight sm:mt-1.5",
              headline.length > 10 ? "text-xl sm:text-4xl lg:text-5xl" : "text-[28px] sm:text-5xl lg:text-6xl"
            )}
          >
            {headline}
          </p>
          <p className="mt-2 hidden max-w-md text-sm text-white/85 sm:line-clamp-1 sm:text-base">{coupon.title}</p>
          <div className="mt-2.5 flex items-center gap-4 sm:mt-4">
            <RevealTrigger
              couponId={coupon.id}
              label={`${isCode ? "Get code" : "Get deal"}: ${coupon.title}`}
              className="btn min-h-10 min-w-0 cursor-pointer bg-white px-4 text-xs font-bold uppercase tracking-wider text-ink hover:bg-brand-tint sm:min-h-11 sm:min-w-36 sm:px-5 sm:text-sm"
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

const FAN = [
  { card: "z-0 -mr-2.5 size-11 -rotate-6 sm:-mr-4 sm:size-[104px] lg:size-40", delay: "0.4s" },
  { card: "z-10 size-[60px] sm:size-[136px] lg:size-52", delay: "0s" },
  { card: "z-0 -ml-2.5 size-11 rotate-6 sm:-ml-4 sm:size-[104px] lg:size-40", delay: "0.9s" },
];

/** Three of the brand's own products on white cards, fanned out and gently floating. */
function ProductFan({ showcase, eager }: { showcase: Showcase; eager?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center pt-5 sm:pb-6 sm:pt-0">
      {showcase.products.map((src, i) => (
        <div key={src} className={cn("relative shrink-0", FAN[i].card)}>
          <div
            className="size-full rounded-xl bg-white p-0.5 shadow-[0_12px_28px_-8px_rgb(15_46_51/0.55)] motion-safe:animate-[nc-float_5s_ease-in-out_infinite] sm:rounded-2xl sm:p-1.5"
            style={{ animationDelay: FAN[i].delay }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={eager ? "eager" : "lazy"} className="size-full rounded-[10px] object-contain sm:rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
