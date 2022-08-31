/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
]);

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withTM({
  reactStrictMode: true,
  webpack5: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
      path: false,
      crypto: require.resolve("crypto-browserify"),
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
      loader: 'file-loader',
      generator: {
        filename: 'static/[hash][ext][query]'
      }
    })
    const experiments = config.experiments || {};
    config.experiments = {...experiments, asyncWebAssembly: true};

    return config;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  }
})
