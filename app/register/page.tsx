"use client";
import { useState } from "react";
import {
  User, Phone, Mail, MapPin, BookOpen, ScrollText, Languages, BookMarked,
  Send, CheckCircle2, Loader2, Sparkles, MessageCircle, Clock, ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useStore } from "@/lib/store";

interface RegForm {
  name: string;
  age: string;
  phone: string;
  email: string;
  course: string;
  level: string;
  schedule: string;
  message: string;
}

const EMPTY: RegForm = {
  name: "", age: "", phone: "", email: "",
  course: "", level: "", schedule: "", message: "",
};

const courseOptions = [
  { value: "quran",   so: "Xifdinta Qur'aanka (Hifz)",    en: "Quran Memorization (Hifz)" },
  { value: "tajweed", so: "Tacwiid & Qira'ad",             en: "Tajweed & Recitation" },
  { value: "arabic",  so: "Luqadda Carabiga",              en: "Arabic Language" },
  { value: "islamic", so: "Daraasadaha Diinta Islaamka",   en: "Islamic Studies" },
  { value: "mixed",   so: "Isku-dar (La xidhiidh)",        en: "Mixed (Let us advise)" },
];

const levelOptions = [
  { value: "beginner",      so: "Bilaawaha (Wax ma garanayso)", en: "Beginner (No experience)" },
  { value: "elementary",    so: "Hoose (Wax yar baan garanayaa)", en: "Elementary (Some basics)" },
  { value: "intermediate",  so: "Dhexe",                   en: "Intermediate" },
  { value: "advanced",      so: "Sare",                    en: "Advanced" },
];

