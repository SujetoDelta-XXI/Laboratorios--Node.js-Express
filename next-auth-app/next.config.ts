import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: '/:path*',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: '/:path*',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/:path*',
      },
    ],
  },
};

export default nextConfig;
