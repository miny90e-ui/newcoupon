import { db } from "./db";
import { BRAND_SHOWCASE, type Showcase } from "@/config/brand-showcase";

// Every brand's home page banner shows that brand's own products, never a shared stock photo.
// Brands without hand-picked photos (src/config/brand-showcase.ts) get them from their Shopify shop:
// the best sellers' main photos on the cards, another photo of the top seller blurred behind them.
// Results are cached in the Setting table for a week.

const CACHE_MS = 7 * 86_400_000;
const FAILED_CACHE_MS = 86_400_000;
// Shops looked up per sheet sync, so a sync stays quick; the rest follow on the next syncs.
const PER_SYNC = 4;
// Not products to show off: add-ons, gift cards, crude slogans.
const SKIP = /gift ?card|protection|insurance|warranty|worry-free|\b(fuck|shit|bitch|cunt)|\b(ass|dick|suck|damn)\b/i;

type ShopProduct = { title: string; type?: string; available: boolean; price: number; images?: string[] };

function cacheKey(link: string) {
  try {
    // Bump the version when the way photos are picked changes, so every brand is looked up again.
    return `showcase:v2:${new URL(link).hostname.replace(/^www\./, "")}`;
  } catch {
    return null;
  }
}

/** Shopify CDN link at a given width (the CDN resizes on `?width=`). */
function sized(src: string, width: number) {
  const u = new URL(src.startsWith("//") ? `https:${src}` : src);
  u.protocol = "https:";
  u.search = `?width=${width}`;
  return u.toString();
}

async function fetchShowcase(link: string): Promise<Showcase | null> {
  const origin = new URL(link).origin;
  const get = (path: string) =>
    fetch(`${origin}${path}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewCouponBot/1.0; +https://offers-coupon.com)" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
  // Best sellers, in the order the shop's own "best selling" page lists them (some pages run to a few MB
  // before the first product); failing that, the shop's product feed.
  const res = await get("/collections/all?sort_by=best-selling");
  const html = res.ok ? (await res.text()).slice(0, 10_000_000) : "";
  let handles = [...new Set([...html.matchAll(/\/products\/([a-z0-9][a-z0-9-]*)/g)].map((m) => m[1]))].slice(0, 10);
  if (handles.length === 0) {
    const feed = await get("/products.json?limit=10")
      .then((r) => (r.ok ? (r.json() as Promise<{ products: { handle: string }[] }>) : null))
      .catch(() => null);
    handles = feed?.products.map((p) => p.handle) ?? [];
  }
  const found = await Promise.all(
    handles.map((h) =>
      get(`/products/${h}.js`)
        .then((r) => (r.ok ? (r.json() as Promise<ShopProduct>) : null))
        .catch(() => null)
    )
  );
  const products = found.filter(
    (p): p is ShopProduct & { images: string[] } =>
      !!p?.available && p.price >= 500 && !!p.images?.length && !SKIP.test(`${p.title} ${p.type ?? ""}`)
  );
  const still = (s: string) => !/\.gif(\?|$)/i.test(s);
  // Each best seller's main photo first; a shop with only one or two products adds more photos of them.
  const photos = [...new Set([...products.map((p) => p.images[0]), ...products.flatMap((p) => p.images.slice(1))])].filter(still);
  if (photos.length < 3) return null;
  const cards = photos.slice(0, 3);
  // Behind them: the next best seller, else the top seller again. A main photo, since a shop's other
  // photos are often charts or before/after shots.
  const backdrop = products.map((p) => p.images[0]).filter((s) => still(s) && !cards.includes(s))[0] ?? cards[0];
  // The middle card is the big one: the top seller goes there.
  return { backdrop: sized(backdrop, 1100), products: [sized(cards[1], 360), sized(cards[0], 440), sized(cards[2], 360)] };
}

/** Looks up shop photos for brands that have none yet, or only a week-old copy. Runs after each sheet sync. */
export async function refreshShowcases() {
  const [stores, rows] = await Promise.all([
    db.store.findMany({ select: { slug: true, website: true, affiliateUrl: true } }),
    db.setting.findMany({ where: { key: { startsWith: "showcase:" } } }),
  ]);
  const cached = new Map(rows.map((r) => [r.key, r]));
  const due = stores.flatMap((s) => {
    const link = s.website || s.affiliateUrl;
    const key = cacheKey(link);
    if (BRAND_SHOWCASE[s.slug] || !key) return [];
    const row = cached.get(key);
    const maxAge = row?.value.includes('"failed"') ? FAILED_CACHE_MS : CACHE_MS;
    return row && Date.now() - row.updatedAt.getTime() < maxAge ? [] : [{ key, link }];
  });
  for (const { key, link } of due.slice(0, PER_SYNC)) {
    const showcase = await fetchShowcase(link).catch(() => null);
    const value = JSON.stringify(showcase ?? { failed: true });
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
}

/** Banner photos for each brand: hand-picked ones first, then the ones read from its shop. */
export async function brandShowcases(stores: { slug: string; website: string | null; affiliateUrl: string }[]) {
  const keys = stores.map((s) => cacheKey(s.website || s.affiliateUrl)).filter((k): k is string => !!k);
  const rows = await db.setting.findMany({ where: { key: { in: keys } } });
  const cached = new Map(rows.map((r) => [r.key, r.value]));
  return new Map(
    stores.map((s) => {
      const value = cached.get(cacheKey(s.website || s.affiliateUrl) ?? "");
      const read = value ? (JSON.parse(value) as Showcase | { failed: true }) : null;
      return [s.slug, BRAND_SHOWCASE[s.slug] ?? (read && "products" in read ? read : null)];
    })
  );
}
