/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base'
])

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA(withTM({
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/app',
    sw: 'service-worker.js', 
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  }
}))
