import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { Notice } from './types';

export async function getNotices(limitCount = 20): Promise<(Notice & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'notices'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Notice & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createNotice(
  data: Omit<Notice, 'publishedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'notices'), {
      ...data,
      publishedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
