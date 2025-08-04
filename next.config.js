// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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