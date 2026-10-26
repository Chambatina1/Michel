import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Old URLs from the previous GoDaddy site that Google still crawls
  async redirects() {
    return [
      { source: "/online-store/:path*", destination: "/catalog", permanent: true },
      { source: "/online-store", destination: "/catalog", permanent: true },
      { source: "/blog/f/:slug", destination: "/blog", permanent: true },
      { source: "/m/:path*", destination: "/", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
