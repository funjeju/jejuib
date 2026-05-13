import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Firebase Admin 초기화
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

export async function POST(request: NextRequest) {
  // 보안: 요청 헤더에서 API 키 확인
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Pending 상태의 인증 기록 조회
    const verificationsSnapshot = await db
      .collection('verifications')
      .where('status', '==', 'pending')
      .limit(10)
      .get();

    if (verificationsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No pending verifications',
        processed: 0,
      });
    }

    const results = [];

    for (const verificationDoc of verificationsSnapshot.docs) {
      const verification = verificationDoc.data();

      try {
        // TODO: 실제 OCR 처리 (Naver Clova)
        // For now, auto-approve pending verifications after 24 hours
        const createdAt = verification.createdAt.toDate();
        const now = new Date();
        const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursElapsed >= 24) {
          // 자동 승인
          await db
            .collection('verifications')
            .doc(verificationDoc.id)
            .update({
              status: 'auto_approved',
              reviewedAt: admin.firestore.Timestamp.now(),
              ocrConfidence: 85, // 시뮬레이션 신뢰도
            });

          // 사용자의 verified 상태 업데이트
          const userRef = db.collection('users').doc(verification.userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            const verifiedSchoolIds = userData?.verifiedSchoolIds || [];

            if (!verifiedSchoolIds.includes(verification.schoolId)) {
              verifiedSchoolIds.push(verification.schoolId);
            }

            await userRef.update({
              verifiedSchoolIds,
              verified: true,
              updatedAt: admin.firestore.Timestamp.now(),
            });
          }

          results.push({
            verificationId: verificationDoc.id,
            status: 'auto_approved',
            userId: verification.userId,
            schoolId: verification.schoolId,
          });
        }
      } catch (error: any) {
        console.error(`Failed to process verification ${verificationDoc.id}:`, error);
        results.push({
          verificationId: verificationDoc.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Processing complete',
      processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Verification processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed', details: error.message },
      { status: 500 }
    );
  }
}
