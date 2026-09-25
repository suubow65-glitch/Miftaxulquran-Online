"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function PrayerTimesWidget() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Mogadishu&country=Somalia&method=3");
        const data = await res.json();
        if (data && data.data && data.data.timings) {
          setTimes({
            Fajr: data.data.timings.Fajr,
            Dhuhr: data.data.timings.Dhuhr,
            Asr: data.data.timings.Asr,
            Maghrib: data.data.timings.Maghrib,
            Isha: data.data.timings.Isha,
          });
        }
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      }
    }
    fetchTimes();
  }, []);

  if (!times) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-8 backdrop-blur-sm shadow-inner w-full max-w-sm">
      <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-gold-400" />
        {t("Waqtiyada Salaadda (Muqdisho)", "Prayer Times (Mogadishu)")}
      </h4>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
          <span className="text-primary-200/80">Fajr</span>
          <span className="font-semibold text-gold-300">{times.Fajr}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
          <span className="text-primary-200/80">Dhuhr</span>
          <span className="font-semibold text-gold-300">{times.Dhuhr}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
          <span className="text-primary-200/80">Asr</span>
          <span className="font-semibold text-gold-300">{times.Asr}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
          <span className="text-primary-200/80">Maghrib</span>
          <span className="font-semibold text-gold-300">{times.Maghrib}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-primary-200/80">Isha</span>
          <span className="font-semibold text-gold-300">{times.Isha}</span>
        </div>
      </div>
    </div>
  );
}
