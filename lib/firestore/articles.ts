import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { Article } from './types';

export async function getPublishedArticles(options?: {
  category?: string;
  type?: 'pillar' | 'daily';
  limitCount?: number;
}): Promise<(Article & { id: string })[]> {
  try {
    const { category, type, limitCount = 20 } = options || {};
    const constraints: any[] = [where('status', '==', 'published'), where('noindex', '==', false)];

    if (category) constraints.push(where('category', '==', category));
    if (type) constraints.push(where('type', '==', type));

    constraints.push(orderBy('publishedAt', 'desc'));
    constraints.push(limit(limitCount));

    const q = query(collection(db, 'articles'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Article & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getArticleBySlug(slug: string): Promise<(Article & { id: string }) | null> {
  try {
    const q = query(
      collection(db, 'articles'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Article & { id: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getArticleCategories(): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    const categories = new Set<string>();
    snapshot.docs.forEach((d) => {
      const category = (d.data() as Article).category;
      if (category) categories.add(category);
    });
    return Array.from(categories).sort();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
