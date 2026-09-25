"use client";

import { MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";

export function FloatingWhatsApp() {
  const settings = useStore((state) => state.settings);
  const whatsappNumber = settings?.whatsapp || "https://wa.me/252619337904";
  
  // Ensure it's a valid url
  const href = whatsappNumber.startsWith("http") ? whatsappNumber : `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-1 hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" style={{ animationDuration: '2.5s' }}></div>
      <MessageCircle className="h-8 w-8 relative z-10 transition-transform group-hover:scale-110" />
    </a>
  );
}
