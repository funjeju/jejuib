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
const storage = admin.storage();

export async function POST(request: NextRequest) {
  // 보안: 요청 헤더에서 API 키 확인
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = admin.firestore.Timestamp.now();

    // 만료된 인증 기록 조회
    const expiredSnapshot = await db
      .collection('verifications')
      .where('expiresAt', '<', now)
      .limit(20)
      .get();

    if (expiredSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No expired verifications',
        deleted: 0,
      });
    }

    const deletedRecords = [];
    const bucket = storage.bucket();

    for (const verificationDoc of expiredSnapshot.docs) {
      const verification = verificationDoc.data();

      try {
        // Storage에서 파일 삭제
        if (verification.storagePath) {
          try {
            await bucket.file(verification.storagePath).delete();
          } catch (storageError) {
            // 파일이 없을 수 있으니 계속 진행
            console.warn(`Could not delete storage file: ${verification.storagePath}`);
          }
        }

        // Firestore에서 인증 기록 삭제
        await db.collection('verifications').doc(verificationDoc.id).delete();

        deletedRecords.push({
          verificationId: verificationDoc.id,
          userId: verification.userId,
          schoolId: verification.schoolId,
        });
      } catch (error: any) {
        console.error(`Failed to delete verification ${verificationDoc.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup complete',
      deleted: deletedRecords.length,
      records: deletedRecords,
    });
  } catch (error: any) {
    console.error('Verification cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: error.message },
      { status: 500 }
    );
  }
}
