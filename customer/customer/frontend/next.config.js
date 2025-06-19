/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co',
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig; 