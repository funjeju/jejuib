import { readFileSync } from 'fs';
import { resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const fullPath = resolve(
      process.cwd(),
      'public/legacy/guide/index.html'
    );

    const content = readFileSync(fullPath, 'utf-8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving guide index:', error);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
