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

export const REVIEWS_CHECKED = "2026-11-15";

/** Keyed by store slug, in the order shown. */
export const SHOPPER_REVIEWS: Record<string, ShopperReviews> = {
  watchdives: {
    sources: [{ site: "Trustpilot", rating: 4.8, count: 420, url: "https://www.trustpilot.com/review/watchdives.com" }],
    liked: "Watches that feel well finished for the price, careful packaging and helpful support. The latest reviews are almost all 5-star.",
  },
  "my-cluck-hut": {
    sources: [{ site: "Judge.me", rating: 4.97, count: 3315, url: "https://judge.me/reviews/stores/mycluckhut.com" }],
    liked: "The soap bars are the most reviewed items, and each best-selling scent is rated 4.9 or higher.",
  },
  jennibag: {
    sources: [
      { site: "Judge.me", rating: 4.85, count: 52378, url: "https://judge.me/reviews/stores/jennibag.com" },
      { site: "Trustpilot", rating: 2.8, count: 416, url: "https://www.trustpilot.com/review/jennibag.com" },
    ],
    liked: "Fits under the seat as a personal item, so many travellers skip the carry-on fee.",
    disliked: "Recent Trustpilot reviews mention slow customer service and a zipper that broke early.",
  },
  "sodapup-true-dogs-llc": {
    sources: [{ site: "Judge.me", rating: 4.86, count: 1057, url: "https://judge.me/reviews/stores/sodapup.com" }],
    liked: "Lick mats and slow-feeder trays, the best sellers, are rated 4.8 to 5 by buyers.",
  },
  comenii: {
    sources: [{ site: "Trustpilot", rating: 4.0, count: 304, url: "https://www.trustpilot.com/review/comenii.com" }],
    liked: "Soft, light fabric that holds up, a good fit and handy pockets for long shifts.",
    disliked: "Some buyers waited a long time for delivery or found returns hard.",
  },
  "atk-gaming-gear": {
    sources: [{ site: "Trustpilot", rating: 4.1, count: 342, url: "https://www.trustpilot.com/review/atk.store" }],
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
        count: 84,
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
        count: 84,
        url: "https://www.supremebeauty.com/products/natural-glow-carotone-clarifying-cream-choose-your-size",
      },
    ],
  },
  "godiva-s-secret": {
    sources: [{ site: "Trustpilot", rating: 3.2, count: 48, url: "https://www.trustpilot.com/review/godivassecretwigs.com" }],
    liked: "Easy, wearable wigs and friendly help over the phone.",
    disliked: "Some dislike the return policy, and one topper didn't match its photos.",
  },
  trivita: {
    sources: [
      { site: "trivita.com", product: "Nopalea", rating: 4.7, count: 171, url: "https://www.trivita.com/products/nopalea" },
      { site: "trivita.com", product: "Slow Dissolve Super B-12", rating: 4.9, count: 67, url: "https://www.trivita.com/products/slow-dissolve-super-b-12" },
    ],
  },
  "matcha-sunday": {
    sources: [{ site: "Judge.me", rating: 4.89, count: 157, url: "https://judge.me/reviews/stores/matchasunday.com" }],
    liked: "Buyers like the bright green colour and smooth, creamy taste, in drinks and in baking.",
  },
  "passion-4-health": {
    sources: [{ site: "Judge.me", rating: 4.9, count: 1211, url: "https://judge.me/reviews/stores/passion4healthvitamins.com" }],
    liked: "Long-time customers say the liquid multivitamin is easy to take and keep reordering it.",
  },
  fanttik: {
    sources: [{ site: "Trustpilot", rating: 3.6, count: 144, url: "https://www.trustpilot.com/review/fanttik.com" }],
    liked: "Well-made, reliable tools that are simple to use every day.",
    disliked: "Several reviewers had slow order processing, late deliveries or parcels that never arrived.",
  },
  lovful: {
    sources: [
      { site: "Judge.me", rating: 4.91, count: 2015, url: "https://judge.me/reviews/stores/lovful.com" },
      { site: "Trustpilot", rating: 2.7, count: 24, url: "https://www.trustpilot.com/review/lovful.com" },
    ],
    liked: "Buyers say the press-on nails look salon-made, fit well and last a long time.",
    disliked: "A few Trustpilot reviewers say promised free items were missing from their order.",
  },
  skymd: {
    sources: [{ site: "tryskymd.com", product: "Daily Hydration", rating: 4.9, count: 2516, url: "https://tryskymd.com/products/hydration" }],
  },
  "6am-nutrition": {
    sources: [
      { site: "6amrun.com", product: "Marathon", rating: 4.89, count: 341, url: "https://6amrun.com/products/marathon" },
      { site: "Trustpilot", rating: 1.4, count: 85, url: "https://www.trustpilot.com/review/6amrun.com" },
    ],
    disliked: "Recent Trustpilot reviews report orders that never shipped, slow refunds and marketing emails that are hard to stop.",
  },
  mewcats: {
    sources: [
      {
        site: "mewcats.com",
        product: "Luxury Detachable Cat Carrier Rolling Stroller",
        rating: 4.89,
        count: 131,
        url: "https://www.mewcats.com/products/luxury-large-detachable-pet-carrier",
      },
      {
        site: "mewcats.com",
        product: "Stylish Detachable Cat Stroller",
        rating: 4.9,
        count: 99,
        url: "https://www.mewcats.com/products/stylish-detachable-cat-stroller-3-color-pet-carrier-on-wheels",
      },
    ],
  },
  "litlookz-studio": {
    sources: [
      { site: "Trustpilot", rating: 3.6, count: 45, url: "https://www.trustpilot.com/review/litlookzstudio.com" },
      {
        site: "litlookzstudio.com",
        product: "You Are My Everything Ring",
        rating: 4.71,
        count: 24,
        url: "https://www.litlookzstudio.com/products/you-are-my-everything-ring",
      },
    ],
    liked: "Shoppers like the low prices, the many styles to choose from and pieces that hold up.",
    disliked: "Some orders took weeks to arrive or did not match the photos.",
  },
  gelshadow: {
    sources: [{ site: "Trustpilot", rating: 2.4, count: 63, url: "https://www.trustpilot.com/review/gelshadow.com" }],
    liked: "A few buyers got knives and slingshots for much less than elsewhere.",
    disliked: "Many reviews mention very slow delivery, wrong or missing items and slow replies.",
  },
};

/** Stores we have codes for but found no review source with 10+ reviews. */
export const NOT_ENOUGH_REVIEWS = ["maestri-house", "ododos", "imagix", "americas-favorite-toffee", "fang-nyc"];
