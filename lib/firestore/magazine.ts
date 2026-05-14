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
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { MagazineIssue, MagazineItem, Subscriber } from './types';

// ── Issues ────────────────────────────────────────────────

export async function getLatestIssue(): Promise<(MagazineIssue & { id: string }) | null> {
  try {
    const q = query(
      collection(db, 'magazine_issues'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MagazineIssue & { id: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getIssues(limitCount = 20): Promise<(MagazineIssue & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'magazine_issues'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MagazineIssue & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getIssueByNumber(number: number): Promise<(MagazineIssue & { id: string }) | null> {
  try {
    const q = query(
      collection(db, 'magazine_issues'),
      where('number', '==', number),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as MagazineIssue & { id: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ── Items ─────────────────────────────────────────────────

export async function getItemsByIds(itemIds: string[]): Promise<(MagazineItem & { id: string })[]> {
  if (!itemIds.length) return [];
  try {
    const results = await Promise.all(
      itemIds.map(async (id) => {
        const docRef = doc(db, 'magazine_items', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;
        return { id: docSnap.id, ...docSnap.data() } as MagazineItem & { id: string };
      })
    );
    return results.filter(Boolean) as (MagazineItem & { id: string })[];
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getItemsBySection(
  section: string,
  limitCount = 10
): Promise<(MagazineItem & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'magazine_items'),
      where('section', '==', section),
      where('status', 'in', ['ready', 'used']),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MagazineItem & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ── Subscribers ───────────────────────────────────────────

export async function createSubscriber(email: string): Promise<string> {
  try {
    const normalized = email.trim().toLowerCase();
    const docRef = await addDoc(collection(db, 'subscribers'), {
      email: normalized,
      source: 'web_form',
      status: 'pending',
      tags: [],
      createdAt: Timestamp.now(),
    } as Omit<Subscriber, 'id'>);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function confirmSubscriber(subscriberId: string): Promise<void> {
  try {
    const docRef = doc(db, 'subscribers', subscriberId);
    await updateDoc(docRef, {
      status: 'active',
      confirmedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
