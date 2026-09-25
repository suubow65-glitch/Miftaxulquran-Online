"use client";
import { useState } from "react";
import { Search, Download, BookOpen, Eye, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";

type Category = "all" | "quran" | "tajweed" | "arabic" | "islamic" | "seerah";

interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  sizeMB: number;
  pagesSo: string;
  pagesEn: string;
  downloadUrl: string;
  color: string;
  emoji: string;
}

const books: Book[] = [
  { id: "1", title: "Nooraniyya Qaaidah", author: "Sh. Nooraniy", category: "quran", sizeMB: 2.4, pagesSo: "64 bog", pagesEn: "64 pages", downloadUrl: "#", color: "#27AE60", emoji: "📖" },
  { id: "2", title: "Tajweed Rules — Al-Jazariyyah", author: "Ibn al-Jazari", category: "tajweed", sizeMB: 3.8, pagesSo: "128 bog", pagesEn: "128 pages", downloadUrl: "#", color: "#F0AE20", emoji: "📜" },
  { id: "3", title: "Madinah Arabic Book 1", author: "Dr. V. Abdur Rahim", category: "arabic", sizeMB: 12.1, pagesSo: "320 bog", pagesEn: "320 pages", downloadUrl: "#", color: "#1A8049", emoji: "🔤" },
  { id: "4", title: "Madinah Arabic Book 2", author: "Dr. V. Abdur Rahim", category: "arabic", sizeMB: 14.3, pagesSo: "350 bog", pagesEn: "350 pages", downloadUrl: "#", color: "#1A8049", emoji: "🔤" },
  { id: "5", title: "Ar-Raheeq Al-Makhtoom (Seerah)", author: "Sh. Mubarakpuri", category: "seerah", sizeMB: 8.7, pagesSo: "450 bog", pagesEn: "450 pages", downloadUrl: "#", color: "#D4920F", emoji: "🌙" },
  { id: "6", title: "Riyad as-Salihin", author: "Imam al-Nawawi", category: "islamic", sizeMB: 6.2, pagesSo: "280 bog", pagesEn: "280 pages", downloadUrl: "#", color: "#0D5C2E", emoji: "📚" },
  { id: "7", title: "Usool at-Tajweed", author: "Miftaxul Quran Staff", category: "tajweed", sizeMB: 1.9, pagesSo: "48 bog", pagesEn: "48 pages", downloadUrl: "#", color: "#F0AE20", emoji: "🎵" },
  { id: "8", title: "Aqeedah al-Wasitiyyah", author: "Ibn Taymiyyah", category: "islamic", sizeMB: 4.5, pagesSo: "120 bog", pagesEn: "120 pages", downloadUrl: "#", color: "#083D1F", emoji: "⭐" },
  { id: "9", title: "Arabic Grammar for Beginners", author: "Miftaxul Quran Staff", category: "arabic", sizeMB: 5.1, pagesSo: "180 bog", pagesEn: "180 pages", downloadUrl: "#", color: "#1A8049", emoji: "📝" },
];

const catTabs: { key: Category; so: string; en: string }[] = [
  { key: "all", so: "Dhammaan", en: "All Books" },
  { key: "quran", so: "Qur'aan", en: "Quran" },
  { key: "tajweed", so: "Tacwiid", en: "Tajweed" },
  { key: "arabic", so: "Carabiga", en: "Arabic" },
  { key: "islamic", so: "Diinta", en: "Islamic" },
  { key: "seerah", so: "Seerada", en: "Seerah" },
];

export default function LibraryPage() {
  const { t, lang } = useLanguage();
  const libraryPageContent = useStore(state => state.libraryPageContent);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = books.filter((b) => {
    const matchCat = category === "all" || b.category === category;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(150deg,#1A8049 0%,#0D5C2E 60%,#083D1F 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-200 mb-6">
            <Sparkles className="h-4 w-4 text-gold-300" />
            {lang === "so" ? libraryPageContent?.heroBadgeSo : libraryPageContent?.heroBadgeEn}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            {(() => {
              const titleStr = lang === "so" ? (libraryPageContent?.heroTitleSo || "") : (libraryPageContent?.heroTitleEn || "");
              const words = titleStr.split(" ");
              const lastWord = words.pop();
              return (
                <>
                  {words.join(" ")} {lastWord && <span className="text-gradient-gold">{lastWord}</span>}
                </>
              );
            })()}
          </h1>
          <p className="text-primary-100/80 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {lang === "so" ? libraryPageContent?.heroSubtitleSo : libraryPageContent?.heroSubtitleEn}
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "so" ? libraryPageContent?.searchPlaceholderSo : libraryPageContent?.searchPlaceholderEn}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm font-medium"
            />
          </div>
        </div>
        <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full block" preserveAspectRatio="none">
          <path fill="#f8fdf9" d="M0,20L720,40L1440,20L1440,40L0,40Z" />
        </svg>
      </section>

      {/* Content */}
      <section className="py-16 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {catTabs.map((tab) => (
              <button key={tab.key} onClick={() => setCategory(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${category === tab.key ? "text-primary-950 shadow-lg" : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40"}`}
                style={category === tab.key ? { background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" } : {}}>
                {lang === "so" ? tab.so : tab.en}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 text-center mb-8 font-medium">
            {filtered.length} {t("buug la helay", "books found")}
          </p>

          {/* Book grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 mx-auto text-primary-200 mb-4" />
              <p className="text-gray-500 font-medium">{t("Buug lama helin.", "No books found.")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((book) => (
                <div key={book.id} className="group rounded-2xl border border-primary-100 bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Book visual */}
                  <div className="h-36 rounded-xl flex items-center justify-center text-6xl mb-5 flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${book.color}20,${book.color}40)`, border: `1px solid ${book.color}30` }}>
                    {book.emoji}
                  </div>

                  <div className="flex-1">
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 text-white"
                      style={{ background: book.color }}>{book.category}</div>
                    <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                    <div className="flex gap-3 text-xs text-gray-400 font-medium">
                      <span>{lang === "so" ? book.pagesSo : book.pagesEn}</span>
                      <span>•</span>
                      <span>{book.sizeMB} MB PDF</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-primary-50 flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      {t("Eeg", "Preview")}
                    </button>
                    <button onClick={() => handleDownload(book.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-950 transition-all hover:-translate-y-0.5 shadow-lg"
                      style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
                      {downloading === book.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Download className="h-4 w-4" />}
                      {t("Dajiso", "Download")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note about adding more */}
          <div className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-white/60 p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto text-primary-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              {t("Buugaag badan ayaa la soo dari doonaa. Wixii macluumaad dheeraad ah nagala soo xiriir.",
                 "More books will be added regularly. Contact us for additional resources.")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
