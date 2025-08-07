/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {},  // Changed from boolean to object
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'i.postimg.cc',
    ],
  },
};

module.exports = nextConfig;