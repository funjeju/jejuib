import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  Query,
  QueryConstraint,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { Post, Comment, PostType } from './types';

/**
 * 학교 게시판 게시글 목록 조회
 */
export async function getPosts(
  schoolId: string,
  type?: PostType,
  limitCount: number = 20
): Promise<(Post & { id: string })[]> {
  try {
    const constraints: QueryConstraint[] = [where('schoolId', '==', schoolId)];

    if (type) {
      constraints.push(where('type', '==', type));
    }

    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));

    const q = query(collection(db, 'posts'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 전체 학교 게시글 목록 조회 (커뮤니티 피드용)
 */
export async function getAllPosts(options?: {
  type?: PostType;
  limitCount?: number;
  sortBy?: 'recent' | 'popular';
}): Promise<(Post & { id: string })[]> {
  try {
    const { type, limitCount = 20, sortBy = 'recent' } = options || {};
    const constraints: QueryConstraint[] = [];

    if (type) {
      constraints.push(where('type', '==', type));
    }

    if (sortBy === 'popular') {
      constraints.push(orderBy('reactionCounts.like', 'desc'));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(limitCount));

    const q = query(collection(db, 'posts'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: string): Promise<(Post & { id: string }) | null> {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Post & { id: string };
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 게시글 작성
 */
export async function createPost(
  schoolId: string,
  authorId: string,
  authorBadge: string,
  data: Omit<Post, 'schoolId' | 'authorId' | 'authorBadge' | 'viewCount' | 'commentCount' | 'reactionCounts' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...data,
      schoolId,
      authorId,
      authorBadge,
      viewCount: 0,
      commentCount: 0,
      reactionCounts: {
        like: 0,
        helpful: 0,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 게시글 수정
 */
export async function updatePost(
  postId: string,
  data: Partial<Omit<Post, 'authorId' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 게시글 조회수 증가
 */
export async function incrementPostViewCount(postId: string): Promise<void> {
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 댓글 추가
 */
export async function addComment(
  postId: string,
  authorId: string,
  authorBadge: string,
  body: string,
  parentId?: string
): Promise<string> {
  try {
    const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
      authorId,
      authorBadge,
      body,
      parentId: parentId || null,
      createdAt: Timestamp.now(),
    } as Comment);

    // 게시글 댓글 수 증가
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(1),
    });

    return commentRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 댓글 목록 조회
 */
export async function getComments(postId: string): Promise<(Comment & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Comment & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));

    // 게시글 댓글 수 감소
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(-1),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 반응 추가 (좋아요, 도움됨)
 */
export async function addReaction(
  postId: string,
  userId: string,
  kind: 'like' | 'helpful'
): Promise<void> {
  try {
    await addDoc(collection(db, 'reactions'), {
      userId,
      targetType: 'post',
      targetId: postId,
      kind,
      createdAt: Timestamp.now(),
    });

    // 게시글 반응 카운트 증가
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      [`reactionCounts.${kind}`]: increment(1),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
