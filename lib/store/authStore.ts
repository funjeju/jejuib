import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User as UserType } from '../firestore/types';
import {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  onAuthChanged,
  getUserProfile,
} from '../firebase/auth';

interface AuthState {
  // 상태
  firebaseUser: FirebaseUser | null;
  userProfile: UserType | null;
  loading: boolean;
  error: string | null;

  // 액션
  initAuth: () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  error: null,

  initAuth: () => {
    // Firebase 인증 상태 변화 감지
    onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // 로그인된 상태
        const userProfile = await getUserProfile(firebaseUser.uid);
        set({
          firebaseUser,
          userProfile,
          loading: false,
        });
      } else {
        // 로그아웃된 상태
        set({
          firebaseUser: null,
          userProfile: null,
          loading: false,
        });
      }
    });
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const firebaseUser = await signUp(email, password, displayName);
      const userProfile = await getUserProfile(firebaseUser.uid);
      set({
        firebaseUser,
        userProfile,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const firebaseUser = await signIn(email, password);
      const userProfile = await getUserProfile(firebaseUser.uid);
      set({
        firebaseUser,
        userProfile,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const firebaseUser = await signInWithGoogle();
      const userProfile = await getUserProfile(firebaseUser.uid);
      set({
        firebaseUser,
        userProfile,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await signOut();
      set({
        firebaseUser: null,
        userProfile: null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
