import Link from "next/link";
import { ExternalLink, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { NOT_ENOUGH_REVIEWS, REVIEWS_CHECKED, SHOPPER_REVIEWS, type ReviewSource } from "@/config/shopper-reviews";
import { StoreLogo } from "./store-logo";

export type ReviewedStore = {
  slug: string;
  name: string;
  logoUrl: string | null;
  coupon: { id: string; discountLabel: string | null; code: string | null } | null;
};

/** 4.8 stays "4.8", 4.97 stays "4.97": the precision the review site itself shows. */
function rating(r: number) {
  return r.toFixed(Math.round(r * 100) % 10 ? 2 : 1);
}

function Source({ s }: { s: ReviewSource }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="group/src flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-sm hover:bg-brand-tint"
    >
      <Star className="size-4 shrink-0 fill-gold text-[#e0a800]" aria-hidden />
      <span className="font-extrabold text-ink">
        {rating(s.rating)}
        <span className="font-medium text-muted">/5</span>
      </span>
      <span className="min-w-0 flex-1 truncate text-muted">
        {s.product ? `${s.product} · ` : ""}
        <span className="font-semibold text-body group-hover/src:underline">{s.site}</span> · {s.count.toLocaleString("en-US")} reviews
      </span>
      <ExternalLink className="size-3.5 shrink-0 text-muted" aria-hidden />
    </a>
  );
}

/** Ratings and a plain summary from independent review sites for each store we have a code for. */
export function ShopperReviews({ stores }: { stores: ReviewedStore[] }) {
  const bySlug = new Map(stores.map((s) => [s.slug, s]));
  const rows = Object.entries(SHOPPER_REVIEWS).flatMap(([slug, reviews]) => {
    const store = bySlug.get(slug);
    return store ? [{ store, reviews }] : [];
  });
  const missing = NOT_ENOUGH_REVIEWS.map((slug) => bySlug.get(slug)?.name).filter(Boolean);
  const checked = new Date(`${REVIEWS_CHECKED}T12:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="mt-10 sm:mt-12">
      <h2 id="reviews-title" className="section-title">What shoppers say about these stores</h2>
      <p className="mt-1.5 max-w-2xl text-sm text-muted">
        Real ratings from independent review sites, good and bad, for every store we have a code for. Tap a rating to read
        the reviews yourself.
      </p>

      <ul className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {rows.map(({ store, reviews }) => (
          <li key={store.slug} className="card flex flex-col p-4">
            <div className="flex items-center gap-3">
              <StoreLogo name={store.name} logoUrl={store.logoUrl} className="size-11 shrink-0 rounded-lg text-xs" />
              <Link href={`/stores/${store.slug}`} className="min-w-0 flex-1 truncate font-bold text-ink hover:underline">
                {store.name}
              </Link>
              {store.coupon?.discountLabel && (
                <span className="shrink-0 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-extrabold uppercase text-brand">
                  {store.coupon.discountLabel}
                </span>
              )}
            </div>

            <div className="mt-3 space-y-1.5">
              {reviews.sources.map((s) => (
                <Source key={s.url} s={s} />
              ))}
            </div>

            {(reviews.liked || reviews.disliked) && (
              <div className="mt-3 space-y-1.5 text-[13px] leading-snug text-body">
                {reviews.liked && (
                  <p className="flex gap-2">
                    <ThumbsUp className="mt-0.5 size-3.5 shrink-0 text-brand" aria-label="Liked" />
                    {reviews.liked}
                  </p>
                )}
                {reviews.disliked && (
                  <p className="flex gap-2">
                    <ThumbsDown className="mt-0.5 size-3.5 shrink-0 text-danger" aria-label="Disliked" />
                    {reviews.disliked}
                  </p>
                )}
              </div>
            )}

            {store.coupon && (
              <div className="mt-auto pt-4">
                <Link href={`/stores/${store.slug}?c=${store.coupon.id}`} className="btn-primary min-h-10 w-full">
                  {store.coupon.code ? "Get Code" : "Get Deal"}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Checked {checked}. We list every review site with 10 or more reviews of a store, whatever the score, and sum up
        what reviewers say in our own words. These are reviews of the stores, not of Offers Coupon.
        {missing.length > 0 && ` Not enough independent reviews yet: ${missing.join(", ")}.`}
      </p>
    </section>
  );
}
