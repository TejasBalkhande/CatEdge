/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

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
