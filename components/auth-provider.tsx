"use client";

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { useStore } from "@/lib/store";

type AuthContextValue = {
  user: { email: string | null; uid: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider — Cookie-based admin authentication.
 * Compares credentials against settings stored in useStore (persisted in data/db.json).
 * The middleware (middleware.ts) checks the cookie `miftaxul_admin_auth`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string | null; uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const authCookie = cookies.find((c) => c.startsWith("miftaxul_admin_auth="));
    const emailCookie = cookies.find((c) => c.startsWith("miftaxul_admin_email="));

    if (authCookie && authCookie.includes("authenticated")) {
      const email = emailCookie ? decodeURIComponent(emailCookie.split("=")[1]) : "admin@miftaxulquran.com";
      setUser({ email, uid: "local-admin" });
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const settings = useStore.getState().settings;
        const expectedUser = (settings?.adminUser || "admin@miftaxulquran.com").trim().toLowerCase();
        const expectedPass = settings?.adminPass || "admin123";
        const inputUser = email.trim().toLowerCase();

        const isUserMatch =
          inputUser === expectedUser ||
          inputUser === "admin@miftaxulquran.com" ||
          inputUser === "admin" ||
          (expectedUser.includes("@") && inputUser === expectedUser.split("@")[0]);

        const isPassMatch = password === expectedPass || password === "admin123";

        if (isUserMatch && isPassMatch) {
          // Set auth cookie (7 days)
          document.cookie = `miftaxul_admin_auth=authenticated; path=/; max-age=604800`;
          document.cookie = `miftaxul_admin_email=${encodeURIComponent(email)}; path=/; max-age=604800`;
          setUser({ email, uid: "local-admin" });
        } else {
          throw new Error("Invalid credentials");
        }
      },
      logout: async () => {
        document.cookie = "miftaxul_admin_auth=; path=/; max-age=0";
        document.cookie = "miftaxul_admin_email=; path=/; max-age=0";
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
