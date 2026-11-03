// Plain JavaScript (not next.config.ts) so the config loads without a compile step:
// Hostinger's shared Node.js servers can't run Next's native compiler (glibc too old).

// The site lives at offers-coupon.com; old and www addresses send visitors (and search engines) there.
const MAIN_SITE = "https://offers-coupon.com";
const OLD_HOSTS = ["newcoupon.vercel.app", "www.offers-coupon.com"];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  async redirects() {
    return OLD_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: `${MAIN_SITE}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
