import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable service worker and PWA features
  output: 'standalone',
  
  // Optimize for SPA-like performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      'react-dom': 'react-dom/client'
    }
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: true // Disable for faster dev
  },
  
  // Optimize for faster development
  typescript: {
    ignoreBuildErrors: false
  },
  
  // Optimize bundle
  webpack: (config, { dev }) => {
    // In development, optimize for speed
    if (dev) {
      config.cache = {
        type: 'memory'
      };
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    } else {
      // In production, optimize for size
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
