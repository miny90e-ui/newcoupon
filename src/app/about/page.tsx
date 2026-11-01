import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "About us", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <ProsePage title="About New Coupon">
      <p>
        New Coupon helps shoppers pay less. We gather coupon codes and deals from stores across fashion, beauty, tech,
        travel, home and more, and put them in one place that is quick to search.
      </p>
      <h2>How we pick offers</h2>
      <p>
        Our team adds and checks offers by hand. Each coupon shows when it expires, and expired offers are hidden
        automatically so you don&apos;t waste time on codes that no longer work.
      </p>
      <h2>How we make money</h2>
      <p>
        Some links on New Coupon are affiliate links. If you buy something after clicking one, the store may pay us a
        small commission. It costs you nothing extra. Read our <a href="/disclosure">affiliate disclosure</a>.
      </p>
    </ProsePage>
  );
}
