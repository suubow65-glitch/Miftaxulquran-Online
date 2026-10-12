"use client";

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { useStore } from "@/lib/store";

type AuthContextValue = {
  user: { email: string | null; uid: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string | null; uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firestore collections & sync
  useEffect(() => {
    useStore.getState().initializeFirestore();
  }, []);

  // Listen to Firebase auth changes
  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, email, password);
        document.cookie = "miftaxul_admin_auth=authenticated; path=/; max-age=604800";
      },
      logout: async () => {
        try {
          const auth = getFirebaseAuth();
          await signOut(auth);
        } catch (_) {}
        document.cookie = "miftaxul_admin_auth=; path=/; max-age=0";
        localStorage.removeItem("teacher_session");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
