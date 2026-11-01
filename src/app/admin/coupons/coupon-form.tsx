import type { Coupon } from "@prisma/client";
import { db } from "@/lib/db";
import { AdminForm } from "@/components/admin-form";
import { Checkbox, Select, TextArea, TextField, toDateInput } from "@/components/admin-fields";
import { saveCoupon } from "../actions";

export async function CouponForm({ coupon, storeId }: { coupon?: Coupon; storeId?: string }) {
  const stores = await db.store.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <AdminForm action={saveCoupon} className="card space-y-5 p-6">
      {coupon && <input type="hidden" name="id" value={coupon.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Select name="storeId" label="Store" required defaultValue={coupon?.storeId ?? storeId} empty="— Choose a store —" options={stores.map((s) => ({ value: s.id, label: s.name }))} />
        <TextField name="title" label="Title" defaultValue={coupon?.title} required placeholder="Extra 20% off your entire order" />
        <TextField name="code" label="Coupon code" defaultValue={coupon?.code} placeholder="SAVE20" hint="Leave empty for a deal that needs no code." />
        <TextField name="discountLabel" label="Discount label" defaultValue={coupon?.discountLabel} placeholder="20% OFF" hint="Short badge on the card: 20% OFF, $10 OFF, FREE SHIP." />
        <TextField name="tag" label="Ribbon" defaultValue={coupon?.tag} placeholder="SITEWIDE" hint="e.g. SITEWIDE, ONLINE ONLY, NEW CUSTOMERS." />
        <TextField name="affiliateUrl" label="Custom affiliate link" type="url" defaultValue={coupon?.affiliateUrl} hint="Optional. Otherwise the store's affiliate link is used." />
        <TextField name="startsAt" label="Starts" type="date" defaultValue={toDateInput(coupon?.startsAt)} hint="Optional. Hidden until this date." />
        <TextField name="expiresAt" label="Expires" type="date" defaultValue={toDateInput(coupon?.expiresAt)} hint="Optional. Hidden automatically after this date." />
      </div>
      <TextArea name="description" label="Details / terms" defaultValue={coupon?.description} />
      <div className="flex flex-wrap gap-x-6">
        <Checkbox name="active" label="Active" defaultChecked={coupon?.active ?? true} />
        <Checkbox name="verified" label="Verified" defaultChecked={coupon?.verified ?? true} />
        <Checkbox name="featured" label="Featured on homepage" defaultChecked={coupon?.featured} />
        <Checkbox name="exclusive" label="Exclusive" defaultChecked={coupon?.exclusive} />
      </div>
    </AdminForm>
  );
}
