import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { CouponModal } from "./coupon-modal";

/** Renders the code popup when the URL has ?c=<couponId>. Drop it on any page that lists coupons. */
export async function CouponReveal({ couponId }: { couponId?: string | string[] }) {
  if (typeof couponId !== "string" || !couponId) return null;
  const c = await db.coupon.findUnique({
    where: { id: couponId },
    include: { store: { select: { name: true, slug: true, logoUrl: true } } },
  });
  if (!c || !c.active) return null;
  return (
    <CouponModal
      key={c.id}
      id={c.id}
      title={c.title}
      description={c.description}
      code={c.type === "CODE" ? c.code : null}
      storeName={c.store.name}
      storeSlug={c.store.slug}
      storeLogo={c.store.logoUrl}
      expires={formatDate(c.expiresAt)}
    />
  );
}
