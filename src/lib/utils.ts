import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const SITE_NAME = "New Coupon";

/** Public site address: SITE_URL if set, else Vercel's production domain, else localhost. */
export function siteUrl(path = "") {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const base = process.env.SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000");
  return base.replace(/\/$/, "") + path;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(d: Date | null | undefined) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export function daysLeft(d: Date | null | undefined) {
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000);
}

export function monthYear() {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
}

/** Two-letter monogram + stable colour for stores that have no logo yet. */
export function monogram(name: string) {
  const letters = name
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const palette = ["#0B2545", "#134E4A", "#7A2E4A", "#3B2F7A", "#7C4A12", "#1E3A8A", "#4A5568", "#0F5257"];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { letters: letters || "NC", color: palette[h % palette.length] };
}

/** Only allow http(s) URLs, so a bad admin entry can't inject javascript: links. */
export function safeUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Internal path or http(s) URL — used for banner links. */
export function safeHref(url: string | null | undefined) {
  if (!url) return "/";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return safeUrl(url) ?? "/";
}
