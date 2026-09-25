import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Miftaxul Quran Online — Ku baro Qur'aanka",
    template: "%s | Miftaxul Quran Online",
  },
  description:
    "Miftaxul Quran Online — Barashada Qur'aanka, Tajwiidka, iyo Luqadda Carabiga iyada oo macalimiin Ijazah haysta. Learn Quran online with certified teachers.",
  keywords: ["quran online", "tajweed", "arabic", "somali quran school", "miftaxul quran"],
  openGraph: {
    siteName: "Miftaxul Quran Online",
    locale: "so_SO",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="so" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <AuthProvider>
          <FirebaseAnalytics />
          <LanguageProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <FloatingWhatsApp />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
