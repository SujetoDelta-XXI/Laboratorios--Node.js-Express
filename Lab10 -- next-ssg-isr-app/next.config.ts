import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // Pokémon
      },
      {
        protocol: "https",
        hostname: "rickandmortyapi.com", // Rick & Morty
      },
    ],
  },
};

export default nextConfig;
