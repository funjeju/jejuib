import { NextRequest, NextResponse } from 'next/server';
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

// POST /api/admin/session
// Body: { idToken: string }
// Firebase ID 토큰을 검증하고 role=admin 이면 admin_session 쿠키를 발급한다.
export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: 'no token' }, { status: 400 });

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 });
  }

  const userDoc = await db.collection('users').doc(decoded.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    return NextResponse.json({ error: 'not admin' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', decoded.uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8시간
    path: '/',
  });
  return res;
}

// DELETE /api/admin/session — 로그아웃 시 쿠키 제거
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_session');
  return res;
}
