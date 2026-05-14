import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  const snap = await adminDb
    .collection('verifications')
    .where('status', 'in', ['pending', 'manual_review'])
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const items = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      reviewedAt: data.reviewedAt?.toDate?.()?.toISOString() ?? null,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ items });
}
