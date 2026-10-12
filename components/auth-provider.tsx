"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

type AuthContextValue = {
  user: { email: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: false,
      login: async (email, password) => {
        // Local-only auth is handled per-page via cookies/localStorage
        setUser({ email });
      },
      logout: async () => {
        setUser(null);
        document.cookie = "miftaxul_admin_auth=; path=/; max-age=0";
        localStorage.removeItem("teacher_session");
      },
    }),
    [user],
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
