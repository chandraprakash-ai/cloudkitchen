/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/req-proxy/:path*',
        destination: 'https://bqacfcanqwmyabubnzkp.supabase.co/:path*',
      },
    ];
  },
};

export default nextConfig;
