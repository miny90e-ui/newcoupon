import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy policy" updated="November 2026">
      <p className="rounded-lg bg-gold-tint p-3 text-sm">
        Template text — have it reviewed for your business and the countries you serve before launch.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details you give us: name, email address and a securely hashed password.</li>
        <li>Coupons you save to your account.</li>
        <li>Anonymous click counts on offers, used to show which deals are popular.</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        We use one essential cookie to keep you signed in. Stores you visit through our links may set their own cookies
        to track affiliate referrals; those are covered by each store&apos;s own privacy policy.
      </p>
      <h2>How we use your data</h2>
      <p>To run your account and show your saved coupons. We do not sell your personal information.</p>
      <h2>Your choices</h2>
      <p>You can ask us to delete your account and data at any time through our <a href="/contact">contact page</a>.</p>
    </ProsePage>
  );
}
