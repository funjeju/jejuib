import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const verificationsSnapshot = await adminDb
      .collection('verifications')
      .where('status', '==', 'pending')
      .limit(10)
      .get();

    if (verificationsSnapshot.empty) {
      return NextResponse.json({ success: true, message: 'No pending verifications', processed: 0 });
    }

    const results = [];

    for (const verificationDoc of verificationsSnapshot.docs) {
      const verification = verificationDoc.data();
      try {
        const createdAt = verification.createdAt.toDate();
        const hoursElapsed = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursElapsed >= 24) {
          await adminDb.collection('verifications').doc(verificationDoc.id).update({
            status: 'auto_approved',
            reviewedAt: admin.firestore.Timestamp.now(),
            ocrConfidence: 85,
          });

          const userRef = adminDb.collection('users').doc(verification.userId);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const verifiedSchoolIds: string[] = userDoc.data()?.verifiedSchoolIds ?? [];
            if (!verifiedSchoolIds.includes(verification.schoolId)) {
              verifiedSchoolIds.push(verification.schoolId);
            }
            await userRef.update({ verifiedSchoolIds, verified: true, updatedAt: admin.firestore.Timestamp.now() });
          }

          results.push({ verificationId: verificationDoc.id, status: 'auto_approved' });
        }
      } catch (error: any) {
        results.push({ verificationId: verificationDoc.id, status: 'error', error: error.message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error: any) {
    return NextResponse.json({ error: 'Processing failed', details: error.message }, { status: 500 });
  }
}
