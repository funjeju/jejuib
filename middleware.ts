import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // pyp_*.html 또는 myp_*.html 요청을 /guide/로 리다이렉트
  if (pathname.match(/^\/pyp_|^\/myp_/)) {
    const match = pathname.match(/^\/(pyp_|myp_)(.+)?$/);
    if (match) {
      const prefix = match[1].slice(0, -1); // 'pyp_' → 'pyp'
      let fileName = match[2] || 'index';
      // 확장자 제거
      if (fileName.endsWith('.html')) {
        fileName = fileName.slice(0, -5);
      }
      const newPath = `/guide/${prefix}/${fileName}`;
      return NextResponse.redirect(new URL(newPath, request.url), 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
