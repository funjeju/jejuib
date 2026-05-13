import { readFileSync } from 'fs';
import { resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

function serveFile(filePath: string): NextResponse | null {
  try {
    let content = readFileSync(filePath, 'utf-8');

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
    let slug = params.slug || [];

    // pyp_cycle.html 형식의 요청을 pyp/cycle.html로 변환
    // pyp/pyp_cycle.html 같은 요청도 처리
    if (slug.length >= 1) {
      const lastSlug = slug[slug.length - 1];
      if (lastSlug.startsWith('pyp_')) {
        slug[slug.length - 1] = lastSlug.slice(4);
        if (slug.length === 1 || slug[0] !== 'pyp') {
          slug = ['pyp', ...slug];
        }
      } else if (lastSlug.startsWith('myp_')) {
        slug[slug.length - 1] = lastSlug.slice(4);
        if (slug.length === 1 || slug[0] !== 'myp') {
          slug = ['myp', ...slug];
        }
      }
    }

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
