"use client";

import { useStore, Course as StoreCourse, initialCourses } from "@/lib/store";
import * as Icons from "lucide-react";
import { ArrowRight, Clock, Users, Award, Star, X, CheckCircle2, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";

const categoryConfig: Record<string, { gradient: string; accent: string; badgeStyle: string; ring: string }> = {
  quran: {
    gradient: "from-primary-50 via-primary-100/50 to-white",
    accent: "from-primary to-primary-800",         /* #27AE60 → #0D5C2E */
    badgeStyle: "bg-primary/10 text-primary border-primary/20",
    ring: "ring-primary/20",
  },
  tajweed: {
    gradient: "from-gold-50 via-gold-100/40 to-white",
    accent: "from-gold-500 to-gold-700",           /* #F0AE20 → #A97010 */
    badgeStyle: "bg-gold-500/10 text-gold-700 border-gold-500/20",
    ring: "ring-gold-400/30",
  },
  arabic: {
    gradient: "from-primary-50 to-white via-gold-50/20",
    accent: "from-primary-700 to-primary-900",     /* #156634 → #083D1F */
    badgeStyle: "bg-primary-700/10 text-primary-800 border-primary-700/20",
    ring: "ring-primary-600/20",
  },
  islamic: {
    gradient: "from-blue-50 via-blue-100/50 to-white",
    accent: "from-blue-600 to-blue-800",
    badgeStyle: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    ring: "ring-blue-400/30",
  }
};

const defaultConfig = {
  gradient: "from-gray-50 to-white",
  accent: "from-gray-600 to-gray-800",
  badgeStyle: "bg-gray-100 text-gray-800 border-gray-200",
  ring: "ring-gray-200"
};

export function CoursesList({ filterCategory = "all" }: { filterCategory?: string }) {
  const rawStoreCourses = useStore((state) => state.courses) || [];
  const storeCourses = rawStoreCourses.length > 0 ? rawStoreCourses : initialCourses;
  const courseHelpCTA = useStore((state) => state.courseHelpCTA);
  const [isClient, setIsClient] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<StoreCourse | null>(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-primary-100 bg-white p-7 shadow-sm animate-pulse"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary-100 mb-5" />
            <div className="h-6 w-3/4 bg-primary-100 rounded mb-3" />
            <div className="h-4 w-full bg-primary-100/70 rounded mb-2" />
            <div className="h-4 w-5/6 bg-primary-100/70 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const displayCourses = storeCourses.filter(c => filterCategory === "all" || c.category === filterCategory);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {displayCourses.map((course) => {
        const config = categoryConfig[course.category] ?? defaultConfig;
        const Icon = (Icons as any)[course.icon || "BookOpen"] || Icons.BookOpen;

        return (
          <article
            key={course.id}
            className="group relative flex flex-col rounded-3xl border border-primary-100 bg-gradient-to-b from-white to-primary-50/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/20"
          >

            {/* ── Image ── */}
            {course.imageUrl ? (
              <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
                <img
                  src={course.imageUrl}
                  alt={lang === "so" ? course.titleSo : course.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Bottom vignette fade */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-bold bg-white/80 backdrop-blur-md text-gray-900 shadow-sm z-10">
                  {lang === "so" ? course.badgeSo || course.category : course.badgeEn || course.category}
                </span>
              </div>
            ) : null}

            <div className="p-5 flex-1 flex flex-col">
              {/* ── Icon + Badge header (no-image cards) ── */}
              {!course.imageUrl && (
                <div className="flex items-start justify-between mb-4">
                  {/* Glassmorphism icon container */}
                  <div
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${config.badgeStyle}`}>
                    {lang === "so" ? course.badgeSo || course.category : course.badgeEn || course.category}
                  </span>
                </div>
              )}

              {/* ── Stats row ── */}
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold flex-wrap">
                {course.learningPaths && course.learningPaths.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-primary-800/80">
                    <Clock className="h-4 w-4 text-primary" />
                    {course.learningPaths.length} {lang === "so" ? "Heer" : "Levels"}
                  </span>
                ) : course.duration ? (
                  <span className="inline-flex items-center gap-1.5 text-primary-800/80">
                    <Clock className="h-4 w-4 text-primary" />
                    {course.duration}
                  </span>
                ) : null}
                {course.level && (!course.learningPaths || course.learningPaths.length === 0) ? (
                  <span className="inline-flex items-center gap-1.5 text-primary-800/80">
                    <Award className="h-4 w-4 text-primary" />
                    {course.level}
                  </span>
                ) : null}
                {course.students ? (
                  <span className="inline-flex items-center gap-1.5 text-primary-800/80">
                    <Users className="h-4 w-4 text-primary" />
                    {course.students.toLocaleString()}
                  </span>
                ) : null}
                {course.rating ? (
                  <span className="inline-flex items-center gap-1 font-bold text-gold-600 ml-auto">
                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                    {course.rating}
                  </span>
                ) : null}
              </div>

              {/* ── Title & description ── */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-black text-primary-900 tracking-tight leading-snug mb-2">
                  {lang === "so" ? course.titleSo : course.titleEn}
                </h3>
                <p className="text-sm leading-6 text-gray-600 flex-1">
                  {lang === "so" ? course.descSo : course.descEn}
                </p>

                {/* ── Learning paths ── */}
                {course.learningPaths && course.learningPaths.length > 0 ? (
                  <div className="mt-4 space-y-1.5 rounded-xl p-3 border border-primary-100 bg-white/60">
                    <h4 className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-2">
                      {t("Heerarka Waxbarashada", "Learning Paths")}
                    </h4>
                    <ul className="space-y-1.5">
                      {course.learningPaths.map(lp => (
                        <li key={lp.id} className="flex items-center justify-between text-sm">
                          <span className="font-bold text-gold-600">{lang === "so" ? lp.levelNameSo : lp.levelNameEn}</span>
                          <span className="text-primary-700/80 font-medium text-xs">{lang === "so" ? lp.durationSo : lp.durationEn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* ── Gold checkmark feature list ── */}
                {course.featuresEn && course.featuresEn.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {course.featuresEn.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {/* Elegant custom gold checkmark */}
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="url(#goldCheck)" opacity="0.15" />
                          <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="url(#goldCheckStroke)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          <defs>
                            <linearGradient id="goldCheck" x1="0" y1="0" x2="16" y2="16">
                              <stop stopColor="#F5C84A" />
                              <stop offset="1" stopColor="#D4920F" />
                            </linearGradient>
                            <linearGradient id="goldCheckStroke" x1="0" y1="0" x2="16" y2="16">
                              <stop stopColor="#F5C84A" />
                              <stop offset="1" stopColor="#D4920F" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-gray-700 font-medium leading-5">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {/* ── CTA Button ── */}
              <div className="mt-5 pt-4 border-t border-primary-100">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="group/btn relative inline-flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-bold text-white overflow-hidden shadow-[0_4px_14px_rgba(13,92,46,0.35)] hover:shadow-[0_6px_20px_rgba(13,92,46,0.5)] hover:-translate-y-0.5 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg,#27AE60 0%,#1A8049 55%,#0D5C2E 100%)" }}
                >
                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out" />
                  <span className="relative">{t("Eeg Faahfaahinta", "View Course Details")}</span>
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 group-hover/btn:translate-x-1 transition-transform duration-200">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {displayCourses.length === 0 ? (
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-primary-200 bg-white/70 p-5 text-center">
          <p className="text-xs text-primary-800/60">
            💡 No courses found. Add some from the Admin Dashboard.
          </p>
        </div>
      ) : null}


      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm" onClick={() => setSelectedCourse(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 overflow-y-auto">
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="absolute top-6 right-6 p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6 pr-12">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-800 flex items-center justify-center shadow-lg flex-shrink-0">
                  {(() => {
                    const ModalIcon = (Icons as any)[selectedCourse.icon || "BookOpen"] || Icons.BookOpen;
                    return <ModalIcon className="h-8 w-8 text-white" />;
                  })()}
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-800 text-xs font-bold mb-2">
                    {lang === "so" ? selectedCourse.badgeSo : selectedCourse.badgeEn}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gold-600 leading-tight">
                    {lang === "so" ? selectedCourse.titleSo : selectedCourse.titleEn}
                  </h2>
                </div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                {lang === "so" ? selectedCourse.descSo : selectedCourse.descEn}
              </p>

              {selectedCourse.learningPaths && selectedCourse.learningPaths.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {t("Heerarka Waxbarashada", "Learning Paths")}
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                        <tr>
                          <th className="px-4 py-3">{t("Heerka", "Level")}</th>
                          <th className="px-4 py-3">{t("Muddada", "Duration")}</th>
                          <th className="px-4 py-3">{t("Bartilmaameedka", "Target Audience")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedCourse.learningPaths.map((lp, i) => (
                          <tr key={lp.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gold-100 text-gold-700 text-xs font-bold">{i + 1}</span>
                                <span className="font-bold text-gray-900">{lang === "so" ? lp.levelNameSo : lp.levelNameEn}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-primary-700 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {lang === "so" ? lp.durationSo : lp.durationEn}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 whitespace-normal min-w-[200px]">
                              {lang === "so" ? lp.targetAudienceSo : lp.targetAudienceEn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("Maxaa lagu bartaa?", "What you will learn")}</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {(lang === "so" ? selectedCourse.featuresSo : selectedCourse.featuresEn).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
              <div className="text-center sm:text-left shrink-0">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{t("Qiimaha", "Price")}</p>
                <p className="text-xl font-black text-gray-900">{lang === "so" ? selectedCourse.priceSo : selectedCourse.priceEn}</p>
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://wa.me/252619337904"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform bg-emerald-600 hover:bg-emerald-700"
                >
                  <Icons.MessageCircle className="h-5 w-5" />
                  {t("Nagala soo xiriir WhatsApp", "Contact us on WhatsApp")}
                </a>
                <Link 
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-primary-950 shadow-lg hover:scale-105 transition-transform"
                  style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}
                >
                  <Icons.UserPlus className="h-5 w-5" />
                  {t("Hadda Is-diiwaangeli", "Register Now")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
