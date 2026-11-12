import type { ShopperReviews } from "@/config/shopper-reviews";
import { liveWays, type StoreFacts } from "@/config/store-facts";

// Search wording for store pages and their savings articles.
// A store page answers "<store> discount code" (someone ready to buy); its article answers "how to save at <store>"
// (someone still finding out). Promo code, coupon code and discount code mean the same thing to Google, so one
// page per store targets all three and the article targets a different question, instead of both chasing one keyword.
// The title and H1 lead with "Discount Code" because Keyword Planner (US) shows it is what most shoppers type
// (watchdives 110 a month vs 20 for "promo code", jennibag 90 vs 10, fanttik 70 vs 30); the description and FAQ keep
// "promo code" and "coupon code" so the page still matches those searches.

type Offer = { code: string | null; discountLabel: string | null; title: string };

/** The savings article for a store. Old addresses ended in "-promo-code"; the article page redirects them here. */
export const savingsSlug = (storeSlug: string) => `how-to-save-at-${storeSlug}`;

/** "10% OFF" → "10% Off", "FREE SHIP" → "Free Shipping". */
export function labelWords(label: string) {
  if (/^free ship/i.test(label)) return "Free Shipping";
  return label.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

const pct = (l: string) => Number(l.match(/^(\d+)\s*%/)?.[1] ?? 0);
const usd = (l: string) => Number(l.match(/^\$(\d+)/)?.[1] ?? 0);

/** The offer to lead with: codes before deals, then the biggest percentage, then the biggest dollar amount. */
export function headlineOffer<T extends Offer>(offers: T[]): T | undefined {
  return offers
    .filter((o) => o.discountLabel)
    .sort((a, b) => Number(!!b.code) - Number(!!a.code) || pct(b.discountLabel!) - pct(a.discountLabel!) || usd(b.discountLabel!) - usd(a.discountLabel!))[0];
}

const isFreeShipping = (o: Offer) => /free ship/i.test(`${o.discountLabel} ${o.title}`);

/** "Comenii Discount Code: 10% Off": the store page's keyword and its best discount, used as its H1 and to start its title. */
export function storeHeading(name: string, offers: Offer[]) {
  const top = headlineOffer(offers);
  const words = top?.discountLabel ? labelWords(top.discountLabel) : null;
  return words ? `${name} ${offers.some((o) => o.code) ? "Discount Code" : "Coupons"}: ${words}` : `${name} Discount Codes & Coupons`;
}

/** Title and description for a store page: keyword first, then the discount and the month, like the pages that rank for it. */
export function storeMeta(name: string, offers: Offer[], month: string) {
  const top = headlineOffer(offers);
  const hasCode = offers.some((o) => o.code);
  const n = offers.length;
  const words = top?.discountLabel ? labelWords(top.discountLabel) : null;
  const title = `${storeHeading(name, offers)} — ${month}`;
  const count = `${n} verified ${name} ${n === 1 ? "offer" : "offers"}`;
  // "Save $10 at X", "Get free shipping at X"
  const lead = !words ? "Save" : /\s+off$/i.test(words) ? `Save ${words.replace(/\s+off$/i, "")}` : `Get ${words.toLowerCase()}`;
  const description = hasCode
    ? `${lead} at ${name} with a promo code we tested in the store's own cart. ${count}: coupon codes, discount codes and deals, checked every week.`
    : words
      ? `${words} at ${name}, no promo code needed. ${count}, with every ${name} coupon and deal in one place.`
      : `The latest ${name} coupon codes, promo codes and deals, verified by Offers Coupon.`;
  return { title, description };
}

const rating = (r: number) => r.toFixed(Math.round(r * 100) % 10 ? 2 : 1);

/**
 * The questions shoppers ask about a store (Google's "People also ask" and suggestions), answered only with what we
 * know: the live offers, the shop's own products, its own shipping and return policies and the public ratings.
 * A question we can't answer truthfully is left out.
 */
export function storeFaq({
  name,
  intro,
  offers,
  reviews,
  facts,
}: {
  name: string;
  intro: string | null;
  offers: Offer[];
  reviews: ShopperReviews | undefined;
  facts?: StoreFacts;
}) {
  const faq: { q: string; a: string }[] = [];
  const top = headlineOffer(offers);
  const code = offers.find((o) => o.code);

  if (code) {
    faq.push({
      q: `Does ${name} have a promo code right now?`,
      a: `Yes${code.discountLabel ? `, one for ${labelWords(code.discountLabel).toLowerCase()}` : ""}. Tap Get Code to see it; ${name} opens in a new tab so you can shop while the code stays on this page.`,
    });
    faq.push({
      q: `How do I use a promo code at ${name}?`,
      a: `Tap Get Code and copy the code. Add what you want to your ${name} cart, paste the code in the discount code box at checkout and tap Apply. The discount shows before you pay.`,
    });
  } else if (top) {
    faq.push({
      q: `Do I need a promo code for ${name}?`,
      a: `Not right now: ${top.title.charAt(0).toLowerCase() + top.title.slice(1)}. Tap Get Deal to go to ${name}; the offer applies without a code.`,
    });
  }

  const ship = offers.find(isFreeShipping);
  if (ship) faq.push({ q: `Does ${name} offer free shipping?`, a: `Yes: ${ship.title.charAt(0).toLowerCase() + ship.title.slice(1)}.` });
  else if (facts?.shipping) {
    faq.push({
      q: /free/i.test(facts.shipping) ? `Does ${name} offer free shipping?` : `How does ${name} shipping work?`,
      a: facts.shipping,
    });
  }

  for (const w of liveWays(facts)) if (w.q) faq.push({ q: w.q, a: w.text });

  if (reviews?.sources.length) {
    const lines = reviews.sources.map((s) =>
      s.product
        ? `${s.product} is rated ${rating(s.rating)}/5 from ${s.count.toLocaleString("en-US")} reviews on ${s.site}`
        : `${name} is rated ${rating(s.rating)}/5 from ${s.count.toLocaleString("en-US")} reviews on ${s.site}`
    );
    faq.push({ q: `How do shoppers rate ${name}?`, a: `${lines.join(", and ")}.${reviews.liked ? ` ${reviews.liked}` : ""}` });
  }

  if (facts?.returns) faq.push({ q: `What is ${name}'s return policy?`, a: facts.returns });

  if (intro) faq.push({ q: `What does ${name} sell?`, a: intro });

  if (code) {
    faq.push({
      q: `How often are ${name} codes checked?`,
      a: `Every week. We fill a cart at ${name}, apply each code and note what it takes off, so the discount shown here is what the code really gives.`,
    });
  }
  return faq;
}
