import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const email = process.env.CONTACT_EMAIL ?? "hello@offers-coupon.com";
  return (
    <ProsePage title="Contact us">
      <p>Found a code that doesn&apos;t work, or want your store listed on Offers Coupon? We&apos;d like to hear from you.</p>
      <p>
        Email: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>We usually reply within two business days.</p>
    </ProsePage>
  );
}
