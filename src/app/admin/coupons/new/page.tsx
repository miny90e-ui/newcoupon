import { CouponForm } from "../coupon-form";

export default async function NewCouponPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const { store } = await searchParams;
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">Add coupon</h1>
      <CouponForm storeId={store} />
    </div>
  );
}
