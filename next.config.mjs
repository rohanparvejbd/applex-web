/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {}
    }
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outletexpense.xyz",
      },
      {
        protocol: "https",
        hostname: "www.outletexpense.xyz",
      },
      {
        protocol: "https",
        hostname: "securepay.sslcommerz.com",
      },
    ],
  },
};
export default nextConfig;
