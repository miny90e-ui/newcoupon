import type { Category } from "@prisma/client";
import { AdminForm } from "@/components/admin-form";
import { Select, TextField } from "@/components/admin-fields";
import { CATEGORY_ICON_NAMES } from "@/components/category-icon";
import { saveCategory } from "../actions";

export function CategoryForm({ category }: { category?: Category }) {
  return (
    <AdminForm action={saveCategory} className="card space-y-5 p-6" submitLabel={category ? "Save" : "Add category"}>
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Name" defaultValue={category?.name} required />
        <TextField name="slug" label="URL slug" defaultValue={category?.slug} hint="Leave empty to create from the name." />
        <Select name="icon" label="Icon" defaultValue={category?.icon ?? "tag"} options={CATEGORY_ICON_NAMES.map((n) => ({ value: n, label: n }))} />
        <TextField name="sortOrder" label="Order" type="number" defaultValue={category?.sortOrder ?? 0} hint="Lower numbers show first." />
      </div>
      <TextField name="description" label="Short description" defaultValue={category?.description} />
    </AdminForm>
  );
}
