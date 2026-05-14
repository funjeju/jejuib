'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { SCHOOLS } from '@/app/data/schools';

const schoolById = Object.fromEntries(SCHOOLS.map((s) => [s.id, s]));

export default function MyPage() {
  const router = useRouter();
  const { firebaseUser, userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/auth/login');
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
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
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* 프로필 헤더 */}
      <div className="mb-12">
        <div className="bg-accent text-white rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2">{userProfile.displayName}</h1>
          <p className="text-white/80">{firebaseUser.email}</p>

          {/* 배지 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {userProfile.verified && (
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                ✓ 인증됨
              </span>
            )}
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
              {userProfile.role === 'student'
                ? '학생'
                : userProfile.role === 'alumni'
                  ? '졸업생'
                  : userProfile.role === 'parent'
                    ? '학부모'
                    : userProfile.role === 'staff'
                      ? '교직원'
                      : '방문자'}
            </span>
            {userProfile.badge && (
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                {userProfile.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 인증 상태 */}
      <div className="bg-surface border border-border rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-text mb-6">학교 인증</h2>

        {userProfile.verifiedSchoolIds && userProfile.verifiedSchoolIds.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-text-muted mb-4">
              {userProfile.verifiedSchoolIds.length}개 학교에서 인증됨
            </p>
            <div className="space-y-2">
              {/* 인증된 학교 목록 (추후 학교명 표시) */}
              {userProfile.verifiedSchoolIds.map((schoolId) => {
                const school = schoolById[schoolId];
                return (
                  <Link
                    key={schoolId}
                    href={`/school/${schoolId}`}
                    className="p-4 bg-muted rounded flex items-center justify-between hover:bg-accent/5 transition"
                  >
                    <div>
                      <span className="text-text font-semibold block">
                        {school?.name || schoolId}
                      </span>
                      {school && (
                        <span className="text-xs text-text-muted">
                          {school.region} · {school.level}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-accent font-semibold">✓ 인증됨</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-muted mb-4">
              아직 인증된 학교가 없습니다. AI 인증을 통해 학교를 추가하세요.
            </p>
            <Link
              href="/verify"
              className="inline-block px-6 py-2 bg-accent text-white rounded font-semibold hover:bg-opacity-90 transition"
            >
              학교 인증하기
            </Link>
          </div>
        )}
      </div>

      {/* 계정 정보 */}
      <div className="bg-surface border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-text mb-6">계정 정보</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-b border-border">
            <span className="text-text-muted">이메일</span>
            <span className="text-text font-semibold">{firebaseUser.email}</span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-border">
            <span className="text-text-muted">닉네임</span>
            <span className="text-text font-semibold">{userProfile.displayName}</span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-border">
            <span className="text-text-muted">가입일</span>
            <span className="text-text font-semibold">
              {userProfile.createdAt
                ? new Date(userProfile.createdAt.toDate?.() || userProfile.createdAt).toLocaleDateString(
                    'ko-KR'
                  )
                : '-'}
            </span>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="text-text-muted">회원 권한</span>
            <span className="text-text font-semibold">
              {userProfile.role === 'student'
                ? '학생'
                : userProfile.role === 'alumni'
                  ? '졸업생'
                  : userProfile.role === 'parent'
                    ? '학부모'
                    : userProfile.role === 'staff'
                      ? '교직원'
                      : '방문자'}
            </span>
          </div>
        </div>
      </div>

      {/* 설정 */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2 border border-border text-text rounded font-semibold hover:bg-muted transition">
          계정 설정
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-border text-text rounded font-semibold hover:bg-muted transition"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
