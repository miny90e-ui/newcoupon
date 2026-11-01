import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, categories] = await Promise.all([
    db.store.findMany({ select: { slug: true, updatedAt: true } }),
    db.category.findMany({ select: { slug: true } }),
  ]);
  const staticPages = ["", "/stores", "/categories", "/deals", "/about", "/contact", "/disclosure", "/privacy", "/terms"];
  return [
    ...staticPages.map((p) => ({ url: siteUrl(p || "/"), changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: siteUrl(`/categories/${c.slug}`), changeFrequency: "daily" as const, priority: 0.7 })),
    ...stores.map((s) => ({ url: siteUrl(`/stores/${s.slug}`), lastModified: s.updatedAt, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
