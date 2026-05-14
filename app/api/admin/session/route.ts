export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

const ADMIN_EMAIL = 'naggu1999@gmail.com';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: 'no token' }, { status: 400 });

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 });
  }

  if (decoded.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'not admin' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', decoded.uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_session');
  return res;
}
