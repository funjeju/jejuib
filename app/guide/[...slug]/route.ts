import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function serveFile(filePath: string): NextResponse | null {
  try {
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'text/html; charset=utf-8';
    const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.woff', '.woff2', '.ttf', '.eot'].includes(ext);

    if (isBinary) {
      const buffer = readFileSync(filePath);
      return new NextResponse(buffer, {
        status: 200,
        headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' },
      });
    }

    const content = readFileSync(filePath, 'utf-8');
    return new NextResponse(content, {
      status: 200,
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' },
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
    const originalPath = slug.join('/');

    // CSS, JS, 이미지 등 정적 파일은 그대로 서빙
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
    const isStaticFile = staticExtensions.some(ext => originalPath.endsWith(ext));

    if (isStaticFile) {
      const filePath = resolve(baseDir, originalPath);
      if (filePath.startsWith(baseDir)) {
        const response = serveFile(filePath);
        if (response) return response;
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // HTML 파일 처리: 확장자 제거 및 경로 변환
    if (slug.length >= 1) {
      const lastItem = slug[slug.length - 1];

      // .html 또는 .htm 확장자 제거
      let cleanedName = lastItem;
      if (lastItem.endsWith('.html')) {
        cleanedName = lastItem.slice(0, -5);
      } else if (lastItem.endsWith('.htm')) {
        cleanedName = lastItem.slice(0, -4);
      }

      // pyp_*, myp_* 형식을 올바른 경로로 변환
      if (cleanedName.startsWith('pyp_')) {
        const fileName = cleanedName.slice(4);
        slug = ['pyp', fileName];
      } else if (cleanedName.startsWith('myp_')) {
        const fileName = cleanedName.slice(4);
        slug = ['myp', fileName];
      } else {
        slug[slug.length - 1] = cleanedName;
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
