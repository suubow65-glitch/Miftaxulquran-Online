"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, CheckCircle2, BookOpen, ScrollText, Languages, GraduationCap,
  Clock, Users, Globe, Shield, Award, Heart, Star, Sparkles, PlayCircle,
  MessageCircle, ChevronDown, Phone, Volume2, VolumeX, ChevronLeft, ChevronRight,
  ListMusic, X,
} from "lucide-react";
import * as Icons from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";
import { 
  initialHeroSlides, initialHero, initialChallengesContent, initialFeaturesContent, 
  initialStepsContent, initialStatsContent, initialStats, initialSettings,
  initialTestimonials
} from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────── Helpers ─────────────── */
function GoldBtn({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-xl font-bold text-primary-950 transition-all hover:-translate-y-0.5 hover:shadow-xl ${className}`}
      style={{ background: "linear-gradient(135deg,#F5C84A 0%,#F0AE20 55%,#D4920F 100%)", boxShadow: "0 6px 24px rgba(240,174,32,0.4)" }}>
      {children}
    </Link>
  );
}

/* ─────────────── Home Page ─────────────── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <CoursesPreviewSection />
      <IjazahSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <StatsSection />
      <NewsSection />
      <TestimonialsSection />
      <FaqSection />
      <PricingSection />
      <CtaBannerSection />
    </>
  );
}

/* ═══════════════════════════════════════
   1. HERO
═══════════════════════════════════════ */
function HeroSection() {
  const { t, lang } = useLanguage();
  const hero = useStore(state => state.hero) || initialHero;
  const settings = useStore(state => state.settings) || initialSettings;
  const tracks = useStore(state => state.tracks) || [];
  const heroSlides = useStore(state => state.heroSlides) || initialHeroSlides;
  const hasInteractedAudio = useStore(state => state.hasInteractedAudio);
  const setHasInteractedAudio = useStore(state => state.setHasInteractedAudio);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const activeTracks = tracks.filter(t => t.isActive);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = activeTracks[currentTrackIndex];
  const currentTrackUrl = currentTrack?.audioDataUrl || "";
  const currentTrackName = currentTrack?.title || "Quran Recitation";
  const currentReciterName = currentTrack?.reciter || "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use store slides or fall back to defaults if store is empty
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : initialHeroSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    // Only set volume on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Watch for track changes (playlist progressing or manual selection)
  useEffect(() => {
    if (audioRef.current && currentTrackUrl) {
      console.log('Audio source updated:', currentTrackUrl.substring(0, 60) + (currentTrackUrl.length > 60 ? '...' : ''));
      
      // Force the audio element to load the new URL
      audioRef.current.load();
      
      if (hasStarted && isPlaying) {
        const timer = setTimeout(() => {
          audioRef.current?.play().catch((e) => {
            console.error("Play failed:", e);
            setIsPlaying(false);
          });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTrackUrl, hasStarted]); // Removed isPlaying from dependencies to avoid loop reloading

  const toggleAudio = () => {
    if (!audioRef.current || !currentTrackUrl) return;

    if (!hasInteractedAudio) {
      setHasInteractedAudio(true);
    }

    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      setHasStarted(true);
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      audioRef.current.muted = false;
      setIsMuted(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTrackEnd = () => {
    if (activeTracks.length > 1) {
      setCurrentTrackIndex(prev => (prev + 1) % activeTracks.length);
    } else {
      // Loop the single track manually if needed, or let standard loop handle it
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  if (!mounted) return null;

  return (
    <section id="top" className="relative overflow-hidden"
      style={{ background: "linear-gradient(150deg,#27AE60 0%,#1A8049 55%,#0D5C2E 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: "#F0AE20" }} />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full opacity-15 blur-3xl" style={{ background: "#F5C84A" }} />
      </div>
      {/* Islamic geometric 8-pointed star pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpolygon points='40,4 46,14 57,10 53,21 64,24 57,32 64,40 57,48 64,56 53,59 57,70 46,66 40,76 34,66 23,70 27,59 16,56 23,48 16,40 23,32 16,24 27,21 23,10 34,14' fill='none' stroke='%23ffffff' stroke-width='1.2'/%3E%3Cpolygon points='40,14 44.5,22.5 54,19 51,28.5 60,30 54.5,37.5 60,45 54,47 58.5,55.5 49,52 46,62 40,55 34,62 31,52 21.5,55.5 26,47 20,45 25.5,37.5 20,30 29,28.5 26,19 35.5,22.5' fill='%23ffffff' opacity='0.15'/%3E%3Ccircle cx='40' cy='40' r='5' fill='none' stroke='%23ffffff' stroke-width='0.8' opacity='0.5'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23ffffff' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-gold-200">
              <Sparkles className="h-4 w-4 text-gold-300" />
              {t("Macalimiin Ijazah haysta — Rag & Dumar", "Certified Ijazah Teachers — Male & Female")}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              {lang === "so" ? hero.headlineSo : hero.headlineEn}
            </h1>

            <p className="text-lg text-primary-100/80 leading-relaxed max-w-xl">
              {lang === "so" ? hero.subheadlineSo : hero.subheadlineEn}
            </p>

            {/* Features checklist */}
            <ul className="space-y-2.5">
              {[
                [t("Xifdinta Qur'aanka iyo Tajwiidka", "Quran Memorization & Tajweed")],
                [t("Koorso Carabiga ee Aasaasiga ah", "Foundation Arabic Language Course")],
                [t("Daraasadaha Diinta Islaamka", "Islamic Studies")],
              ]?.map(([item]) => (
                <li key={item as string} className="flex items-center gap-2.5 text-primary-100/90 font-medium text-sm">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-gold-400" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Language badges */}
            <div>
              <p className="text-xs font-bold text-primary-300/70 uppercase tracking-widest mb-3">
                {t("Luqadaha waxbarashada", "Teaching Languages")}
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Somali 🇸🇴", "English 🇬🇧", "عربي 🌙"]?.map((b) => (
                  <span key={b} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20">{b}</span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <GoldBtn href="/courses" className="px-7 py-4 text-base flex-1 sm:flex-none justify-center">
                {lang === "so" ? hero.ctaTextSo : hero.ctaTextEn}
                <ArrowRight className="h-5 w-5" />
              </GoldBtn>
              <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#25D366] hover:bg-[#20bb5a] shadow-lg transition-all hover:-translate-y-0.5 flex-1 sm:flex-none">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>

            <div className="pt-1">
              <Link href="/track" className="inline-flex items-center justify-start gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-100 transition-colors group">
                <span className="border-b border-gold-300/30 group-hover:border-gold-100">
                  {t("Ma tahay arday hore? Halkan kala soco horumarkaaga", "Already a student? Track your progress here")}
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["A","M","R","S","F"]?.map((l, i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-primary-700 flex items-center justify-center text-xs font-bold text-gold-300"
                    style={{ background: `linear-gradient(135deg,#1A8049,#0D5C2E)` }}>{l}</div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white">2,000+ {t("Arday", "Students")}</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5]?.map(i => <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />)}
                  <span className="ml-1 text-xs text-primary-200/70">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium Interactive Card */}
          <div className="relative">
            {/* Outer ambient glow */}
            <div className="absolute -inset-6 rounded-[3rem] blur-3xl opacity-60"
              style={{ background: "radial-gradient(ellipse,rgba(240,174,32,0.25) 0%,rgba(26,128,73,0.15) 60%,transparent 100%)" }} />

            {/* Card shell */}
            <div className="relative rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(40px) saturate(180%)", aspectRatio: "4/5", display: "flex", flexDirection: "column" }}>

              <audio ref={audioRef} src={currentTrackUrl} onEnded={handleTrackEnd} playsInline />

              {/* ── Slide Images (absolute, fade transition) ── */}
              {slides?.map((slide, idx) => (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt="Slide"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: currentImageIndex === idx ? 1 : 0,
                    transition: "opacity 1.5s cubic-bezier(0.4,0,0.2,1)",
                    zIndex: 0,
                  }}
                />
              ))}

              {/* ── Cinematic gradient ── */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#042211]/95 via-[#0D5C2E]/40 to-transparent" />

              {/* ── Top shimmer line ── */}
              <div className="absolute top-0 left-0 right-0 h-px z-20"
                style={{ background: "linear-gradient(90deg,transparent,rgba(245,200,74,0.5),transparent)" }} />

              {/* ── Slide text: Bottom Section (Hadith/Description) ── */}
              {(() => {
                const activeSlide = slides[currentImageIndex];
                if (!activeSlide || (!activeSlide.hadithAr && !activeSlide.hadithSo && !activeSlide.hadithEn)) return null;
                return (
                  <div className="absolute z-20 bottom-24 left-0 right-0 pointer-events-none px-8 flex flex-col items-center text-center">
                    {activeSlide.hadithAr && (
                      <p className="text-xl sm:text-2xl font-black font-arabic text-gold-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-0.5 leading-tight">
                        {activeSlide.hadithAr}
                      </p>
                    )}
                    {(activeSlide.hadithSo || activeSlide.hadithEn) && (
                      <p className="text-[14px] sm:text-base font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-snug">
                        {lang === "so" ? (activeSlide.hadithSo || activeSlide.hadithEn) : (activeSlide.hadithEn || activeSlide.hadithSo)}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* ── Navigation Arrows ── */}
              <div className="absolute inset-y-0 left-3 z-20 flex items-center pointer-events-none">
                <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + slides.length) % slides.length)}
                  className="p-2 rounded-full bg-primary-900/40 hover:bg-primary-800/60 backdrop-blur-sm transition-all hover:scale-110 shadow-[0_0_15px_rgba(26,128,73,0.3)] group pointer-events-auto">
                  <ChevronLeft className="h-7 w-7 text-gold-400 group-hover:text-gold-300" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 z-20 flex items-center pointer-events-none">
                <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % slides.length)}
                  className="p-2 rounded-full bg-primary-900/40 hover:bg-primary-800/60 backdrop-blur-sm transition-all hover:scale-110 shadow-[0_0_15px_rgba(26,128,73,0.3)] group pointer-events-auto">
                  <ChevronRight className="h-7 w-7 text-gold-400 group-hover:text-gold-300" />
                </button>
              </div>

              {/* ── Unmute prompt (Center Pulse Button) ── */}
              {(!hasStarted || isMuted) && currentTrackUrl && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0D5C2E]/40 backdrop-blur-md">
                  <button
                    onClick={toggleAudio}
                    className="flex flex-col items-center gap-1.5 px-8 py-6 rounded-3xl font-black text-sm text-primary-950 transition-all hover:scale-105 active:scale-95 animate-pulse"
                    style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 0 40px rgba(240,174,32,0.6), 0 0 0 8px rgba(245,200,74,0.2)" }}
                  >
                    <Volume2 className="h-8 w-8 mb-1" />
                    <span className="text-lg">{t("Maqal Qur'aanka", "Listen to Quran")}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-80">(Click to Play)</span>
                  </button>
                </div>
              )}


              {/* ── Control Bar ── */}
              <div
                className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 gap-3"
                style={{
                  background: "rgba(5,30,15,0.55)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "0 0 1.85rem 1.85rem",
                }}
              >
                {/* Playlist Popup */}
                {showPlaylist && activeTracks.length > 0 && (
                  <div className="absolute bottom-[80px] left-4 w-64 bg-primary-950/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-2 z-50">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{lang === "so" ? "Bedel Suuradda" : "Select Track"}</span>
                      <button onClick={() => setShowPlaylist(false)}>
                        <X className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {activeTracks?.map((track, i) => (
                        <button
                          key={track.id}
                          onClick={() => {
                            setCurrentTrackIndex(i);
                            setShowPlaylist(false);
                            setHasStarted(true);
                            if (!isPlaying) setIsPlaying(true);
                            if (!hasInteractedAudio) setHasInteractedAudio(true);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm flex flex-col transition-colors ${i === currentTrackIndex ? "bg-gold-500/20 border border-gold-500/30" : "hover:bg-white/5"}`}
                        >
                          <span className={`font-bold ${i === currentTrackIndex ? "text-gold-400" : "text-white"} truncate`}>{track.title}</span>
                          <span className="text-[10px] text-gray-400 truncate">{track.reciter}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Left: LIVE badge & Playlist Toggle */}
                <div className="flex items-center gap-2 min-w-[80px]">
                  <button onClick={() => setShowPlaylist(!showPlaylist)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10" title={lang === "so" ? "Bedel Suuradda" : "Select Track"}>
                    <ListMusic className="h-4 w-4 text-gold-300" />
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.35)" }}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-200">LIVE</span>
                  </div>
                </div>

                {/* Center: Large Play/Pause */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    {/* Pulse ring */}
                    {isPlaying && !isMuted && (
                      <span className="absolute -inset-1 rounded-full animate-[pulseRing_2s_ease-out_infinite]"
                        style={{ background: "rgba(245,200,74,0.3)" }} />
                    )}
                    <button
                      onClick={toggleAudio}
                      className="relative flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                      style={{
                        width: 52, height: 52,
                        background: (isPlaying && !isMuted)
                          ? "linear-gradient(135deg,#F5C84A 0%,#F0AE20 55%,#D4920F 100%)"
                          : "rgba(245,200,74,0.15)",
                        border: "2px solid rgba(245,200,74,0.6)",
                        boxShadow: (isPlaying && !isMuted)
                          ? "0 0 20px rgba(240,174,32,0.6), 0 4px 16px rgba(0,0,0,0.4)"
                          : "0 0 12px rgba(240,174,32,0.2), 0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {isPlaying && !isMuted ? (
                        /* Pause icon — two bars */
                        <span className="flex gap-[3px]">
                          <span className="block w-[3px] h-4 rounded-full" style={{ background: "#083D1F" }} />
                          <span className="block w-[3px] h-4 rounded-full" style={{ background: "#083D1F" }} />
                        </span>
                      ) : (
                        /* Play triangle */
                        <PlayCircle className="h-6 w-6" style={{ color: isPlaying ? "#083D1F" : "#F5C84A" }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Reciter Name & Visualizer */}
                <div className="flex items-center justify-end min-w-[80px] max-w-[140px] gap-2">
                  {(isPlaying && !isMuted) && (
                    <div className="flex items-end gap-[2px] h-3">
                      <span className="w-0.5 bg-gold-400 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                      <span className="w-0.5 bg-gold-400 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-gold-400 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gold-300 truncate text-right drop-shadow-md max-w-[120px]">
                      {currentTrackName}
                    </span>
                    {currentReciterName && (
                      <span className="text-[10px] font-medium text-gold-400/80 truncate text-right drop-shadow-md max-w-[120px]">
                        {currentReciterName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0%, 100% { transform: scaleY(0.15); }
          50%       { transform: scaleY(1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}} />

      {/* Wave divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
          <path fill="#ffffff" d="M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,21.3C672,21,768,43,864,48C960,53,1056,43,1152,37.3C1248,32,1344,32,1392,32L1440,32L1440,60L0,60Z" />
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   2. PAIN POINTS
═══════════════════════════════════════ */
function PainPointsSection() {
  const { t, lang } = useLanguage();
  const challengesContent = useStore(s => s.challengesContent) || initialChallengesContent;

  if (!challengesContent || !challengesContent.cards) return null;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary mb-5">
            <span>🤔</span>
            {lang === "so" ? challengesContent.badgeTextSo : challengesContent.badgeTextEn}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
            {lang === "so" ? challengesContent.mainTitleSo : challengesContent.mainTitleEn}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {challengesContent.cards?.map((p) => (
            <div key={p.id} className="group rounded-2xl border border-primary-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl bg-primary-50 border border-primary-100 group-hover:scale-110 transition-transform overflow-hidden">
                  {p.icon.startsWith('data:') || p.icon.startsWith('http') ? <img src={p.icon} alt="" className="w-full h-full object-cover" /> : p.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5">{lang === "so" ? p.titleSo : p.titleEn}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{lang === "so" ? p.descSo : p.descEn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solution banner */}
        <div className="rounded-3xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-6 border border-primary-100"
          style={{ background: "linear-gradient(135deg,#edfbf3,#d0f5e2)" }}>
          <div className="h-20 w-20 rounded-full flex-shrink-0 flex items-center justify-center text-4xl shadow-inner bg-white border border-primary-200">
            🔑
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-primary-900 mb-2">
              {lang === "so" ? challengesContent.bannerTitleSo : challengesContent.bannerTitleEn}
            </h3>
            <p className="text-sm text-primary-800/80 leading-relaxed">
              {lang === "so" ? challengesContent.bannerDescSo : challengesContent.bannerDescEn}
            </p>
          </div>
          <GoldBtn href="/about" className="px-6 py-3 text-sm flex-shrink-0">
            {lang === "so" ? challengesContent.buttonTextSo : challengesContent.buttonTextEn}
            <ArrowRight className="h-4 w-4" />
          </GoldBtn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   3. COURSES PREVIEW
═══════════════════════════════════════ */
function CoursesPreviewSection() {
  const { t } = useLanguage();
  return (
    <section id="courses" className="py-12 lg:py-16 bg-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F0AE20]/40 bg-white px-4 py-1.5 text-sm font-semibold text-primary mb-4 shadow-[0_0_15px_rgba(39,174,96,0.3)]">
              <Award className="h-4 w-4 text-gold-500" />
              {t("Barnaamijyadayada", "Our Programs")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-primary-950">
              {t("Maxaa lagu bartaa ", "What do you learn at ")}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C84A] via-[#F0AE20] to-[#D4920F] drop-shadow-sm font-black">Miftaxul Quran?</span>
            </h2>
          </div>
          <Link href="/courses" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-800 transition-colors border-b-2 border-[#F0AE20] pb-0.5">
            {t("Eeg Dhammaan", "View All")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4">
          <CoursesList />
        </div>
        <div className="text-center mt-10 sm:hidden">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            {t("Eeg Dhammaan Koorsooyinka", "View All Courses")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   4. WHY CHOOSE US
═══════════════════════════════════════ */
function WhyChooseUsSection() {
  const { t, lang } = useLanguage();
  const featuresContent = useStore(state => state.featuresContent) || initialFeaturesContent;

  if (!featuresContent) return null;

  return (
    <section id="why-us" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/50 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 mb-5">
            <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
            {t("Sababta Noo Dooranayso", "Why Choose Us")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
            {lang === "so" ? featuresContent.mainHeadingSo : featuresContent.mainHeadingEn}
          </h2>
          <p className="mt-5 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {lang === "so" ? featuresContent.subHeadingSo : featuresContent.subHeadingEn}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuresContent.features?.map(({ id, iconName, titleSo, titleEn, descSo, descEn }) => {
            const Icon = (Icons as any)[iconName || "Star"] || Icons.Star;
            return (
            <div key={id} className="group rounded-2xl border border-primary-100 bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="h-13 w-13 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                <Icon className="h-6 w-6" style={{ color: "#F5C84A" }} />
              </div>
              <h3 className="font-bold text-gray-900 text-base leading-snug">{lang === "so" ? titleSo : titleEn}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{lang === "so" ? descSo : descEn}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   5. HOW IT WORKS
═══════════════════════════════════════ */
function HowItWorksSection() {
  const { lang } = useLanguage();
  const stepsContent = useStore(state => state.stepsContent) || initialStepsContent;

  if (!stepsContent) return null;

  return (
    <section className="py-20 lg:py-24 bg-primary-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            {lang === "so" ? stepsContent.mainTitleSo : stepsContent.mainTitleEn}
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: "#F0AE20" }} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-primary-100 p-8 sm:p-12">
          {/* Step indicators */}
          <div className="flex items-center justify-between relative mb-10">
            <div className="absolute left-[16.5%] right-[16.5%] top-4 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg,#27AE60,#F0AE20)" }} />
            {stepsContent.steps?.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center relative z-10" style={{ width: "33%" }}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg"
                  style={{ background: idx === 2 ? "linear-gradient(135deg,#F5C84A,#D4920F)" : "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                  {idx + 1}
                </div>
                <div className="h-6 w-px border-l-2 border-dashed border-gray-300 mt-1" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stepsContent.steps?.map((s) => {
              const Icon = (Icons as any)[s.iconName || "Star"] || Icons.Star;
              return (
                <div key={s.id} className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-md mb-3"
                    style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#F5C84A" }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 leading-tight">{lang === "so" ? s.titleSo : s.titleEn}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{lang === "so" ? s.descSo : s.descEn}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <GoldBtn href="/courses" className="px-8 py-4 text-base">
              {lang === "so" ? stepsContent.ctaButtonTextSo : stepsContent.ctaButtonTextEn}
              <ArrowRight className="h-5 w-5" />
            </GoldBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   6. STATISTICS
═══════════════════════════════════════ */
function StatsSection() {
  const { lang } = useLanguage();
  const statsContent = useStore(state => state.statsContent) || initialStatsContent;

  if (!statsContent) return null;

  return (
    <section className="py-20 lg:py-24" style={{ background: "linear-gradient(135deg,#1A8049,#0D5C2E)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {lang === "so" ? statsContent.mainTitleSo : statsContent.mainTitleEn}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {statsContent.stats?.map((stat) => {
            const Icon = (Icons as any)[stat.iconName || "Star"] || Icons.Star;
            return (
              <div key={stat.id} className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-5 text-center hover:bg-white/20 transition-all">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg,#F5C84A,#D4920F)" }}>
                  <Icon className="h-5 w-5 text-primary-950" />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-bold mt-1" style={{ color: "#F5C84A" }}>{lang === "so" ? stat.labelSo : stat.labelEn}</p>
                <p className="text-[10px] text-primary-200/60 mt-0.5">{lang === "so" ? stat.subLabelSo : stat.subLabelEn}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   7. TESTIMONIALS
═══════════════════════════════════════ */
function TestimonialsSection() {
  const { lang, t } = useLanguage();
  const testimonials = useStore(state => state.testimonials) || initialTestimonials;
  const submitTestimonial = useStore(state => state.submitTestimonial);
  
  const reviews = testimonials.filter(t => t.isApproved);

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, content: "", image: "" });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTestimonial(form);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
      setForm({ name: "", location: "", rating: 5, content: "", image: "" });
    }, 4000);
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 mb-5">
            <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
            {t("Wixii Ardaydu Yidhaahdeen", "What Students Say")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            {t("Codadka ", "Voices of our ")}<span style={{ color: "#27AE60" }}>{t("ardaydayada", "students")}</span>
          </h2>
        </div>
        
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {reviews?.map((r, i) => {
              // Parse bilingual seeded content (Somali | English) if it exists
              let displayContent = r.content;
              if (r.content.includes(" | ")) {
                const parts = r.content.split(" | ");
                displayContent = lang === "so" ? parts[0] : (parts[1] || parts[0]);
              }

              return (
                <div key={r.id || i} className="rounded-3xl border border-primary-100 bg-primary-50/30 p-7 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(r.rating)]?.map((_, j) => <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" />)}
                    {[...Array(5 - r.rating)]?.map((_, j) => <Star key={j} className="h-4 w-4 text-gray-300" />)}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-6 flex-1">&ldquo;{displayContent}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-primary-100">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                        {r.name[0]?.toUpperCase() || "S"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("Wali lama soo gudbin wax ra'yi ah.", "No reviews submitted yet.")}</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-950 text-base shadow-md hover:-translate-y-1 transition-all"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
            <MessageCircle className="h-5 w-5" />
            {t("Sii ra'yigaaga", "Write a Review")}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="p-8">
              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 bg-primary-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{t("Mahadsanid!", "Thank You!")}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {t(
                      "Ra'yigaaga waa la helay, dib ayaa looga eegayaa maamulka ka hor intaan la soo saarin.",
                      "Your review has been received and will be reviewed by admins before being published."
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-gray-900">{t("Sii ra'yigaaga", "Write a Review")}</h3>
                    <p className="text-sm text-gray-500 mt-2">{t("Nala wadaag khibradaada Miftaxul Quran Online.", "Share your experience with Miftaxul Quran Online.")}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Magaca", "Name")}</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Faadumo A." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Waddanka/Magaalada", "Location")}</label>
                      <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 🇸🇪 Sweden" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Qiimeynta", "Rating")}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5]?.map(star => (
                        <button key={star} type="button" onClick={() => setForm({...form, rating: star})} className="p-1 transition-transform hover:scale-110">
                          <Star className={`h-8 w-8 ${star <= form.rating ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Muxuu ahaa khibradaadu?", "What was your experience?")}</label>
                    <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder={t("Halkan ku qor ra'yigaaga...", "Write your review here...")}></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Sawirkaaga (Ikhtiyaari)", "Your Photo (Optional)")}</label>
                    <div className="flex items-center gap-4">
                      {form.image ? (
                        <img src={form.image} className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 border-dashed">
                          <Users className="h-5 w-5" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-all cursor-pointer" />
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white text-base shadow-lg hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                    <MessageCircle className="h-5 w-5" />
                    {t("Dir Ra'yiga", "Submit Review")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════
   8. FAQ
═══════════════════════════════════════ */
function FaqSection() {
  const { lang, t } = useLanguage();
  const faqContent = useStore(state => state.faqContent);
  const [open, setOpen] = useState<number | null>(null);

  if (!faqContent) return null;

  return (
    <section className="py-20 lg:py-24 bg-primary-50/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            {lang === "so" ? faqContent.mainHeadingSo : faqContent.mainHeadingEn}
          </h2>
        </div>
        <div className="space-y-3">
          {faqContent.faqs?.map((f, i) => (
            <div key={f.id} className="rounded-2xl border border-primary-100 bg-white overflow-hidden shadow-sm">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-gray-900 text-sm sm:text-base hover:text-primary transition-colors gap-4">
                <span>{lang === "so" ? f.questionSo : f.questionEn}</span>
                <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform text-primary ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-primary-50">
                  <p className="pt-4">{lang === "so" ? f.answerSo : f.answerEn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t("Weli su'aalo ma qabtaa?", "Still have questions?")}
            {" "}
            <Link href="/contact" className="font-bold text-primary hover:underline">
              {t("Nagala soo xiriir", "Contact us")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   9. CTA BANNER
═══════════════════════════════════════ */
function CtaBannerSection() {
  const { lang } = useLanguage();
  const bottomCTA = useStore(state => state.bottomCTA);
  const settings = useStore(state => state.settings);

  if (!bottomCTA) return null;

  return (
    <section className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#F5C84A 0%,#F0AE20 50%,#D4920F 100%)" }}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl" style={{ background: "#ffffff" }} />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-3xl" style={{ background: "#A97010" }} />
      </div>
      
      {/* Islamic pattern (Darker gold / subtle) */}
      <div className="absolute inset-0 opacity-[0.15]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23A97010' fill-opacity='1'%3E%3Cpolygon points='40,4 46,14 57,10 53,21 64,24 57,32 64,40 57,48 64,56 53,59 57,70 46,66 40,76 34,66 23,70 27,59 16,56 23,48 16,40 23,32 16,24 27,21 23,10 34,14' fill='none' stroke='%23A97010' stroke-width='1.2'/%3E%3Cpolygon points='40,14 44.5,22.5 54,19 51,28.5 60,30 54.5,37.5 60,45 54,47 58.5,55.5 49,52 46,62 40,55 34,62 31,52 21.5,55.5 26,47 20,45 25.5,37.5 20,30 29,28.5 26,19 35.5,22.5' fill='%23A97010' opacity='0.15'/%3E%3Ccircle cx='40' cy='40' r='5' fill='none' stroke='%23A97010' stroke-width='0.8' opacity='0.5'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23A97010' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-900/20 bg-white/30 backdrop-blur-sm px-5 py-2 text-sm font-bold text-primary-950 mb-8 shadow-sm">
          <Sparkles className="h-4 w-4" />
          {lang === "so" ? bottomCTA.badgeSo : bottomCTA.badgeEn}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary-950 leading-tight mb-6 drop-shadow-sm">
          {lang === "so" ? bottomCTA.titleSo : bottomCTA.titleEn}
        </h2>
        <p className="text-primary-950/80 font-medium text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {lang === "so" ? bottomCTA.descriptionSo : bottomCTA.descriptionEn}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white shadow-[0_8px_24px_rgba(4,34,17,0.3)] hover:-translate-y-1 transition-transform"
            style={{ background: "linear-gradient(135deg,#27AE60 0%,#0D5C2E 100%)" }}>
            {lang === "so" ? bottomCTA.primaryButtonTextSo : bottomCTA.primaryButtonTextEn}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a href={settings?.whatsapp || "https://wa.me/252619337904"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#25D366] hover:bg-[#20bb5a] shadow-[0_8px_24px_rgba(37,211,102,0.3)] transition-transform hover:-translate-y-1">
            <MessageCircle className="h-5 w-5" />
            {lang === "so" ? bottomCTA.whatsappButtonTextSo : bottomCTA.whatsappButtonTextEn}
          </a>
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-primary-950 border-2 border-primary-900/20 hover:bg-white/40 transition-colors shadow-sm">
            <Phone className="h-5 w-5" />
            {lang === "so" ? bottomCTA.contactButtonTextSo : bottomCTA.contactButtonTextEn}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   10. PRICING SECTION
═══════════════════════════════════════ */
function PricingSection() {
  const { lang, t } = useLanguage();
  const pricingContent = useStore(state => state.pricingContent);

  if (!pricingContent) return null;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            {lang === "so" ? pricingContent.mainTitleSo : pricingContent.mainTitleEn}
          </h2>
          <p className="text-lg text-gray-600">
            {lang === "so" ? pricingContent.subtitleSo : pricingContent.subtitleEn}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {pricingContent.plans?.map((plan, index) => {
            const isPopular = plan.isPopular;
            
            let cardStyle = "";
            let checkIconStyle = "";
            let buttonStyle = "";
            let titleStyle = "";

            if (isPopular) {
              cardStyle = "bg-gradient-to-b from-[#27AE60] to-[#0D5C2E] text-white shadow-[0_20px_50px_rgba(39,174,96,0.3)] scale-105 border border-[#F0AE20]/50 z-10";
              checkIconStyle = "text-[#F5C84A]";
              buttonStyle = "bg-gradient-to-r from-[#F5C84A] to-[#D4920F] text-white hover:shadow-lg hover:-translate-y-0.5";
              titleStyle = "text-2xl font-black text-[#F5C84A]";
            } else if (index === 0) {
              cardStyle = "bg-emerald-50/80 border border-emerald-200 text-gray-900 shadow-md hover:shadow-lg";
              checkIconStyle = "text-[#27AE60]";
              buttonStyle = "bg-white text-[#27AE60] border-2 border-emerald-200 hover:bg-[#27AE60] hover:text-white hover:border-transparent";
              titleStyle = "text-2xl font-black text-[#27AE60]";
            } else {
              cardStyle = "bg-amber-50/80 border border-[#F0AE20]/30 text-gray-900 shadow-md hover:shadow-lg";
              checkIconStyle = "text-[#D4920F]";
              buttonStyle = "bg-white text-[#D4920F] border-2 border-[#F0AE20]/30 hover:bg-[#F0AE20] hover:text-white hover:border-transparent";
              titleStyle = "text-2xl font-black text-[#D4920F]";
            }

            return (
              <div 
                key={plan.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${cardStyle}`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#F5C84A] to-[#D4920F] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 shadow-sm">
                    {t("Ugu Caan San", "Most Popular")}
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className={`mb-2 ${titleStyle}`}>
                    {lang === "so" ? plan.nameSo : plan.nameEn}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6 border-b pb-6 border-opacity-20 border-current">
                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                    <span className={`text-sm font-medium ${isPopular ? "text-white/80" : "text-gray-500"}`}>
                      {lang === "so" ? plan.periodSo : plan.periodEn}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {(lang === "so" ? plan.featuresSo : plan.featuresEn)?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 shrink-0 ${checkIconStyle}`} />
                        <span className={`text-sm ${isPopular ? "text-white/90" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register" 
                    className={`block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all ${buttonStyle}`}>
                    {lang === "so" ? plan.buttonTextSo : plan.buttonTextEn}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IjazahSection() {
  const { lang } = useLanguage();
  const ijazahContent = useStore(state => state.ijazahContent);

  if (!ijazahContent) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-emerald-50/30">
      {/* Background Islamic Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 12.5L45 15l-7.5 10 2.5 12.5-12.5-5-12.5 5 2.5-12.5-7.5-10 12.5-2.5L30 0z' fill='%231A8049' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wide mb-4">
                {lang === "so" ? ijazahContent.subtitleSo : ijazahContent.subtitleEn}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-emerald-950 leading-tight">
                {lang === "so" ? ijazahContent.titleSo : ijazahContent.titleEn}
              </h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {lang === "so" ? ijazahContent.descriptionSo : ijazahContent.descriptionEn}
            </p>
            <div>
              <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-primary-950 font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                {lang === "so" ? "Is-diiwaangeli Hadda" : "Register Now"}
                <Icons.ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-gold-500/20 blur-3xl rounded-full" />
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-white/50 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={ijazahContent.certificateImage || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop"} 
                alt="Ijazah Certificate Mockup" 
                className="w-full h-auto rounded-2xl border border-gray-100"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gold-100 flex items-center justify-center">
                  <Icons.Award className="h-6 w-6 text-gold-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{lang === "so" ? "La Aqoonsan Yahay" : "Recognized"}</p>
                  <p className="text-sm text-gray-500">{lang === "so" ? "Heer Caalami" : "Globally"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const { lang, t } = useLanguage();
  const insights = useStore(state => state.insights) || [];
  
  if (insights.length === 0) return null;
  
  const latestInsights = insights.slice(0, 3);

  return (
    <section className="relative py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wide mb-4">
            {t("Waxyaabihii Ugu Dambeeyay", "Latest Updates")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-emerald-950 mb-4">
            {t("Ogaal", "Insights")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("La soco wararkii ugu dambeeyay iyo maqaallo faa'iido leh oo ku saabsan barashada Qur'aanka.", "Stay updated with our latest news and beneficial articles about Quran learning.")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {latestInsights?.map((post, i) => (
            <motion.div 
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                  {lang === "so" ? post.titleSo : post.titleEn}
                </h3>
                <div className="text-gray-600 line-clamp-3 mb-6 flex-1" dangerouslySetInnerHTML={{ __html: lang === "so" ? post.contentSo : post.contentEn }} />
                <Link href="#" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900 transition-colors">
                  {t("Sii Akhri", "Read More")}
                  <Icons.ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
