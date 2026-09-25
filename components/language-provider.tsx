"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "so" | "en";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (so: string, en: string) => string;
}

const LanguageContext = createContext<LangCtx>({
  lang: "so",
  setLang: () => {},
  t: (so) => so,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("so");

  useEffect(() => {
    const saved = localStorage.getItem("mq_lang") as Lang | null;
    if (saved === "so" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("mq_lang", l);
  };

  const t = (so: string, en: string) => (lang === "so" ? so : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
