export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!normalized.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // 중복 확인
    const existing = await adminDb
      .collection('subscribers')
      .where('email', '==', normalized)
      .limit(1)
      .get();

    if (!existing.empty) {
      const sub = existing.docs[0].data();
      if (sub.status === 'active') {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      // pending 상태면 재발송 허용 (이메일 재요청)
      return NextResponse.json({ ok: true, resent: true });
    }

    await adminDb.collection('subscribers').add({
      email: normalized,
      source: 'web_form',
      status: 'pending',
      tags: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    // TODO: 확인 이메일 발송 (Cloud Function trigger or Stibee API)

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
