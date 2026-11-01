import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ConfirmButton } from "@/components/admin-form";
import { CouponForm } from "../coupon-form";
import { deleteCoupon } from "../../actions";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await db.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Edit coupon</h1>
      <p className="mb-6 text-sm text-muted">{coupon.clicks} clicks so far</p>
      <CouponForm coupon={coupon} />
      <form action={deleteCoupon} className="mt-6">
        <input type="hidden" name="id" value={coupon.id} />
        <ConfirmButton label="Delete coupon" message="Delete this coupon? This cannot be undone." />
      </form>
    </div>
  );
}
