import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; connect-src 'self' https://yprwuzewpvcrhljylih.supabase.co; ...",
        },
      ],
    },
  ];
},
};
export default nextConfig;