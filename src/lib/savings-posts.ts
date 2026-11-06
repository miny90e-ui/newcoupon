import "server-only";
import { db } from "./db";
import { liveCouponWhere } from "./queries";
import { brandShowcases } from "./store-showcase";
import { GUIDES } from "@/config/savings-guides";
import { REVIEWS_CHECKED, SHOPPER_REVIEWS, type ShopperReviews } from "@/config/shopper-reviews";

// The articles on /savings-tips: one deal article per store with a live code (built from the sheet data,
// the store's own product photos and the shopper ratings), plus the evergreen guides.

export type SavingsPost = {
  slug: string;
  kind: "deal" | "guide";
  title: string;
  excerpt: string;
  date: string;
  /** Wide photo for the featured slot and the article header */
  image: string | null;
  thumb: string | null;
  store?: { slug: string; name: string; logoUrl: string | null; category: { slug: string; name: string } | null };
  coupon?: { id: string; title: string; code: string | null; discountLabel: string | null; description: string | null };
  /** The offer in words, without the "with code X" the importer adds when the sheet's offer column is blank */
  offer?: string;
  reviews?: ShopperReviews;
};

const SMALL = new Set(["a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);
const titleCase = (s: string) =>
  s.replace(/\S+/g, (w, i: number) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)));

const fmt = (r: number) => r.toFixed(Math.round(r * 100) % 10 ? 2 : 1);

function dealExcerpt(reviews: ShopperReviews | undefined, code: string | null) {
  const top = reviews?.sources[0];
  if (top?.product) return `Best seller ${top.product} is rated ${fmt(top.rating)}/5 from ${top.count.toLocaleString("en-US")} reviews. Here's the code and what buyers say.`;
  if (top) return `Rated ${fmt(top.rating)}/5 across ${top.count.toLocaleString("en-US")} ${top.site} reviews. Here's the code and what buyers say.`;
  return code ? `We tested code ${code} in the store's cart. Here's what it takes off and how to use it.` : "Here's the deal and how to get it.";
}

/** Every article, newest first in the order shown: the top-rated deals lead, the guides sit among them. */
export async function savingsPosts(): Promise<SavingsPost[]> {
  const stores = await db.store.findMany({
    where: { coupons: { some: liveCouponWhere() } },
    select: {
      slug: true,
      name: true,
      logoUrl: true,
      category: { select: { slug: true, name: true } },
      website: true,
      affiliateUrl: true,
      coupons: {
        where: liveCouponWhere(),
        select: { id: true, title: true, code: true, discountLabel: true, description: true },
        orderBy: [{ clicks: "desc" }, { updatedAt: "desc" }],
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });
  const showcases = await brandShowcases(stores);
  const rank = Object.keys(SHOPPER_REVIEWS);
  const order = (slug: string) => (rank.includes(slug) ? rank.indexOf(slug) : rank.length);

  const deals: SavingsPost[] = stores
    .sort((a, b) => order(a.slug) - order(b.slug))
    .map(({ coupons: [coupon], website: _w, affiliateUrl: _a, ...store }) => {
      const reviews = SHOPPER_REVIEWS[store.slug];
      const show = showcases.get(store.slug);
      const offer = coupon.title.replace(/\s+with code\s+\S+$/i, "");
      return {
        slug: `${store.slug}-promo-code`,
        kind: "deal",
        title: `${store.name} ${coupon.code ? "Promo Code" : "Deal"}: ${titleCase(offer)}`,
        excerpt: dealExcerpt(reviews, coupon.code),
        date: REVIEWS_CHECKED,
        image: show?.backdrop ?? null,
        thumb: show?.products[1] ?? null,
        store,
        coupon,
        offer,
        reviews,
      };
    });
  const guides: SavingsPost[] = GUIDES.map((g) => ({ ...g, kind: "guide", image: g.photo, thumb: g.photo }));
  // Guides third and seventh, like a magazine mixes features in among the news.
  const posts = [...deals];
  posts.splice(2, 0, guides[0]);
  posts.splice(6, 0, guides[1]);
  return posts;
}

export async function savingsPost(slug: string) {
  const posts = await savingsPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const related = [...posts.slice(i + 1), ...posts.slice(0, i)].slice(0, 3);
  return { post: posts[i], related };
}
