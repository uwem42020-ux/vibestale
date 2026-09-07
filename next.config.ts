import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        // Match any local image path without a query string
        pathname: '/**',
      },
      {
        // Match the /api/image proxy with any query string (e.g., ?url=...)
        pathname: '/api/image',
        search: '**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/music', destination: '/', permanent: true },
      { source: '/music-videos', destination: '/', permanent: true },
      { source: '/movies', destination: '/', permanent: true },
      { source: '/memes', destination: '/', permanent: true },
      { source: '/media', destination: '/', permanent: true },
      { source: '/artist/:path*', destination: '/', permanent: true },
      { source: '/live-tv', destination: '/live-news', permanent: true },
      { source: '/movie/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;