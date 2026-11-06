import { ExternalLink, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { REVIEWS_CHECKED, type ReviewSource, type ShopperReviews } from "@/config/shopper-reviews";

/** 4.8 stays "4.8", 4.97 stays "4.97": the precision the review site itself shows. */
export function ratingText(r: number) {
  return r.toFixed(Math.round(r * 100) % 10 ? 2 : 1);
}

export const reviewsChecked = () =>
  new Date(`${REVIEWS_CHECKED}T12:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

function Source({ s }: { s: ReviewSource }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="group/src flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm shadow-sm ring-1 ring-black/5 transition hover:ring-[#e0a800]"
    >
      <Star className="size-5 shrink-0 fill-gold text-[#e0a800]" aria-hidden />
      <span className="text-base font-extrabold text-ink">
        {ratingText(s.rating)}
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

/** A store's ratings from independent review sites (each linked) and what reviewers like and dislike. */
export function ReviewSummary({ reviews }: { reviews: ShopperReviews }) {
  return (
    <div>
      <div className="space-y-1.5">
        {reviews.sources.map((s) => (
          <Source key={s.url} s={s} />
        ))}
      </div>
      {(reviews.liked || reviews.disliked) && (
        <div className="mt-3 grid gap-2 text-sm leading-relaxed text-body sm:grid-flow-col sm:auto-cols-fr">
          {reviews.liked && (
            <p className="flex gap-2.5 rounded-xl bg-brand-tint p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white">
                <ThumbsUp className="size-3.5" aria-label="Liked" />
              </span>
              {reviews.liked}
            </p>
          )}
          {reviews.disliked && (
            <p className="flex gap-2.5 rounded-xl bg-[#e6ecee] p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-white">
                <ThumbsDown className="size-3.5" aria-label="Disliked" />
              </span>
              {reviews.disliked}
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-[#6b5a2a]">
        Checked {reviewsChecked()}. We list every review site with 10 or more reviews of the store, whatever the score,
        and sum up what reviewers say in our own words. These are reviews of the store, not of Offers Coupon.
      </p>
    </div>
  );
}
