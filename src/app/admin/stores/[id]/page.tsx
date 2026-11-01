import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ConfirmButton } from "@/components/admin-form";
import { StoreForm } from "../store-form";
import { deleteStore } from "../../actions";

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await db.store.findUnique({ where: { id } });
  if (!store) notFound();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Edit {store.name}</h1>
        <Link href={`/stores/${store.slug}`} className="link text-sm" target="_blank">View on site</Link>
      </div>
      <StoreForm store={store} />
      <form action={deleteStore} className="mt-6">
        <input type="hidden" name="id" value={store.id} />
        <ConfirmButton label="Delete store" message={`Delete ${store.name} and ALL its coupons? This cannot be undone.`} />
      </form>
    </div>
  );
}
