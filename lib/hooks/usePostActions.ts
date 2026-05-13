import { useState } from 'react';
import { addReaction } from '@/lib/firestore/posts';
import { useAuth } from './useAuth';

export function usePostActions() {
  const { firebaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPostReaction = async (postId: string, kind: 'like' | 'helpful') => {
    if (!firebaseUser) {
      setError('로그인이 필요합니다');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addReaction(postId, firebaseUser.uid, kind);
    } catch (err: any) {
      setError(err.message || '반응 추가에 실패했습니다');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    addPostReaction,
    isLoading,
    error,
    clearError,
  };
}
