/** @type {import('next').NextConfig} */
const nextConfig = {
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
