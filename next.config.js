/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.paystack.co',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
          pathname: '/qrcodes/**',
        },
        {
          protocol: 'https',
          hostname: 'pay-sender.vercel.app', 
          port: '',
          pathname: '/qrcodes/**',
        }
      ],
    },
    reactStrictMode: true,
    webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding')
      return config;
    },
    // Enable Edge Runtime for better performance (optional)
    experimental: {
      runtime: 'edge',
    }
  };
  
  module.exports = nextConfig;