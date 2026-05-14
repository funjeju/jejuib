import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 보호 — 어드민 세션 쿠키 없으면 로그인 페이지로
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // pyp_*.html 또는 myp_*.html 요청을 /guide/로 리다이렉트
  if (pathname.match(/^\/pyp_|^\/myp_/)) {
    const match = pathname.match(/^\/(pyp_|myp_)(.+)?$/);
    if (match) {
      const prefix = match[1].slice(0, -1);
      let fileName = match[2] || 'index';
      if (fileName.endsWith('.html')) fileName = fileName.slice(0, -5);
      return NextResponse.redirect(new URL(`/guide/${prefix}/${fileName}`, request.url), 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
