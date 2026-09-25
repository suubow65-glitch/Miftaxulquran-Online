"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";
import { CoursesList } from "@/components/courses-list";

type Tab = "all" | "quran" | "tajweed" | "arabic" | "islamic";

const tabs: { key: Tab; so: string; en: string }[] = [
  { key: "all", so: "Dhammaan", en: "All Courses" },
  { key: "quran", so: "Qur'aan", en: "Quran" },
  { key: "tajweed", so: "Tacwiid", en: "Tajweed" },
  { key: "arabic", so: "Carabiga", en: "Arabic" },
  { key: "islamic", so: "Diinta", en: "Islamic" },
];

export default function CoursesPage() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const courseHelpCTA = useStore(state => state.courseHelpCTA);

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(150deg,#1A8049 0%,#0D5C2E 60%,#083D1F 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-200 mb-6">
            <Sparkles className="h-4 w-4 text-gold-300" />
            {t("Barnaamijyadayada", "Our Programs")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            {t("Koorsooyinkayaga ", "Our ")}<span className="text-gradient-gold">{t("Asaaska", "Core Courses")}</span>
          </h1>
          <p className="text-primary-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("Laga bilaabo Carabiga aasaasiga ah illaa xifdinta Qur'aanka sare — barnaamijkeenna waxaa loogu talagalay ardayda dhammaan heerarka.", "From foundational Arabic to advanced Quran memorization — our programs serve students of all levels.")}
          </p>
        </div>
        <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full block" preserveAspectRatio="none">
          <path fill="#f8fdf9" d="M0,20L720,40L1440,20L1440,40L0,40Z" />
        </svg>
      </section>

      {/* Filter tabs + course cards */}
      <section className="py-16 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab.key ? "text-primary-950 shadow-lg" : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40"}`}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" } : {}}>
                {lang === "so" ? tab.so : tab.en}
              </button>
            ))}
          </div>

          {/* Cards */}
          <CoursesList filterCategory={activeTab} />

          {/* Bottom CTA */}
          <div className="mt-16 rounded-3xl p-8 sm:p-12 text-center border border-primary-100 bg-white shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
              {lang === "so" ? courseHelpCTA.titleSo : courseHelpCTA.titleEn}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
              {lang === "so" ? courseHelpCTA.descSo : courseHelpCTA.descEn}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-primary-950"
                style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
                {lang === "so" ? courseHelpCTA.contactButtonSo : courseHelpCTA.contactButtonEn} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`https://wa.me/${courseHelpCTA.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bb5a] transition-all shadow-lg">
                <MessageCircle className="h-5 w-5" />
                {lang === "so" ? courseHelpCTA.whatsappButtonSo : courseHelpCTA.whatsappButtonEn}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
