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
    // Handle Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;

