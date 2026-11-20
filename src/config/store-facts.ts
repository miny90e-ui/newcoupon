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
  "28pilates": {
    checked: "2026-11-20",
    shipping:
      "28 Pilates ships only within the US, and shipping is free on every order. Orders are processed in 1–2 business days and arrive in about 5–7 business days by DHL or FedEx.",
    returns:
      "US buyers can return a purchase within 30 days of receiving it, for any reason; email 28 Pilates first for instructions. Faulty or wrong items go back free; after a change of mind, the buyer pays the return shipping.",
    ways: [{ title: "Black Friday sale", text: "When we checked on November 20, 28 Pilates' site advertised 70% off plus three free gifts.", until: "2026-11-30" }],
  },
  "6am-nutrition": {
    checked: "2026-11-16",
    shipping:
      "Shipping is free on orders of $55 or more (after discounts); smaller orders pay the USPS Priority rate shown at checkout. Orders ship by the next business day and can take 7–10 days to arrive.",
    returns:
      "6AM Run's money-back guarantee: take a product daily for at least two weeks, and if it doesn't work for you, contact 6AM Run within 30 days of the order date for a refund plus a $10 gift card, without sending anything back.",
    ways: [{ title: "Build a bundle", text: "6AM Run's Build a Bundle page lets you pack several of its products together to save." }],
  },
  "all-naturell-healing": {
    checked: "2026-11-20",
    shipping:
      "Orders ship within 3–5 business days, by USPS unless you pick another option, with a tracking number; eBooks can be downloaded right away. Orders over $500 need a signature on delivery.",
    returns:
      "Herbs, herbal products, capsules and cookbooks can't be returned or refunded. A damaged or wrong item must be reported within 7 business days of delivery; for anything else, email All Naturell Healing first to ask whether it can be returned or exchanged.",
    ways: [{ title: "Reward points", text: "All Naturell Healing runs a points program, and its site explains how to redeem points on an order." }],
  },
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
  "cowboy-colostrum": {
    checked: "2026-11-20",
    returns:
      "Because colostrum is a food, only unopened bottles with the tamper seal intact can be returned. Email Cowboy Colostrum first for a return label; approved refunds go back to the original payment method within 10 business days.",
    ways: [
      { title: "Black Friday sale", text: "When we checked on November 20, Cowboy Colostrum was taking 45% off sitewide, subscriptions included.", until: "2026-11-30" },
      { title: "Rewards", text: "Cowboy Colostrum runs its own rewards program." },
    ],
  },
  drleo: {
    checked: "2026-11-08",
    shipping:
      "US shipping, Alaska and Hawaii included, is free on orders over $30 and $5 below that. DrLeo ships to the US and Mexico only; orders leave in 1–3 business days and arrive in 5–10.",
    returns: "You have 30 days after delivery to ask for a return. The buyer pays return shipping unless the item is faulty, damaged or wrong.",
    ways: [{ title: "Sets and Hot Sale", text: "DrLeo sells skincare sets, and its Hot Sale collection lists marked-down products." }],
  },
  "fang-nyc": {
    checked: "2026-11-16",
    shipping:
      "Orders to the US, Canada, Mexico and the UK ship free over $150 and cost $10 below that, arriving in 2–8 business days. Worldwide express shipping is free over $250 and $15 below that. Orders are processed in 1–3 business days.",
    returns:
      "Unworn items with their tags can be returned within 14 days of the ship date, after emailing FANG first; underwear, swimwear and sale items can't be returned. In the US, FANG sends a return label and takes its cost out of the refund.",
    ways: [{ title: "Sale", text: "FANG NYC keeps a Sale collection, and select styles were 20% off when we checked." }],
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
  "im-peccable-chicken": {
    checked: "2026-11-20",
    shipping:
      "Orders ship Monday to Wednesday by UPS in insulated boxes with cold packs and arrive 1–3 business days later, within the continental US only (no PO boxes). Shipping is free on orders over $100; below that it's worked out at checkout.",
    returns:
      "First orders come with a 30-day guarantee: if you're not happy, contact Im'peccable Chicken within 30 days of delivery for a refund of 60% of the product price, without sending anything back. A spoiled or damaged box must be reported within 8 hours of delivery, with photos.",
    ways: [
      { title: "Subscriptions", text: "Im'peccable Chicken sells its boxes as one-time orders or as a subscription you can skip, pause or cancel from your account." },
      { title: "Loyalty program", text: "Im'peccable Chicken runs a loyalty program." },
    ],
  },
  imagix: {
    checked: "2026-11-08",
    shipping: "Orders are processed within 1–3 business days, Monday to Friday.",
    returns:
      "Orders from myimagix.com can be returned within 30 days of delivery, refunded to the original payment method; the buyer pays return shipping unless the item is faulty or wrong.",
  },
  "intense-oud": {
    checked: "2026-11-20",
    shipping:
      "Shipping is worked out at checkout from the destination, weight and method, and some orders get free standard shipping, shown at checkout. Orders to Canada or the UK may owe duties and taxes if they aren't collected at checkout.",
    returns:
      "Unused, unopened items in their original packaging can be returned within 30 days of delivery; email Intense Oud first for a return label. Opened fragrances and oils can't be returned unless they arrived damaged.",
    ways: [
      { title: "Black Friday sale", text: "When we checked on November 20, Intense Oud's site showed 25% off sitewide.", until: "2026-11-30" },
      { title: "Intense Rewards", text: "Intense Oud's Intense Rewards program gives points on every order that can be redeemed later." },
    ],
  },
  jennibag: {
    checked: "2026-11-08",
    shipping: "JenniBag charges one flat rate to ship anywhere in the world. Orders take 2–5 business days to reach the carrier.",
    returns: "Undamaged items can be returned or exchanged within 30 days of purchase, and the buyer pays return shipping.",
    ways: [{ title: "Email list", text: "JenniBag's newsletter sends subscriber-only offers." }],
  },
  "litlookz-studio": {
    checked: "2026-11-16",
    shipping:
      "Shipping costs $4.90 and is free on orders over $65. Delivery takes 3–8 business days to the US and Canada and 3–11 to the UK and Europe.",
    returns:
      "Unworn items with their tags, in the original packaging, can be returned within 30 days of the order date; email Litlookz Studio first and it sends a return label. Damaged or faulty items can be returned free.",
    ways: [{ title: "Sale and price picks", text: "Litlookz Studio has a Sale section and lets you shop by price, from $20 & Under to $40 & Under." }],
  },
  lovful: {
    checked: "2026-11-16",
    shipping:
      "US standard shipping is free on orders of $50 or more and $5 below that; express shipping (3–5 business days) is $25, free from $150. Each set is handmade, so allow 3–5 business days before it ships.",
    returns:
      "Wrong, faulty or late orders are refunded or replaced within 30 days of delivery. A lost or ill-fitting nail can be replaced free with your next order or bought for $3 a piece, and orders can be changed or cancelled free within 24 hours.",
    ways: [
      { title: "New customer offer", text: "Lovful's own site offers new customers 20% off a first order with code WELCOME20." },
      { title: "Sale collections", text: "Lovful sorts marked-down sets into 40% off and 60% off collections." },
    ],
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
  mauvstudio: {
    checked: "2026-11-20",
    shipping:
      "Shipping is free worldwide. Orders are checked and packed within 5 business days, then take 3–8 business days to US addresses and 3–11 elsewhere.",
    returns:
      "To return an item, contact MAUV STUDIO within 30 days of receiving the order, with photos. The buyer pays return shipping unless the item is faulty or not as described; small color differences from the photos don't count.",
    ways: [{ title: "Newsletter", text: "MAUV STUDIO's newsletter gives subscribers early access to its sales." }],
  },
  mewcats: {
    checked: "2026-11-16",
    shipping:
      "Shipping is free to more than 200 countries, with no extra customs or duty charges. In-stock orders leave within 1–3 days; free shipping takes 20–40 business days and standard shipping 7–15.",
    returns:
      "Unused items in their original packaging can be returned within 30 days of purchase, after emailing Mewcats; sale items, custom products and gift cards can't be returned. An order cancelled before it ships is refunded minus a 5% fee.",
  },
  "my-cluck-hut": {
    checked: "2026-11-08",
    shipping: "Shipping is free on orders of $62 or more (merch sent by a third party doesn't count toward it). Orders ship by USPS or UPS in 1–3 business days.",
    returns: "You have 14 days after receiving an item to ask for a return; it has to be unused and in its original packaging.",
    ways: [{ title: "Soap and candle bundles", text: "My Cluck Hut sells bundles of soap bars, candles and bath products." }],
  },
  ocoopa: {
    checked: "2026-11-20",
    shipping:
      "Orders are processed Monday to Saturday within 1–2 business days, and a tracking link is emailed when the order ships. An order can be cancelled until it ships.",
    returns:
      "Ocoopa offers a 30-day money-back guarantee for any reason, as long as the item comes back with all its accessories and original packaging; for a return that isn't about quality, the buyer pays shipping. Every product also has a 2-year warranty.",
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
  skymd: {
    checked: "2026-11-16",
    shipping:
      "SkyMD ships within the US only, from Wisconsin. Orders over $35 ship free; below that, UPS standard shipping (3–5 business days) is $5.95 and USPS Priority (1–3 business days) is $14.95.",
    returns:
      "Anything bought on tryskymd.com can be returned within 30 days of purchase for a refund or store credit, and a flavor can be swapped for another of equal value.",
    ways: [
      {
        title: "Military and first responder discount",
        q: "Does SkyMD have a military or first responder discount?",
        text: "Yes: current and former US military, their spouses and dependents, and first responders get 30% off after verifying with GovX ID.",
      },
      { title: "Subscribe and save", text: "A subscription takes 20% off every recurring order and ships free; deliveries can be swapped, paused or cancelled." },
      { title: "SkyMD Rewards", text: "Members get 50 points for signing up and earn points on every order, redeemable for discounts at checkout." },
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
  "spinefitter-by-sissel": {
    checked: "2026-11-20",
    shipping:
      "Spinefitter delivers only to mainland addresses in the countries it ships to; the cost depends on the delivery zone and is shown at checkout.",
    returns:
      "Spinefitter is sold by SISSEL in Germany. You can withdraw from a purchase within 14 days of receiving it without giving a reason, and SISSEL refunds the payment, including standard delivery.",
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
  "tarkine-athletics": {
    checked: "2026-11-20",
    shipping:
      "US shipping is free on orders over $130 and $15 below that, by DHL with tracking; any US import duties are the buyer's to pay. UK and Europe: free over £100 or €115.",
    returns:
      "Shoes can be returned within 14 days of delivery for any reason, even after running in them; other items within 30 days if they're in the condition you got them. Returns go to Tarkine in Australia and the buyer pays the shipping for a refund; exchanges are free.",
    ways: [
      { title: "Re-Run shoes", text: "Tarkine's Re-Run range gives shoes a second life and sells them for less than new pairs." },
      { title: "Rewards program", text: "Tarkine runs its own rewards program." },
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
  "zuma-nutrition": {
    checked: "2026-11-20",
    shipping:
      "Orders ship within 1–3 business days from California by USPS or UPS, and shipping is free on orders over $90. Zuma also ships to Canada, Mexico, Australia, New Zealand, the UK and several European countries, with duties shown at checkout.",
    returns:
      "Unopened, sealed products can be returned within 30 days of the order for a refund of the product price; opened supplements and personal care can't. Email Zuma before sending anything back; the buyer pays return shipping unless Zuma sent the wrong item.",
    ways: [
      { title: "Black Friday sale", text: "When we checked on November 20, Zuma's own banner offered 20% off sitewide with code BFCM20.", until: "2026-11-30" },
      {
        title: "Subscribe & save",
        text: "Zuma Nutrition's subscriptions save 10% on each order.",
        q: "Does Zuma Nutrition have a subscription discount?",
      },
      { title: "First-order offer", text: "Zuma Nutrition gives 10% off a first order for signing up with your email." },
      { title: "Rewards and referrals", text: "Zuma Nutrition runs a rewards program and a refer-a-friend program." },
    ],
  },
};

/** Today's offers from a store's ways to save (ended offers drop off by themselves). */
export function liveWays(facts: StoreFacts | undefined, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return (facts?.ways ?? []).filter((w) => !w.until || w.until >= today);
}
