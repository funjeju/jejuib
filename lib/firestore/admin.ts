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

export async function approveVerification(
  verificationId: string,
  ocrConfidence: number = 100
): Promise<void> {
  try {
    const verificationRef = db.collection('verifications').doc(verificationId);
    const verificationDoc = await verificationRef.get();

    if (!verificationDoc.exists) {
      throw new Error('Verification not found');
    }

    const verification = verificationDoc.data();

    if (!verification) {
      throw new Error('Verification data is empty');
    }

    // 인증 기록 업데이트
    await verificationRef.update({
      status: 'approved',
      reviewedAt: admin.firestore.Timestamp.now(),
      ocrConfidence,
    });

    // 사용자 정보 업데이트
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
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function rejectVerification(
  verificationId: string,
  reason: string = ''
): Promise<void> {
  try {
    const verificationRef = db.collection('verifications').doc(verificationId);
    const verificationDoc = await verificationRef.get();

    if (!verificationDoc.exists) {
      throw new Error('Verification not found');
    }

    const verification = verificationDoc.data();
    if (!verification) {
      throw new Error('Verification data is empty');
    }

    // 인증 기록 업데이트
    await verificationRef.update({
      status: 'rejected',
      reviewedAt: admin.firestore.Timestamp.now(),
      rejectionReason: reason,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteVerification(verificationId: string): Promise<void> {
  try {
    const verificationRef = db.collection('verifications').doc(verificationId);
    const verificationDoc = await verificationRef.get();

    if (!verificationDoc.exists) {
      throw new Error('Verification not found');
    }

    const verification = verificationDoc.data();
    if (!verification) {
      throw new Error('Verification data is empty');
    }

    // Storage에서 파일 삭제
    if (verification.storagePath) {
      try {
        const bucket = admin.storage().bucket();
        await bucket.file(verification.storagePath).delete();
      } catch (storageError) {
        console.warn(`Could not delete storage file: ${verification.storagePath}`);
      }
    }

    // Firestore에서 인증 기록 삭제
    await verificationRef.delete();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function runVerificationProcessing(): Promise<{
  processed: number;
  approved: number;
  errors: string[];
}> {
  try {
    const pendingSnapshot = await db
      .collection('verifications')
      .where('status', '==', 'pending')
      .limit(10)
      .get();

    let approved = 0;
    const errors: string[] = [];

    for (const verificationDoc of pendingSnapshot.docs) {
      const verification = verificationDoc.data();

      try {
        const createdAt = verification.createdAt.toDate();
        const now = new Date();
        const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        // 24시간 이후 자동 승인
        if (hoursElapsed >= 24) {
          await approveVerification(verificationDoc.id, 85);
          approved++;
        }
      } catch (error: any) {
        errors.push(`${verificationDoc.id}: ${error.message}`);
      }
    }

    return {
      processed: pendingSnapshot.size,
      approved,
      errors,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function runVerificationCleanup(): Promise<{
  deleted: number;
  errors: string[];
}> {
  try {
    const now = admin.firestore.Timestamp.now();
    const expiredSnapshot = await db
      .collection('verifications')
      .where('expiresAt', '<', now)
      .limit(20)
      .get();

    let deleted = 0;
    const errors: string[] = [];
    const bucket = admin.storage().bucket();

    for (const verificationDoc of expiredSnapshot.docs) {
      const verification = verificationDoc.data();

      try {
        // Storage 파일 삭제
        if (verification.storagePath) {
          try {
            await bucket.file(verification.storagePath).delete();
          } catch (storageError) {
            console.warn(`Could not delete storage file: ${verification.storagePath}`);
          }
        }

        // Firestore 기록 삭제
        await db.collection('verifications').doc(verificationDoc.id).delete();
        deleted++;
      } catch (error: any) {
        errors.push(`${verificationDoc.id}: ${error.message}`);
      }
    }

    return {
      deleted,
      errors,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
