import type { Metadata } from 'next';
import { Header } from './components/shared/Header';
import { Footer } from './components/shared/Footer';
import { AuthProvider } from './components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '펀제주 - IB 학부모와 학생을 위한 신뢰의 정보 허브',
  description: 'IB 교육 정보, 학교 검색, 커뮤니티, 제주 통합 정보 플랫폼',
  keywords: 'IB, 국제바칼로레아, 학부모, 정보, 제주',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
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
