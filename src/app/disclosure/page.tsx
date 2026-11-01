import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Affiliate disclosure", alternates: { canonical: "/disclosure" } };

export default function DisclosurePage() {
  return (
    <ProsePage title="Affiliate disclosure">
      <p>
        New Coupon is free to use because we take part in affiliate programmes. When you click a link to a store on our
        site and then make a purchase, we may earn a commission from that store.
      </p>
      <ul>
        <li>You never pay more because you used our link.</li>
        <li>Commissions do not decide whether an offer is listed. We list offers we believe are useful to shoppers.</li>
        <li>Prices, terms and availability are set by each store and can change at any time.</li>
      </ul>
      <p>
        This disclosure is provided in line with the U.S. Federal Trade Commission&apos;s guidance on endorsements.
      </p>
    </ProsePage>
  );
}
