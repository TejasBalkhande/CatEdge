// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // remove the standalone output — we'll use the Cloudflare adapter
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'i.postimg.cc',
    ],
  },
};

module.exports = nextConfig;
