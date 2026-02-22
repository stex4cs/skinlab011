import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/me/admin",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/me/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
