import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/dentist/",
        destination: "/dentist/dashboard",
        permanent: false,
      },
      {
        source: "/patient",
        destination: "/patient/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
