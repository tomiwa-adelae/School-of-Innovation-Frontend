import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "d36rvngjgtpmnt.cloudfront.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
