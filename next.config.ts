import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,

});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWAConfig(nextConfig);
