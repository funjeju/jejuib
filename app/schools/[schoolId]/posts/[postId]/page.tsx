'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPost, getComments, addComment, deleteComment, incrementPostViewCount } from '@/lib/firestore/posts';
import { Post, Comment } from '@/lib/firestore/types';
import { CommentTree } from '@/app/components/community/CommentTree';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function PostDetail({
  params,
}: {
  params: { schoolId: string; postId: string };
}) {
  const router = useRouter();
  const { firebaseUser, userProfile, loading: authLoading } = useAuth();
  const [post, setPost] = useState<(Post & { id: string }) | null>(null);
  const [comments, setComments] = useState<(Comment & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [newComment, setNewComment] = useState('');

  // 게시글 로드
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const postData = await getPost(params.postId);
        if (!postData) {
          router.push(`/schools/${params.schoolId}`);
          return;
        }
        setPost(postData);

        // 조회수 증가
        await incrementPostViewCount(params.postId);

        // 댓글 로드
        const commentsData = await getComments(params.postId);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to load post:', err);
        router.push(`/schools/${params.schoolId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.postId, params.schoolId, router]);

  // 댓글 추가
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !userProfile) {
      router.push('/auth/login');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('댓글을 입력해주세요');
      return;
    }

    setIsSubmittingComment(true);
    setCommentError('');

    try {
      const commentId = await addComment(
        params.postId,
        firebaseUser.uid,
        userProfile.badge || userProfile.role,
        newComment
      );

      // 로컬 상태에 댓글 추가
      const newCommentObj: Comment & { id: string } = {
        id: commentId,
        authorId: firebaseUser.uid,
        authorBadge: userProfile.badge || userProfile.role,
        body: newComment,
        createdAt: new Date() as any,
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');

      // 게시글의 댓글 수 업데이트
      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount + 1,
        });
      }
    } catch (err: any) {
      setCommentError(err.message || '댓글 작성 중 오류가 발생했습니다');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 답글 추가
  const handleAddReply = async (parentId: string, body: string) => {
    if (!firebaseUser || !userProfile) {
      router.push('/auth/login');
      return;
    }

    try {
      const commentId = await addComment(
        params.postId,
        firebaseUser.uid,
        userProfile.badge || userProfile.role,
        body,
        parentId
      );

      const newReply: Comment & { id: string } = {
        id: commentId,
        authorId: firebaseUser.uid,
        authorBadge: userProfile.badge || userProfile.role,
        body,
        parentId,
        createdAt: new Date() as any,
      };

      setComments([...comments, newReply]);

      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount + 1,
        });
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(params.postId, commentId);
      setComments(comments.filter((c) => c.id !== commentId));

      if (post) {
        setPost({
          ...post,
          commentCount: Math.max(0, post.commentCount - 1),
        });
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center text-text-muted">로드 중...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const createdDate = post.createdAt?.toDate?.() || new Date();
  const timeAgo = formatDistanceToNow(createdDate, { locale: ko, addSuffix: true });

  const postTypeConfig: Record<string, { label: string; color: string }> = {
    review: { label: '후기', color: 'bg-blue-100 text-blue-700' },
    question: { label: '질문', color: 'bg-yellow-100 text-yellow-700' },
    share: { label: '공유', color: 'bg-green-100 text-green-700' },
    meetup: { label: '모임', color: 'bg-purple-100 text-purple-700' },
    notice: { label: '공지', color: 'bg-red-100 text-red-700' },
    experience: { label: '경험', color: 'bg-indigo-100 text-indigo-700' },
  };

  const config = postTypeConfig[post.type];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-accent hover:underline mb-6 font-semibold"
      >
        ← 돌아가기
      </button>

      {/* 게시글 헤더 */}
      <div className="bg-surface border border-border rounded-lg p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
          {post.pinned && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
              📌 고정
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-text mb-4">{post.title}</h1>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          {post.authorBadge && (
            <span className="text-xs font-semibold px-2 py-1 bg-accent/10 text-accent rounded">
              {post.authorBadge}
            </span>
          )}
          <span className="text-sm text-text-muted">{timeAgo}</span>
          <span className="text-sm text-text-muted">조회 {post.viewCount}</span>
        </div>

        {/* 평점 (리뷰인 경우) */}
        {post.type === 'review' && post.rating && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">평점:</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(post.rating!) ? '⭐' : '☆'}>
                  </span>
                ))}
              </div>
              <span className="text-sm text-text-muted">({post.rating?.toFixed(1)})</span>
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="text-text whitespace-pre-wrap mb-6">{post.body}</div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-muted text-text-muted px-3 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 반응 버튼 */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <button className="flex-1 py-2 px-3 text-sm font-semibold text-text-muted hover:bg-muted hover:text-accent transition rounded">
            👍 {post.reactionCounts.like}
          </button>
          <button className="flex-1 py-2 px-3 text-sm font-semibold text-text-muted hover:bg-muted hover:text-accent transition rounded">
            ✓ {post.reactionCounts.helpful}
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-surface border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-text mb-6">댓글 ({post.commentCount})</h2>

        {/* 댓글 작성 폼 */}
        {authLoading ? (
          <div className="text-text-muted text-sm mb-6">로드 중...</div>
        ) : firebaseUser ? (
          <form onSubmit={handleAddComment} className="mb-8">
            {commentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {commentError}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-3"
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-accent/5 border border-accent/20 rounded text-center">
            <p className="text-text-muted mb-3">댓글을 작성하려면 로그인해주세요</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-sm px-4 py-2 bg-accent text-white rounded font-semibold hover:bg-opacity-90 transition"
            >
              로그인
            </button>
          </div>
        )}

        {/* 댓글 트리 */}
        <CommentTree
          comments={comments}
          currentUserId={firebaseUser?.uid}
          onAddReply={handleAddReply}
          onDeleteComment={handleDeleteComment}
          isLoading={isSubmittingComment}
        />
      </div>
    </div>
  );
}
