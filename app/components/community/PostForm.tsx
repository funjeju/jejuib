'use client';

import { useState } from 'react';
import { Post, PostType, RatingCategories } from '@/lib/firestore/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const postSchema = z.object({
  type: z.enum(['review', 'question', 'share', 'meetup', 'notice', 'experience']),
  title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다').max(200, '제목은 200자 이하여야 합니다'),
  body: z.string().min(10, '본문은 최소 10자 이상이어야 합니다').max(5000, '본문은 5000자 이하여야 합니다'),
  tags: z.string().default(''),
  rating: z.number().min(1).max(5).optional(),
  ratingCategories: z.object({
    teaching: z.number().min(1).max(5).optional(),
    atmosphere: z.number().min(1).max(5).optional(),
    parentInvolvement: z.number().min(1).max(5).optional(),
    iaSupport: z.number().min(1).max(5).optional(),
    privateTutoring: z.number().min(1).max(5).optional(),
  }).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  schoolId: string;
  onSubmit: (data: Omit<Post, 'schoolId' | 'authorId' | 'authorBadge' | 'viewCount' | 'commentCount' | 'reactionCounts' | 'createdAt' | 'updatedAt' | 'id'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: Post;
}

export function PostForm({ schoolId, onSubmit, isLoading, initialData }: PostFormProps) {
  const [showRatingCategories, setShowRatingCategories] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: initialData?.type || 'share',
      title: initialData?.title || '',
      body: initialData?.body || '',
      tags: initialData?.tags?.join(', ') || '',
      rating: initialData?.rating || 3,
      ratingCategories: initialData?.ratingCategories || {},
    },
  });

  const type = watch('type');
  const rating = watch('rating');
  const ratingCategories = watch('ratingCategories');

  const handleFormSubmit = async (data: PostFormData) => {
    setSubmitError('');
    try {
      const tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 5);

      await onSubmit({
        type: data.type,
        title: data.title,
        body: data.body,
        tags,
        pinned: false,
        rating: data.type === 'review' ? data.rating : undefined,
        ratingCategories: data.type === 'review' ? data.ratingCategories : undefined,
      });
    } catch (error: any) {
      setSubmitError(error.message || '게시글 작성 중 오류가 발생했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-surface border border-border rounded-lg p-6">
      {/* 에러 메시지 */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* 게시글 타입 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-2">게시글 유형</label>
        <select
          {...register('type')}
          className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        >
          <option value="review">후기</option>
          <option value="question">질문</option>
          <option value="share">공유</option>
          <option value="meetup">모임</option>
          <option value="notice">공지</option>
          <option value="experience">경험</option>
        </select>
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-2">제목</label>
        <input
          {...register('title')}
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isLoading}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      {/* 본문 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-2">본문</label>
        <textarea
          {...register('body')}
          placeholder="내용을 입력하세요"
          rows={8}
          className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isLoading}
        />
        {errors.body && <p className="text-xs text-red-600 mt-1">{errors.body.message}</p>}
      </div>

      {/* 태그 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-2">태그 (쉼표로 구분, 최대 5개)</label>
        <input
          {...register('tags')}
          type="text"
          placeholder="예: 추천, 좋은환경, 학생들"
          className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* 평점 (리뷰인 경우) */}
      {type === 'review' && (
        <>
          <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-text">전체 평점</label>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setValue('rating', i + 1)}
                      className={`text-2xl transition ${(rating || 0) >= i + 1 ? '⭐' : '☆'}`}
                    >
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-accent">({rating || 0}/5)</span>
              </div>
            </div>

            {/* 평가 항목별 점수 토글 */}
            <button
              type="button"
              onClick={() => setShowRatingCategories(!showRatingCategories)}
              className="text-xs text-accent hover:underline mb-4"
            >
              {showRatingCategories ? '항목별 평가 숨기기' : '항목별 평가 추가'}
            </button>

            {/* 항목별 평가 */}
            {showRatingCategories && (
              <div className="space-y-4">
                {(['teaching', 'atmosphere', 'parentInvolvement', 'iaSupport', 'privateTutoring'] as const).map(
                  (category) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-text">
                          {category === 'teaching'
                            ? '교육의 질'
                            : category === 'atmosphere'
                              ? '학교 분위기'
                              : category === 'parentInvolvement'
                                ? '학부모 참여'
                                : category === 'iaSupport'
                                  ? 'IA 지원'
                                  : '사교육 의존도'}
                        </label>
                        <span className="text-xs text-accent">
                          {ratingCategories?.[category] || 0}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={ratingCategories?.[category] || 0}
                        onChange={(e) => {
                          const newCategories = { ...ratingCategories, [category]: parseInt(e.target.value) };
                          setValue('ratingCategories', newCategories);
                        }}
                        className="w-full"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* 버튼 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? '작성 중...' : '게시글 작성'}
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="px-6 py-3 border border-border rounded-lg font-semibold text-text hover:bg-muted transition"
        >
          취소
        </button>
      </div>
    </form>
  );
}
