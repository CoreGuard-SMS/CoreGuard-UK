import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1:*"],
  experimental: {
    serverComponentsExternalPackages: ['electron']
  },
  webpack: (config, { isServer }) => {
    // Exclude electron from the build
    config.externals = config.externals || [];
    config.externals.push('electron');
    
    // Exclude electron directory from being processed
    config.module.rules.push({
      test: /\.(js|ts|tsx|jsx)$/,
      exclude: /node_modules/,
      include: /electron/,
      use: 'null-loader'
    });
    
    return config;
  }
};

export default nextConfig;
