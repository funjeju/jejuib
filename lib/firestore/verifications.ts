import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { Verification, DocumentType } from './types';

export async function createVerification(
  userId: string,
  schoolId: string,
  documentType: DocumentType,
  storagePath: string,
  extractedSchool: string = '',
  extractedYear: string = ''
): Promise<string> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30일 만료

    const docRef = await addDoc(collection(db, 'verifications'), {
      userId,
      schoolId,
      documentType,
      storagePath,
      ocrConfidence: 0,
      extractedSchool,
      extractedYear,
      status: 'pending' as const,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
    } as Verification);

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUserVerifications(userId: string): Promise<(Verification & { id: string })[]> {
  try {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    const q = query(collection(db, 'verifications'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Verification & { id: string });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getVerification(verificationId: string): Promise<(Verification & { id: string }) | null> {
  try {
    const docRef = doc(db, 'verifications', verificationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Verification & { id: string };
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUserVerificationForSchool(
  userId: string,
  schoolId: string
): Promise<(Verification & { id: string }) | null> {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('schoolId', '==', schoolId),
    ];
    const q = query(collection(db, 'verifications'), ...constraints);
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Verification & { id: string };
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getSchoolVerifications(schoolId: string): Promise<(Verification & { id: string })[]> {
  try {
    const constraints: QueryConstraint[] = [where('schoolId', '==', schoolId)];
    const q = query(collection(db, 'verifications'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Verification & { id: string });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
