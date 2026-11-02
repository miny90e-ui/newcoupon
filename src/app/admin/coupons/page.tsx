import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { toggleCouponActive } from "../actions";

const PAGE = 50;

export default async function AdminCoupons({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; store?: string; status?: string; page?: string; saved?: string }>;
}) {
  const { q, store, status = "all", page = "1", saved } = await searchParams;
  const p = Math.max(1, Number(page) || 1);
  const now = new Date();
  const where: Prisma.CouponWhereInput = {
    ...(q && { OR: [{ title: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] }),
    ...(store && { storeId: store }),
    ...(status === "live" && { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }),
    ...(status === "expired" && { expiresAt: { lte: now } }),
    ...(status === "off" && { active: false }),
  };
  const [coupons, total, stores] = await Promise.all([
    db.coupon.findMany({ where, include: { store: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: PAGE, skip: (p - 1) * PAGE }),
    db.coupon.count({ where }),
    db.store.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (pg: number) => `?${new URLSearchParams({ ...(q && { q }), ...(store && { store }), status, page: String(pg) })}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Coupons ({total})</h1>
        <Link href="/admin/coupons/new" className="btn-primary">Add coupon</Link>
      </div>
      {saved && <p role="status" className="mt-4 rounded-lg bg-brand-tint px-3 py-2.5 text-sm font-medium">Coupon saved.</p>}
      <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]">
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" name="q" defaultValue={q} placeholder="Title or code" className="input" />
        <label className="sr-only" htmlFor="store">Store</label>
        <select id="store" name="store" defaultValue={store ?? ""} className="input">
          <option value="">All stores</option>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <label className="sr-only" htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={status} className="input">
          <option value="all">All</option>
          <option value="live">Live</option>
          <option value="expired">Expired</option>
          <option value="off">Turned off</option>
        </select>
        <button className="btn-outline">Filter</button>
      </form>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Offer</th><th className="p-3">Code</th><th className="p-3">Expires</th><th className="p-3">Clicks</th><th className="p-3">Status</th><th className="p-3"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coupons.map((c) => {
              const expired = c.expiresAt && c.expiresAt <= now;
              return (
                <tr key={c.id}>
                  <td className="p-3">
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="text-xs text-muted">{c.store.name}{c.featured && " · Featured"}{c.discountLabel && ` · ${c.discountLabel}`}</p>
                  </td>
                  <td className="p-3 font-mono text-xs">{c.code ?? <span className="font-sans text-muted">Deal</span>}</td>
                  <td className="p-3 tabular-nums">{c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : "—"}</td>
                  <td className="p-3 tabular-nums">{c.clicks}</td>
                  <td className="p-3">
                    <form action={toggleCouponActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold ${expired ? "bg-red-50 text-danger" : c.active ? "bg-brand-tint text-brand" : "bg-canvas text-muted"}`} title="Click to turn on/off">
                        {expired ? "Expired" : c.active ? "Live" : "Off"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3 text-right"><Link href={`/admin/coupons/${c.id}`} className="font-semibold text-ink hover:underline">Edit</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center gap-3">
          {p > 1 && <Link href={qs(p - 1)} className="btn-outline">Previous</Link>}
          <span className="text-sm text-muted">Page {p} of {pages}</span>
          {p < pages && <Link href={qs(p + 1)} className="btn-outline">Next</Link>}
        </nav>
      )}
    </div>
  );
}
