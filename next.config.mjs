/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
