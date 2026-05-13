/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        // 레거시 가이드 페이지 - 정확한 경로 매핑
        {
          source: '/guide/pyp',
          destination: '/legacy/guide/pyp/index.html',
        },
        {
          source: '/guide/myp',
          destination: '/legacy/guide/myp/index.html',
        },
        {
          source: '/guide/:path*',
          destination: '/legacy/guide/:path*/index.html',
        },
        {
          source: '/guide',
          destination: '/legacy/guide/index.html',
        },
        {
          source: '/explore',
          destination: '/legacy/explore/index.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
