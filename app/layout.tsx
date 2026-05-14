import type { Metadata } from 'next';
import { Header } from './components/shared/Header';
import { Footer } from './components/shared/Footer';
import { AuthProvider } from './components/auth/AuthProvider';
import './globals.css';

const _rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibcommunity.kr';
const SITE_URL = _rawSiteUrl.startsWith('http') ? _rawSiteUrl : `https://${_rawSiteUrl}`;

export const metadata: Metadata = {
  title: {
    default: 'IBCommunity — 한국 IB 학부모·학생을 위한 신뢰의 정보 허브',
    template: '%s | IBCommunity',
  },
  description: 'IB 교육 가이드, 전국 430개 인증 학교 검색, 학부모 커뮤니티, 제주 IB 매거진을 한곳에서.',
  keywords: ['IB', '국제바칼로레아', 'IB 학교', 'IB PYP', 'IB MYP', 'IB DP', '제주 IB', '학부모 커뮤니티'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'IBCommunity',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-bg">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
