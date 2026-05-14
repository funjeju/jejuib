import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FundjejuBot/1.0 (+https://fundjeju.com)' },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    function getMeta(property: string): string {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'));
      return match?.[1] || '';
    }

    function getTitle(): string {
      return (
        getMeta('og:title') ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
        ''
      );
    }

    return NextResponse.json({
      title: getTitle().trim(),
      description: getMeta('og:description').trim(),
      image: getMeta('og:image').trim(),
      siteName: getMeta('og:site_name').trim(),
    });
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
