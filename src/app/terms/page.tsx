import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Terms of use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <ProsePage title="Terms of use" updated="November 2026">
      <p className="rounded-lg bg-brand-tint p-3 text-sm">
        Template text — have it reviewed for your business before launch.
      </p>
      <h2>Using Offers Coupon</h2>
      <p>Offers Coupon lists coupon codes and deals offered by third-party stores. Using the site is free.</p>
      <h2>Offers are set by stores</h2>
      <p>
        Stores set and may change or end their offers at any time. We try to keep listings accurate but cannot
        guarantee that every code will work. Any purchase is between you and the store.
      </p>
      <h2>Accounts</h2>
      <p>Keep your password private. We may suspend accounts that misuse the site.</p>
      <h2>Trademarks</h2>
      <p>Store names and logos belong to their owners and are used only to identify their offers.</p>
    </ProsePage>
  );
}
