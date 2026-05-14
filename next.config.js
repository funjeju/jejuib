/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/guide/:path*', destination: '/legacy/guide/:path*' },
      { source: '/explore', destination: '/legacy/explore/index.html' },
    ];
  },
};

module.exports = nextConfig;
