/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from public directory
  // No special config needed for ads.txt - it should work automatically
  
  // Optional: Add headers for better caching
  async headers() {
    return [
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  
  // Optional: Redirects if needed
  async redirects() {
    return [];
  },
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Actual domains found in articles
      {
        protocol: 'https',
        hostname: 'images.ft.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.theglobeandmail.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thedailybeast.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cldnry.s-nbcnews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'deadline.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fdn.gsmarena.com',
        pathname: '/**',
      },
      // Common CDN patterns
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.s-nbcnews.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;