"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/language-provider";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

const courseLinks = [
  { href: "/courses", so: "Dhamaan Koorsooyinka", en: "All Courses" },
  { href: "/courses#quran", so: "Xifdinta Qur'aanka (Hifz)", en: "Quran Memorization" },
  { href: "/courses#tajweed", so: "Tacwiid & Qira'ad", en: "Tajweed & Recitation" },
  { href: "/courses#arabic", so: "Luqadda Carabiga", en: "Arabic Language" },
  { href: "/courses#islamic", so: "Daraasadaha Diinta", en: "Islamic Studies" },
];

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: t("Bogga Hore", "Home") },
    { href: "/about", label: t("Nagu Saabsan", "About Us") },
    { href: "/library", label: t("Maktabadda", "Library") },
    { href: "/insights", label: t("Ogaal", "Insights") },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-lg shadow-lg shadow-black/5 border-b border-primary-100/60"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group" onClick={() => setMobileOpen(false)}>
            <img 
              src="/logo.png" 
              alt="Miftaxul Quran" 
              className="h-[70px] w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary rounded-lg hover:bg-primary-50 transition-all"
            >
              {t("Bogga Hore", "Home")}
            </Link>

            {/* Courses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCoursesOpen((o) => !o)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary rounded-lg hover:bg-primary-50 transition-all"
              >
                {t("Koorsooyinka", "Courses")}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {coursesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
                    <div className="w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 translate-y-1" />
                  </div>
                  {courseLinks.map((cl) => (
                    <Link
                      key={cl.href}
                      href={cl.href}
                      onClick={() => setCoursesOpen(false)}
                      className="block px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors"
                    >
                      {lang === "so" ? cl.so : cl.en}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary rounded-lg hover:bg-primary-50 transition-all"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Toggle */}
            <div className="inline-flex items-center bg-gray-50 p-1 rounded-full border border-gray-100 shadow-inner">
              <button
                onClick={() => setLang("so")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
                  lang === "so"
                    ? "bg-white text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10"
                    : "text-gray-500 hover:text-primary hover:bg-white/60"
                }`}
              >
                <img src="https://flagcdn.com/so.svg" alt="Somali" className="w-4 h-4 rounded-full object-cover shadow-sm border border-black/5" />
                <span className="text-sm font-semibold">Somali</span>
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
                  lang === "en"
                    ? "bg-white text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10"
                    : "text-gray-500 hover:text-primary hover:bg-white/60"
                }`}
              >
                <img src="https://flagcdn.com/gb.svg" alt="English" className="w-4 h-4 rounded-full object-cover shadow-sm border border-black/5" />
                <span className="text-sm font-semibold">English</span>
              </button>
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-primary-950 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #F5C84A 0%, #F0AE20 55%, #D4920F 100%)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}
            >
              {t("Is-diiwaangeli", "Register Now")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center shrink-0">
              <img 
                src="/logo.png" 
                alt="Miftaxul Quran" 
                className="h-[50px] w-auto object-contain" 
              />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors">
              {t("Bogga Hore", "Home")}
            </Link>

            {/* Courses accordion */}
            <div>
              <button
                onClick={() => setMobileCoursesOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors"
              >
                {t("Koorsooyinka", "Courses")}
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCoursesOpen && (
                <div className="pl-4 flex flex-col gap-1 mt-1 border-l-2 border-primary-100 ml-4">
                  {courseLinks.map((cl) => (
                    <Link key={cl.href} href={cl.href} onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-primary rounded-lg hover:bg-primary-50 transition-colors">
                      {lang === "so" ? cl.so : cl.en}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/library" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors">
              {t("Maktabadda", "Library")}
            </Link>
            <Link href="/insights" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors">
              {t("Ogaal", "Insights")}
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors">
              {t("Nagu Saabsan", "About Us")}
            </Link>
          </nav>

          {/* Mobile bottom */}
          <div className="p-5 border-t border-gray-100 flex flex-col gap-4">
            {/* Language toggle */}
            <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
              <div className="grid grid-cols-2 gap-2 bg-gray-200/50 p-1 rounded-xl">
                <button onClick={() => setLang("so")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 ${
                    lang === "so" 
                      ? "bg-white text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10" 
                      : "text-gray-500 hover:text-primary hover:bg-white/60"
                  }`}>
                  <img src="https://flagcdn.com/so.svg" alt="Somali" className="w-4 h-4 rounded-full object-cover shadow-sm border border-black/5" />
                  <span className="text-sm font-semibold">Somali</span>
                </button>
                <button onClick={() => setLang("en")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 ${
                    lang === "en" 
                      ? "bg-white text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10" 
                      : "text-gray-500 hover:text-primary hover:bg-white/60"
                  }`}>
                  <img src="https://flagcdn.com/gb.svg" alt="English" className="w-4 h-4 rounded-full object-cover shadow-sm border border-black/5" />
                  <span className="text-sm font-semibold">English</span>
                </button>
              </div>
            </div>
            <Link href="/register" onClick={() => setMobileOpen(false)}
              className="w-full text-center py-4 rounded-xl font-black text-base text-primary-950"
              style={{ background: "linear-gradient(135deg, #F5C84A 0%, #F0AE20 55%, #D4920F 100%)", boxShadow: "0 6px 20px rgba(240,174,32,0.4)" }}>
              {t("Is-diiwaangeli — Bilaash", "Register — Free Trial")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
