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
    const amadeusApiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';
    console.log('AMADEUS_API_URL:', amadeusApiUrl); // Debugging
    return [
      {
        source: "/api/:path*",
        destination: `${amadeusApiUrl}/:path*`, 
      },
    ];
  },
};

module.exports = nextConfig;
