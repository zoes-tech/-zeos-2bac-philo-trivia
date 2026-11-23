import type { NextConfig } from "next";

/**
 * The app is fully static: all curriculum data is bundled at build time and
 * progress lives in localStorage. `output: "export"` produces the `out/`
 * directory that Cloudflare Pages serves directly — no server runtime.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
