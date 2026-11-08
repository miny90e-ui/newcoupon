// What shoppers search next to "<store> promo code" (Google's suggestions: "free shipping", "returns",
// "student discount", "birthday discount", "discount code first order"), answered from each store's own
// shipping policy, return policy and program pages, in our own words. Keyed by store slug.
// Rule: only what the store's own pages say; a store whose page says nothing on a point leaves it out.
// The store page turns these into FAQ answers; the savings article shows them as sections.

export type SaveWay = {
  /** Short name, e.g. "Student discount" */
  title: string;
  text: string;
  /** The search question this answers, added to the store's FAQ */
  q?: string;
  /** Last day the offer runs (yyyy-mm-dd); hidden after it */
  until?: string;
};

export type StoreFacts = {
  /** Day the store's pages were read (yyyy-mm-dd) */
  checked: string;
  shipping?: string;
  returns?: string;
  ways?: SaveWay[];
};

export const STORE_FACTS: Record<string, StoreFacts> = {
  "americas-favorite-toffee": {
    checked: "2026-11-08",
    returns: "Toffee is perishable, so Dave's Sweet Tooth doesn't take returns; gift cards can't be returned either.",
    ways: [{ title: "Bundles and variety packs", text: "Dave's Sweet Tooth sells toffee bundles and variety packs, like a 12-flavor pack; several were on sale when we checked." }],
  },
  "atk-gaming-gear": {
    checked: "2026-11-08",
    shipping:
      "Most orders leave within 1–3 business days. Standard shipping takes 3–16 business days and is sent with taxes and duties covered; DHL Express takes 1–4 business days and costs more.",
    returns: "Returns can be requested within 7 days of receiving the item, and the buyer pays the return shipping.",
    ways: [
      { title: "Gear Perks", text: "Items in ATK's Gear Perks collection come with discounts that apply by themselves at checkout." },
      { title: "ATK Rewards", text: "ATK runs its own rewards program, ATK Rewards." },
    ],
  },
  comenii: {
    checked: "2026-11-08",
    shipping:
      "Shipping to the US and Canada is $5 and free on orders over $50 (UK: free over £50, Australia: free over $80). Orders leave the warehouse in 1–2 days and arrive in 6–12 working days.",
    returns:
      "Unworn, unwashed items with their tags can be returned within 30 days of purchase, after asking Comenii's customer service. The buyer pays return shipping unless the item is faulty.",
    ways: [
      {
        title: "Student discount",
        q: "Does Comenii have a student discount?",
        text: "Yes: students get 15% off. Enter a student email on Comenii's Student Program page and confirm it to receive the code.",
      },
      {
        title: "Comenii Rewards",
        text: "Members get 200 points for joining, 5 points per $1 spent and 200 points on their birthday, and trade points for discount coupons.",
      },
    ],
  },
  drleo: {
    checked: "2026-11-08",
    shipping:
      "US shipping, Alaska and Hawaii included, is free on orders over $30 and $5 below that. DrLeo ships to the US and Mexico only; orders leave in 1–3 business days and arrive in 5–10.",
    returns: "You have 30 days after delivery to ask for a return. The buyer pays return shipping unless the item is faulty, damaged or wrong.",
    ways: [{ title: "Sets and Hot Sale", text: "DrLeo sells skincare sets, and its Hot Sale collection lists marked-down products." }],
  },
  fanttik: {
    checked: "2026-11-08",
    shipping: "Shipping is free on all products. Orders are processed in 1–2 business days and standard delivery takes 2–7 business days.",
    returns: "Unused items can be returned within 30 days of delivery, and Fanttik products come with a 12-month warranty.",
    ways: [
      { title: "Black Friday sale", text: "Fanttik's Black Friday Early Bird sale takes up to 50% off selected tools.", until: "2026-11-30" },
      { title: "Clearance and bundles", text: "Fanttik also runs a clearance sale and sells \"Bundle Save\" sets." },
      { title: "Membership", text: "Fanttik has a membership program with a refer-a-friend option." },
    ],
  },
  "godiva-s-secret": {
    checked: "2026-11-08",
    shipping:
      "US orders over $99 (after discounts) can ship free by USPS Priority Mail. Godiva's Secret also ships to Canada and abroad by USPS or DHL Express.",
    returns: "Items can be returned within 20 days of the day they shipped, and the full amount paid comes back as store credit.",
    ways: [
      {
        title: "Birthday code",
        q: "Does Godiva's Secret have a birthday discount?",
        text: "Yes: leave your email and birthday on the Birthday Rewards page and Godiva's Secret emails a 25% off code for one whole order on your birthday, valid for 30 days.",
      },
      {
        title: "Godiva's Rewards",
        text: "Earn 1 point per $1 spent; every 100 points is a $5 credit. A friend you refer gets 15% off and you get 200 points.",
      },
      { title: "Sale page", text: "Godiva's Secret keeps a Sale page of marked-down items." },
    ],
  },
  imagix: {
    checked: "2026-11-08",
    shipping: "Orders are processed within 1–3 business days, Monday to Friday.",
    returns:
      "Orders from myimagix.com can be returned within 30 days of delivery, refunded to the original payment method; the buyer pays return shipping unless the item is faulty or wrong.",
  },
  jennibag: {
    checked: "2026-11-08",
    shipping: "JenniBag charges one flat rate to ship anywhere in the world. Orders take 2–5 business days to reach the carrier.",
    returns: "Undamaged items can be returned or exchanged within 30 days of purchase, and the buyer pays return shipping.",
    ways: [{ title: "Email list", text: "JenniBag's newsletter sends subscriber-only offers." }],
  },
  "maestri-house": {
    checked: "2026-11-08",
    shipping: "Shipping is free on orders over $19.99 in the continental US, and delivery usually takes 2–5 business days.",
    returns: "Products bought on maestrihouse.com can be returned within 30 days of delivery, and every Maestri House product has a 1-year warranty.",
  },
  "matcha-sunday": {
    checked: "2026-11-08",
    shipping: "Shipping is free on orders over $50.",
    returns: "Matcha and other food are final sale. Accessories and teaware can be returned within 14 days of delivery.",
    ways: [
      { title: "Subscribe and save", text: "Matcha subscriptions renew at 5% off and can be skipped or cancelled at any time." },
      { title: "Sets and bundles", text: "Matcha Sunday also sells matcha kits, sets and powder bundles." },
    ],
  },
  "my-cluck-hut": {
    checked: "2026-11-08",
    shipping: "Shipping is free on orders of $62 or more (merch sent by a third party doesn't count toward it). Orders ship by USPS or UPS in 1–3 business days.",
    returns: "You have 14 days after receiving an item to ask for a return; it has to be unused and in its original packaging.",
    ways: [{ title: "Soap and candle bundles", text: "My Cluck Hut sells bundles of soap bars, candles and bath products." }],
  },
  ododos: {
    checked: "2026-11-08",
    shipping: "US standard shipping (3–5 business days) is free from $49 and $5.90 below that; express shipping (2–3 business days) is free from $129.",
    returns: "You have 30 days after receiving an item to ask for a return.",
    ways: [
      {
        title: "Newsletter coupon",
        q: "Is there an Ododos discount for signing up?",
        text: "Yes: subscribing to the Ododos newsletter gets you a 10% off coupon.",
      },
      { title: "Sale", text: "Ododos keeps a Sale collection of marked-down activewear." },
    ],
  },
  "passion-4-health": {
    checked: "2026-11-08",
    shipping: "Orders take 2–3 business days to process. International buyers pay any customs and duties.",
    returns: "Unopened products can be refunded or replaced if you ask within 30 days of the invoice date; opened products can't be returned.",
    ways: [
      { title: "Subscribe and save", text: "The liquid multivitamin can be bought on Subscribe & Save, a delivery subscription." },
      { title: "Wellness Pack", text: "Passion 4 Health also sells its products together as the Wellness Pack bundle." },
    ],
  },
  "sodapup-true-dogs-llc": {
    checked: "2026-11-08",
    shipping:
      "Standard shipping is free on orders of $40 or more (after discounts) in the continental US. Orders to Alaska, Hawaii and other countries pay shipping.",
    returns: "Eligible items can be returned within 30 days of purchase; the original shipping charge isn't refunded.",
    ways: [
      { title: "Bundles", text: "SodaPup has a discounted bundles collection; the lick mat bundle was 3 for the price of 1 when we checked." },
      { title: "Cosmetic seconds", text: "Toys with small cosmetic flaws are sold for less in the Cosmetic Seconds & Clearance collection." },
    ],
  },
  "supreme-hair-and-beauty": {
    checked: "2026-11-08",
    shipping: "Supreme Hair & Beauty ships across the US and abroad; international buyers may owe customs duties and taxes.",
    returns: "Returns have to be started within 14 days of receiving the order, and items must come back in the condition they arrived.",
    ways: [
      { title: "Clearance wigs", text: "The clearance section has wigs and crochet hair at reduced prices." },
      { title: "3-bundle deals", text: "Supreme Hair & Beauty sells hair bundles as 3-bundle deals." },
    ],
  },
  trivita: {
    checked: "2026-11-08",
    shipping: "Shipping is free on orders over $89, and orders are processed within 2 business days.",
    returns: "TriVita gives a full refund, minus shipping, if you're not satisfied within 60 days of the order date.",
    ways: [
      {
        title: "Premier Membership",
        q: "Does TriVita have a membership discount?",
        text: "Yes: registering a free TriVita account makes you a Premier Member, which saves up to 30% on products.",
      },
      { title: "Rewards and bundles", text: "TriVita also runs a rewards program and sells bundles of its best sellers." },
    ],
  },
  watchdives: {
    checked: "2026-11-08",
    shipping:
      "Watchdives ships to most countries. Most in-stock orders leave in 1–3 business days; postal shipping with taxes included takes 7–15 business days and express 4–6.",
    returns:
      "New products can be returned for a change of mind within 30 days of delivery, after Watchdives authorizes the return. Clearance and promotional items may have other terms.",
    ways: [
      { title: "11.11 Global Watch Festival", text: "Watchdives' biggest sale of the year runs from October 31 to December 31, 2026.", until: "2026-12-31" },
      { title: "Hot Sale", text: "The Hot Sale collection lists discounted watches." },
    ],
  },
};

/** Today's offers from a store's ways to save (ended offers drop off by themselves). */
export function liveWays(facts: StoreFacts | undefined, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return (facts?.ways ?? []).filter((w) => !w.until || w.until >= today);
}
