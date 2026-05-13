/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // 기존 정적 가이드 사이트 라우팅
      {
        source: '/guide/:path*',
        destination: '/legacy/guide/:path*',
      },
      {
        source: '/explore',
        destination: '/legacy/explore/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
