import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = {
  title: "About us",
  description: "How Offers Coupon finds promo codes, tests each one in the store's own cart every week, and makes money.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ProsePage title="About Offers Coupon">
      <p>
        Offers Coupon helps shoppers pay less at independent online stores. Each store has one page with its working promo
        codes and deals, the answers shoppers look for (shipping, returns, other ways to save) and a short guide to saving
        there.
      </p>
      <h2>How we check codes</h2>
      <p>
        We add every code by hand, then try it in the store&apos;s own cart: we put an item in the cart, apply the code and
        note what it takes off. The discount you see on a coupon is what the code gave us, not what someone claimed. We run
        the same check every week. A code we couldn&apos;t confirm shows no discount, and offers that pass their end date
        are hidden automatically.
      </p>
      <h2>Where the other facts come from</h2>
      <p>
        Shipping costs, return windows and programs like student or birthday discounts are read from each store&apos;s own
        policy pages, and we show the date we read them. Ratings come from public review sites such as Trustpilot and
        Judge.me, only when a store has 10 or more reviews there, and we link to the source. We never write or edit
        reviews.
      </p>
      <h2>How we make money</h2>
      <p>
        Some links on Offers Coupon are affiliate links. If you buy something after clicking one, the store may pay us a
        small commission. It costs you nothing extra and doesn&apos;t change which codes we list. Read our{" "}
        <Link href="/disclosure">affiliate disclosure</Link>.
      </p>
      <h2>Contact</h2>
      <p>
        Found a code that no longer works, or a fact that has changed? <Link href="/contact">Tell us</Link> and we&apos;ll
        check it.
      </p>
    </ProsePage>
  );
}
