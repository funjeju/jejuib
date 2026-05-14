'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { getAllPosts } from '@/lib/firestore/posts';
import { Post, PostType } from '@/lib/firestore/types';
import { SCHOOLS } from '@/app/data/schools';
import { PostCard } from '@/app/components/community/PostCard';
import { WritePostModal } from '@/app/components/community/WritePostModal';

type SortOption = 'recent' | 'popular';

const POST_TYPE_OPTIONS: { value: PostType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'review', label: '후기' },
  { value: 'question', label: '질문' },
  { value: 'share', label: '공유' },
  { value: 'meetup', label: '모임' },
  { value: 'experience', label: '경험' },
];

const REGION_OPTIONS = ['전체', ...Array.from(new Set(SCHOOLS.map((s) => s.region))).sort()];

const schoolById = Object.fromEntries(SCHOOLS.map((s) => [s.id, s]));

export default function CommunityPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [posts, setPosts] = useState<(Post & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<PostType | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPosts({
          type: selectedType === 'all' ? undefined : selectedType,
          sortBy,
          limitCount: 30,
        });
        setPosts(data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedType, sortBy]);

  // 지역 필터는 클라이언트에서 schoolId → region 매핑으로 처리
  const filteredPosts = selectedRegion === '전체'
    ? posts
    : posts.filter((p) => schoolById[p.schoolId]?.region === selectedRegion);

  const handleReaction = (postId: string, kind: 'like' | 'helpful') => {
    if (!firebaseUser) {
      router.push('/auth/login');
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reactionCounts: { ...p.reactionCounts, [kind]: p.reactionCounts[kind] + 1 } }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-text mb-1">커뮤니티</h1>
          <p className="text-text-muted text-sm">전국 IB 학교 학부모·학생들의 이야기</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* 사이드바 필터 */}
          <aside className="md:w-48 shrink-0">
            <div className="space-y-6">

              {/* 정렬 */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">정렬</p>
                <div className="space-y-1">
                  {([{ value: 'recent', label: '최신순' }, { value: 'popular', label: '인기순' }] as const).map(
                    ({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          sortBy === value
                            ? 'bg-accent/10 text-accent font-semibold'
                            : 'text-text-muted hover:bg-border/40'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 글 유형 */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">유형</p>
                <div className="space-y-1">
                  {POST_TYPE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedType(value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedType === value
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-text-muted hover:bg-border/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 지역 */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">지역</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {REGION_OPTIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedRegion === region
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-text-muted hover:bg-border/40'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* 피드 */}
          <main className="flex-1 min-w-0">
            {/* 상단 바 */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-text-muted">
                {isLoading ? '로드 중...' : `${filteredPosts.length}개 게시글`}
              </p>
              <button
                onClick={() => {
                  if (!firebaseUser) {
                    router.push('/auth/login');
                  } else {
                    setWriteModalOpen(true);
                  }
                }}
                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                글쓰기
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-border rounded w-1/4 mb-3" />
                    <div className="h-5 bg-border rounded w-3/4 mb-2" />
                    <div className="h-4 bg-border rounded w-full mb-1" />
                    <div className="h-4 bg-border rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-24 text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="font-medium text-text mb-1">아직 게시글이 없습니다</p>
                <p className="text-sm text-text-muted mb-6">
                  학교 페이지에서 첫 글을 남겨보세요.
                </p>
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedRegion('전체');
                  }}
                  className="text-sm text-accent hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const school = schoolById[post.schoolId];
                  return (
                    <div key={post.id}>
                      {school && (
                        <Link
                          href={`/school/${post.schoolId}`}
                          className="inline-block text-xs text-text-muted hover:text-accent mb-1 px-1 transition"
                        >
                          📍 {school.name}
                        </Link>
                      )}
                      <PostCard
                        post={post}
                        schoolId={post.schoolId}
                        onClickReaction={handleReaction}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {writeModalOpen && (
        <WritePostModal
          onClose={() => setWriteModalOpen(false)}
          onPostCreated={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}
    </div>
  );
}
