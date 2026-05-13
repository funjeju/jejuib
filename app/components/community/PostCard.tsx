'use client';

import Link from 'next/link';
import { Post, PostType } from '@/lib/firestore/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
  post: Post & { id: string };
  schoolId: string;
  onClickReaction?: (postId: string, kind: 'like' | 'helpful') => void;
}

const postTypeConfig: Record<PostType, { label: string; color: string }> = {
  review: { label: '후기', color: 'bg-blue-100 text-blue-700' },
  question: { label: '질문', color: 'bg-yellow-100 text-yellow-700' },
  share: { label: '공유', color: 'bg-green-100 text-green-700' },
  meetup: { label: '모임', color: 'bg-purple-100 text-purple-700' },
  notice: { label: '공지', color: 'bg-red-100 text-red-700' },
  experience: { label: '경험', color: 'bg-indigo-100 text-indigo-700' },
};

export function PostCard({ post, schoolId, onClickReaction }: PostCardProps) {
  const config = postTypeConfig[post.type];
  const createdDate = post.createdAt?.toDate?.() || new Date();
  const timeAgo = formatDistanceToNow(createdDate, { locale: ko, addSuffix: true });

  return (
    <Link href={`/schools/${schoolId}/posts/${post.id}`}>
      <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md hover:border-accent transition cursor-pointer">
        {/* 헤더: 타입, 제목, 고정 */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
              {post.pinned && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                  📌 고정
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-text line-clamp-2">{post.title}</h3>
          </div>
        </div>

        {/* 본문 미리보기 */}
        <p className="text-sm text-text-muted line-clamp-2 mb-4">{post.body}</p>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-muted text-text-muted px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-text-muted px-2 py-1">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* 평점 (리뷰인 경우) */}
        {post.type === 'review' && post.rating && (
          <div className="mb-4">
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

        {/* 작성자 및 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            {post.authorBadge && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold">
                {post.authorBadge}
              </span>
            )}
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>👁 {post.viewCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>

        {/* 반응 버튼 */}
        <div
          className="flex gap-2 pt-2 border-t border-border"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClickReaction?.(post.id, 'like');
            }}
            className="flex-1 py-2 px-3 text-sm font-semibold text-text-muted hover:bg-muted hover:text-accent transition rounded"
          >
            👍 {post.reactionCounts.like}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClickReaction?.(post.id, 'helpful');
            }}
            className="flex-1 py-2 px-3 text-sm font-semibold text-text-muted hover:bg-muted hover:text-accent transition rounded"
          >
            ✓ {post.reactionCounts.helpful}
          </button>
        </div>
      </div>
    </Link>
  );
}
