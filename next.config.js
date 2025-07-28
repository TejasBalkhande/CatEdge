// next.config.js
const { withCloudflarePagesAdapter } = require('@cloudflare/next-on-pages/next-config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'i.postimg.cc',
    ],
  },
};

module.exports =
  process.env.NODE_ENV === 'production'
    ? withCloudflarePagesAdapter(nextConfig)
    : nextConfig;
