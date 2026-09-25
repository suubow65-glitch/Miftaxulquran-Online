"use client";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight, BookOpen, Heart, Globe, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const teachers = useStore(state => state.teachers);
  const aboutContent = useStore(state => state.aboutPageContent);
  const statsContent = useStore(state => state.statsContent);

  if (!aboutContent || !statsContent) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(150deg,#1A8049 0%,#0D5C2E 60%,#083D1F 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-200 mb-6">
            <Sparkles className="h-4 w-4 text-gold-300" />
            {t("Nagu Saabsan", "About Us")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            {lang === "so" ? aboutContent.heroTitleSo : aboutContent.heroTitleEn}
          </h1>
          <p className="text-primary-100/80 text-lg max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
            {lang === "so" ? aboutContent.heroSubtitleSo : aboutContent.heroSubtitleEn}
          </p>
        </div>
        <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full block" preserveAspectRatio="none">
          <path fill="#f8fdf9" d="M0,20L720,40L1440,20L1440,40L0,40Z" />
        </svg>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {statsContent.stats.slice(0, 4)?.map((stat, idx) => {
                const colors = ["#27AE60", "#F0AE20", "#1A8049", "#D4920F"];
                const color = colors[idx % colors.length];
                return (
                  <div key={stat.id} className="rounded-2xl border border-primary-100 bg-white p-7 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <p className="text-4xl font-black mb-2" style={{ color }}>{stat.value}</p>
                    <p className="text-sm font-semibold text-gray-600">{lang === "so" ? stat.labelSo : stat.labelEn}</p>
                  </div>
                );
              })}
            </div>

            {/* Text */}
            <div className="space-y-10">
              {/* Mission */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary mb-5">
                  <BookOpen className="h-4 w-4" />
                  {lang === "so" ? aboutContent.missionTitleSo : aboutContent.missionTitleEn}
                </div>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                  {lang === "so" ? aboutContent.missionDescriptionSo : aboutContent.missionDescriptionEn}
                </div>
              </div>

              {/* Vision */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-600 mb-5">
                  <Globe className="h-4 w-4 text-gold-500" />
                  {lang === "so" ? aboutContent.visionTitleSo : aboutContent.visionTitleEn}
                </div>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                  {lang === "so" ? aboutContent.visionDescriptionSo : aboutContent.visionDescriptionEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              {lang === "so" ? aboutContent.ourStoryTitleSo : aboutContent.ourStoryTitleEn}
            </h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed whitespace-pre-wrap max-w-3xl text-center sm:text-left">
            {lang === "so" ? aboutContent.ourStoryContentSo : aboutContent.ourStoryContentEn}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              {t("Qiyamkayaga ", "Our Core ")}<span style={{ color: "#27AE60" }}>{t("Asaasiga", "Values")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutContent.values?.map((v) => {
              const Icon = (Icons as any)[v.iconName || "BookOpen"] || Icons.BookOpen;
              return (
                <div key={v.id} className="rounded-2xl border border-primary-100 bg-white p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                    style={{ background: `linear-gradient(135deg,${v.color},${v.color}99)` }}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{lang === "so" ? v.titleSo : v.titleEn}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{lang === "so" ? v.descSo : v.descEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              {t("Kooxda ", "Meet our ")}<span style={{ color: "#27AE60" }}>{t("Macalimiinta", "Teachers")}</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm">
              {t("Macalimiin Ijazah haysta oo leh aqoon iyo khibrad sare", "Ijazah-certified teachers with deep knowledge and experience")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(!teachers ? [] : teachers)?.map((t, i) => (
            <div key={t.id} className="group relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-primary-50 relative mb-5">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-6xl text-primary-200 group-hover:scale-105 transition-transform duration-700">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors">{t.name}</h3>
              <p className="text-sm font-semibold text-gold-500 mb-2">{lang === "so" ? t.titleSo : t.titleEn}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{lang === "so" ? t.bioSo : t.bioEn}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-50/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            {t("Ku biir Miftaxul Quran Maanta", "Join Miftaxul Quran Today")}
          </h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            {t("Casharkii ugu horreeyay bilaash — 3 maalmood oo tijaabo ah.", "First lesson free — 3-day trial available.")}
          </p>
          <Link href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-950"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 6px 20px rgba(240,174,32,0.4)" }}>
            {t("Bilow Waxbarashadaada", "Start Learning")} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
