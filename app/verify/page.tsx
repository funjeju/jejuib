'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { SCHOOLS } from '@/app/data/schools';
import { createVerification, getUserVerifications } from '@/lib/firestore/verifications';
import { uploadVerificationDocument } from '@/lib/firebase/storage';
import { Verification, DocumentType } from '@/lib/firestore/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const documentTypes: { value: DocumentType; label: string; description: string }[] = [
  {
    value: 'student_id',
    label: '학생증',
    description: '학교 발급 학생증 또는 학생 카드',
  },
  {
    value: 'enrollment_cert',
    label: '재학증명서',
    description: '학교 발급 재학 증명서',
  },
  {
    value: 'graduation_cert',
    label: '졸업증명서',
    description: '학교 발급 졸업 증명서',
  },
  {
    value: 'family_relation',
    label: '가족관계증명서',
    description: '정부24 발급 가족관계증명서 (자녀 정보 포함)',
  },
];

const verificationStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: '검토 중', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  auto_approved: { label: '자동 승인', color: 'bg-green-100 text-green-700', icon: '✓' },
  manual_review: { label: '수동 검토 필요', color: 'bg-blue-100 text-blue-700', icon: '👤' },
  approved: { label: '인증 완료', color: 'bg-green-100 text-green-700', icon: '✓' },
  rejected: { label: '거부됨', color: 'bg-red-100 text-red-700', icon: '✕' },
};

export default function VerifyPage() {
  const router = useRouter();
  const { firebaseUser, userProfile, loading: authLoading } = useAuth();
  const [step, setStep] = useState<'school-select' | 'document-upload' | 'review'>('school-select');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('student_id');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [verifications, setVerifications] = useState<(Verification & { id: string })[]>([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);

  // 인증 레코드 로드
  useEffect(() => {
    if (!firebaseUser) return;

    const loadVerifications = async () => {
      setIsLoadingVerifications(true);
      try {
        const data = await getUserVerifications(firebaseUser.uid);
        setVerifications(data);
      } catch (err) {
        console.error('Failed to load verifications:', err);
      } finally {
        setIsLoadingVerifications(false);
      }
    };

    loadVerifications();
  }, [firebaseUser]);

  // 인증 필요 여부 체크
  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/auth/login');
    }
  }, [firebaseUser, authLoading, router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !file || !selectedSchoolId) {
      setUploadError('모든 정보를 입력해주세요');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // 파일 업로드
      const storagePath = await uploadVerificationDocument(
        firebaseUser.uid,
        selectedDocumentType,
        file
      );

      // Firestore에 인증 레코드 생성
      const verificationId = await createVerification(
        firebaseUser.uid,
        selectedSchoolId,
        selectedDocumentType,
        storagePath
      );

      // 로컬 상태 업데이트
      const newVerification: Verification & { id: string } = {
        id: verificationId,
        userId: firebaseUser.uid,
        schoolId: selectedSchoolId,
        documentType: selectedDocumentType,
        storagePath,
        ocrConfidence: 0,
        extractedSchool: '',
        extractedYear: '',
        status: 'pending',
        createdAt: new Date() as any,
        expiresAt: new Date() as any,
      };

      setVerifications([...verifications, newVerification]);
      setStep('review');
      setFile(null);
      setSelectedSchoolId('');
    } catch (err: any) {
      setUploadError(err.message || '업로드 중 오류가 발생했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center text-text-muted">로드 중...</div>
      </div>
    );
  }

  if (!firebaseUser || !userProfile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">학교 인증</h1>
        <p className="text-text-muted">
          학교 발급 서류를 업로드하여 학교 커뮤니티에서 인증된 사용자로 활동하세요.
        </p>
      </div>

      {/* 단계 표시 */}
      <div className="flex gap-4 mb-12">
        <div
          className={`flex-1 p-4 rounded-lg text-center font-semibold transition ${
            step === 'school-select' || step === 'document-upload' || step === 'review'
              ? 'bg-accent text-white'
              : 'bg-muted text-text-muted'
          }`}
        >
          1. 학교 선택
        </div>
        <div
          className={`flex-1 p-4 rounded-lg text-center font-semibold transition ${
            step === 'document-upload' || step === 'review'
              ? 'bg-accent text-white'
              : 'bg-muted text-text-muted'
          }`}
        >
          2. 서류 업로드
        </div>
        <div
          className={`flex-1 p-4 rounded-lg text-center font-semibold transition ${
            step === 'review' ? 'bg-accent text-white' : 'bg-muted text-text-muted'
          }`}
        >
          3. 검토
        </div>
      </div>

      {/* 단계별 콘텐츠 */}
      {step === 'school-select' && (
        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">인증할 학교를 선택하세요</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {SCHOOLS.map((school) => (
              <button
                key={school.id}
                onClick={() => {
                  setSelectedSchoolId(school.id!);
                  setStep('document-upload');
                }}
                className={`p-6 rounded-lg border-2 transition text-left ${
                  selectedSchoolId === school.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <h3 className="font-bold text-text mb-2">{school.name}</h3>
                <p className="text-sm text-text-muted mb-3">{school.nameEn}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 bg-muted text-text-muted rounded">
                    {school.level}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted text-text-muted rounded">
                    {school.region}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'document-upload' && (
        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">인증 서류를 업로드하세요</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* 문서 타입 선택 */}
            <div>
              <label className="block text-sm font-semibold text-text mb-4">
                인증 서류 유형
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map((docType) => (
                  <button
                    key={docType.value}
                    type="button"
                    onClick={() => setSelectedDocumentType(docType.value)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedDocumentType === docType.value
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <h3 className="font-bold text-text mb-1">{docType.label}</h3>
                    <p className="text-xs text-text-muted">{docType.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                사진 또는 파일 선택
              </label>
              <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {file ? (
                  <div>
                    <p className="text-sm font-semibold text-text">✓ {file.name}</p>
                    <p className="text-xs text-text-muted mt-1">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-text mb-2">파일을 드래그하거나 클릭</p>
                    <p className="text-xs text-text-muted">
                      JPG, PNG, PDF (최대 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 에러 메시지 */}
            {uploadError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {uploadError}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('school-select')}
                className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold text-text hover:bg-muted transition"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {isUploading ? '업로드 중...' : '업로드'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'review' && (
        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">인증 현황</h2>

          {isLoadingVerifications ? (
            <p className="text-text-muted text-center py-8">로드 중...</p>
          ) : verifications.length === 0 ? (
            <p className="text-text-muted text-center py-8">인증 기록이 없습니다</p>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => {
                const school = SCHOOLS.find((s) => s.id === verification.schoolId);
                const docType = documentTypes.find((d) => d.value === verification.documentType);
                const statusConfig = verificationStatusConfig[verification.status];
                const createdDate = verification.createdAt?.toDate?.() || new Date();
                const timeAgo = formatDistanceToNow(createdDate, { locale: ko, addSuffix: true });

                return (
                  <div
                    key={verification.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-text">{school?.name}</h3>
                        <p className="text-sm text-text-muted">{docType?.label}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusConfig.color}`}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{timeAgo}</p>
                  </div>
                );
              })}
            </div>
          )}

          {userProfile.verified && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded text-sm">
              <p className="text-green-700 font-semibold mb-2">✓ 인증 완료</p>
              <p className="text-green-600">
                {userProfile.verifiedSchoolIds.length}개 학교에서 인증되었습니다.
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setStep('school-select');
                setSelectedSchoolId('');
              }}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              다른 학교 인증하기
            </button>
            <button
              onClick={() => router.push('/me')}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold text-text hover:bg-muted transition"
            >
              마이페이지로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
