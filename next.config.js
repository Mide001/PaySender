/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['api.paystack.co'],
    },
    reactStrictMode: true,
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config;
    },
};

module.exports = nextConfig
