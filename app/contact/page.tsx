"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface FormData { name: string; email: string; phone: string; subject: string; message: string; }
const EMPTY: FormData = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const db = getFirebaseDb();
      await addDoc(collection(db, "contacts"), { ...form, createdAt: serverTimestamp(), read: false });
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all";

  const contactCards = [
    { icon: Phone, label: t("Telefoon", "Phone"), value: "+252 619 337 904", href: "tel:+252619337904", color: "#27AE60" },
    { icon: Mail, label: t("Email", "Email"), value: "info@miftaxulquran.com", href: "mailto:info@miftaxulquran.com", color: "#F0AE20" },
    { icon: MapPin, label: t("Cinwaanka", "Address"), value: t("Muqdisho, Buulaxuubey, Soomaaliya", "Mogadishu, Buulaxuubey, Somalia"), href: "#map", color: "#1A8049" },
    { icon: MessageCircle, label: "WhatsApp", value: "+252 619 337 904", href: "https://wa.me/252619337904", color: "#25D366" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(150deg,#1A8049 0%,#0D5C2E 60%,#083D1F 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-200 mb-6">
            <Sparkles className="h-4 w-4 text-gold-300" />
            {t("Nagala Soo Xiriir", "Get In Touch")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            {t("Nagala ", "Contact ")}<span className="text-gradient-gold">{t("Soo Xiriir", "Us")}</span>
          </h1>
          <p className="text-primary-100/80 text-lg max-w-xl mx-auto">
            {t("Su'aalo ma qabtaa? Waxaan halkan u diyaarnahay kaa caawinta.", "Have questions? We are here to help you.")}
          </p>
        </div>
        <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full block" preserveAspectRatio="none">
          <path fill="#f8fdf9" d="M0,20L720,40L1440,20L1440,40L0,40Z" />
        </svg>
      </section>

      <section className="py-16 bg-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactCards?.map(({ icon: Icon, label, value, href, color }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="group rounded-2xl border border-primary-100 bg-white p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg"
                  style={{ background: `linear-gradient(135deg,${color},${color}cc)` }}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-primary-100 bg-white p-8 sm:p-10 shadow-lg">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {t("Noogu Dir Farriinta", "Send Us a Message")}
                </h2>
                <p className="text-sm text-gray-500 mb-8">{t("Waxaan kaa jawaabn doonaa 24 saacadood gudahood.", "We'll reply within 24 hours.")}</p>

                {status === "sent" ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t("Farriintaada waa la helay!", "Message received!")}</h3>
                    <p className="text-sm text-gray-500">{t("Waxaan kaa jawaabn doonaa 24 saacadood gudahood.", "We'll get back to you within 24 hours.")}</p>
                    <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-primary hover:underline">
                      {t("Farriin kale dir", "Send another message")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">{t("Magacaaga", "Your Name")} *</label>
                        <input required value={form.name} onChange={set("name")} placeholder={t("Magacaaga oo buuxa", "Your full name")} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">{t("Emailka", "Email Address")} *</label>
                        <input required type="email" value={form.email} onChange={set("email")} placeholder="info@example.com" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">{t("Telefoonka", "Phone Number")}</label>
                        <input value={form.phone} onChange={set("phone")} placeholder="+252..." className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">{t("Mawduuca", "Subject")} *</label>
                        <select required value={form.subject} onChange={set("subject")} className={inputClass}>
                          <option value="">{t("Dooro...", "Select...")}</option>
                          <option value="enroll">{t("Is-diiwaangelin", "Enrollment")}</option>
                          <option value="quran">{t("Xifdinta Qur'aanka", "Quran Memorization")}</option>
                          <option value="tajweed">{t("Tacwiidka", "Tajweed")}</option>
                          <option value="arabic">{t("Luqadda Carabiga", "Arabic Language")}</option>
                          <option value="other">{t("Kale", "Other")}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">{t("Farriinta", "Message")} *</label>
                      <textarea required rows={5} value={form.message} onChange={set("message")}
                        placeholder={t("Noo qor su'aalahaaga ama farriintaada...", "Write your questions or message here...")}
                        className={`${inputClass} resize-none`} />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {t("Khalad yiri. Mar kale isku day ama WhatsApp noo soo dir.", "An error occurred. Please try again or send us a WhatsApp.")}
                      </p>
                    )}

                    <button type="submit" disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-primary-950 disabled:opacity-70 transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 6px 20px rgba(240,174,32,0.4)" }}>
                      {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      {status === "sending" ? t("La dirayaa...", "Sending...") : t("Dir Farriinta", "Send Message")}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info + Map */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Quick connect */}
              <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base mb-4">{t("Xiriir Degdeg", "Quick Connect")}</h3>
                <div className="space-y-3">
                  <a href="https://wa.me/252619337904" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bb5a] transition-all hover:-translate-y-0.5 shadow-lg">
                    <MessageCircle className="h-5 w-5" />
                    {t("WhatsApp-na u Dir", "Message on WhatsApp")}
                  </a>
                  <a href="tel:+252619337904"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg"
                    style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
                    <Phone className="h-5 w-5" />
                    {t("Noo Wac", "Call Us")} — +252 619 337 904
                  </a>
                  <a href="mailto:info@miftaxulquran.com"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-primary-950 transition-all hover:-translate-y-0.5 shadow-lg"
                    style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
                    <Mail className="h-5 w-5" />
                    info@miftaxulquran.com
                  </a>
                </div>
              </div>

              {/* Business hours */}
              <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base mb-4">{t("Wakhtiyada Shaqada", "Working Hours")}</h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    { d: t("Isniinta – Khamiista", "Mon – Thu"), h: "08:00 – 22:00" },
                    { d: t("Jimcaha", "Friday"), h: "Jumʿah – 14:00 – 22:00" },
                    { d: t("Sabtida – Axadda", "Sat – Sun"), h: "09:00 – 20:00" },
                  ]?.map(({ d, h }) => (
                    <div key={d} className="flex justify-between gap-4">
                      <span className="font-medium text-gray-700">{d}</span>
                      <span className="text-gray-500 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div id="map" className="rounded-2xl overflow-hidden border border-primary-100 shadow-sm">
                <iframe
                  title="Miftaxul Quran Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.3!2d45.3438!3d2.0469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d589ff0b8f2e4c1%3A0x0!2sBuulaxuubey%2C%20Mogadishu!5e0!3m2!1sen!2sso!4v1690000000000"
                  width="100%" height="200" loading="lazy" style={{ border: 0 }} allowFullScreen />
                <div className="p-4 bg-white">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {t("Muqdisho, Buulaxuubey, Soomaaliya", "Mogadishu, Buulaxuubey, Somalia")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
