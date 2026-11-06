import Link from "next/link";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import type { SavingsPost } from "@/lib/savings-posts";
import { cn } from "@/lib/utils";
import { StoreLogo } from "./store-logo";
import { ratingText } from "./shopper-reviews";

export const postDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// One colour family per category, so the list reads at a glance. `hero` carries white text (4.5:1 at its
// lighter end), `text` sits on `tint`, `stage` is the bright backdrop behind a product photo.
type Tone = { hero: string; stage: string; tint: string; text: string; solid: string };
const TONES: Record<string, Tone> = {
  beauty: { hero: "from-[#be185d] to-[#5c0d33]", stage: "from-[#ffd1e3] to-[#f472a8]", tint: "bg-[#fdeef4]", text: "text-[#a8174f]", solid: "bg-[#be185d]" },
  fashion: { hero: "from-[#6d28d9] to-[#2e1065]", stage: "from-[#e2d6ff] to-[#a78bfa]", tint: "bg-[#f3eeff]", text: "text-[#5b21b6]", solid: "bg-[#6d28d9]" },
  electronics: { hero: "from-[#1d4ed8] to-[#172554]", stage: "from-[#d3e2ff] to-[#6d9cff]", tint: "bg-[#eaf1ff]", text: "text-[#1e40af]", solid: "bg-[#1d4ed8]" },
  travel: { hero: "from-[#0369a1] to-[#0c2d48]", stage: "from-[#cdeefd] to-[#4cc3f5]", tint: "bg-[#e6f6fd]", text: "text-[#075985]", solid: "bg-[#0369a1]" },
  "home-garden": { hero: "from-[#15803d] to-[#052e16]", stage: "from-[#d3f5de] to-[#5fd38b]", tint: "bg-[#eaf8ef]", text: "text-[#166534]", solid: "bg-[#15803d]" },
  "food-dining": { hero: "from-[#c2410c] to-[#6c2408]", stage: "from-[#ffe1c7] to-[#fb923c]", tint: "bg-[#fff2e8]", text: "text-[#9a3412]", solid: "bg-[#c2410c]" },
  "sports-outdoors": { hero: "from-[#b91c1c] to-[#5c0f0f]", stage: "from-[#ffd6d6] to-[#f87171]", tint: "bg-[#fdeeee]", text: "text-[#991b1b]", solid: "bg-[#b91c1c]" },
  "health-wellness": { hero: "from-[#0c7a80] to-[#0f2e33]", stage: "from-[#cdf1f1] to-[#4cc9c9]", tint: "bg-[#e8f6f6]", text: "text-[#0b6a6f]", solid: "bg-[#0c7a80]" },
};
/** The category colours in turn, for lists that aren't about one store (the tips in a guide). */
export const TONE_CYCLE = Object.values(TONES);
const GUIDE: Tone = { hero: "from-[#0c7a80] to-[#0f2e33]", stage: "from-[#fff1b8] to-[#ffc93c]", tint: "bg-[#fff7d6]", text: "text-[#8a5300]", solid: "bg-[#e0a800]" };

export function postTone(post: SavingsPost): Tone {
  if (post.kind === "guide") return GUIDE;
  return TONES[post.store?.category?.slug ?? ""] ?? TONES["health-wellness"];
}

/** "Fashion", "Guide": what a post is about, in one word or two. */
export const postLabel = (post: SavingsPost) => (post.kind === "guide" ? "Guide" : (post.store?.category?.name ?? "Deal"));

/** Byline: who, when, and the store's headline rating when there is one. `onDark` for a coloured header. */
export function PostMeta({ post, onDark, className }: { post: SavingsPost; onDark?: boolean; className?: string }) {
  const top = post.reviews?.sources[0];
  return (
    <p className={cn("flex flex-wrap items-center gap-x-1.5 text-xs", onDark ? "text-white/75" : "text-muted", className)}>
      <span>Offers Coupon Team</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{postDate(post.date)}</time>
      {top && (
        <>
          <span aria-hidden>·</span>
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", onDark ? "text-white" : "text-ink")}>
            <Star className="size-3 fill-gold text-[#e0a800]" aria-hidden />
            {ratingText(top.rating)}
            <span className="font-normal opacity-80">{top.product ? "" : ` ${top.site}`}</span>
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
    <span className={cn("grid place-items-center bg-white p-3", className)}>
      {post.store && <StoreLogo name={post.store.name} logoUrl={post.store.logoUrl} className="h-full max-h-20 w-full text-sm" />}
    </span>
  );
}

/** Gold sale sticker: the discount on a deal, "Guide" on a guide. */
export function Sticker({ post, className }: { post: SavingsPost; className?: string }) {
  const label = post.kind === "guide" ? "Guide" : post.coupon?.discountLabel;
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex -rotate-3 items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold uppercase leading-none text-ink shadow-[0_4px_10px_-2px_rgb(0_0_0/0.3)]",
        className
      )}
    >
      {post.kind === "guide" && <BookOpen className="size-3" aria-hidden />}
      {label}
    </span>
  );
}

