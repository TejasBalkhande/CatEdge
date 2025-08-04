// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  experimental: {
    serverActions: {},
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'i.postimg.cc',
    ],
  },
};

module.exports = nextConfig;