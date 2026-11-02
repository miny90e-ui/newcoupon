import type { Banner } from "@prisma/client";
import { AdminForm } from "@/components/admin-form";
import { Checkbox, TextField } from "@/components/admin-fields";
import { saveBanner } from "../actions";

export function BannerForm({ banner }: { banner?: Banner }) {
  return (
    <AdminForm action={saveBanner} className="card space-y-5 p-6" submitLabel={banner ? "Save" : "Add banner"}>
      {banner && <input type="hidden" name="id" value={banner.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="title" label="Headline" defaultValue={banner?.title} required />
        <TextField name="subtitle" label="Subtitle" defaultValue={banner?.subtitle} />
        <TextField name="ctaLabel" label="Button text" defaultValue={banner?.ctaLabel ?? "Shop now"} />
        <TextField name="linkUrl" label="Button link" defaultValue={banner?.linkUrl} required placeholder="/stores/some-store or https://…" />
        <TextField name="bgColor" label="Background colour" defaultValue={banner?.bgColor ?? "#0C7A80"} hint="Used when there is no image. Hex, e.g. #0C7A80." />
        <TextField name="sortOrder" label="Order" type="number" defaultValue={banner?.sortOrder ?? 0} />
        <div>
          <label htmlFor="imageFile" className="label">Background image</label>
          <input id="imageFile" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="block w-full text-sm file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-canvas file:px-4 file:font-semibold" />
          <p className="mt-1 text-xs text-muted">Wide image, about 1600×600. Text sits on the left.</p>
        </div>
        <TextField name="imageUrl" label="…or image URL" defaultValue={banner?.imageUrl} />
      </div>
      <div className="flex flex-wrap gap-x-6">
        <Checkbox name="active" label="Show on homepage" defaultChecked={banner?.active ?? true} />
        {banner?.imageUrl && <Checkbox name="removeImage" label="Remove image" />}
      </div>
    </AdminForm>
  );
}