const scheduleOptions = [
  { value: "morning",   so: "Subaxnimo (08:00–12:00)",   en: "Morning (08:00–12:00)" },
  { value: "afternoon", so: "Galabnimo (12:00–17:00)",   en: "Afternoon (12:00–17:00)" },
  { value: "evening",   so: "Galab dambe (17:00–22:00)", en: "Evening (17:00–22:00)" },
  { value: "flexible",  so: "Waqti kasta oo fudud",       en: "Flexible / Discuss later" },
];

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const addLead = useStore(state => state.addLead);
  
  const [form, setForm] = useState<RegForm>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof RegForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Add lead to Zustand store
      addLead({
        id: `lead-${Date.now()}`,
        ...form,
        status: "Pending",
        createdAt: new Date().toISOString()
      });
      
      // Simulate network request for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 focus:bg-white transition-all";

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(150deg,#1A8049 0%,#0D5C2E 55%,#083D1F 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#F0AE20" }} />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "#F5C84A" }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-200 mb-6">
            <Sparkles className="h-4 w-4 text-gold-300" />
            {t("Ku soo biir — Casharka 1aad bilaash ah", "Join us — First class is free")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            {t("Is-diiwaangeli — ", "Register & ")}<span className="text-gradient-gold">{t("Nagala Xiriir", "Contact Us")}</span>
          </h1>
          <p className="text-primary-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(
              "Buuxi foomka hoose si aad ugu biirto Miftaxul Quran Online. Macalin ayaa kula xiriiri doona 24 saacadood gudahood.",
              "Fill in the form below to join Miftaxul Quran Online. A teacher will contact you within 24 hours."
            )}
          </p>

          {/* Mini trust stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { emoji: "✅", so: "3 Cashar oo bilaash", en: "3 free trial classes" },
              { emoji: "🕒", so: "Waqti aad doortid", en: "Your chosen schedule" },
              { emoji: "🌍", so: "Meel kasta dunida", en: "Anywhere in the world" },
            ]?.map((s) => (
              <div key={s.en} className="flex items-center gap-1.5 text-sm font-semibold text-primary-100/90">
                <span>{s.emoji}</span>
                <span>{t(s.so, s.en)}</span>
              </div>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 1440 50" className="absolute bottom-0 w-full block" preserveAspectRatio="none">
          <path fill="#f8fdf9" d="M0,25L720,50L1440,25L1440,50L0,50Z" />
        </svg>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* ══ Section A: Registration Form ══ */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-primary-100 bg-white p-8 sm:p-10 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {t("Foomka Is-diiwaangelinta", "Registration Form")}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-8 ml-13">
                  {t("Macalin ayaa kula soo xiriiri doona oo kugu qaban doona tijaabo.", "A teacher will reach out to schedule your free trial.")}
                </p>

                {status === "sent" ? (
                  /* ── Success State ── */
                  <div className="text-center py-12">
                    <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
                      style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                      {t("Is-diiwaangelintii waa la helay!", "Registration received!")}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                      {t(
                        "Mahadsanid! Macalin ayaa kula soo xiriiri doona 24 saacadood gudahood si loo qabto tijaabadaada bilaashka ah.",
                        "Thank you! A teacher will contact you within 24 hours to arrange your free trial."
                      )}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                      <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#25D366] hover:bg-[#20bb5a] shadow-lg transition-all">
                        <MessageCircle className="h-4 w-4" />
                        {t("WhatsApp-na nala hadal", "Chat on WhatsApp")}
                      </a>
                      <button onClick={() => setStatus("idle")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-primary border border-primary/30 hover:bg-primary-50 transition-all">
                        {t("Kale diiwaangeli", "Register another")}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Form ── */
                  <form onSubmit={submit} className="space-y-5">
                    {/* Row 1: Name + Age */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Magacaaga oo buuxa", "Full Name")} *
                        </label>
                        <input
                          required value={form.name} onChange={set("name")}
                          placeholder={t("Magacaaga", "Your name")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Da'da", "Age")} *
                        </label>
                        <input
                          required value={form.age} onChange={set("age")} type="number"
                          min="4" max="99"
                          placeholder={t("Da'daada", "Your age")}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Telefoonka / WhatsApp", "Phone / WhatsApp")} *
                        </label>
                        <input
                          required value={form.phone} onChange={set("phone")}
                          placeholder="+252..."
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Email-ka (haddii jiro)", "Email (optional)")}
                        </label>
                        <input
                          type="email" value={form.email} onChange={set("email")}
                          placeholder="example@gmail.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Row 3: Course Interest */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        {t("Koorsaha Aad Rabto", "Course Interest")} *
                      </label>
                      <select required value={form.course} onChange={set("course")} className={inputClass}>
                        <option value="">{t("Dooro koorsaha...", "Select a course...")}</option>
                        {courseOptions?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {lang === "so" ? o.so : o.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Row 4: Level + Schedule */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Heerka Hadda", "Current Level")} *
                        </label>
                        <select required value={form.level} onChange={set("level")} className={inputClass}>
                          <option value="">{t("Dooro heerka...", "Select level...")}</option>
                          {levelOptions?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {lang === "so" ? o.so : o.en}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          {t("Wakhtiga Dhigashada", "Preferred Schedule")} *
                        </label>
                        <select required value={form.schedule} onChange={set("schedule")} className={inputClass}>
                          <option value="">{t("Dooro waqtiga...", "Select time...")}</option>
                          {scheduleOptions?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {lang === "so" ? o.so : o.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Message */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        {t("Su'aalo dheeraad ah (ikhtiyaari)", "Additional notes (optional)")}
                      </label>
                      <textarea
                        rows={3} value={form.message} onChange={set("message")}
                        placeholder={t(
                          "Noo sheeg wixii dheeraad ah oo aad rabto inaan garannno...",
                          "Tell us anything else we should know..."
                        )}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {t(
                          "Khalad yiri. WhatsApp noo dir ama mar kale isku day.",
                          "Something went wrong. Please try again or message us on WhatsApp."
                        )}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-base text-primary-950 disabled:opacity-70 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      style={{ background: "linear-gradient(135deg,#F5C84A 0%,#F0AE20 55%,#D4920F 100%)", boxShadow: "0 8px 28px rgba(240,174,32,0.45)" }}
                    >
                      {status === "sending" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      {status === "sending"
                        ? t("La dirayaa...", "Submitting...")
                        : t("Diiwaangeli — Bilaash", "Register — Free Trial")}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      {t("Ama nala hadal toos:", "Or reach us directly:")}
                      {" "}
                      <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                        className="font-bold text-[#25D366] hover:underline">WhatsApp</a>
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* ══ Section B + C: Contact Info + Map ══ */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* ── Section B: Contact Details ── */}
              <div className="rounded-3xl border border-primary-100 bg-white p-7 shadow-lg">
                <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {t("Xiriirka Degdegga", "Quick Contact")}
                </h2>

                <div className="space-y-4">
                  {/* Phone */}
                  <a href="tel:+252619337904"
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-primary-100 hover:border-primary/30 hover:bg-primary-50/50 hover:-translate-y-0.5 transition-all">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform"
                      style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("Telefoon", "Phone")}</p>
                      <p className="text-base font-extrabold text-gray-900 mt-0.5">+252 619 337 904</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t("Wac ama SMS dir", "Call or send SMS")}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-[#25D366]/30 hover:border-[#25D366]/60 hover:bg-[#25D366]/5 hover:-translate-y-0.5 transition-all">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform bg-[#25D366]">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</p>
                      <p className="text-base font-extrabold text-gray-900 mt-0.5">+252 619 337 904</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t("Farriinta degdegga ah", "Fastest response")}</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:info@miftaxulquran.com"
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-gold-200/60 hover:border-gold-400/40 hover:bg-gold-50/50 hover:-translate-y-0.5 transition-all">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform"
                      style={{ background: "linear-gradient(135deg,#F5C84A,#D4920F)" }}>
                      <Mail className="h-5 w-5 text-primary-950" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                      <p className="text-sm font-extrabold text-gray-900 mt-0.5 break-all">info@miftaxulquran.com</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t("Jawaabnaa 24 sac gudahood", "Reply within 24 hours")}</p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-primary-100 bg-primary-50/30">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: "linear-gradient(135deg,#1A8049,#083D1F)" }}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("Cinwaanka", "Address")}</p>
                      <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                        {t("Muqdisho, Buulaxuubey", "Mogadishu, Buulaxuubey")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{t("Soomaaliya", "Somalia")}</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mt-6 pt-6 border-t border-primary-50">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t("Saacadaha Shaqada", "Working Hours")}
                  </p>
                  <div className="space-y-2 text-xs">
                    {[
                      { d: t("Isniinta – Khamiista", "Mon – Thu"), h: "08:00 – 22:00" },
                      { d: t("Jimcaha", "Friday"), h: "14:00 – 22:00" },
                      { d: t("Sabtida – Axadda", "Sat – Sun"), h: "09:00 – 20:00" },
                    ]?.map(({ d, h }) => (
                      <div key={d} className="flex justify-between">
                        <span className="font-semibold text-gray-700">{d}</span>
                        <span className="text-gray-500 font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Course Quick-pick cards ── */}
              <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                  {t("Koorsooyinka Jira", "Available Courses")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: BookOpen,    label: t("Qur'aan", "Quran"),          color: "#27AE60" },
                    { icon: ScrollText,  label: t("Tajwiid", "Tajweed"),         color: "#F0AE20" },
                    { icon: Languages,   label: t("Carabiga", "Arabic"),          color: "#1A8049" },
                    { icon: BookMarked,  label: t("Diinta", "Islamic Studies"),  color: "#D4920F" },
                  ]?.map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-2 p-3 rounded-xl border border-primary-50 bg-primary-50/30">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20` }}>
                        <Icon className="h-4 w-4" style={{ color }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section C: Google Map ── */}
              <div className="rounded-3xl overflow-hidden border border-primary-100 shadow-lg">
                <iframe
                  title="Miftaxul Quran — Mogadishu, Buulaxuubey"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3990.1!2d45.3!3d2.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d589ff0b8f2e4c1%3A0x0!2sBuulaxuubey%2C%20Mogadishu%2C%20Somalia!5e0!3m2!1sen!2sso!4v1695000000000"
                  width="100%"
                  height="240"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                />
                <div className="bg-white px-5 py-3.5 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {t("Buulaxuubey, Muqdisho", "Buulaxuubey, Mogadishu")}
                  </p>
                  <a
                    href="https://maps.google.com/?q=Buulaxuubey+Mogadishu+Somalia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    {t("Furan", "Open")} <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
