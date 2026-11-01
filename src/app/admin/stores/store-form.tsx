import type { Store } from "@prisma/client";
import { db } from "@/lib/db";
import { AdminForm } from "@/components/admin-form";
import { Checkbox, Select, TextArea, TextField } from "@/components/admin-fields";
import { StoreLogo } from "@/components/store-logo";
import { saveStore } from "../actions";

export async function StoreForm({ store }: { store?: Store }) {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminForm action={saveStore} className="card space-y-5 p-6">
      {store && <input type="hidden" name="id" value={store.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Store name" defaultValue={store?.name} required />
        <TextField name="slug" label="URL slug" defaultValue={store?.slug} hint="Leave empty to create from the name. Used in /stores/<slug>." />
        <TextField name="affiliateUrl" label="Affiliate link" type="url" defaultValue={store?.affiliateUrl} required placeholder="https://…" hint="Where 'Visit store' and coupons without their own link go." />
        <TextField name="website" label="Store website" type="url" defaultValue={store?.website} placeholder="https://…" />
        <Select name="categoryId" label="Category" defaultValue={store?.categoryId} empty="— None —" options={categories.map((c) => ({ value: c.id, label: c.name }))} />
      </div>
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <StoreLogo name={store?.name ?? "New Store"} logoUrl={store?.logoUrl} className="size-20 rounded-xl border border-line text-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="logoFile" className="label">Upload logo</label>
            <input id="logoFile" name="logoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="block w-full text-sm file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-canvas file:px-4 file:font-semibold" />
            <p className="mt-1 text-xs text-muted">PNG/JPG/WebP, square, up to 4 MB.</p>
          </div>
          <TextField name="logoUrl" label="…or logo URL" defaultValue={store?.logoUrl} />
        </div>
      </div>
      <TextArea name="description" label="Description" defaultValue={store?.description} hint="Shown on the store page and used for Google." />
      <Checkbox name="featured" label="Feature on the homepage (Popular Stores)" defaultChecked={store?.featured} />
    </AdminForm>
  );
}
