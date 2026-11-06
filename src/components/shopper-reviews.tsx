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
      className="group/src flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-sm hover:bg-brand-tint"
    >
      <Star className="size-4 shrink-0 fill-gold text-[#e0a800]" aria-hidden />
      <span className="font-extrabold text-ink">
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
        <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-body">
          {reviews.liked && (
            <p className="flex gap-2">
              <ThumbsUp className="mt-1 size-3.5 shrink-0 text-brand" aria-label="Liked" />
              {reviews.liked}
            </p>
          )}
          {reviews.disliked && (
            <p className="flex gap-2">
              <ThumbsDown className="mt-1 size-3.5 shrink-0 text-danger" aria-label="Disliked" />
              {reviews.disliked}
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Checked {reviewsChecked()}. We list every review site with 10 or more reviews of the store, whatever the score,
        and sum up what reviewers say in our own words. These are reviews of the store, not of Offers Coupon.
      </p>
    </div>
  );
}
