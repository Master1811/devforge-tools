/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Output standalone for optimized production builds
  output: 'standalone',

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Image optimization settings
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };

      // @guanmingchiu/sqlparser-ts uses node:fs/promises — it's a Node-only WASM
      // loader that can't run in the browser. Mark it external so webpack doesn't
      // try to bundle it; sqlOptimizer's try/catch fallback handles the failure.
      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : [];
      config.externals = [
        ...existingExternals,
        ({ request }, callback) => {
          if (request === '@guanmingchiu/sqlparser-ts') {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;

