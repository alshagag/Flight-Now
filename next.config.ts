/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  async rewrites() {
    const amadeusApiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';
    return [
      {
        source: "/api/:path*",
        destination: `${amadeusApiUrl}/:path*`, 
      },
    ];
  },
};

module.exports = nextConfig;
