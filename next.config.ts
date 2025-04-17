import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dentist/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
