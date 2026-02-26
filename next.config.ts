import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* REMOVED: The rewrite to localhost:3000. 
     Next.js handles /api routes automatically. 
     If you have a SEPARATE backend on a different port (like 5000), 
     change the destination below and uncomment it.
  */
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", 
      },
    ];
  },
  */

  // Optional: If you use images from Supabase, add this to allow them
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        
      },
      
      {
        protocol: 'https',
        hostname:'imageunsplash.com',
      },
      
    ],

  },
};

export default nextConfig;