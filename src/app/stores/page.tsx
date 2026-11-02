import type { Metadata } from "next";
import { storeSummaries } from "@/lib/queries";
import { StoresDirectory } from "@/components/stores-directory";

export const metadata: Metadata = {
  title: "All Stores A–Z",
  description: "Browse every store on New Coupon and find their latest coupon codes and deals.",
  alternates: { canonical: "/stores" },
};

export default async function StoresPage() {
  const stores = await storeSummaries();
  const offers = stores.reduce((n, s) => n + s.offers, 0);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Stores</h1>
      <p className="mt-2 text-muted">
        {stores.length} {stores.length === 1 ? "store" : "stores"} · {offers} active {offers === 1 ? "offer" : "offers"}, checked by our team.
      </p>
      <StoresDirectory stores={stores} />
    </div>
  );
}
