import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    } as any),
  });
}

const db = admin.firestore();

export async function GET() {
  const snap = await db
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
