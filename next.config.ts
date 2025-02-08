/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://test.api.amadeus.com/:path*", // API Amadeus URL
      },
    ];
  },
};

module.exports = nextConfig;
