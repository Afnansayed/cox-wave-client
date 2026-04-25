import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // or '10mb'
    },
  },

  // rewrites() {
  //   return [
  //    {
  //       // Explicitly map v1 API requests
  //       source: "/api/v1/:path*",
  //       destination: process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/:path*",
  //     },
  //   ];
  // }

};

export default nextConfig;
