'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPost } from '@/lib/firestore/posts';
import { Post } from '@/lib/firestore/types';
import { SCHOOLS } from '@/app/data/schools';
import { PostForm } from './PostForm';

interface WritePostModalProps {
  onClose: () => void;
  onPostCreated?: (post: Post & { id: string }) => void;
}

export function WritePostModal({ onClose, onPostCreated }: WritePostModalProps) {
  const router = useRouter();
  const { firebaseUser, userProfile } = useAuth();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifiedSchoolIds = userProfile?.verifiedSchoolIds ?? [];
  const verifiedSchools = verifiedSchools_of(verifiedSchoolIds);

  function verifiedSchools_of(ids: string[]) {
    return ids
      .map((id) => SCHOOLS.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => !!s);
  }

  const activeSchoolId =
    selectedSchoolId ??
    (verifiedSchoolIds.length === 1 ? verifiedSchoolIds[0] : null);

  const handleSubmit = async (
    data: Omit<Post, 'schoolId' | 'authorId' | 'authorBadge' | 'viewCount' | 'commentCount' | 'reactionCounts' | 'createdAt' | 'updatedAt' | 'id'>
  ) => {
    if (!firebaseUser || !userProfile || !activeSchoolId) return;
    setIsSubmitting(true);
    try {
      const newId = await createPost(
        activeSchoolId,
        firebaseUser.uid,
        userProfile.badge || userProfile.role,
        data
      );
      const newPost: Post & { id: string } = {
        id: newId,
        schoolId: activeSchoolId,
        authorId: firebaseUser.uid,
        authorBadge: userProfile.badge || userProfile.role,
        ...data,
        viewCount: 0,
        commentCount: 0,
        reactionCounts: { like: 0, helpful: 0 },
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      onPostCreated?.(newPost);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-text">글쓰기</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-border hover:text-text transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* 인증된 학교가 없는 경우 */}
          {verifiedSchoolIds.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏫</div>
              <p className="font-semibold text-text mb-2">학교 인증이 필요합니다</p>
              <p className="text-sm text-text-muted mb-6">
                글을 작성하려면 먼저 재학 중인 학교를 인증해주세요.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/verify');
                }}
                className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                학교 인증하기
              </button>
            </div>
          )}

          {/* 인증 학교가 여러 개인 경우 — 먼저 학교 선택 */}
          {verifiedSchoolIds.length > 1 && !activeSchoolId && (
            <div>
              <p className="text-sm font-semibold text-text mb-4">어느 학교로 게시할까요?</p>
              <div className="space-y-2">
                {verifiedSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => setSelectedSchoolId(school.id!)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition"
                  >
                    <p className="font-semibold text-text text-sm">{school.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{school.region} · {school.programs.join(', ')}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 학교가 결정된 경우 — 폼 표시 */}
          {activeSchoolId && (
            <div>
              {verifiedSchoolIds.length > 1 && (
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full font-semibold">
                    {SCHOOLS.find((s) => s.id === activeSchoolId)?.name}
                  </span>
                  <button
                    onClick={() => setSelectedSchoolId(null)}
                    className="text-xs text-text-muted hover:text-text transition"
                  >
                    변경
                  </button>
                </div>
              )}
              <PostForm
                schoolId={activeSchoolId}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                onCancel={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
