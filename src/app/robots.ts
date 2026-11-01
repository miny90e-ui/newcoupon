import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/go/", "/out/", "/search"] }],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
