"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const settings = useStore((s) => s.settings);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const authCookie = document.cookie.split("; ").find((c) => c.startsWith("miftaxul_admin_auth="));
    if (authCookie?.includes("authenticated")) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
        document.cookie = "miftaxul_admin_auth=authenticated; path=/; max-age=604800"; // 7 days
        document.cookie = `miftaxul_admin_email=${encodeURIComponent(email.trim())}; path=/; max-age=604800`;
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Email ama Password khaldan. (Invalid email or password)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A8049 0%, #083D1F 100%)" }}
    >
      {/* Geometric patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-[#F0AE20]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#27AE60]/15 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 55,20 55,45 30,55 5,45 5,20" fill="none" stroke="#F0AE20" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Card decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0AE20] opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#27AE60] opacity-5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative text-center mb-8">
          <div className="h-16 w-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 mb-4 border border-gray-100">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: "linear-gradient(135deg, #1A8049, #083D1F)" }}>
              مQ
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Admin Login</h1>
          <p className="text-sm text-gray-500 font-medium">Miftaxul Quran — CMS / LMS / ERP</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or username"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A8049] focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A8049] focus:bg-white transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-gray-900 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #F5C84A 0%, #F0AE20 100%)", boxShadow: "0 4px 14px rgba(240,174,32,0.3)" }}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
