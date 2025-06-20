/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "onlytwins.jundev.tech"
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
