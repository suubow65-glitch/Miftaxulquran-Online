"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { Lock, User, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { useStore, type CMSState } from "@/lib/store";
import { getFirebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function TeacherLogin() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const teachers = useStore((s: CMSState) => s.teachers);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("teacher_session");
    if (session) {
      router.push("/teacher/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const teacher = teachers.find((t) => t.id === selectedTeacherId);

    if (!teacher) {
      setError(t("Macallinka dooro.", "Please select a teacher."));
      setLoading(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      const teacherEmail = `${teacher.username || teacher.id}@miftaxulquran.com`;
      await signInWithEmailAndPassword(auth, teacherEmail, password);
      localStorage.setItem("teacher_session", teacher.id);
      router.push("/teacher/dashboard");
    } catch (err: any) {
      console.warn("Teacher Firebase Auth sign-in warning:", err);
      // Fallback: check stored teacher password
      if (teacher.password && teacher.password === password) {
        localStorage.setItem("teacher_session", teacher.id);
        router.push("/teacher/dashboard");
      } else {
        setError(t("Furaha sirta waa khalad.", "Incorrect password."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D5C2E 0%, #083D1F 100%)" }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#F0AE20]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#27AE60]/20 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <pattern id="geo2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 55,20 55,45 30,55 5,45 5,20" fill="none" stroke="#F0AE20" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#geo2)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ background: "linear-gradient(135deg, #1A8049, #083D1F)" }}>
              مQ
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {t("Galitaanka Macallinka", "Teacher Login")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Magacaaga ku dooro liiska si aad u gasho.", "Select your name from the list to sign in.")}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-bold text-red-600 text-center flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Teacher selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                {t("Macallinka", "Select Teacher")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <select
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C2E]/50 focus:border-[#0D5C2E] transition-all font-medium appearance-none"
                >
                  <option value="">{t("— Macallinka dooro —", "— Select a teacher —")}</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                {t("Furaha Sirta", "Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C2E]/50 focus:border-[#0D5C2E] transition-all font-medium"
                  placeholder={t("Gali sirtaada", "Enter your password")}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t("Tusaale: axmed123, maxamed123, faadumo123, cali123", "Demo: axmed123, maxamed123, faadumo123, cali123")}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
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
