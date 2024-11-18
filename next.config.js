/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "pay-sender.vercel.app"],
    unoptimized: process.env.NODE_ENV === "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.paystack.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/qrcodes/**",
      },
      {
        protocol: "https",
        hostname: "pay-sender.vercel.app",
        port: "",
        pathname: "/qrcodes/**",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
