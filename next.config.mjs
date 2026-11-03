// Plain JavaScript (not next.config.ts) so the config loads without a compile step:
// Hostinger's shared Node.js servers can't run Next's native compiler (glibc too old).
/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
