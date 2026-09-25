'use client';
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const { lang, t } = useLanguage();
  const insights = useStore((state) => state.insights) || [];
  const insightsHeader = useStore((state) => state.insightsHeader);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Section */}
      <section className="bg-emerald-950 py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 12.5L45 15l-7.5 10 2.5 12.5-12.5-5-12.5 5 2.5-12.5-7.5-10 12.5-2.5L30 0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-gold-500/20 text-gold-400 text-sm font-bold tracking-wide mb-6">
            {t("Ogaal", "Insights")}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {insightsHeader ? (lang === "so" ? insightsHeader.titleSo : insightsHeader.titleEn) : t("Maqaallo & Warar", "Blog & News")}
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            {insightsHeader ? (lang === "so" ? insightsHeader.subtitleSo : insightsHeader.subtitleEn) : t(
              "La soco wararkii ugu dambeeyay iyo maqaallo faa'iido leh oo ku saabsan barashada Qur'aanka.", 
              "Stay updated with our latest news and beneficial articles about Quran learning."
            )}
          </p>
        </motion.div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {insights.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insights.map((post, i) => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={post.image || "https://images.unsplash.com/photo-1609599006353-e629aaab31ce?q=80&w=1000&auto=format&fit=crop"} 
                      alt={lang === "so" ? post.titleSo : post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {lang === "so" ? post.categorySo : post.categoryEn}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-gold-500 mb-3">{post.date}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {lang === "so" ? post.titleSo : post.titleEn}
                    </h3>
                    <div 
                      className="text-gray-600 line-clamp-3 mb-6 flex-1 text-base leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: lang === "so" ? post.contentSo : post.contentEn }} 
                    />
                    <Link href="#" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900 transition-colors mt-auto">
                      {t("Sii Akhri", "Read More")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t("Wali wax maqaal ah lama soo galin", "No articles posted yet")}
              </h3>
              <p className="text-gray-500">
                {t("Fadlan dib u soo noqo dhawaan.", "Please check back soon.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
