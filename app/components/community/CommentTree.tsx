'use client';

import { useState } from 'react';
import { Comment } from '@/lib/firestore/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CommentTreeProps {
  comments: (Comment & { id: string })[];
  currentUserId?: string;
  onAddReply: (parentId: string, body: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  isLoading?: boolean;
}

function CommentNode({
  comment,
  isCurrentUser,
  level = 0,
  onAddReply,
  onDeleteComment,
  isLoading,
  childComments,
}: {
  comment: Comment & { id: string };
  isCurrentUser: boolean;
  level?: number;
  onAddReply: (parentId: string, body: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  isLoading?: boolean;
  childComments: (Comment & { id: string })[];
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const createdDate = comment.createdAt?.toDate?.() || new Date();
  const timeAgo = formatDistanceToNow(createdDate, { locale: ko, addSuffix: true });

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await onAddReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await onDeleteComment(comment.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-border pl-4' : ''}`}>
      {/* 댓글 */}
      <div className="py-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-2">
          {comment.authorBadge && (
            <span className="text-xs font-semibold px-2 py-1 bg-accent/10 text-accent rounded">
              {comment.authorBadge}
            </span>
          )}
          <span className="text-xs text-text-muted">{timeAgo}</span>
          {isCurrentUser && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              삭제
            </button>
          )}
        </div>

        {/* 본문 */}
        <p className="text-sm text-text mb-3 whitespace-pre-wrap">{comment.body}</p>

        {/* 답글 버튼 */}
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-xs font-semibold text-accent hover:text-accent/80 transition"
        >
          {isReplying ? '취소' : '답글'}
        </button>

        {/* 삭제 확인 다이얼로그 */}
        {showDeleteConfirm && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded flex gap-2">
            <div className="flex-1">
              <p className="text-xs text-red-700 font-semibold">정말 삭제하시겠습니까?</p>
            </div>
            <button
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-100"
            >
              삭제
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs font-semibold text-text-muted hover:bg-gray-100 px-2 py-1 rounded"
            >
              취소
            </button>
          </div>
        )}

        {/* 답글 입력 폼 */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !replyText.trim()}
                className="px-3 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? '작성 중...' : '답글 작성'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText('');
                }}
                className="px-3 py-2 border border-border text-sm font-semibold rounded hover:bg-muted transition"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 자식 댓글들 */}
      {childComments.map((child) => (
        <CommentNode
          key={child.id}
          comment={child}
          isCurrentUser={false}
          level={level + 1}
          onAddReply={onAddReply}
          onDeleteComment={onDeleteComment}
          isLoading={isLoading}
          childComments={[]}
        />
      ))}
    </div>
  );
}

export function CommentTree({
  comments,
  currentUserId,
  onAddReply,
  onDeleteComment,
  isLoading,
}: CommentTreeProps) {
  // 루트 댓글과 자식 댓글 분리
  const rootComments = comments.filter((c) => !c.parentId);
  const childCommentMap = new Map<string, (Comment & { id: string })[]>();

  comments.forEach((comment) => {
    if (comment.parentId) {
      if (!childCommentMap.has(comment.parentId)) {
        childCommentMap.set(comment.parentId, []);
      }
      childCommentMap.get(comment.parentId)!.push(comment);
    }
  });

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 border-t border-border">
      {rootComments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          isCurrentUser={comment.authorId === currentUserId}
          onAddReply={onAddReply}
          onDeleteComment={onDeleteComment}
          isLoading={isLoading}
          childComments={childCommentMap.get(comment.id) || []}
        />
      ))}
    </div>
  );
}
