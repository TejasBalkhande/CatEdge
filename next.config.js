/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 Add this line
  },
  // Configure remote image domains
  images: {
    domains: [
      'raw.githubusercontent.com', // GitHub raw file hosting
      'i.postimg.cc',              // Postimages.org
    ],
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports = require('@cloudflare/next-on-pages/next-config')(nextConfig);
} else {
  module.exports = nextConfig;
}