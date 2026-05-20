import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Firebase Storage images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