function RatingPill({ post }: { post: SavingsPost }) {
  const top = post.reviews?.sources[0];
  if (!top) return null;
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-ink shadow">
      <Star className="size-3 fill-gold text-[#e0a800]" aria-hidden />
      {ratingText(top.rating)}
    </span>
  );
}

/** The lead article: its photo beside a panel in the store's category colour. */
export function FeaturedPost({ post }: { post: SavingsPost }) {
  const tone = postTone(post);
  const top = post.reviews?.sources[0];
  return (
    <Link
      href={`/savings-tips/${post.slug}`}
      className="group grid overflow-hidden rounded-3xl bg-ink shadow-[0_24px_48px_-20px_rgb(15_46_51/0.55)] sm:grid-cols-[1.1fr_1fr]"
    >
      <div className="relative aspect-[2/1] overflow-hidden sm:aspect-auto sm:min-h-72">
        <PostImage post={post} wide className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink shadow sm:left-4 sm:top-4">
          Featured
        </span>
        <Sticker post={post} className="absolute bottom-3 right-3 px-3 py-1.5 text-sm sm:bottom-4 sm:right-4" />
      </div>
      <div className={cn("relative flex flex-col justify-center overflow-hidden bg-gradient-to-br p-5 sm:p-7", tone.hero)}>
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <span aria-hidden className="absolute -bottom-14 right-10 size-28 rounded-full bg-gold/20" />
        <p className="relative text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
          {post.kind === "deal" ? `${postLabel(post)} · Tested this week` : "Shopping guide"}
        </p>
        <h2 className="relative mt-1.5 text-xl font-extrabold leading-snug text-white sm:text-2xl">{post.title}</h2>
        {top && (
          <p className="relative mt-2 flex items-center gap-1.5 text-sm text-white/90">
            <span className="flex" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className={cn("size-3.5", i < Math.round(top.rating) ? "fill-gold text-gold" : "text-white/40")} />
              ))}
            </span>
            <span className="font-bold text-white">{ratingText(top.rating)}</span>
            <span>
              {top.product ? "" : `on ${top.site} · `}
              {top.count.toLocaleString("en-US")} reviews
            </span>
          </p>
        )}
        <p className="relative mt-2 line-clamp-2 text-sm text-white/85">{post.excerpt}</p>
        <span className="relative mt-4 inline-flex min-h-10 w-fit items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-bold text-ink transition-transform group-hover:translate-x-1">
          {post.kind === "deal" ? "Get the code" : "Read the guide"}
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** A post in the grid: the store's product on a stage in its category colour, then the headline. */
export function PostCard({ post }: { post: SavingsPost }) {
  const tone = postTone(post);
  return (
    <Link
      href={`/savings-tips/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", tone.stage)}>
        <span aria-hidden className="absolute -right-8 -top-8 size-24 rounded-full bg-white/25" />
        <span aria-hidden className="absolute -bottom-6 -left-6 size-16 rounded-full bg-white/20" />
        {post.kind === "guide" ? (
          <PostImage post={post} className="absolute inset-0 size-full" />
        ) : (
          <PostImage
            post={post}
            className="absolute left-1/2 top-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-xl shadow-[0_12px_24px_-10px_rgb(0_0_0/0.45)] ring-4 ring-white transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105"
          />
        )}
        <Sticker post={post} className="absolute left-2 top-2" />
        <span className="absolute bottom-2 right-2">
          <RatingPill post={post} />
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col p-3 sm:p-4", tone.tint)}>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider sm:text-[11px]", tone.text)}>{postLabel(post)}</span>
        <h3 className="mt-0.5 line-clamp-3 text-[13px] font-bold leading-snug text-ink sm:text-[15px]">{post.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-body max-sm:hidden">{post.excerpt}</p>
        <span className={cn("mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold", tone.text)}>
          {post.kind === "deal" ? "Get the code" : "Read the guide"}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
