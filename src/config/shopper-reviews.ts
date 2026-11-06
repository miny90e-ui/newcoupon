// What real shoppers say about the stores we have codes for, shown on /savings-tips.
// Every number comes from a public review page (linked), never from us; "checked" is the day it was read.
// Rule: list every source with 10+ reviews, good or bad, and sum up what reviewers say in our own words
// (no copied review text). Stores with no such source go in NOT_ENOUGH_REVIEWS. Refreshed weekly.

export type ReviewSource = {
  /** e.g. "Trustpilot", "Judge.me", or the store's own site for a product's reviews */
  site: string;
  rating: number;
  count: number;
  url: string;
  /** Set when the rating is for one product rather than the whole store */
  product?: string;
};

export type ShopperReviews = { sources: ReviewSource[]; liked?: string; disliked?: string };

export const REVIEWS_CHECKED = "2026-11-06";

/** Keyed by store slug, in the order shown. */
export const SHOPPER_REVIEWS: Record<string, ShopperReviews> = {
  watchdives: {
    sources: [{ site: "Trustpilot", rating: 4.8, count: 410, url: "https://www.trustpilot.com/review/watchdives.com" }],
    liked: "Watches that feel well finished for the price, careful packaging and helpful support. The latest reviews are almost all 5-star.",
  },
  "my-cluck-hut": {
    sources: [{ site: "Judge.me", rating: 4.97, count: 3305, url: "https://judge.me/reviews/stores/mycluckhut.com" }],
    liked: "The soap bars are the most reviewed items, and each best-selling scent is rated 4.9 or higher.",
  },
  jennibag: {
    sources: [
      { site: "Judge.me", rating: 4.86, count: 50879, url: "https://judge.me/reviews/stores/jennibag.com" },
      { site: "Trustpilot", rating: 2.8, count: 414, url: "https://www.trustpilot.com/review/jennibag.com" },
    ],
    liked: "Fits under the seat as a personal item, so many travellers skip the carry-on fee.",
    disliked: "Recent Trustpilot reviews mention slow customer service and a zipper that broke early.",
  },
  "sodapup-true-dogs-llc": {
    sources: [{ site: "Judge.me", rating: 4.86, count: 1046, url: "https://judge.me/reviews/stores/sodapup.com" }],
    liked: "Lick mats and slow-feeder trays, the best sellers, are rated 4.8 to 5 by buyers.",
  },
  comenii: {
    sources: [{ site: "Trustpilot", rating: 4.0, count: 304, url: "https://www.trustpilot.com/review/comenii.com" }],
    liked: "Soft, light fabric that holds up, a good fit and handy pockets for long shifts.",
    disliked: "Some buyers waited a long time for delivery or found returns hard.",
  },
  "atk-gaming-gear": {
    sources: [{ site: "Trustpilot", rating: 4.0, count: 309, url: "https://www.trustpilot.com/review/atk.store" }],
    liked: "Very light mice, solid build and fair prices, with discounts through the year.",
    disliked: "Complaints about shipping delays and delivery costs.",
  },
  drleo: {
    sources: [
      {
        site: "drleo.com",
        product: "Deep Pore Clay Mask",
        rating: 4.8,
        count: 200,
        url: "https://drleo.com/products/dr-leo-amazon-white-deep-pore-cleansing-purifying-clay-mask",
      },
      {
        site: "drleo.com",
        product: "Salicylic Acid Drying Lotion",
        rating: 4.7,
        count: 82,
        url: "https://drleo.com/products/encapsulated-salicylic-acid-drying-lotion-plus-20ml",
      },
    ],
  },
  "supreme-hair-and-beauty": {
    sources: [
      {
        site: "supremebeauty.com",
        product: "Carotone Clarifying Cream",
        rating: 4.9,
        count: 83,
        url: "https://www.supremebeauty.com/products/natural-glow-carotone-clarifying-cream-choose-your-size",
      },
    ],
  },
  "godiva-s-secret": {
    sources: [{ site: "Trustpilot", rating: 3.2, count: 48, url: "https://www.trustpilot.com/review/godivassecretwigs.com" }],
    liked: "Easy, wearable wigs and friendly help over the phone.",
    disliked: "Some dislike the return policy, and one topper didn't match its photos.",
  },
};

/** Stores we have codes for but found no review source with 10+ reviews. */
export const NOT_ENOUGH_REVIEWS = ["maestri-house", "ododos", "imagix"];
