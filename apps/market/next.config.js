/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
]);

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA(withTM({
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
      path: false,
      crypto: require.resolve("crypto-browserify"),
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
