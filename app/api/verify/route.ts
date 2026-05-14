import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin';
import { callClovaOcr } from '@/lib/ocr/clova';
import { FieldValue } from 'firebase-admin/firestore';

// 학교 ID 추출 매핑 (Clova 추출 텍스트 → schoolId)
const SCHOOL_NAME_TO_ID: Record<string, string> = {
  NLCS: 'nlcs-jeju',
  BHA: 'branksome-hall',
  KIS: 'kis-jeju',
  SJA: 'sja-jeju',
  GIFS: 'gifs',
  한국국제학교: 'kis-jeju',
  브랭섬홀: 'branksome-hall',
  세인트존스베리: 'sja-jeju',
  노스런던컬리지에잇: 'nlcs-jeju',
};

const AUTO_APPROVE_CONFIDENCE = 0.85;

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
    const { storagePath, schoolId, documentType } = await req.json();
    if (!storagePath || !schoolId || !documentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. 파일 다운로드 (Firebase Storage)
    const bucket = adminStorage.bucket();
    const file = bucket.file(storagePath);
    const [fileBuffer] = await file.download();
    const [metadata] = await file.getMetadata();
    const mimeType = (metadata.contentType as string) || 'image/jpeg';
    const imageBase64 = fileBuffer.toString('base64');

    // 4. 클로바 OCR 호출
    const ocrResult = await callClovaOcr(imageBase64, mimeType);

    // 5. 신뢰도 기반 상태 결정
    const matchedSchoolId = SCHOOL_NAME_TO_ID[ocrResult.extractedSchool] || '';
    const schoolMatch = matchedSchoolId === schoolId || ocrResult.rawText.includes(schoolId);
    const effectiveConfidence = schoolMatch ? ocrResult.confidence : ocrResult.confidence * 0.5;

    const status =
      effectiveConfidence >= AUTO_APPROVE_CONFIDENCE
        ? 'auto_approved'
        : effectiveConfidence >= 0.5
        ? 'manual_review'
        : 'pending';

    // 6. Firestore 검증 레코드 생성
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const verificationRef = await adminDb.collection('verifications').add({
      userId,
      schoolId,
      documentType,
      storagePath,
      ocrConfidence: effectiveConfidence,
      extractedSchool: ocrResult.extractedSchool,
      extractedYear: ocrResult.extractedYear,
      status,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
    });

    // 7. 자동 승인이면 유저 레코드 업데이트
    if (status === 'auto_approved') {
      const userRef = adminDb.collection('users').doc(userId);
      await userRef.update({
        verified: true,
        verifiedSchoolIds: FieldValue.arrayUnion(schoolId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      verificationId: verificationRef.id,
      status,
      confidence: effectiveConfidence,
    });
  } catch (err: any) {
    console.error('Verify error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
