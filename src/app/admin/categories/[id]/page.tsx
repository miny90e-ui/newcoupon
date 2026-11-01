import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ConfirmButton } from "@/components/admin-form";
import { CategoryForm } from "../category-form";
import { deleteCategory } from "../../actions";

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">Edit {category.name}</h1>
      <CategoryForm category={category} />
      <form action={deleteCategory} className="mt-6">
        <input type="hidden" name="id" value={category.id} />
        <ConfirmButton label="Delete category" message="Delete this category? Its stores stay, but lose their category." />
      </form>
    </div>
  );
}
