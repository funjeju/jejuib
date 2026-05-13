'use client';

import { SCHOOLS } from '@/app/data/schools';
import { notFound } from 'next/navigation';

export default function SchoolDetail({ params }: { params: { id: string } }) {
  const school = SCHOOLS.find((s) => s.id === params.id);

  if (!school) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* 학교 헤더 */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-cert-bg text-cert-text text-xs font-semibold rounded-full mb-3">
          {school.stage === '인증' ? '✓ 인증 학교' : '후보 학교'}
        </div>
        <h1 className="text-5xl font-bold mb-2 text-text">{school.name}</h1>
        <p className="text-lg text-text-muted mb-4">{school.nameEn}</p>

        {/* 정보 배지들 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-muted rounded text-sm text-text">
            {school.level}
          </span>
          <span className="px-3 py-1 bg-muted rounded text-sm text-text">
            {school.type}
          </span>
          <span className="px-3 py-1 bg-muted rounded text-sm text-text">
            {school.region}
          </span>
          {school.programs.map((prog) => (
            <span key={prog} className="px-3 py-1 bg-accent-soft rounded text-sm text-accent font-semibold">
              {prog}
            </span>
          ))}
        </div>

        {/* 학교 기본 정보 */}
        <div className="text-text-muted space-y-2">
          <p>📍 {school.address}</p>
          <p>📞 웹사이트 준비 중</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 게시판 영역 */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">학교 커뮤니티</h2>
              <button className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-opacity-90 transition">
                글쓰기
              </button>
            </div>

            {/* 게시글 필터/탭 */}
            <div className="flex gap-2 mb-6 border-b border-border pb-4">
              <button className="text-sm font-semibold text-accent border-b-2 border-accent pb-2">
                전체
              </button>
              <button className="text-sm text-text-muted hover:text-accent transition pb-2">
                후기
              </button>
              <button className="text-sm text-text-muted hover:text-accent transition pb-2">
                질문
              </button>
              <button className="text-sm text-text-muted hover:text-accent transition pb-2">
                정보 공유
              </button>
            </div>

            {/* 게시글 목록 (placeholder) */}
            <div className="space-y-4">
              <div className="p-4 border border-border rounded hover:bg-muted transition cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-text">게시글이 아직 없습니다</h3>
                  <span className="text-xs text-text-faint">조회 0</span>
                </div>
                <p className="text-sm text-text-muted">
                  이 학교를 다니는 학부모나 학생이 작성한 첫 번째 게시글이 될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 사이드바 */}
        <div className="space-y-6">
          {/* 평점 카드 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-bold text-text mb-4">평점</h3>
            <div className="text-center mb-3">
              <div className="text-4xl font-bold text-accent">0.0</div>
              <div className="text-sm text-text-muted">첫 평점을 남겨주세요</div>
            </div>
            <button className="w-full py-2 border border-accent text-accent rounded text-sm hover:bg-accent-soft transition">
              평점 남기기
            </button>
          </div>

          {/* 학교 정보 카드 */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-bold text-text mb-4">📋 학교 정보</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-text-muted">학교급:</span>
                <br />
                <span className="font-semibold text-text">{school.level}</span>
              </li>
              <li>
                <span className="text-text-muted">유형:</span>
                <br />
                <span className="font-semibold text-text">{school.type}</span>
              </li>
              <li>
                <span className="text-text-muted">지역:</span>
                <br />
                <span className="font-semibold text-text">
                  {school.region} {school.city}
                </span>
              </li>
              <li>
                <span className="text-text-muted">프로그램:</span>
                <br />
                <span className="font-semibold text-text">{school.programs.join(', ')}</span>
              </li>
            </ul>
          </div>

          {/* 인근 매물 (제주만) */}
          {school.region === '제주' && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-bold text-text mb-4">🏠 인근 매물</h3>
              <p className="text-sm text-text-muted">Phase 2에서 오픈 예정</p>
            </div>
          )}

          {/* 관련 뉴스 (제주만) */}
          {school.region === '제주' && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-bold text-text mb-4">📰 관련 뉴스</h3>
              <p className="text-sm text-text-muted">Phase 3에서 오픈 예정</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
