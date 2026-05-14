import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = await adminAuth.verifyIdToken(token);
      const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
      if (userDoc.data()?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const [issues, items, subscribers, verifications, listings, articles] = await Promise.all([
      adminDb.collection('magazine_issues').where('status', '==', 'published').count().get(),
      adminDb.collection('magazine_items').count().get(),
      adminDb.collection('subscribers').where('status', '==', 'active').count().get(),
      adminDb.collection('verifications').where('status', '==', 'manual_review').count().get(),
      adminDb.collection('listings').where('isActive', '==', true).count().get(),
      adminDb.collection('articles').where('status', '==', 'published').count().get(),
    ]);

    return NextResponse.json({
      issues: issues.data().count,
      items: items.data().count,
      subscribers: subscribers.data().count,
      pendingVerifications: verifications.data().count,
      listings: listings.data().count,
      articles: articles.data().count,
    });
  } catch {
    return NextResponse.json({ issues: 0, items: 0, subscribers: 0, pendingVerifications: 0, listings: 0, articles: 0 });
  }
}
