import Link from "next/link";
import { db } from "@/lib/db";
import { BannerForm } from "./banner-form";

export default async function AdminBanners({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Homepage banners</h1>
      <p className="mt-1 text-sm text-muted">Slides in the carousel at the top of the homepage.</p>
      {saved && <p role="status" className="mt-4 rounded-lg bg-brand-tint px-3 py-2.5 text-sm font-medium">Banner saved.</p>}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {banners.map((b) => (
          <li key={b.id}>
            <Link href={`/admin/banners/${b.id}`} className="block overflow-hidden rounded-xl text-white shadow" style={{ backgroundColor: b.bgColor ?? "#0C7A80" }}>
              <div className="relative p-5">
                {b.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
                )}
                <p className="relative font-bold text-white">{b.title}</p>
                <p className="relative mt-1 text-xs text-white/80">{b.active ? "Live" : "Hidden"} · order {b.sortOrder} · {b.linkUrl}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 mt-10 text-lg font-bold">Add a banner</h2>
      <BannerForm />
    </div>
  );
}
