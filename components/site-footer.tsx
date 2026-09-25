"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Phone, Mail, MapPin, MessageCircle, Globe, Play, Camera } from "lucide-react";
import { useStore } from "@/lib/store";

export function SiteFooter() {
  const { lang, t } = useLanguage();
  const footerContent = useStore(s => s.footerContent);
  const settings = useStore(s => s.settings);
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/", so: "Hoyga", en: "Home" },
    { href: "/courses", so: "Koorsooyinka", en: "Courses" },
    { href: "/library", so: "Maktabadda", en: "Library" },
    { href: "/insights", so: "Ogaal", en: "Insights" },
    { href: "/track", so: "Dabagalka Ardayda", en: "Student Portal" },
  ];

  return (
    <footer style={{ background: "linear-gradient(180deg, #0D5C2E 0%, #083D1F 100%)" }}>
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-16 lg:gap-x-20 items-start">
          
          {/* Column 1: Brand & Blurb (Wider) */}
          <div className="md:col-span-5 flex flex-col text-left">
            <Link href="/" className="inline-block group mb-6 bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all self-start">
              <img 
                src="/logo.png" 
                alt="Miftaxul Quran" 
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </Link>
            <p className="text-sm text-primary-200/80 leading-relaxed mb-4">
              {footerContent ? (lang === "so" ? footerContent.aboutSo : footerContent.aboutEn) : ""}
            </p>
            {/* Arabic tagline */}
            <p className="font-arabic text-gold-400 text-lg" dir="rtl">مفتاح القرآن</p>
          </div>

          {/* Column 2: Links */}
          <div className="md:col-span-3 flex flex-col text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              {t("Xiriirka Degdegga", "Quick Links")}
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-primary-200/80 hover:text-gold-400 transition-colors font-medium flex items-center justify-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 group-hover:bg-gold-400 transition-colors" />
                    {t(l.so, l.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Socials */}
          <div className="md:col-span-4 flex flex-col text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">
              {t("Xiriirka", "Contact")}
            </h4>
            <ul className="space-y-4 mb-8">
              <li>
                <a href="tel:+252619337904"
                  className="flex items-center justify-start gap-3 text-sm text-primary-200/80 hover:text-gold-400 transition-colors group">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gold-500 group-hover:text-gold-400" />
                  <span>+252 619 337 904</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@miftaxulquran.com"
                  className="flex items-center justify-start gap-3 text-sm text-primary-200/80 hover:text-gold-400 transition-colors group">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gold-500 group-hover:text-gold-400" />
                  <span>info@miftaxulquran.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start justify-start gap-3 text-sm text-primary-200/80">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-500" />
                  <span>{t("Muqdisho, Buulaxuubey, Soomaaliya", "Mogadishu, Buulaxuubey, Somalia")}</span>
                </div>
              </li>
            </ul>

            <div className="flex flex-col items-start gap-5">
              <div className="flex items-center gap-3">
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-white transition-all shadow-md">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {settings?.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-white transition-all shadow-md">
                    <Play className="h-4 w-4" />
                  </a>
                )}
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-white transition-all shadow-md">
                    <Camera className="h-4 w-4" />
                  </a>
                )}
              </div>
              <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bb5a] transition-all hover:-translate-y-0.5 shadow-lg max-w-[180px]">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-xs text-primary-300/60 tracking-wide">
            {footerContent ? (lang === "so" ? footerContent.copyrightSo : footerContent.copyrightEn) : `© ${year} Miftaxul Quran Online. All rights reserved.`}
          </p>
          <div className="flex gap-4 items-center">
            <Link href="/teacher/login" className="text-xs text-primary-300/60 hover:text-gold-400 transition-colors">
              {t("Galitaanka Macallinka", "Teacher Login")}
            </Link>
          </div>
          <p className="text-xs text-primary-300/60 font-arabic tracking-wide" dir="rtl">
            مفتاح القرآن — {t("Furaha Qur'aanka", "The Key of the Quran")}
          </p>
        </div>
      </div>
    </footer>
  );
}
