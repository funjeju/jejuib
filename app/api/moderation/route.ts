import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

type TargetType = 'post' | 'comment';
const REPORT_AUTO_HIDE_THRESHOLD = 5;

export async function POST(req: NextRequest) {
  try {
    // 1. 인증 확인
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    // 2. 요청 파싱
    const { targetType, targetId, reason } = await req.json() as {
      targetType: TargetType;
      targetId: string;
      reason?: string;
    };

    if (!targetType || !targetId || !['post', 'comment'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // 3. 중복 신고 방지
    const existingReport = await adminDb
      .collection('reactions')
      .where('userId', '==', userId)
      .where('targetType', '==', targetType)
      .where('targetId', '==', targetId)
      .where('kind', '==', 'report')
      .limit(1)
      .get();

    if (!existingReport.empty) {
      return NextResponse.json({ error: 'Already reported' }, { status: 409 });
    }

    // 4. 신고 레코드 생성
    await adminDb.collection('reactions').add({
      userId,
      targetType,
      targetId,
      kind: 'report',
      reason: reason || '',
      createdAt: FieldValue.serverTimestamp(),
    });

    // 5. 신고 수 집계 및 임계치 초과 시 자동 숨김
    const collection = targetType === 'post' ? 'posts' : 'comments';
    const targetRef = adminDb.collection(collection).doc(targetId);

    const reportCount = await adminDb
      .collection('reactions')
      .where('targetType', '==', targetType)
      .where('targetId', '==', targetId)
      .where('kind', '==', 'report')
      .get();

    if (reportCount.size >= REPORT_AUTO_HIDE_THRESHOLD) {
      await targetRef.update({ hidden: true, hiddenReason: 'auto_report' });
    }

    return NextResponse.json({ ok: true, reportCount: reportCount.size });
  } catch (err: any) {
    console.error('Moderation error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
