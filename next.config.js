/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
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
