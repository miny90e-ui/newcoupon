import type { Metadata } from "next";
import Link from "next/link";
import {
  BellRing, CalendarClock, CheckCircle2, Layers, Mail, PiggyBank, ShoppingCart, Truck, type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Savings Tips — Smarter Ways to Shop Online",
  description: "Simple, practical habits that help you pay less every time you shop online: stacking codes, timing sales, free shipping and more.",
  alternates: { canonical: "/savings-tips" },
};

const TIPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Layers,
    title: "Stack a code on top of a sale",
    body: "Many stores let a promo code apply to items that are already marked down. Add sale items to your cart first, then try the code — the two discounts often combine.",
  },
  {
    icon: Mail,
    title: "Claim the first-order discount",
    body: "Newsletter and SMS sign-ups usually unlock 10–20% off your first purchase. Use a dedicated shopping email so the offers don't crowd your main inbox.",
  },
  {
    icon: Truck,
    title: "Mind the free-shipping threshold",
    body: "If you're a few dollars short of free shipping, add something you'd buy anyway instead of paying for delivery. It's often cheaper than the shipping fee.",
  },
  {
    icon: ShoppingCart,
    title: "Leave items in your cart",
    body: "Signed in and left a cart behind? Some stores follow up with a reminder and an extra discount within a day or two. Patience can pay.",
  },
  {
    icon: CalendarClock,
    title: "Shop the calendar",
    body: "Big savings cluster around Black Friday, Cyber Monday, end-of-season clearances and back-to-school. Plan bigger purchases around those windows.",
  },
  {
    icon: BellRing,
    title: "Save the coupons you'll need",
    body: "Tap the heart on any New Coupon offer to keep it in your account, so the code is ready when you're ready to buy — before it expires.",
  },
  {
    icon: PiggyBank,
    title: "Compare the final price, not the discount",
    body: "A bigger percentage off isn't always the better deal. Check the total after shipping and taxes across two or three stores before you pay.",
  },
  {
    icon: CheckCircle2,
    title: "Read the fine print",
    body: "Codes can exclude certain brands, gift cards or sale items, and many have a minimum spend. A quick look at the terms saves a failed checkout.",
  },
];

const CHECKLIST = [
  "Searched New Coupon for the store's latest codes",
  "Checked if the code works on sale items",
  "Reached the free-shipping minimum (or know the fee)",
  "Compared the final total with another store",
  "Confirmed the code hasn't expired",
];

export default function SavingsTipsPage() {
  return (
    <div className="container-page py-10">
      <section className="rounded-[24px] bg-brand px-6 py-10 text-white sm:px-12 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Savings Tips</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Small habits that save you money every time you shop
        </h1>
        <p className="mt-4 max-w-xl text-white/85">
          Practical tricks our team uses to pay less online — no extreme couponing required.
        </p>
      </section>

      <section aria-labelledby="tips-title" className="mt-12">
        <h2 id="tips-title" className="section-title">8 ways to pay less</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="card flex flex-col p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-tint text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-bold text-muted" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="checklist-title" className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-6 sm:p-8">
          <h2 id="checklist-title" className="section-title">Before you pay: a 30-second checklist</h2>
          <ul className="mt-5 space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <span className="text-[15px] text-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card flex flex-col justify-center bg-ink p-6 text-white sm:p-8">
          <h2 className="text-2xl font-extrabold text-white">Ready to put it into practice?</h2>
          <p className="mt-2 text-white/80">Browse today&apos;s verified codes and deals across every category.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/deals" className="btn bg-white text-ink hover:bg-brand-tint">See best deals</Link>
            <Link href="/stores" className="btn border border-white/30 text-white hover:bg-white/10">All stores</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
