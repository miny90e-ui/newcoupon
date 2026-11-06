import Link from "next/link";
import { Star } from "lucide-react";
import type { SavingsPost } from "@/lib/savings-posts";
import { cn } from "@/lib/utils";
import { StoreLogo } from "./store-logo";
import { ratingText } from "./shopper-reviews";

export const postDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** Byline: who, when, and the store's headline rating when there is one. */
export function PostMeta({ post, className }: { post: SavingsPost; className?: string }) {
  const top = post.reviews?.sources[0];
  return (
    <p className={cn("flex flex-wrap items-center gap-x-1.5 text-xs text-muted", className)}>
      <span>Offers Coupon Team</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{postDate(post.date)}</time>
      {top && (
        <>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-ink">
            <Star className="size-3 fill-gold text-[#e0a800]" aria-hidden />
            {ratingText(top.rating)}
            <span className="font-normal text-muted">{top.product ? "" : ` ${top.site}`}</span>
          </span>
        </>
      )}
    </p>
  );
}

/** Photo for a post: the store's own product photo, or its logo when the shop's photos couldn't be read. */
export function PostImage({ post, wide, className }: { post: SavingsPost; wide?: boolean; className?: string }) {
  const src = wide ? post.image : post.thumb;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" loading={wide ? "eager" : "lazy"} decoding="async" className={cn("object-cover", className)} />;
  }
  return (
    <span className={cn("grid place-items-center border border-line bg-white p-3", className)}>
      {post.store && <StoreLogo name={post.store.name} logoUrl={post.store.logoUrl} className="h-full max-h-20 w-full text-sm" />}
    </span>
  );
}

function Kicker({ post }: { post: SavingsPost }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
      {post.kind === "guide" ? "Guide" : `Deal${post.coupon?.discountLabel ? ` · ${post.coupon.discountLabel}` : ""}`}
    </span>
  );
}

export function FeaturedPost({ post }: { post: SavingsPost }) {
  return (
    <Link href={`/savings-tips/${post.slug}`} className="group block">
      <PostImage post={post} wide className="aspect-[2/1] w-full rounded-2xl bg-brand-tint" />
      <div className="mt-3">
        <Kicker post={post} />
        <h2 className="mt-0.5 text-lg font-extrabold leading-snug text-ink group-hover:underline sm:text-xl">{post.title}</h2>
        <PostMeta post={post} className="mt-1" />
        <p className="mt-1.5 text-sm text-body">{post.excerpt}</p>
      </div>
    </Link>
  );
}

export function PostRow({ post }: { post: SavingsPost }) {
  return (
    <Link href={`/savings-tips/${post.slug}`} className="group flex gap-3 py-4 sm:gap-4">
      <PostImage post={post} className="size-20 shrink-0 rounded-xl bg-brand-tint sm:size-24" />
      <div className="min-w-0 flex-1">
        <Kicker post={post} />
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink group-hover:underline sm:text-base">{post.title}</h3>
        <PostMeta post={post} className="mt-0.5" />
        <p className="mt-1 line-clamp-2 text-[13px] text-body sm:text-sm">{post.excerpt}</p>
      </div>
    </Link>
  );
}
