import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/app/superadmin/organization",
        destination: "/app/superadmin/settings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
