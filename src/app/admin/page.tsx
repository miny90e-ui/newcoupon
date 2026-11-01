import Link from "next/link";
import { db } from "@/lib/db";
import { liveCouponWhere } from "@/lib/queries";

export default async function AdminDashboard() {
  const live = liveCouponWhere();
  const [stores, liveCoupons, allCoupons, users, clicks, top, expiringSoon] = await Promise.all([
    db.store.count(),
    db.coupon.count({ where: live }),
    db.coupon.count(),
    db.user.count(),
    db.coupon.aggregate({ _sum: { clicks: true } }),
    db.coupon.findMany({ orderBy: { clicks: "desc" }, take: 8, include: { store: { select: { name: true } } } }),
    db.coupon.findMany({
      where: { active: true, expiresAt: { gt: new Date(), lte: new Date(Date.now() + 7 * 86_400_000) } },
      orderBy: { expiresAt: "asc" },
      take: 8,
      include: { store: { select: { name: true } } },
    }),
  ]);
  const stats = [
    { label: "Stores", value: stores, href: "/admin/stores" },
    { label: "Live coupons", value: liveCoupons, sub: `${allCoupons} total`, href: "/admin/coupons" },
    { label: "Outbound clicks", value: clicks._sum.clicks ?? 0 },
    { label: "Registered users", value: users, href: "/admin/users" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/stores/new" className="btn-outline">Add store</Link>
          <Link href="/admin/coupons/new" className="btn-primary">Add coupon</Link>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 text-3xl font-extrabold tabular-nums text-ink">{s.value.toLocaleString("en-US")}</dd>
            {s.sub && <dd className="text-xs text-muted">{s.sub}</dd>}
          </div>
        ))}
      </dl>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Most clicked">
          {top.map((c) => (
            <Row key={c.id} href={`/admin/coupons/${c.id}`} left={`${c.store.name} — ${c.title}`} right={`${c.clicks} clicks`} />
          ))}
        </Panel>
        <Panel title="Expiring in the next 7 days">
          {expiringSoon.length === 0 && <li className="py-3 text-sm text-muted">Nothing is about to expire.</li>}
          {expiringSoon.map((c) => (
            <Row key={c.id} href={`/admin/coupons/${c.id}`} left={`${c.store.name} — ${c.title}`} right={c.expiresAt!.toISOString().slice(0, 10)} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="text-base font-bold">{title}</h2>
      <ul className="mt-2 divide-y divide-line">{children}</ul>
    </section>
  );
}

function Row({ href, left, right }: { href: string; left: string; right: string }) {
  return (
    <li>
      <Link href={href} className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm hover:text-brand">
        <span className="truncate">{left}</span>
        <span className="shrink-0 tabular-nums text-muted">{right}</span>
      </Link>
    </li>
  );
}
