import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { School } from './types';

export async function getSchoolById(schoolId: string): Promise<(School & { id: string }) | null> {
  try {
    const docRef = doc(db, 'schools', schoolId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as School & { id: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getSchoolsByRegion(region: string): Promise<(School & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'schools'),
      where('region', '==', region),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as School & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getSchoolsByStage(stage: '인증' | '후보' | '관심'): Promise<(School & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'schools'),
      where('stage', '==', stage),
      orderBy('region'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as School & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function searchSchools(keyword: string): Promise<(School & { id: string })[]> {
  try {
    // Firestore full-text search is not native — use prefix match on nameEn as workaround
    // For production, consider Algolia or Firebase Extensions Search
    const q = query(
      collection(db, 'schools'),
      where('name', '>=', keyword),
      where('name', '<=', keyword + ''),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as School & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
