import { db } from "./db";

// Fills in what the sheet leaves blank (store name, logo, category, description) by reading
// the store's own homepage once. Results are cached in the Setting table for 30 days.

export type StoreMeta = { name: string | null; logo: string | null; description: string | null; origin: string };

// Tracking / short-link hosts: their homepage is the network's, not the store's, so skip them.
const TRACKERS =
  /(^|\.)(pxf\.io|sjv\.io|awin1\.com|anrdoezrs\.net|dpbolvw\.net|kqzyfj\.com|jdoqocy\.com|tkqlhce\.com|shareasale\.com|linksynergy\.com|skimresources\.com|amzn\.to|bit\.ly|tinyurl\.com|uppromote\.com|prf\.hn|impact\.com|go2cloud\.org|clickbank\.net|accesstrade\.vn|shope\.ee|s\.lazada\.vn)$/i;

const CACHE_MS = 30 * 86_400_000;
const FAILED_CACHE_MS = 86_400_000;

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function meta(html: string, attr: "property" | "name", key: string) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? decode(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "") || null : null;
}

function absolute(src: string | null | undefined, origin: string) {
  if (!src) return null;
  try {
    const u = new URL(src.replace(/\\\//g, "/"), origin);
    u.protocol = "https:";
    return u.toString();
  } catch {
    return null;
  }
}

/** Reads (or returns cached) name, logo and description from the homepage behind a link. */
export async function storeMeta(link: string | null | undefined): Promise<StoreMeta | null> {
  let origin: string;
  try {
    const u = new URL(link ?? "");
    if (!/^https?:$/.test(u.protocol) || TRACKERS.test(u.hostname)) return null;
    origin = u.origin;
  } catch {
    return null;
  }
  const key = `meta:${new URL(origin).hostname.replace(/^www\./, "")}`;
  const cached = await db.setting.findUnique({ where: { key } });
  if (cached) {
    const value = JSON.parse(cached.value) as StoreMeta | { failed: true };
    const maxAge = "failed" in value ? FAILED_CACHE_MS : CACHE_MS;
    if (Date.now() - cached.updatedAt.getTime() < maxAge) return "failed" in value ? null : value;
  }

  let result: StoreMeta | null = null;
  try {
    const res = await fetch(`${origin}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OffersCouponBot/1.0; +https://offers-coupon.com)" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok && (res.headers.get("content-type") ?? "").includes("html")) {
      const html = (await res.text()).slice(0, 600_000);
      const finalOrigin = new URL(res.url || origin).origin;
      const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "");
      const rawName = meta(html, "property", "og:site_name") || title.split(/\s[-|–—:]\s/)[0];
      const name = rawName?.replace(/[®™©]/g, "").trim().slice(0, 60) || null;
      // Some shops write a broken logo link here (e.g. "https:files\/logo.png"); only a real link counts.
      const ldLogo = html.match(/"logo"\s*:\s*(?:\{[^}]*?"url"\s*:\s*)?"([^"]+)"/)?.[1]?.replace(/\\\//g, "/");
      const ldLogoOk = ldLogo && /^(https?:)?\/\/|^\/[^/]/.test(ldLogo) ? ldLogo : null;
      const logo = absolute(ldLogoOk || meta(html, "property", "og:image") || meta(html, "name", "twitter:image"), finalOrigin);
      const description = (meta(html, "name", "description") || meta(html, "property", "og:description"))?.slice(0, 400) ?? null;
      result = { name, logo, description, origin: finalOrigin };
    }
  } catch {
    result = null;
  }
  const value = JSON.stringify(result ?? { failed: true });
  await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  return result;
}

const CATEGORY_WORDS: Record<string, string[]> = {
  beauty: ["beauty", "skin", "skincare", "makeup", "cosmetic", "soap", "bath", "hair", "fragrance", "perfume", "nail", "lotion"],
  fashion: ["fashion", "clothing", "apparel", "shoes", "sneaker", "dress", "jewelry", "handbag", "wear", "outfit"],
  electronics: ["electronics", "tech", "laptop", "phone", "gadget", "audio", "camera", "headphone", "charger", "smart home"],
  travel: ["travel", "hotel", "flight", "booking", "trip", "luggage", "vacation", "tour"],
  "home-garden": ["home", "kitchen", "furniture", "decor", "garden", "coffee", "espresso", "cookware", "bedding", "candle"],
  "food-dining": ["food", "snack", "meal", "restaurant", "grocery", "chocolate", "recipe", "delivery"],
  "sports-outdoors": ["sport", "outdoor", "fitness", "gym", "bike", "camping", "hiking", "golf", "running"],
  "health-wellness": ["health", "vitamin", "supplement", "wellness", "sleep", "protein", "nutrition"],
};

/** Best-guess category slug from a store's name and description, or null. */
export function guessCategorySlug(text: string): string | null {
  const t = ` ${text.toLowerCase()} `;
  let best: string | null = null;
  let bestScore = 0;
  for (const [slug, words] of Object.entries(CATEGORY_WORDS)) {
    const score = words.reduce((n, w) => n + (t.split(w).length - 1), 0);
    if (score > bestScore) [best, bestScore] = [slug, score];
  }
  return best;
}
