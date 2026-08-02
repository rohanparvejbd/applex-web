/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {}
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outletexpense.xyz",
      },
      {
        protocol: "https",
        hostname: "securepay.sslcommerz.com",
      },
    ],
  },
};
export default nextConfig;
