// The evergreen articles on /savings-tips (the per-store deal articles are built from the sheet data).
// Photos: free-licence Unsplash images in /public/tips.

export const GUIDES = [
  {
    slug: "ways-to-pay-less",
    title: "8 Simple Ways to Pay Less Every Time You Shop Online",
    excerpt: "Stack codes on sales, time big buys and never pay for shipping you don't need.",
    date: "2026-11-03",
    photo: "/tips/stack.webp",
  },
  {
    slug: "how-to-use-a-coupon-code",
    title: "How to Use a Coupon Code Online, Step by Step",
    excerpt: "Where the promo box hides at checkout, and what to do when a code won't apply.",
    date: "2026-11-03",
    photo: "/tips/cart.webp",
  },
] as const;

export const TIPS: { photo: string; title: string; body: string }[] = [
  {
    photo: "/tips/stack.webp",
    title: "Stack a code on top of a sale",
    body: "Many stores let a promo code apply to items that are already marked down. Add sale items to your cart first, then try the code — the two discounts often combine.",
  },
  {
    photo: "/tips/email.webp",
    title: "Claim the first-order discount",
    body: "Newsletter and SMS sign-ups usually unlock 10–20% off your first purchase. Use a dedicated shopping email so the offers don't crowd your main inbox.",
  },
  {
    photo: "/tips/shipping.webp",
    title: "Mind the free-shipping threshold",
    body: "If you're a few dollars short of free shipping, add something you'd buy anyway instead of paying for delivery. It's often cheaper than the shipping fee.",
  },
  {
    photo: "/tips/cart.webp",
    title: "Leave items in your cart",
    body: "Signed in and left a cart behind? Some stores follow up with a reminder and an extra discount within a day or two. Patience can pay.",
  },
  {
    photo: "/tips/calendar.webp",
    title: "Shop the calendar",
    body: "Big savings cluster around Black Friday, Cyber Monday, end-of-season clearances and back-to-school. Plan bigger purchases around those windows.",
  },
  {
    photo: "/tips/save.webp",
    title: "Save the coupons you'll need",
    body: "Tap the heart on any Offers Coupon offer to keep it in your account, so the code is ready when you're ready to buy — before it expires.",
  },
  {
    photo: "/tips/compare.webp",
    title: "Compare the final price, not the discount",
    body: "A bigger percentage off isn't always the better deal. Check the total after shipping and taxes across two or three stores before you pay.",
  },
  {
    photo: "/tips/fine-print.webp",
    title: "Read the fine print",
    body: "Codes can exclude certain brands, gift cards or sale items, and many have a minimum spend. A quick look at the terms saves a failed checkout.",
  },
];

export const CHECKLIST = [
  "Searched Offers Coupon for the store's latest codes",
  "Checked if the code works on sale items",
  "Reached the free-shipping minimum (or know the fee)",
  "Compared the final total with another store",
  "Confirmed the code hasn't expired",
];

/** "Code won't apply?" help for the how-to guide. */
export const TROUBLESHOOT = [
  { title: "Look for the right box", body: "It may be called promo code, discount code, gift card or coupon. On phones it's often folded away under “Order summary”." },
  { title: "Check what's in your cart", body: "Some codes skip sale items, gift cards or a few brands, or need a minimum spend. The offer's notes on Offers Coupon say when." },
  { title: "Type it exactly", body: "Paste the code rather than typing it, and remove any space before or after it." },
  { title: "One code at a time", body: "Most stores take a single code per order. If another one is already applied, remove it first." },
];
