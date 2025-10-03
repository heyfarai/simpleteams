import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "/front-office",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig;
