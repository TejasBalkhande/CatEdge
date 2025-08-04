/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  experimental: {
    serverActions: {
      // Add any specific options you need here
      // or leave empty object to enable defaults
    },
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),

  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'i.postimg.cc',
    ],
  },
};

module.exports = nextConfig;
