import { readFileSync } from 'fs';
import { resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

function serveFile(filePath: string): NextResponse | null {
  try {
    let content = readFileSync(filePath, 'utf-8');

    // iframe 내에서 절대 경로로 변환하기 위해 base 태그 추가
    if (!content.includes('<base')) {
      const baseUrl = filePath.includes('/pyp/') ? '/guide/pyp/' : '/guide/myp/';
      content = content.replace('</head>', `<base href="${baseUrl}"></head>`);
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  try {
    const baseDir = resolve(process.cwd(), 'public/legacy/guide');
    const slug = params.slug || [];

    // 보안: 경로 이탈 방지
    const basePath = resolve(baseDir, slug.join('/'));
    if (!basePath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 1. 정확한 파일 찾기 (예: /guide/pyp/cycle → pyp/cycle.html)
    if (slug.length > 0) {
      const filePath = resolve(baseDir, `${slug.join('/')}.html`);
      const response = serveFile(filePath);
      if (response) return response;
    }

    // 2. 디렉토리의 index.html 찾기
    const indexPath = resolve(baseDir, slug.length === 0 ? 'index.html' : `${slug.join('/')}/index.html`);
    const response = serveFile(indexPath);
    if (response) return response;

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Error serving guide file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
