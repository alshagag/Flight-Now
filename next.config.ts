/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const amadeusApiUrl = process.env.AMADEUS_API_URL || "https://test.api.amadeus.com"; // Fallback URL

    if (!amadeusApiUrl.startsWith("http")) {
      throw new Error("❌ AMADEUS_API_URL is not properly defined. Check your .env file.");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${amadeusApiUrl}/:path*`, 
      },
    ];
  },
  env: {
    AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID,
    AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET,
    AMADEUS_API_URL: process.env.AMADEUS_API_URL || "https://test.api.amadeus.com",
  },
};

module.exports = nextConfig;
