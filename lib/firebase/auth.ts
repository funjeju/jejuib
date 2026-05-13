import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { User as UserType } from '../firestore/types';

// Google Provider
const googleProvider = new GoogleAuthProvider();

/**
 * 이메일로 회원가입
 */
export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName,
      role: 'visitor',
      verified: false,
      verifiedSchoolIds: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as UserType);

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 이메일로 로그인
 */
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Google로 로그인
 */
export async function signInWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Firestore에서 사용자 존재 확인, 없으면 생성
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || 'Google User',
        role: 'visitor',
        verified: false,
        verifiedSchoolIds: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      } as UserType);
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 현재 사용자 가져오기 (Promise)
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

/**
 * 인증 상태 구독
 */
export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Firestore에서 사용자 정보 가져오기
 */
export async function getUserProfile(uid: string): Promise<UserType | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as UserType) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUserProfile(uid: string, data: Partial<UserType>) {
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}
