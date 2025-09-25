import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@repo/shared', '@repo/ui'],
};

export default nextConfig;
