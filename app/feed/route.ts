import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fundjeju.com';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('articles')
      .where('status', '==', 'published')
      .where('noindex', '==', false)
      .orderBy('publishedAt', 'desc')
      .limit(20)
      .get();

    const items = snapshot.docs.map((doc) => {
      const d = doc.data();
      const date: Date = d.publishedAt?.toDate?.() || new Date();
      return {
        slug: d.slug as string,
        title: d.title as string,
        excerpt: d.excerpt as string,
        category: d.category as string,
        date,
      };
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IBCommunity — 제주 IB 교육 아티클</title>
    <link>${SITE_URL}</link>
    <description>IB 교육, 제주 IB 학교, 입시 전략에 관한 깊이 있는 분석 글</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${SITE_URL}/articles/${item.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${item.slug}</guid>
      <description><![CDATA[${item.excerpt}]]></description>
      <category>${item.category}</category>
      <pubDate>${item.date.toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    console.error('RSS feed error:', err);
    return new NextResponse('RSS feed error', { status: 500 });
  }
}
