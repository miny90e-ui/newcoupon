import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ConfirmButton } from "@/components/admin-form";
import { BannerForm } from "../banner-form";
import { deleteBanner } from "../../actions";

export default async function EditBanner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await db.banner.findUnique({ where: { id } });
  if (!banner) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">Edit banner</h1>
      <BannerForm banner={banner} />
      <form action={deleteBanner} className="mt-6">
        <input type="hidden" name="id" value={banner.id} />
        <ConfirmButton label="Delete banner" message="Delete this banner?" />
      </form>
    </div>
  );
}
