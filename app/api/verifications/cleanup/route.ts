import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const expiredSnapshot = await adminDb
      .collection('verifications')
      .where('expiresAt', '<', now)
      .limit(20)
      .get();

    if (expiredSnapshot.empty) {
      return NextResponse.json({ success: true, message: 'No expired verifications', deleted: 0 });
    }

    const bucket = adminStorage.bucket();
    const deletedRecords = [];

    for (const verificationDoc of expiredSnapshot.docs) {
      const verification = verificationDoc.data();
      try {
        if (verification.storagePath) {
          try { await bucket.file(verification.storagePath).delete(); } catch {}
        }
        await adminDb.collection('verifications').doc(verificationDoc.id).delete();
        deletedRecords.push({ verificationId: verificationDoc.id });
      } catch (error: any) {
        console.error(`Failed to delete verification ${verificationDoc.id}:`, error);
      }
    }

    return NextResponse.json({ success: true, deleted: deletedRecords.length, records: deletedRecords });
  } catch (error: any) {
    return NextResponse.json({ error: 'Cleanup failed', details: error.message }, { status: 500 });
  }
}
