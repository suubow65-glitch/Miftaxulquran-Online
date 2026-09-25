"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, Loader2, LogIn } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Need to make sure store is hydrated
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const settings = useStore(s => s.settings);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (signInError) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        document.cookie = "miftaxul_admin_auth=authenticated; path=/; max-age=604800";
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      style={{ background: "linear-gradient(135deg, #1A8049 0%, #083D1F 100%)" }}>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500 opacity-10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative text-center mb-8">
          <div className="h-16 w-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 mb-4 border border-gray-100">
            <Image src="/logo.png" alt="Miftaxul Quran" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Admin Login</h1>
          <p className="text-sm text-gray-500 font-medium">Miftaxul Quran Content Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 text-center animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-primary-950 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            style={{ background: "linear-gradient(135deg, #F5C84A 0%, #F0AE20 100%)", boxShadow: "0 4px 14px rgba(240,174,32,0.3)" }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
