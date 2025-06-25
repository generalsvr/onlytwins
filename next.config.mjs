/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "onlytwins.jundev.tech"
  ],
  experimental:{
    serverActions: true
  },
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
