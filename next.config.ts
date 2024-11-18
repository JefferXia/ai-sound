import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: '*.cos.ap-nanjing.myqcloud.com'
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
