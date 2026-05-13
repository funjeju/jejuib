'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCHOOLS } from '@/app/data/schools';
import { notFound } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPosts, createPost } from '@/lib/firestore/posts';
import { Post, PostType } from '@/lib/firestore/types';
import { PostCard } from '@/app/components/community/PostCard';
import { PostForm } from '@/app/components/community/PostForm';

export default function SchoolDetail({ params }: { params: { id: string } }) {
  const school = SCHOOLS.find((s) => s.id === params.id);
  const router = useRouter();
  const { firebaseUser, userProfile, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<(Post & { id: string })[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [selectedType, setSelectedType] = useState<PostType | 'all'>('all');
  const [showPostForm, setShowPostForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!school) {
    notFound();
  }

  // 게시글 로드
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const postsData = await getPosts(params.id);
        setPosts(postsData);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadPosts();
  }, [params.id]);

  // 게시글 작성
  const handleCreatePost = async (data: Omit<Post, 'schoolId' | 'authorId' | 'authorBadge' | 'viewCount' | 'commentCount' | 'reactionCounts' | 'createdAt' | 'updatedAt' | 'id'>) => {
    if (!firebaseUser || !userProfile) {
      setError('로그인이 필요합니다');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newPostId = await createPost(
        params.id,
        firebaseUser.uid,
        userProfile.badge || userProfile.role,
        data
      );

      // 새 게시글을 로컬 상태에 추가
      const newPost: Post & { id: string } = {
        id: newPostId,
        schoolId: params.id,
        authorId: firebaseUser.uid,
        authorBadge: userProfile.badge || userProfile.role,
        ...data,
        viewCount: 0,
        commentCount: 0,
        reactionCounts: { like: 0, helpful: 0 },
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      setPosts([newPost, ...posts]);
      setShowPostForm(false);
    } catch (err: any) {
      setError(err.message || '게시글 작성 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 반응 추가 핸들러
  const handleReaction = async (postId: string, kind: 'like' | 'helpful') => {
    if (!firebaseUser) {
      router.push('/auth/login');
      return;
    }

    try {
      // TODO: addReaction 함수 호출
      // 로컬 상태 업데이트
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              reactionCounts: {
                ...post.reactionCounts,
                [kind]: post.reactionCounts[kind] + 1,
              },
            }
          : post
      ));
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  // 필터링된 게시글
  const filteredPosts = selectedType === 'all'
    ? posts
    : posts.filter((post) => post.type === selectedType);

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
          {/* 게시글 작성 모달 */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 mb-8">
              <div className="bg-bg rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text">새 게시글 작성</h2>
                  <button
                    onClick={() => setShowPostForm(false)}
                    className="text-2xl text-text-muted hover:text-text"
                  >
                    ✕
                  </button>
                </div>
                <PostForm
                  schoolId={params.id}
                  onSubmit={handleCreatePost}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="bg-surface border border-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">학교 커뮤니티</h2>
              <button
                onClick={() => {
                  if (!firebaseUser) {
                    router.push('/auth/login');
                  } else {
                    setShowPostForm(true);
                  }
                }}
                className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-opacity-90 transition"
              >
                글쓰기
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            {/* 게시글 필터/탭 */}
            <div className="flex gap-2 mb-6 border-b border-border pb-4 overflow-x-auto">
              <button
                onClick={() => setSelectedType('all')}
                className={`text-sm font-semibold pb-2 whitespace-nowrap transition ${
                  selectedType === 'all'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-muted hover:text-accent'
                }`}
              >
                전체
              </button>
              {(['review', 'question', 'share', 'meetup', 'notice', 'experience'] as const).map((type) => {
                const typeLabels = {
                  review: '후기',
                  question: '질문',
                  share: '공유',
                  meetup: '모임',
                  notice: '공지',
                  experience: '경험',
                };
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`text-sm font-semibold pb-2 whitespace-nowrap transition ${
                      selectedType === type
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-text-muted hover:text-accent'
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                );
              })}
            </div>

            {/* 게시글 목록 */}
            {isLoadingPosts ? (
              <div className="text-center py-12">
                <p className="text-text-muted">로드 중...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted mb-4">
                  {selectedType === 'all'
                    ? '아직 게시글이 없습니다.'
                    : `이 카테고리에 게시글이 없습니다.`}
                </p>
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-sm text-accent hover:underline font-semibold"
                >
                  {selectedType !== 'all' && '다른 카테고리 보기'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    schoolId={params.id}
                    onClickReaction={handleReaction}
                  />
                ))}
              </div>
            )}
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
