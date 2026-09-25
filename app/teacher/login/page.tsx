"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import Image from "next/image";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function TeacherLogin() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const teachers = useStore((s) => s.teachers);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const session = localStorage.getItem("teacher_session");
    if (session) {
      router.push("/teacher/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const teacher = teachers.find(t => t.username === username && t.password === password);
      if (teacher) {
        localStorage.setItem("teacher_session", teacher.id);
        router.push("/teacher/dashboard");
      } else {
        setError(t("Magaca ama sirta waa khalad.", "Invalid username or password."));
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D5C2E 0%, #083D1F 100%)" }}>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#F0AE20]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#27AE60]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner border border-gray-100">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain p-2" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {t("Galitaanka Macallinka", "Teacher Login")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Fadlan gali magacaaga iyo sirtaada si aad u gasho bartaada.", "Please enter your credentials to access your portal.")}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-bold text-red-600 text-center flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                {t("Magaca Galitaanka", "Username")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C2E]/50 focus:border-[#0D5C2E] transition-all font-medium"
                  placeholder={t("Gali magacaaga", "Enter your username")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                {t("Furaha Sirta", "Password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C2E]/50 focus:border-[#0D5C2E] transition-all font-medium"
                  placeholder={t("Gali sirtaada", "Enter your password")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              style={{ background: "linear-gradient(135deg, #F5C84A 0%, #F0AE20 100%)", color: "#1a1a1a" }}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#1a1a1a]" />
              ) : (
                <>
                  {t("Gudaha Gal", "Sign In")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
              &larr; {t("Ku noqo bogga hore", "Return to home page")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
