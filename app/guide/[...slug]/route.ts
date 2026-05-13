import { readFileSync } from 'fs';
import { resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug || [];
    const filePath = slug.length === 0 ? 'index.html' : `${slug.join('/')}.html`;

    // public/legacy/guide/ 경로에서 파일 찾기
    const fullPath = resolve(
      process.cwd(),
      `public/legacy/guide/${filePath}`
    );

    // 보안: 경로 이탈 방지
    if (!fullPath.includes('legacy/guide')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    try {
      const content = readFileSync(fullPath, 'utf-8');
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      // 파일이 없으면 index.html 시도
      if (!filePath.endsWith('/index.html')) {
        const indexPath = resolve(
          process.cwd(),
          `public/legacy/guide/${slug.join('/')}/index.html`
        );
        try {
          const indexContent = readFileSync(indexPath, 'utf-8');
          return new NextResponse(indexContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        } catch {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving guide file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
