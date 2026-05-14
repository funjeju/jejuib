'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GuideModal } from './components/shared/modals/GuideModal';
import { SchoolSearchModal } from './components/shared/modals/SchoolSearchModal';
import { getAllPosts } from '@/lib/firestore/posts';
import { getNotices } from '@/lib/firestore/notices';
import { Post, Notice } from '@/lib/firestore/types';
import { SCHOOLS } from '@/app/data/schools';

const schoolById = Object.fromEntries(SCHOOLS.map((s) => [s.id, s]));

const POST_TYPE_COLORS: Record<string, string> = {
  review: 'bg-blue-100 text-blue-700',
  question: 'bg-yellow-100 text-yellow-700',
  share: 'bg-green-100 text-green-700',
  meetup: 'bg-purple-100 text-purple-700',
  notice: 'bg-red-100 text-red-700',
  experience: 'bg-indigo-100 text-indigo-700',
};
const POST_TYPE_LABELS: Record<string, string> = {
  review: '후기', question: '질문', share: '공유', meetup: '모임', notice: '공지', experience: '경험',
};

export default function Home() {
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [schoolSearchModalOpen, setSchoolSearchModalOpen] = useState(false);
  const [recentPosts, setRecentPosts] = useState<(Post & { id: string })[]>([]);
  const [recentNotices, setRecentNotices] = useState<(Notice & { id: string })[]>([]);

  useEffect(() => {
    getAllPosts({ sortBy: 'popular', limitCount: 3 })
      .then(setRecentPosts)
      .catch(() => {});
    getNotices(2)
      .then(setRecentNotices)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="w-full">
        {/* 히어로 섹션 */}
        <section className="bg-accent text-white py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              한국 IB 학부모와 학생을<br />위한 신뢰의 정보 허브
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              IB 교육 가이드, 학교 검색, 커뮤니티, 제주 특화 정보를 한곳에서 만나보세요.
            </p>
          </div>
        </section>

        {/* 주요 기능 카드 */}
        <section className="py-20 px-4 bg-bg">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 가이드 */}
              <button
                onClick={() => setGuideModalOpen(true)}
                className="p-8 border border-border rounded-lg bg-surface hover:border-accent hover:shadow-lg transition text-left w-full"
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-accent mb-3">IB 가이드</h3>
                <p className="text-text-muted">
                  MYP/PYP 완벽 이해, 양식, 용어 사전 등 학부모 필수 정보
                </p>
              </button>

              {/* 학교 검색 */}
              <button
                onClick={() => setSchoolSearchModalOpen(true)}
                className="p-8 border border-border rounded-lg bg-surface hover:border-accent hover:shadow-lg transition text-left w-full"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-accent mb-3">학교 검색</h3>
                <p className="text-text-muted">
                  전국 430개 IB 인증 학교 검색 및 상세 정보
                </p>
              </button>

              {/* 제주 허브 */}
              <Link
                href="/jeju"
                className="p-8 border border-border rounded-lg bg-surface hover:border-accent hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">🏝️</div>
                <h3 className="text-2xl font-bold text-accent mb-3">제주 정보</h3>
                <p className="text-text-muted">
                  제주 IB 학교, 부동산, 뉴스, 맛집 한눈에
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* 커뮤니티 소개 */}
        <section className="py-20 px-4 bg-accent-soft">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-text">커뮤니티</h2>
            <p className="text-lg text-text-muted mb-4">
              인증된 학부모와 학생들이 함께 나누는 신뢰의 커뮤니티
            </p>
            <p className="text-text-muted mb-8">
              AI 기반 신원 인증으로 안전하고 신뢰성 있는 정보 교류를 보장합니다.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded hover:bg-opacity-90 transition"
            >
              회원가입하기
            </Link>
          </div>
        </section>

        {/* 최근 인기 게시글 */}
        {recentPosts.length > 0 && (
          <section className="py-16 px-4 bg-surface">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text">커뮤니티 인기글</h2>
                <Link href="/community" className="text-sm text-accent hover:underline">
                  전체 보기 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPosts.map((post) => {
                  const school = schoolById[post.schoolId];
                  return (
                    <Link
                      key={post.id}
                      href={`/schools/${post.schoolId}/posts/${post.id}`}
                      className="p-5 bg-bg border border-border rounded-xl hover:border-accent transition group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${POST_TYPE_COLORS[post.type] || ''}`}>
                          {POST_TYPE_LABELS[post.type] || post.type}
                        </span>
                        {school && (
                          <span className="text-xs text-text-muted truncate">{school.name}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-text mb-2 line-clamp-2 group-hover:text-accent transition">
                        {post.title}
                      </h3>
                      <p className="text-xs text-text-muted line-clamp-2 mb-3">{post.body}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>👍 {post.reactionCounts.like}</span>
                        <span>💬 {post.commentCount}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 펀제주 공지 */}
        {recentNotices.length > 0 && (
          <section className="py-12 px-4 bg-bg border-t border-border">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-text">펀제주 공지</h2>
                <Link href="/notice" className="text-sm text-accent hover:underline">전체 보기 →</Link>
              </div>
              <div className="space-y-2">
                {recentNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    href="/notice"
                    className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-accent transition group"
                  >
                    <span className="text-sm font-medium text-text group-hover:text-accent transition line-clamp-1">
                      {notice.title}
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap ml-4 shrink-0">
                      {notice.publishedAt?.toDate?.().toLocaleDateString('ko-KR') ?? ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 특징 섹션 */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-text">IBCommunity의 약속</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-text mb-3">신뢰성</h3>
                <p className="text-text-muted">
                  AI 인증으로 검증된 회원만 참여하여 신뢰할 수 있는 정보 제공
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-text mb-3">전문성</h3>
                <p className="text-text-muted">
                  IB 교육 전문가 큐레이션과 학부모 경험 공유
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-text mb-3">통합성</h3>
                <p className="text-text-muted">
                  가이드, 학교정보, 커뮤니티, 제주 정보를 한곳에서
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {guideModalOpen && (
        <GuideModal onClose={() => setGuideModalOpen(false)} />
      )}
      {schoolSearchModalOpen && (
        <SchoolSearchModal onClose={() => setSchoolSearchModalOpen(false)} />
      )}
    </>
  );
}
