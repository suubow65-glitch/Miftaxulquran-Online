"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, BookOpen, ScrollText, Library, Settings, MessageSquare,
  LogOut, ChevronRight, Users, Globe, Award, Clock, Plus, Pencil, Trash2,
  Save, X, Check, AlertCircle, Menu, Star, FileText, HelpCircle, BarChart3,
  UploadCloud, File as FileIcon, Lock, Music, PlayCircle, Image as LucideImage, ChevronUp, ChevronDown as ChevronDownIcon, DollarSign,
  Loader2, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { HeroSlide } from "@/lib/store";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

/* ─────── Types ─────── */
type Module = "overview" | "hero" | "hero-slideshow" | "why-us" | "challenges" | "steps" | "stats" | "about" | "leads" | "teachers" | "courses" | "pricing" | "courseHelp" | "library" | "testimonials" | "faq" | "bottomCTA" | "footer" | "settings" | "messages" | "insights" | "security" | "audio" | "library-content" | "ijazah" | "students" | "lesson-logs" | "payments" | "exams";

interface Message { id?: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: unknown; read: boolean; }

/* ─────── Sidebar nav ─────── */
const navItems: { label: string; icon: typeof LayoutDashboard; id: Module; group: "ACADEMIC" | "WEBSITE CONTENT" | "SYSTEM" | "GENERAL" }[] = [
  { label: "Overview", icon: LayoutDashboard, id: "overview", group: "GENERAL" },
  { label: "Messages", icon: MessageSquare, id: "messages", group: "GENERAL" },
  
  { label: "Students", icon: Users, id: "students", group: "ACADEMIC" },
  { label: "Teachers", icon: Award, id: "teachers", group: "ACADEMIC" },
  { label: "Lesson Logs", icon: Clock, id: "lesson-logs", group: "ACADEMIC" },
  { label: "Exams", icon: FileText, id: "exams", group: "ACADEMIC" },
  { label: "Payments", icon: DollarSign, id: "payments", group: "ACADEMIC" },

  { label: "Hero Content", icon: Star, id: "hero", group: "WEBSITE CONTENT" },
  { label: "Hero Slideshow", icon: PlayCircle, id: "hero-slideshow", group: "WEBSITE CONTENT" },
  { label: "Section: Why Us", icon: Star, id: "why-us", group: "WEBSITE CONTENT" },
  { label: "Section: Challenges", icon: AlertCircle, id: "challenges", group: "WEBSITE CONTENT" },
  { label: "Section: Steps", icon: FileText, id: "steps", group: "WEBSITE CONTENT" },
  { label: "Section: Stats", icon: BarChart3, id: "stats", group: "WEBSITE CONTENT" },
  { label: "About Us", icon: Globe, id: "about", group: "WEBSITE CONTENT" },
  { label: "Ogaal (Insights)", icon: ScrollText, id: "insights", group: "WEBSITE CONTENT" },
  { label: "Quran Player", icon: Music, id: "audio", group: "WEBSITE CONTENT" },
  { label: "Courses", icon: BookOpen, id: "courses", group: "WEBSITE CONTENT" },
  { label: "Section: Ijazah", icon: Star, id: "ijazah", group: "WEBSITE CONTENT" },
  { label: "Section: Pricing", icon: DollarSign, id: "pricing", group: "WEBSITE CONTENT" },
  { label: "Section: Course Help", icon: MessageSquare, id: "courseHelp", group: "WEBSITE CONTENT" },
  { label: "Section: Library Content", icon: BookOpen, id: "library-content", group: "WEBSITE CONTENT" },
  { label: "Library PDFs", icon: Library, id: "library", group: "WEBSITE CONTENT" },
  { label: "Testimonials", icon: MessageSquare, id: "testimonials", group: "WEBSITE CONTENT" },
  { label: "FAQ", icon: HelpCircle, id: "faq", group: "WEBSITE CONTENT" },
  { label: "Section: Final CTA", icon: Star, id: "bottomCTA", group: "WEBSITE CONTENT" },
  { label: "Section: Footer", icon: Globe, id: "footer", group: "WEBSITE CONTENT" },

  { label: "Site Settings", icon: Settings, id: "settings", group: "SYSTEM" },
  { label: "Admin Security", icon: Lock, id: "security", group: "SYSTEM" },
  { label: "Student Leads", icon: Users, id: "leads", group: "SYSTEM" },
];

/* ─────── Helper ─────── */
function toast(msg: string) { alert(msg); }

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

function FileUpload({ value, onChange, accept, label }: { value: string, onChange: (val: string) => void, accept: string, label: string }) {
  const [drag, setDrag] = useState(false);
  
  const processFile = async (file: File) => {
    // ~3MB limit warning to avoid LocalStorage quota issues
    if (file.size > 3 * 1024 * 1024 && accept.includes("audio")) {
      alert("WARNING: This audio file is over 3MB. It may exceed the browser's LocalStorage limit, causing data to disappear on refresh. For larger files, consider hosting them externally and using a URL. Saving Reciter/Surah name will still work.");
    }
    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (e) {
      alert("Failed to read file.");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isImage = value && (value.startsWith("data:image") || value.match(/\.(jpeg|jpg|gif|png|svg)$/i) != null);
  
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      <div 
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors text-center ${drag ? "border-primary bg-primary-50" : "border-gray-300 hover:border-primary/50 bg-gray-50 hover:bg-gray-100/50"}`}
      >
        <input type="file" accept={accept} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        {value ? (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            {isImage ? (
              <img src={value} alt="Preview" className="h-20 object-contain rounded-lg border border-gray-200 shadow-sm" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-primary">
                {accept === "audio/*" ? <Music className="h-8 w-8" /> : <FileIcon className="h-8 w-8" />}
                <span className="text-xs font-bold">{accept === "audio/*" ? "Audio Track Selected" : "Document Selected"}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 font-medium">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 gap-2 pointer-events-none">
            <UploadCloud className={`h-7 w-7 ${drag ? "text-primary" : "text-gray-400"}`} />
            <p className="text-sm font-medium"><span className="text-primary font-bold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-400">{accept === "image/*" ? "SVG, PNG, JPG or GIF" : accept === "audio/*" ? "MP3 files" : "PDF files"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── PAYMENTS MODULE ─────────────────────── */
function PaymentsModule() {
  const students = useStore(s => s.students);
  const payments = useStore(s => s.payments);
  const addPayment = useStore(s => s.addPayment);
  const updatePayment = useStore(s => s.updatePayment);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleTogglePaid = (studentId: string) => {
    const existing = payments.find(p => p.studentId === studentId && p.month === currentMonth);
    if (existing) {
      updatePayment(existing.id, { ...existing, status: existing.status === "Paid" ? "Pending" : "Paid", datePaid: new Date().toISOString() });
    } else {
      addPayment({
        id: "pay-" + Date.now(),
        studentId,
        month: currentMonth,
        amount: "0",
        status: "Paid",
        datePaid: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">Payments / Lacag Bixinta</h2>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-bold text-primary">
          Month: {currentMonth}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900">Student Name / Magaca Ardayga</th>
              <th className="px-6 py-4 font-bold text-gray-900">Student ID / ID-ga</th>
              <th className="px-6 py-4 font-bold text-gray-900">Subjects / Maaddooyinka</th>
              <th className="px-6 py-4 font-bold text-gray-900 text-center">Payment Status / Xaaladda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No students found.</td></tr>
            )}
            {students.map(std => {
              const payment = payments.find(p => p.studentId === std.id && p.month === currentMonth);
              const isPaid = payment?.status === "Paid";
              const enrolledSubjects = std.enrollments?.map(e => e.subjectName).join(', ') || "-";

              return (
                <tr key={std.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{std.name}</td>
                  <td className="px-6 py-4 text-gray-600">{std.studentId}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{enrolledSubjects}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleTogglePaid(std.id)}
                      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                        isPaid 
                          ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]/90' 
                          : 'bg-[#F0AE20] text-white hover:bg-[#F0AE20]/90'
                      }`}
                    >
                      {isPaid ? <Check className="h-3.5 w-3.5 mr-1" /> : <Clock className="h-3.5 w-3.5 mr-1" />}
                      {isPaid ? 'Paid / Wuu Bixiyay' : 'Mark as Paid / U Bedel Bixiyay'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────── EXAMS MODULE ─────────────────────── */
function ExamsModule() {
  const students = useStore(s => s.students);
  const teachers = useStore(s => s.teachers);
  const exams = useStore(s => s.exams);
  const addExam = useStore(s => s.addExam);
  const deleteExam = useStore(s => s.deleteExam);

  const [form, setForm] = useState({ studentId: "", subject: "", term: "", score: "", grade: "" });

  const handleAddExam = () => {
    if (!form.studentId || !form.subject || !form.term || !form.score || !form.grade) {
      toast("Please fill all fields.");
      return;
    }
    const student = students.find(s => s.id === form.studentId);
    let teacherId = "";
    if (student && student.enrollments.length > 0) {
      const enr = student.enrollments.find(e => e.subjectName === form.subject);
      if (enr) teacherId = enr.teacherId;
    }

    addExam({
      id: "exam-" + Date.now(),
      studentId: form.studentId,
      subject: form.subject,
      teacherId: teacherId,
      score: form.score,
      grade: form.grade,
      term: form.term,
      date: new Date().toISOString()
    });
    setForm({ studentId: "", subject: "", term: "", score: "", grade: "" });
    toast("Exam result added successfully.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6">Exams / Imtixaanada</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Add Exam Result / Kudar Natiijo Imtixaan</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Student / Ardayga</label>
              <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27AE60]/50 outline-none bg-white text-sm">
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Maaddada</label>
              <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27AE60]/50 outline-none bg-white text-sm">
                <option value="">-- Select Subject --</option>
                <option value="Quran">Quran</option>
                <option value="Arabic">Arabic</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Qaida">Qaida</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Month / Bisha</label>
              <input type="month" value={form.term} onChange={e => setForm({...form, term: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27AE60]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Score / Dhibcaha (Number)</label>
              <input type="number" value={form.score} onChange={e => setForm({...form, score: e.target.value})} placeholder="e.g. 95" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27AE60]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Grade / Darajada</label>
              <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27AE60]/50 outline-none bg-white text-sm">
                <option value="">-- Select Grade --</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleAddExam} className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Save Result / Keydi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Exam History / Natiijooyinkii U Dambeeyay</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-bold text-gray-900">Student / Ardayga</th>
              <th className="px-6 py-3 font-bold text-gray-900">Subject / Maaddada</th>
              <th className="px-6 py-3 font-bold text-gray-900">Month / Bisha</th>
              <th className="px-6 py-3 font-bold text-gray-900">Score / Dhibcaha</th>
              <th className="px-6 py-3 font-bold text-gray-900">Grade / Darajada</th>
              <th className="px-6 py-3 font-bold text-gray-900 text-right">Actions / Ficil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No exams recorded yet.</td></tr>
            )}
            {[...exams].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exam => {
              const student = students.find(s => s.id === exam.studentId);
              return (
                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{student?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-gray-600">{exam.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{exam.term}</td>
                  <td className="px-6 py-4 font-bold text-[#27AE60]">{exam.score}%</td>
                  <td className="px-6 py-4 font-bold text-[#F0AE20]">{exam.grade}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { if(confirm("Are you sure?")) deleteExam(exam.id); }} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN DASHBOARD ═══════════════════════ */
export default function AdminDashboard() {
  const [module, setModule] = useState<Module>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg,#0D5C2E 0%,#083D1F 100%)" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-white flex-shrink-0">
            <Image src="/logo.png" alt="MQ" fill className="object-contain p-0.5" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-[10px] font-bold tracking-wider" style={{ color: "#F0AE20" }}>ADMIN PANEL</p>
            <p className="text-sm font-extrabold text-white truncate">Miftaxul Quran</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {["GENERAL", "ACADEMIC", "WEBSITE CONTENT", "SYSTEM"].map(group => (
            <div key={group} className="space-y-1">
              {group !== "GENERAL" && (
                <div className="px-4 py-1 text-[10px] font-bold text-white/50 tracking-widest">{group}</div>
              )}
              {navItems.filter(i => i.group === group).map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setModule(id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${module === id ? "text-primary-950 shadow-lg" : "text-primary-200/80 hover:bg-white/10 hover:text-white"}`}
                  style={module === id ? { background: "linear-gradient(135deg,#F5C84A,#F0AE20)" } : {}}>
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                  <span className="flex-1 text-left">{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <Link href="/" target="_blank"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-primary-200/80 hover:bg-white/10 hover:text-white transition-all mb-1">
            <Globe className="h-4 w-4" /> View Site
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/25 transition-all">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base">{navItems.find(n => n.id === module)?.label}</h1>
              <p className="text-xs text-gray-400">Miftaxul Quran CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>A</div>
          </div>
        </header>

        {/* Module content */}
        <main className="flex-1 overflow-y-auto p-6">
          {module === "overview" && <OverviewModule />}
          {module === "students" && <StudentsModule />}
          {module === "lesson-logs" && <LessonLogsModule />}
          {module === "payments" && <PaymentsModule />}
          {module === "exams" && <ExamsModule />}
          {module === "leads" && <LeadsModule />}
          {module === "hero" && <HeroModule />}
          {module === "hero-slideshow" && <HeroSlideshowModule />}
          {module === "why-us" && <WhyUsModule />}
          {module === "challenges" && <ChallengesModule />}
          {module === "steps" && <StepsModule />}
          {module === "stats" && <StatsModule />}
          {module === "about" && <AboutModule />}
          {module === "teachers" && <TeachersModule />}
          {module === "courses" && <CoursesModule />}
          {module === "ijazah" && <IjazahModule />}
          {module === "pricing" && <PricingModule />}
          {module === "courseHelp" && <CourseHelpModule />}
          {module === "library-content" && <LibraryContentModule />}
          {module === "library" && <LibraryModule />}
          {module === "testimonials" && <TestimonialsModule />}
          {module === "faq" && <FaqModule />}
          {module === "bottomCTA" && <BottomCTAModule />}
          {module === "footer" && <FooterModule />}
          {module === "messages" && <MessagesModule />}
          {module === "insights" && <InsightsModule />}
          {module === "audio" && <QuranPlayerModule />}
          {module === "settings" && <SettingsModule />}
          {module === "security" && <SecurityModule />}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────── WHY US MODULE ─────────────────────── */
function WhyUsModule() {
  const featuresContent = useStore(s => s.featuresContent);
  const updateFeaturesContent = useStore(s => s.updateFeaturesContent);
  
  const [form, setForm] = useState(featuresContent);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateFeaturesContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setForm({ ...form, features: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm space-y-6">
        <h2 className="font-extrabold text-gray-900 mb-2">Edit 'Why Choose Us' Headings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">🇸🇴 Somali</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Heading</label>
              <input value={form.mainHeadingSo} onChange={e => setForm({...form, mainHeadingSo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Sub Heading</label>
              <textarea rows={2} value={form.subHeadingSo} onChange={e => setForm({...form, subHeadingSo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">🇬🇧 English</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Heading</label>
              <input value={form.mainHeadingEn} onChange={e => setForm({...form, mainHeadingEn: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Sub Heading</label>
              <textarea rows={2} value={form.subHeadingEn} onChange={e => setForm({...form, subHeadingEn: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-6">Edit Features (8 Cards)</h2>
        <div className="space-y-6">
          {form.features.map((feature, i) => (
            <div key={feature.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary-100 text-primary flex items-center justify-center rounded-lg font-bold">#{i + 1}</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon Name (Lucide)</label>
                  <input value={feature.iconName} onChange={e => handleFeatureChange(i, "iconName", e.target.value)} placeholder="e.g. Users, Clock, Shield" className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title (SO)</label>
                    <input value={feature.titleSo} onChange={e => handleFeatureChange(i, "titleSo", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description (SO)</label>
                    <textarea rows={2} value={feature.descSo} onChange={e => handleFeatureChange(i, "descSo", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title (EN)</label>
                    <input value={feature.titleEn} onChange={e => handleFeatureChange(i, "titleEn", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description (EN)</label>
                    <textarea rows={2} value={feature.descEn} onChange={e => handleFeatureChange(i, "descEn", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm" style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Features</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── COURSE HELP CTA ─────────────────────── */
function CourseHelpModule() {
  const data = useStore(s => s.courseHelpCTA);
  const update = useStore(s => s.updateCourseHelpCTA);

  const [form, setForm] = useState(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(data);
  }, [data]);

  if (!form) return null;

  const handleSave = () => {
    update(form);
    setSaved(true);
    toast("Course Help CTA settings saved successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Manage Course Help CTA</h2>
          <p className="text-xs text-gray-400 mt-0.5">Changes are saved to localStorage and displayed live on the site.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">🇸🇴 Somali</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (Somali)</label>
              <input value={form.titleSo} onChange={e => setForm({ ...form, titleSo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (Somali)</label>
              <textarea rows={3} value={form.descSo} onChange={e => setForm({ ...form, descSo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Button (Somali)</label>
              <input value={form.contactButtonSo} onChange={e => setForm({ ...form, contactButtonSo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Button (Somali)</label>
              <input value={form.whatsappButtonSo} onChange={e => setForm({ ...form, whatsappButtonSo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">🇬🇧 English</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (English)</label>
              <input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (English)</label>
              <textarea rows={3} value={form.descEn} onChange={e => setForm({ ...form, descEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Button (English)</label>
              <input value={form.contactButtonEn} onChange={e => setForm({ ...form, contactButtonEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Button (English)</label>
              <input value={form.whatsappButtonEn} onChange={e => setForm({ ...form, whatsappButtonEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Phone Number</label>
          <input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="e.g. 252619337904"
            className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <p className="text-xs text-gray-400 mt-1">Include country code without the '+' sign.</p>
        </div>
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save CTA Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── OVERVIEW ─────────────────────── */
function OverviewModule() {
  const cards = [
    { icon: Users, label: "Active Students", value: "2,000+", color: "#27AE60", sub: "+12% this month" },
    { icon: BookOpen, label: "Active Courses", value: "4", color: "#F0AE20", sub: "All running" },
    { icon: MessageSquare, label: "New Messages", value: "—", color: "#1A8049", sub: "Check inbox" },
    { icon: Globe, label: "Countries", value: "40+", color: "#D4920F", sub: "Worldwide" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-extrabold text-gray-900 mb-1">Quick Actions</h2>
        <p className="text-sm text-gray-500 mb-5">Jump to common tasks</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Add New Course", icon: Plus, mod: "courses" as Module },
            { label: "Upload PDF Book", icon: FileText, mod: "library" as Module },
            { label: "View Messages", icon: MessageSquare, mod: "messages" as Module },
          ].map(({ label, icon: Icon, mod }) => (
            <button key={label} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary hover:bg-primary-50 transition-all text-left">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6">
        <h2 className="font-extrabold text-gray-900 mb-4">Contact Information (Live)</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div><p className="font-bold text-gray-700">Phone</p><p className="text-gray-600">+252 619 337 904</p></div>
          <div><p className="font-bold text-gray-700">Email</p><p className="text-gray-600">info@miftaxulquran.com</p></div>
          <div><p className="font-bold text-gray-700">Location</p><p className="text-gray-600">Mogadishu, Buulaxuubey</p></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── HERO ─────────────────────── */
function HeroModule() {
  const hero = useStore(state => state.hero);
  const updateHero = useStore(state => state.updateHero);
  
  const [form, setForm] = useState(hero);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateHero(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-6">Edit Hero Section</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Somali */}
          <div className="space-y-5">
            <h3 className="font-bold text-primary flex items-center gap-2"><span className="text-xl">🇸🇴</span> Somali (Default)</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Main Headline (H1)</label>
              <textarea rows={2} value={form.headlineSo} onChange={e => setForm(f => ({ ...f, headlineSo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Sub-headline</label>
              <textarea rows={3} value={form.subheadlineSo} onChange={e => setForm(f => ({ ...f, subheadlineSo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">CTA Button Text</label>
              <input value={form.ctaTextSo} onChange={e => setForm(f => ({ ...f, ctaTextSo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          {/* English */}
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><span className="text-xl">🇬🇧</span> English</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Main Headline (H1)</label>
              <textarea rows={2} value={form.headlineEn} onChange={e => setForm(f => ({ ...f, headlineEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Sub-headline</label>
              <textarea rows={3} value={form.subheadlineEn} onChange={e => setForm(f => ({ ...f, subheadlineEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">CTA Button Text</label>
              <input value={form.ctaTextEn} onChange={e => setForm(f => ({ ...f, ctaTextEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2 mt-4">
            <FileUpload 
              label="Hero Background Image" 
              accept="image/*" 
              value={form.bgImageUrl || ""} 
              onChange={val => setForm(f => ({ ...f, bgImageUrl: val }))} 
            />
            <p className="text-xs text-gray-500">Upload a background image for the hero section (optional).</p>
          </div>

        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
            {saved ? <><Check className="h-4 w-4" />Saved Successfully</> : <><Save className="h-4 w-4" />Save All Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── HERO SLIDESHOW ─────────────────────── */
function HeroSlideshowModule() {
  const heroSlides = useStore(state => state.heroSlides);
  const addHeroSlide = useStore(state => state.addHeroSlide);
  const updateHeroSlide = useStore(state => state.updateHeroSlide);
  const deleteHeroSlide = useStore(state => state.deleteHeroSlide);
  const reorderHeroSlides = useStore(state => state.reorderHeroSlides);

  const emptySlide: Omit<HeroSlide, "id"> = {
    image: "",
    hadithAr: "",
    hadithSo: "",
    hadithEn: "",
  };

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<HeroSlide, "id">>(emptySlide);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptySlide);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (slide: HeroSlide) => {
    setForm({ image: slide.image, hadithAr: slide.hadithAr, hadithSo: slide.hadithSo, hadithEn: slide.hadithEn });
    setEditingId(slide.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    if (!form.image) { alert("Please upload an image first."); return; }
    if (editingId) {
      updateHeroSlide(editingId, { id: editingId, ...form });
    } else {
      addHeroSlide({ id: `slide-${Date.now()}`, ...form });
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); resetForm(); }, 1500);
  };

  const handleDelete = (id: string) => {
    deleteHeroSlide(id);
    setDeleteConfirm(null);
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= heroSlides.length) return;
    const arr = [...heroSlides];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    reorderHeroSlides(arr);
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900 text-xl">Hero Slideshow</h2>
          <p className="text-sm text-gray-400 mt-0.5">{heroSlides.length} slide{heroSlides.length !== 1 ? "s" : ""} — auto-cycles every 5 seconds on the home page</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptySlide); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm shadow-md hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}
          >
            <Plus className="h-4 w-4" /> Add New Slide
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-2xl border-2 border-primary/20 bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              {editingId ? "Edit Slide" : "Add New Slide"}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <FileUpload
              label="Slide Image *"
              accept="image/*"
              value={form.image}
              onChange={val => setForm(f => ({ ...f, image: val }))}
            />
            {!form.image && (
              <p className="text-xs text-amber-600 mt-1.5 font-medium">⚠ An image is required for each slide.</p>
            )}
          </div>

          {/* Text Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2"><span className="text-lg">🇸🇦</span> Hadith (Arabic)</label>
              <textarea
                dir="rtl"
                rows={2}
                value={form.hadithAr}
                onChange={e => setForm(f => ({ ...f, hadithAr: e.target.value }))}
                placeholder="خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-xl font-arabic text-right focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2"><span className="text-lg">🇸🇴</span> Translation (Somali)</label>
                <textarea
                  rows={3}
                  value={form.hadithSo}
                  onChange={e => setForm(f => ({ ...f, hadithSo: e.target.value }))}
                  placeholder="Kii idiinku khayr badan..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2"><span className="text-lg">🇬🇧</span> Translation (English)</label>
                <textarea
                  rows={3}
                  value={form.hadithEn}
                  onChange={e => setForm(f => ({ ...f, hadithEn: e.target.value }))}
                  placeholder="The best among you..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 pt-5 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}
            >
              {saved ? <><Check className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />{editingId ? "Update Slide" : "Save Slide"}</>}
            </button>
            <button onClick={resetForm} className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slides Grid */}
      {heroSlides.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
          <LucideImage className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No slides yet.</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add New Slide" to create your first hero slide.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id} className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all">
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-gray-100">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt="Slide"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <LucideImage className="h-10 w-10" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Slide number badge */}
                <div className="absolute top-2 left-2 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black text-primary-950"
                  style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
                  {idx + 1}
                </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-bold text-xs leading-tight drop-shadow text-right font-arabic" dir="rtl">
                      {slide.hadithAr}
                    </p>
                    <p className="text-white/70 text-[10px] mt-0.5 line-clamp-1 drop-shadow text-left">
                      {slide.hadithEn || slide.hadithSo}
                    </p>
                  </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 flex items-center justify-between gap-2">
                {/* Reorder buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => moveSlide(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 disabled:opacity-25 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveSlide(idx, 1)}
                    disabled={idx === heroSlides.length - 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 disabled:opacity-25 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDownIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Edit / Delete */}
                <div className="flex gap-1.5 ml-auto">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary-50 hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>

                  {deleteConfirm === slide.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        <Check className="h-3 w-3" /> Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(slide.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
        <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" /> Tips for Best Results
        </h4>
        <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
          <li>Use landscape images (e.g. 16:9 or 4:3) at least 900px wide for crisp display.</li>
          <li>Avoid very light images — the text overlay needs contrast with the dark gradient.</li>
          <li>Titles are shown in large text on the card; keep them short (3–6 words).</li>
          <li>Slides auto-cycle every 5 seconds on the home page.</li>
          <li>Use the ↑ / ↓ arrows to change the display order.</li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────── STEPS ─────────────────────── */
function StepsModule() {
  const stepsContent = useStore(s => s.stepsContent);
  const updateStepsContent = useStore(s => s.updateStepsContent);

  const [form, setForm] = useState(stepsContent);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateStepsContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const updatedSteps = [...form.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setForm({ ...form, steps: updatedSteps });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm space-y-6">
        <h2 className="font-extrabold text-gray-900 mb-2">Edit 'Steps to Start' Headings & CTA</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">🇸🇴 Somali</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title</label>
              <input value={form.mainTitleSo} onChange={e => setForm({...form, mainTitleSo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">CTA Button Text</label>
              <input value={form.ctaButtonTextSo} onChange={e => setForm({...form, ctaButtonTextSo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">🇬🇧 English</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title</label>
              <input value={form.mainTitleEn} onChange={e => setForm({...form, mainTitleEn: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">CTA Button Text</label>
              <input value={form.ctaButtonTextEn} onChange={e => setForm({...form, ctaButtonTextEn: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-6">Edit Steps (3 Items)</h2>
        <div className="space-y-6">
          {form.steps.map((step, i) => (
            <div key={step.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary-100 text-primary flex items-center justify-center rounded-lg font-bold">#{i + 1}</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon Name (Lucide)</label>
                  <input value={step.iconName} onChange={e => handleStepChange(i, "iconName", e.target.value)} placeholder="e.g. FileText, BarChart, GraduationCap" className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title (SO)</label>
                    <input value={step.titleSo} onChange={e => handleStepChange(i, "titleSo", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description (SO)</label>
                    <textarea rows={2} value={step.descSo} onChange={e => handleStepChange(i, "descSo", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title (EN)</label>
                    <input value={step.titleEn} onChange={e => handleStepChange(i, "titleEn", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description (EN)</label>
                    <textarea rows={2} value={step.descEn} onChange={e => handleStepChange(i, "descEn", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm" style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Steps</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── STATS ─────────────────────── */
function StatsModule() {
  const statsContent = useStore(state => state.statsContent);
  const updateStatsContent = useStore(state => state.updateStatsContent);

  const [form, setForm] = useState(statsContent);
  const [saved, setSaved] = useState(false);
  
  const save = () => {
    updateStatsContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...form.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setForm({ ...form, stats: updatedStats });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-4">Edit 'Statistics' Heading</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title (SO)</label>
            <input value={form.mainTitleSo} onChange={e => setForm({...form, mainTitleSo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title (EN)</label>
            <input value={form.mainTitleEn} onChange={e => setForm({...form, mainTitleEn: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-6">Edit Stats (6 Cards)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {form.stats.map((stat, i) => (
            <div key={stat.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <span className="h-6 w-6 bg-primary-100 text-primary flex items-center justify-center rounded text-xs font-bold">#{i + 1}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Icon Name (Lucide)</label>
                <input value={stat.iconName} onChange={e => handleStatChange(i, "iconName", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Value (e.g., 50+)</label>
                <input value={stat.value} onChange={e => handleStatChange(i, "value", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Label (SO)</label>
                  <input value={stat.labelSo} onChange={e => handleStatChange(i, "labelSo", e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Label (EN)</label>
                  <input value={stat.labelEn} onChange={e => handleStatChange(i, "labelEn", e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Sub Label (SO)</label>
                  <input value={stat.subLabelSo} onChange={e => handleStatChange(i, "subLabelSo", e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Sub Label (EN)</label>
                  <input value={stat.subLabelEn} onChange={e => handleStatChange(i, "subLabelEn", e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm" style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Statistics</>}
          </button>
        </div>
      </div>
    </div>
  );
}



/* ─────────────────────── COURSES ─────────────────────── */
function CoursesModule() {
  const courses = useStore(s => s.courses);
  const addCourse = useStore(s => s.addCourse);
  const updateCourse = useStore(s => s.updateCourse);
  const deleteCourse = useStore(s => s.deleteCourse);

  type StoreCourse = typeof courses[number];
  const [editing, setEditing] = useState<StoreCourse | null>(null);
  const [isNew, setIsNew] = useState(false);

  const EMPTY: StoreCourse = {
    id: "", category: "quran",
    titleSo: "", titleEn: "",
    descSo: "", descEn: "",
    duration: "", level: "",
    students: 0, rating: 5,
    priceSo: "La xidhiidh", priceEn: "Contact Us",
    featuresSo: [], featuresEn: [],
    imageUrl: "",
    icon: "BookOpen", badgeSo: "", badgeEn: "",
    learningPaths: [],
  };

  const handleSave = () => {
    if (!editing) return;
    if (isNew) addCourse({ ...editing, id: `c-${Date.now()}` });
    else updateCourse(editing.id, editing);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this course?")) deleteCourse(id);
  };

  const field = (label: string, key: keyof StoreCourse, placeholder = "") => (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      <input value={String(editing![key] ?? "")} placeholder={placeholder}
        onChange={e => setEditing(v => v ? { ...v, [key]: e.target.value } : v)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Manage Courses ({courses.length})</h2>
          <p className="text-xs text-gray-400 mt-0.5">Changes are saved to localStorage and displayed live on the site.</p>
        </div>
        <button onClick={() => { setEditing(EMPTY); setIsNew(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border-2 border-primary bg-white shadow-xl overflow-hidden">
          <div className="bg-primary-50 px-7 py-5 flex items-center justify-between border-b border-primary-100">
            <h3 className="font-extrabold text-primary-950 text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {isNew ? "Add New Course" : `Edit Course: ${editing.titleEn || editing.titleSo || 'Untitled'}`}
            </h3>
            <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-primary-100 text-primary-900 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-7 space-y-10">
            {/* Media Section */}
            <section>
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-primary"></span> Media
              </h4>
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6">
                <FileUpload 
                  label="Course Thumbnail Image" 
                  accept="image/*" 
                  value={editing.imageUrl || ""} 
                  onChange={val => setEditing(v => v ? { ...v, imageUrl: val } : v)} 
                />
              </div>
            </section>

            {/* General Info */}
            <section>
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-gold-500"></span> General Info
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
                  <select value={editing.category}
                    onChange={e => setEditing(v => v ? { ...v, category: e.target.value as StoreCourse["category"] } : v)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm">
                    {["quran","tajweed","arabic","islamic","seerah"].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                  </select>
                </div>
                {field("Icon (Lucide)", "icon", "e.g. BookOpen")}
                {field("Duration (Static fallback)", "duration", "e.g. 6–18 months")}
                {field("Level (Static fallback)", "level", "e.g. All Levels")}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Students</label>
                  <input type="number" value={editing.students}
                    onChange={e => setEditing(v => v ? { ...v, students: parseInt(e.target.value) || 0 } : v)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Rating (Max 5.0)</label>
                  <input type="number" step="0.1" max="5" value={editing.rating}
                    onChange={e => setEditing(v => v ? { ...v, rating: parseFloat(e.target.value) || 0 } : v)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                </div>
              </div>
            </section>

            {/* Bilingual Content */}
            <section>
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span> Course Content
              </h4>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Somali Content Card */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-200/50">
                    <span className="text-2xl">🇸🇴</span>
                    <h4 className="font-extrabold text-emerald-900">Somali Details</h4>
                  </div>
                  <div className="space-y-5">
                    {field("Badge (Somali)", "badgeSo", "e.g. Qur'aan")}
                    {field("Title (Somali)", "titleSo", "e.g. Xifdinta Qur'aanka")}
                    {field("Price (Somali)", "priceSo", "e.g. $20")}
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 mb-2">Description (Somali)</label>
                      <textarea rows={4} value={editing.descSo}
                        onChange={e => setEditing(v => v ? { ...v, descSo: e.target.value } : v)}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 mb-2">Features / What you'll learn (Somali)</label>
                      <textarea rows={5} value={editing.featuresSo.join("\n")}
                        onChange={e => setEditing(v => v ? { ...v, featuresSo: e.target.value.split("\n") } : v)}
                        placeholder="One feature per line"
                        className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none shadow-sm" />
                      <p className="text-[11px] text-emerald-700/60 mt-1.5 font-medium">Tip: Press Enter to separate features</p>
                    </div>
                  </div>
                </div>

                {/* English Content Card */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-blue-200/50">
                    <span className="text-2xl">🇬🇧</span>
                    <h4 className="font-extrabold text-blue-900">English Details</h4>
                  </div>
                  <div className="space-y-5">
                    {field("Badge (English)", "badgeEn", "e.g. Quran")}
                    {field("Title (English)", "titleEn", "e.g. Quran Memorization")}
                    {field("Price (English)", "priceEn", "e.g. $20")}
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-2">Description (English)</label>
                      <textarea rows={4} value={editing.descEn}
                        onChange={e => setEditing(v => v ? { ...v, descEn: e.target.value } : v)}
                        className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-2">Features / What you'll learn (English)</label>
                      <textarea rows={5} value={editing.featuresEn.join("\n")}
                        onChange={e => setEditing(v => v ? { ...v, featuresEn: e.target.value.split("\n") } : v)}
                        placeholder="One feature per line"
                        className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-sm" />
                      <p className="text-[11px] text-blue-700/60 mt-1.5 font-medium">Tip: Press Enter to separate features</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Paths */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span> Learning Paths / Levels
                </h4>
                <button 
                  onClick={() => setEditing(v => v ? {
                    ...v, 
                    learningPaths: [...(v.learningPaths || []), {
                      id: `lp-${Date.now()}`,
                      levelNameSo: "", levelNameEn: "",
                      durationSo: "", durationEn: "",
                      targetAudienceSo: "", targetAudienceEn: ""
                    }]
                  } : v)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-800 transition-colors shadow-sm rounded-xl"
                >
                  <Plus className="h-4 w-4" /> Add Level
                </button>
              </div>
              
              <div className="space-y-4">
                {(editing.learningPaths || []).map((lp, idx) => (
                  <div key={lp.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm relative group">
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditing(v => v ? {
                          ...v,
                          learningPaths: v.learningPaths?.filter(p => p.id !== lp.id)
                        } : v)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        title="Delete Level"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 w-11/12">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">{idx + 1}</span>
                      <p className="font-bold text-gray-700">Level Configuration</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">🇸🇴 Somali Config</p>
                        <div className="space-y-3">
                          <input value={lp.levelNameSo} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].levelNameSo = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Level Name (e.g., Bilow)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                          <input value={lp.durationSo} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].durationSo = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Duration (e.g., 4 Bilood)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                          <input value={lp.targetAudienceSo} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].targetAudienceSo = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Target Audience" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                        </div>
                      </div>
                      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">🇬🇧 English Config</p>
                        <div className="space-y-3">
                          <input value={lp.levelNameEn} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].levelNameEn = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Level Name (e.g., Beginner)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                          <input value={lp.durationEn} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].durationEn = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Duration (e.g., 4 Months)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                          <input value={lp.targetAudienceEn} onChange={(e) => {
                              const newLp = [...(editing.learningPaths || [])];
                              newLp[idx].targetAudienceEn = e.target.value;
                              setEditing(v => v ? { ...v, learningPaths: newLp } : v);
                            }} placeholder="Target Audience" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(editing.learningPaths?.length === 0 || !editing.learningPaths) && (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                    <p className="text-sm font-medium text-gray-500">No learning paths configured.</p>
                    <p className="text-xs text-gray-400 mt-1">The static fallback duration/level will be displayed on the card instead.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="bg-gray-50 px-7 py-5 border-t border-gray-200 flex gap-4">
            <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-primary-950 text-sm shadow-md hover:scale-[1.02] transition-transform"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
              <Save className="h-5 w-5" /> Save Course
            </button>
            <button onClick={() => setEditing(null)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-gray-600 text-sm border-2 border-gray-200 hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{c.titleEn}</p>
              <p className="text-xs text-gray-400 truncate">{c.titleSo}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.category} • {c.duration} • {c.level}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setEditing(c); setIsNew(false); }}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(c.id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── LIBRARY ─────────────────────── */
function LibraryModule() {
  const books = useStore(s => s.library);
  const addBook = useStore(s => s.addBook);
  const updateBook = useStore(s => s.updateBook);
  const deleteBook = useStore(s => s.deleteBook);

  type StoreBook = typeof books[number];
  const EMPTY_BOOK: StoreBook = { id: "", title: "", author: "", category: "quran", sizeMB: 0, pagesSo: "", pagesEn: "", downloadUrl: "", coverImage: "", color: "#27AE60", emoji: "📖" };
  const [editing, setEditing] = useState<StoreBook | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = () => {
    if (!editing) return;
    if (isNew) addBook({ ...editing, id: `b-${Date.now()}` });
    else updateBook(editing.id, editing);
    setEditing(null);
    setIsNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Library PDFs ({books.length})</h2>
          <p className="text-xs text-gray-400 mt-0.5">Changes are saved to localStorage and displayed live on the library page.</p>
        </div>
        <button onClick={() => { setEditing(EMPTY_BOOK); setIsNew(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
          <Plus className="h-4 w-4" /> Add Book
        </button>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-primary-900">
          <strong>Note:</strong> Uploaded PDFs and cover images are converted to Base64 and stored locally for now.
        </p>
      </div>

      {editing && (
        <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-gray-900">{isNew ? "Add New Book" : `Edit: ${editing.title}`}</h3>
            <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Title *</label>
              <input value={editing.title} onChange={e => setEditing(v => v ? { ...v, title: e.target.value } : v)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Author *</label>
              <input value={editing.author} onChange={e => setEditing(v => v ? { ...v, author: e.target.value } : v)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
              <select value={editing.category} onChange={e => setEditing(v => v ? { ...v, category: e.target.value as StoreBook["category"] } : v)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {["quran","tajweed","arabic","islamic","seerah"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Size (MB)</label>
              <input type="number" step="0.1" value={editing.sizeMB} onChange={e => setEditing(v => v ? { ...v, sizeMB: parseFloat(e.target.value) } : v)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Pages label (Somali)</label>
              <input value={editing.pagesSo} onChange={e => setEditing(v => v ? { ...v, pagesSo: e.target.value } : v)}
                placeholder="64 bog" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Pages label (English)</label>
              <input value={editing.pagesEn} onChange={e => setEditing(v => v ? { ...v, pagesEn: e.target.value } : v)}
                placeholder="64 pages" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="sm:col-span-2">
              <FileUpload 
                label="Cover Image" 
                accept="image/*" 
                value={editing.coverImage || ""} 
                onChange={val => setEditing(v => v ? { ...v, coverImage: val } : v)} 
              />
            </div>
            <div className="sm:col-span-2">
              <FileUpload 
                label="PDF Document" 
                accept="application/pdf" 
                value={editing.downloadUrl || ""} 
                onChange={val => setEditing(v => v ? { ...v, downloadUrl: val } : v)} 
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
              <Save className="h-4 w-4" /> Save Book
            </button>
            <button onClick={() => setEditing(null)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-gray-600 text-sm border border-gray-200">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {books.map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-gold-50 border border-gold-200">{b.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{b.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{b.author} • {b.category} • {b.sizeMB} MB</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(b); setIsNew(false); }}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => deleteBook(b.id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── TESTIMONIALS ─────────────────────── */
function TestimonialsModule() {
  const items = useStore(s => s.testimonials);
  const deleteTestimonial = useStore(s => s.deleteTestimonial);
  const approveTestimonial = useStore(s => s.approveTestimonial);
  const updateTestimonial = useStore(s => s.updateTestimonial);
  
  const pendingItems = items.filter(t => !t.isApproved);
  const liveItems = items.filter(t => t.isApproved);
  
  const [tab, setTab] = useState<"pending" | "live">("pending");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, content: "", image: "" });

  const startEdit = (item: any) => {
    setForm({ name: item.name, location: item.location || item.country || "", rating: item.rating, content: item.content || item.text || "", image: item.image || "" });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEdit = () => {
    if (editingId) {
      updateTestimonial(editingId, form);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-gray-900">User Reviews Moderation</h2>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setTab("pending")} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "pending" ? "bg-white text-primary-950 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
          Pending Approvals ({pendingItems.length})
        </button>
        <button onClick={() => setTab("live")} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "live" ? "bg-white text-primary-950 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
          Live Testimonials ({liveItems.length})
        </button>
      </div>

      {editingId && (
        <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-lg">
          <h3 className="font-extrabold text-gray-900 mb-5">Edit Review</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating: {form.rating}/5</label>
            <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}
              className="w-full accent-primary" />
          </div>
          <div className="mb-4">
            <FileUpload 
              label="Student Photo (Optional)" 
              accept="image/*" 
              value={form.image} 
              onChange={val => setForm(f => ({ ...f, image: val || "" }))} 
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Content</label>
            <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
              <Save className="h-4 w-4" /> Save Changes
            </button>
            <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-gray-600 text-sm border border-gray-200">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(tab === "pending" ? pendingItems : liveItems).map(item => (
          <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-4 hover:shadow-md transition-all">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
            ) : (
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>{item.name[0]?.toUpperCase()}</div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{item.location || (item as any).country}</span>
                  <div className="flex gap-0.5 ml-1">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Old'}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{item.content || (item as any).text}</p>
              
              <div className="flex flex-wrap gap-2.5">
                {tab === "pending" && (
                  <button onClick={() => approveTestimonial(item.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm">
                    <Check className="h-3.5 w-3.5" /> Approve & Publish
                  </button>
                )}
                <button onClick={() => startEdit(item)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => deleteTestimonial(item.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {(tab === "pending" ? pendingItems : liveItems).length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No {tab} reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */
function FaqModule() {
  const faqContent = useStore(s => s.faqContent);
  const updateFaqContent = useStore(s => s.updateFaqContent);
  const [saved, setSaved] = useState(false);

  type StoreFaq = typeof faqContent.faqs[number];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StoreFaq, 'id'>>({ questionSo: "", questionEn: "", answerSo: "", answerEn: "" });

  const startAdd = () => {
    setForm({ questionSo: "", questionEn: "", answerSo: "", answerEn: "" });
    setEditingId(null);
    setAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (faq: StoreFaq) => {
    setForm({ questionSo: faq.questionSo, questionEn: faq.questionEn, answerSo: faq.answerSo, answerEn: faq.answerEn });
    setEditingId(faq.id);
    setAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveFaq = () => {
    if (editingId) {
      updateFaqContent({
        ...faqContent,
        faqs: faqContent.faqs.map(f => f.id === editingId ? { ...form, id: editingId } : f)
      });
    } else {
      updateFaqContent({
        ...faqContent,
        faqs: [...faqContent.faqs, { ...form, id: `faq-${Date.now()}` }]
      });
    }
    setAdding(false);
    setEditingId(null);
  };

  const deleteFaq = (id: string) => {
    updateFaqContent({
      ...faqContent,
      faqs: faqContent.faqs.filter(f => f.id !== id)
    });
  };

  const handleHeadingSave = () => {
    updateFaqContent(faqContent); // In Zustand it updates in place if we modify the state object, but let's just show saved
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="font-black text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" /> FAQ Section Settings
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2"><span className="text-xl">🇸🇴</span> Somali Heading</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Main Headline</label>
              <input value={faqContent.mainHeadingSo} onChange={e => updateFaqContent({ ...faqContent, mainHeadingSo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><span className="text-xl">🇬🇧</span> English Heading</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Main Headline</label>
              <input value={faqContent.mainHeadingEn} onChange={e => updateFaqContent({ ...faqContent, mainHeadingEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button onClick={handleHeadingSave} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
            {saved ? <><Check className="h-4 w-4" />Saved Successfully</> : <><Save className="h-4 w-4" />Save Headings</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-black text-2xl text-gray-900">Questions ({faqContent.faqs.length})</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the frequently asked questions.</p>
          </div>
          <button onClick={startAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        {adding && (
          <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-gray-900">{editingId ? "Edit FAQ Entry" : "New FAQ Entry"}</h3>
              <button onClick={() => setAdding(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-5">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Question (Somali)</label>
                  <input value={form.questionSo} onChange={e => setForm(f => ({ ...f, questionSo: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Answer (Somali)</label>
                  <textarea rows={3} value={form.answerSo} onChange={e => setForm(f => ({ ...f, answerSo: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Question (English)</label>
                  <input value={form.questionEn} onChange={e => setForm(f => ({ ...f, questionEn: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Answer (English)</label>
                  <textarea rows={3} value={form.answerEn} onChange={e => setForm(f => ({ ...f, answerEn: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveFaq} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
                style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
                <Save className="h-4 w-4" /> Save FAQ
              </button>
              <button onClick={() => setAdding(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-gray-600 text-sm border border-gray-200">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {faqContent.faqs.map((f, i) => (
            <div key={f.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#27AE60,#0D5C2E)" }}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{f.questionEn}</p>
                <p className="text-xs text-gray-500 italic">{f.questionSo}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{f.answerEn}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(f)}
                  className="p-2 rounded-lg text-primary-600 hover:bg-primary-50"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteFaq(f.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── MESSAGES ─────────────────────── */
function MessagesModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const db = getFirebaseDb();
        const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
      } catch { setMessages([]); } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="font-extrabold text-gray-900">Contact Messages ({messages.length})</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No messages yet. They will appear here when users submit the contact form.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {messages.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left rounded-2xl border p-5 transition-all hover:shadow-md ${selected?.id === m.id ? "border-primary bg-primary-50/50" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-gray-900 text-sm truncate">{m.name}</p>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 truncate">{m.email} · {m.subject}</p>
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{m.message}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="font-extrabold text-gray-900">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
              </div>
              <div className="mb-4">
                <span className="text-xs font-bold text-primary bg-primary-50 border border-primary-200 rounded-full px-2.5 py-1">{selected.subject}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              <div className="mt-6 pt-5 border-t border-gray-100 flex gap-3">
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-950"
                  style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
                  Reply via Email
                </a>
                <a href={`https://wa.me/${selected.phone?.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bb5a]">
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── SETTINGS ─────────────────────── */
function SettingsModule() {
  const settingsStore = useStore(s => s.settings);
  const updateSettings = useStore(s => s.updateSettings);
  const [settings, setSettings] = useState(settingsStore);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  type SettingsKey = keyof typeof settingsStore;
  const fields: { key: SettingsKey; label: string; placeholder: string; isTextarea?: boolean }[] = [
    { key: "phone", label: "Phone Number", placeholder: "+252..." },
    { key: "email", label: "Email Address", placeholder: "info@..." },
    { key: "addressSo", label: "Address (Somali)", placeholder: "Muqdisho, Soomaaliya" },
    { key: "addressEn", label: "Address (English)", placeholder: "Mogadishu, Somalia" },
    { key: "whatsapp", label: "WhatsApp Number (no +)", placeholder: "252619337904" },
    { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/..." },
    { key: "mapEmbedCode", label: "Google Map Embed Code", placeholder: "<iframe..." },
    { key: "seoDescriptionSo", label: "SEO Description (Somali)", placeholder: "Miftaxul Quran...", isTextarea: true },
    { key: "seoDescriptionEn", label: "SEO Description (English)", placeholder: "Miftaxul Quran...", isTextarea: true },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="font-extrabold text-gray-900 mb-1">Site Settings</h2>
        <p className="text-xs text-gray-400 mb-6">These values appear in the site footer, contact section, and WhatsApp button.</p>
        <div className="space-y-5">
          {fields.map(({ key, label, placeholder, isTextarea }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-700 mb-2">{label}</label>
              {isTextarea ? (
                <textarea value={settings[key] as string} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              ) : (
                <input value={settings[key] as string} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <label className="block text-xs font-bold text-gray-700 mb-2">Teacher Online Status (Live Badge)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setSettings(s => ({ ...s, isTeacherLive: !s.isTeacherLive }))}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.isTeacherLive ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.isTeacherLive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <p className="text-xs text-gray-500">When ON, a red 'Live' badge appears on the Hero section teacher card.</p>
          </div>
        </div>

        <button onClick={save} className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
          {saved ? <><Check className="h-4 w-4" />Saved to Store!</> : <><Save className="h-4 w-4" />Save Settings</>}
        </button>
      </div>

      <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Current Live Values</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="font-bold text-gray-600">Phone:</span> <span className="text-gray-800">{settingsStore.phone}</span></div>
          <div><span className="font-bold text-gray-600">Email:</span> <span className="text-gray-800">{settingsStore.email}</span></div>
          <div className="col-span-2"><span className="font-bold text-gray-600">Address (EN):</span> <span className="text-gray-800">{settingsStore.addressEn}</span></div>
          <div className="col-span-2"><span className="font-bold text-gray-600">WhatsApp:</span> <span className="text-gray-800">+{settingsStore.whatsapp}</span></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── LEADS ─────────────────────── */
function LeadsModule() {
  const leads = useStore(state => state.leads);
  const updateLeadStatus = useStore(state => state.updateLeadStatus);
  const deleteLead = useStore(state => state.deleteLead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Student Leads</h2>
          <p className="text-sm text-gray-500">Manage submissions from the registration form.</p>
        </div>
        <div className="bg-primary-50 text-primary-900 px-4 py-2 rounded-xl text-sm font-bold border border-primary-100">
          Total Leads: {leads?.length || 0}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
              <tr>
                <th className="p-4 whitespace-nowrap">Name & Contact</th>
                <th className="p-4 whitespace-nowrap">Course Info</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!leads || leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No leads yet.</td>
                </tr>
              ) : leads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{l.name} <span className="text-gray-400 font-normal text-xs">(Age: {l.age})</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">{l.phone}</p>
                    {l.email && <p className="text-xs text-gray-500">{l.email}</p>}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-primary">{l.course}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{l.level} • {l.schedule}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={l.status}
                      onChange={(e) => updateLeadStatus(l.id, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                        l.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        l.status === "Contacted" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-green-50 text-green-700 border-green-200"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Enrolled">Enrolled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteLead(l.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── TEACHERS ─────────────────────── */
function TeachersModule() {
  const teachers = useStore(state => state.teachers);
  const addTeacher = useStore(state => state.addTeacher);
  const updateTeacher = useStore(state => state.updateTeacher);
  const deleteTeacher = useStore(state => state.deleteTeacher);
  const updateTeacherCredentials = useStore(state => state.updateTeacherCredentials);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [credId, setCredId] = useState<string | null>(null);
  const [cred, setCred] = useState({ username: "", password: "" });

  const handleAdd = () => {
    setEditingId("new");
    setForm({ id: `t-${Date.now()}`, name: "", titleSo: "", titleEn: "", bioSo: "", bioEn: "", imageUrl: "", username: "", password: "" });
  };

  const handleSave = () => {
    if (editingId === "new") addTeacher(form);
    else updateTeacher(form.id, form);
    setEditingId(null);
  };

  const openCred = (t: any) => {
    setCredId(t.id);
    setCred({ username: t.username || "", password: t.password || "" });
  };

  const saveCred = () => {
    if (!cred.username || !cred.password) { toast("Username and password are required."); return; }
    updateTeacherCredentials(credId!, cred.username, cred.password);
    setCredId(null);
    toast("Credentials saved / Xogta sirta ah la keydiay!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Teacher Profiles / Macalimiinta</h2>
          <p className="text-sm text-gray-500">Manage staff profiles and login credentials.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-md">
          <Plus className="h-4 w-4" /> Add Teacher / Kudar Macalin
        </button>
      </div>

      {/* Credential editor modal */}
      {credId && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md p-8 relative">
            <button onClick={() => setCredId(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X className="h-5 w-5" /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Lock className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-black text-gray-900">Set Portal Credentials</h3>
                <p className="text-xs text-gray-500">{teachers.find(t => t.id === credId)?.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Username / Magaca Galitaanka</label>
                <input value={cred.username} onChange={e => setCred({ ...cred, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none text-sm"
                  placeholder="e.g. teacher_ahmed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password / Furaha Sirta <span className="text-gold-600 font-normal">(stored client-side)</span></label>
                <input type="password" value={cred.password} onChange={e => setCred({ ...cred, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none text-sm"
                  placeholder="Min 4 characters" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCredId(null)} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={saveCred} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-700 shadow-md flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Credentials / Keydi
              </button>
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <div className="bg-white rounded-2xl border border-primary-200 p-6 shadow-xl mb-8 relative">
          <button onClick={() => setEditingId(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
            <X className="h-5 w-5" />
          </button>
          <h3 className="font-extrabold text-gray-900 mb-6">{editingId === "new" ? "Add New Teacher / Macalin Cusub" : "Edit Teacher / Wax Ka Beddel"}</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name / Magaca Buuxa</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="e.g. Sh. Axmed C." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Username / Magaca Galitaanka <span className="text-gray-400 font-normal">(optional now)</span></label>
                <input value={form.username || ""} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="e.g. teacher_ahmed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password / Furaha Sirta</label>
                <input type="password" value={form.password || ""} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Min 4 characters" />
              </div>
              <div>
                <FileUpload label="Profile Image" accept="image/*" value={form.imageUrl || ""} onChange={val => setForm({...form, imageUrl: val})} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-primary">🇸🇴 Somali Info</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title / Cinwaanka</label>
                <input value={form.titleSo} onChange={e => setForm({...form, titleSo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Taariikh</label>
                <textarea value={form.bioSo} onChange={e => setForm({...form, bioSo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm h-24 resize-none" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-gray-700">🇬🇧 English Info</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bio</label>
                <textarea value={form.bioEn} onChange={e => setForm({...form, bioEn: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm h-24 resize-none" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setEditingId(null)} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-700 shadow-lg">Save Teacher / Keydi</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(!teachers ? [] : teachers).map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => { setEditingId(t.id); setForm(t); }} className="p-2 bg-white text-gray-600 hover:text-primary rounded-lg border border-gray-200 shadow-sm"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => openCred(t)} className="p-2 bg-white text-amber-600 hover:bg-amber-50 rounded-lg border border-gray-200 shadow-sm" title="Set Login Credentials"><Lock className="h-4 w-4" /></button>
              <button onClick={() => deleteTeacher(t.id)} className="p-2 bg-white text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 shadow-sm"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative flex items-center justify-center">
                {t.imageUrl ? <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" /> : <div className="font-bold text-gray-400 text-xl">{t.name[0]}</div>}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{t.name}</h3>
                <p className="text-xs font-medium text-primary mt-0.5 truncate">{t.titleEn}</p>
                {t.username ? (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Lock className="h-2.5 w-2.5" /> @{t.username}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ⚠ No login set
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{t.bioEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── INSIGHTS ─────────────────────── */
function InsightsModule() {
  const insights = useStore(s => s.insights);
  const addInsight = useStore(s => s.addInsight);
  const deleteInsight = useStore(s => s.deleteInsight);

  const insightsHeader = useStore(s => s.insightsHeader);
  const updateInsightsHeader = useStore(s => s.updateInsightsHeader);

  const [headerForm, setHeaderForm] = useState(insightsHeader);
  const [headerSaved, setHeaderSaved] = useState(false);

  const saveHeader = () => {
    updateInsightsHeader(headerForm);
    setHeaderSaved(true);
    setTimeout(() => setHeaderSaved(false), 2000);
  };

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ titleSo: "", titleEn: "", contentSo: "", contentEn: "", image: "", date: "", categorySo: "", categoryEn: "" });

  const add = () => {
    addInsight({ ...form, id: `insight-${Date.now()}`, date: form.date || new Date().toISOString().split('T')[0] });
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Manage Ogaal / Insights ({insights.length})</h2>
          <p className="text-xs text-gray-400 mt-0.5">Post bilingual insights and updates.</p>
        </div>
        <button onClick={() => { setForm({ titleSo: "", titleEn: "", contentSo: "", contentEn: "", image: "", date: "", categorySo: "", categoryEn: "" }); setAdding(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
          <Plus className="h-4 w-4" /> Add Insight
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-gray-900">Page Header Details</h3>
          <button onClick={saveHeader} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors">
            {headerSaved ? "Saved!" : "Save Header"}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Title (Somali)</label>
              <input value={headerForm?.titleSo || ""} onChange={e => setHeaderForm(f => ({ ...f, titleSo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Subtitle (Somali)</label>
              <textarea rows={3} value={headerForm?.subtitleSo || ""} onChange={e => setHeaderForm(f => ({ ...f, subtitleSo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Title (English)</label>
              <input value={headerForm?.titleEn || ""} onChange={e => setHeaderForm(f => ({ ...f, titleEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Subtitle (English)</label>
              <textarea rows={3} value={headerForm?.subtitleEn || ""} onChange={e => setHeaderForm(f => ({ ...f, subtitleEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </div>
        </div>
      </div>

      {adding && (
        <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-gray-900">New Insight</h3>
            <button onClick={() => setAdding(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
          </div>
          
          <div className="mb-5">
            <FileUpload 
              label="Article Image" 
              accept="image/*" 
              value={form.image || ""} 
              onChange={val => setForm(f => ({ ...f, image: val }))} 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category (Somali)</label>
                <input value={form.categorySo} onChange={e => setForm(f => ({ ...f, categorySo: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (Somali)</label>
                <input value={form.titleSo} onChange={e => setForm(f => ({ ...f, titleSo: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Content (Somali)</label>
                <textarea rows={5} value={form.contentSo} onChange={e => setForm(f => ({ ...f, contentSo: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category (English)</label>
                <input value={form.categoryEn} onChange={e => setForm(f => ({ ...f, categoryEn: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (English)</label>
                <input value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Content (English)</label>
                <textarea rows={5} value={form.contentEn} onChange={e => setForm(f => ({ ...f, contentEn: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
              <Plus className="h-4 w-4" /> Publish Insight
            </button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-gray-600 text-sm border border-gray-200">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {insights.map(p => (
          <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-4">
            {p.image && (
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={p.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="inline-block mb-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-50 px-2 py-0.5 rounded-md">
                {p.categoryEn}
              </span>
              <p className="font-bold text-gray-900 text-sm">{p.titleEn}</p>
              <p className="text-xs text-gray-500 mb-1">{p.date}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{p.contentEn}</p>
            </div>
            <button onClick={() => deleteInsight(p.id)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─────────────────────── SECURITY ─────────────────────── */
function SecurityModule() {
  const settingsStore = useStore(s => s.settings);
  const updateSettings = useStore(s => s.updateSettings);

  const [form, setForm] = useState({ adminUser: settingsStore.adminUser || "admin", adminPass: settingsStore.adminPass || "miftaxul2024" });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings({ ...settingsStore, adminUser: form.adminUser, adminPass: form.adminPass });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md space-y-6">
      <div className="rounded-2xl border-2 border-red-100 bg-white p-7 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-5 rounded-full blur-xl -mr-10 -mt-10" />
        <h2 className="font-extrabold text-gray-900 mb-2 flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-500" /> Admin Security
        </h2>
        <p className="text-xs text-gray-500 mb-6">Change your dashboard login credentials.</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Username</label>
            <input value={form.adminUser} onChange={e => setForm(f => ({ ...f, adminUser: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <input type="text" value={form.adminPass} onChange={e => setForm(f => ({ ...f, adminPass: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" />
          </div>
        </div>

        <button onClick={save} className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:bg-red-600 bg-red-500">
          {saved ? <><Check className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />Update Credentials</>}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── QURAN PLAYER ─────────────────────── */
function QuranPlayerModule() {
  const tracks = useStore(s => s.tracks);
  const addTrack = useStore(s => s.addTrack);
  const deleteTrack = useStore(s => s.deleteTrack);
  const toggleTrackActive = useStore(s => s.toggleTrackActive);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", reciter: "", audioDataUrl: "" });

  const add = () => {
    addTrack({ ...form, id: `audio-${Date.now()}`, isActive: false });
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Quran Player (Playlist)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage the background audio playlist played in the Hero section.</p>
        </div>
        <button onClick={() => { setForm({ title: "", reciter: "", audioDataUrl: "" }); setAdding(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
          <Plus className="h-4 w-4" /> Upload Audio
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-gray-900">Upload New Audio</h3>
            <button onClick={() => setAdding(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Track Title (Surah Name)</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Reciter Name (Macallinka Akhrinaya)</label>
                <input value={form.reciter} onChange={e => setForm(f => ({ ...f, reciter: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Direct MP3 Link (URL)</label>
              <input value={form.audioDataUrl} onChange={e => setForm(f => ({ ...f, audioDataUrl: e.target.value }))}
                placeholder="https://server8.mp3quran.net/.../001.mp3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <p className="text-[10px] text-gray-500 mt-1">Paste a direct MP3 link from Quran hosting sites.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
              style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
              <Save className="h-4 w-4" /> Save Audio
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tracks.map(t => (
          <div key={t.id} className={`rounded-2xl border ${t.isActive ? 'border-primary bg-primary-50/30' : 'border-gray-200 bg-white'} p-5 flex items-center gap-4`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${t.isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Music className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{t.title} {t.reciter && <span className="text-gray-500 font-normal ml-1">- {t.reciter}</span>}</p>
              {t.isActive && <p className="text-xs font-bold text-primary flex items-center gap-1 mt-1"><Check className="h-3 w-3" /> In Playlist</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleTrackActive(t.id)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${t.isActive ? 'text-gray-500 bg-gray-100 hover:bg-gray-200' : 'text-primary bg-primary-50 hover:bg-primary-100 border border-primary-200'}`}>
                {t.isActive ? 'Remove from Playlist' : 'Add to Playlist'}
              </button>
              {t.id !== "default-audio" && (
                <button onClick={() => deleteTrack(t.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── CHALLENGES SECTION ─────────────────────── */
function ChallengesModule() {
  const content = useStore(s => s.challengesContent);
  const updateContent = useStore(s => s.updateChallengesContent);

  const [form, setForm] = useState(content);
  const [saved, setSaved] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const save = () => {
    updateContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCard = (id: string, updates: Partial<typeof content.cards[0]>) => {
    setForm(f => ({
      ...f,
      cards: f.cards.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  if (!form) return <div className="p-4">Loading challenges content...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900">Challenges Section (Pain Points)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Edit headings, cards, and the bottom CTA banner.</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-primary-950 text-sm"
          style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save All</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Headings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <h3 className="font-extrabold text-gray-900 mb-5">Main Headings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Badge Text</label>
                <input value={form.badgeTextSo} onChange={e => setForm({ ...form, badgeTextSo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title</label>
                <input value={form.mainTitleSo} onChange={e => setForm({ ...form, mainTitleSo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Badge Text</label>
                <input value={form.badgeTextEn} onChange={e => setForm({ ...form, badgeTextEn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Main Title</label>
                <input value={form.mainTitleEn} onChange={e => setForm({ ...form, mainTitleEn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <h3 className="font-extrabold text-gray-900 mb-5">Challenges Cards (6)</h3>
          <div className="space-y-4">
            {form.cards.map((c, i) => (
              <div key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-700">Card {i + 1}</span>
                  <button onClick={() => setEditingCardId(editingCardId === c.id ? null : c.id)} className="text-xs text-primary font-bold">
                    {editingCardId === c.id ? "Close" : "Edit Card"}
                  </button>
                </div>
                {editingCardId === c.id ? (
                  <div className="space-y-4 pt-3 border-t border-gray-200 mt-3">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
                        <input placeholder="Title" value={c.titleSo} onChange={e => updateCard(c.id, { titleSo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm" />
                        <textarea placeholder="Description" rows={3} value={c.descSo} onChange={e => updateCard(c.id, { descSo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm resize-none" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
                        <input placeholder="Title" value={c.titleEn} onChange={e => updateCard(c.id, { titleEn: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm" />
                        <textarea placeholder="Description" rows={3} value={c.descEn} onChange={e => updateCard(c.id, { descEn: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm resize-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon (Emoji or Base64 Image)</label>
                      <input value={c.icon} onChange={e => updateCard(c.id, { icon: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl overflow-hidden">
                      {c.icon.startsWith('data:') || c.icon.startsWith('http') ? <img src={c.icon} alt="Icon" className="w-full h-full object-cover" /> : c.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{c.titleEn}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{c.descEn}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <h3 className="font-extrabold text-gray-900 mb-5">Bottom CTA Banner</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary">🇸🇴 Somali</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Title</label>
                <input value={form.bannerTitleSo} onChange={e => setForm({ ...form, bannerTitleSo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Description</label>
                <textarea rows={3} value={form.bannerDescSo} onChange={e => setForm({ ...form, bannerDescSo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Button Text</label>
                <input value={form.buttonTextSo} onChange={e => setForm({ ...form, buttonTextSo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700">🇬🇧 English</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Title</label>
                <input value={form.bannerTitleEn} onChange={e => setForm({ ...form, bannerTitleEn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Description</label>
                <textarea rows={3} value={form.bannerDescEn} onChange={e => setForm({ ...form, bannerDescEn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Button Text</label>
                <input value={form.buttonTextEn} onChange={e => setForm({ ...form, buttonTextEn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save All</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── BOTTOM CTA MODULE ─────────────────────── */
function BottomCTAModule() {
  const bottomCTA = useStore(s => s.bottomCTA);
  const updateBottomCTA = useStore(s => s.updateBottomCTA);
  
  const [form, setForm] = useState(bottomCTA);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateBottomCTA(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="font-black text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" /> Final CTA Section
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Somali Fields */}
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2"><span className="text-xl">🇸🇴</span> Somali Content</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Badge</label>
              <input name="badgeSo" value={form.badgeSo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Title</label>
              <textarea name="titleSo" value={form.titleSo} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
              <textarea name="descriptionSo" value={form.descriptionSo} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Buttons</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Button</label>
                <input name="primaryButtonTextSo" value={form.primaryButtonTextSo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Button</label>
                <input name="whatsappButtonTextSo" value={form.whatsappButtonTextSo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Button</label>
                <input name="contactButtonTextSo" value={form.contactButtonTextSo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>

          {/* English Fields */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><span className="text-xl">🇬🇧</span> English Content</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Badge</label>
              <input name="badgeEn" value={form.badgeEn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Title</label>
              <textarea name="titleEn" value={form.titleEn} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
              <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Buttons</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Button</label>
                <input name="primaryButtonTextEn" value={form.primaryButtonTextEn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Button</label>
                <input name="whatsappButtonTextEn" value={form.whatsappButtonTextEn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Button</label>
                <input name="contactButtonTextEn" value={form.contactButtonTextEn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-950 text-base transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
            {saved ? <><Check className="h-5 w-5" /> Saved</> : <><Save className="h-5 w-5" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── FOOTER MODULE ─────────────────────── */
function FooterModule() {
  const footerContent = useStore(s => s.footerContent);
  const updateFooterContent = useStore(s => s.updateFooterContent);
  
  const [form, setForm] = useState(footerContent);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateFooterContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="font-black text-2xl text-gray-900 mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" /> Footer Content
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Somali Fields */}
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2"><span className="text-xl">🇸🇴</span> Somali Content</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">About School</label>
              <textarea name="aboutSo" value={form.aboutSo} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Copyright Text</label>
              <input name="copyrightSo" value={form.copyrightSo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          {/* English Fields */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><span className="text-xl">🇬🇧</span> English Content</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">About School</label>
              <textarea name="aboutEn" value={form.aboutEn} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Copyright Text</label>
              <input name="copyrightEn" value={form.copyrightEn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 mb-8">
          <p className="text-sm text-primary-800 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <strong>Note:</strong> Social media links (Facebook, YouTube, Instagram) are managed in the <em>Site Settings</em> module and will automatically appear in the footer if provided.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-950 text-base transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", boxShadow: "0 4px 14px rgba(240,174,32,0.4)" }}>
            {saved ? <><Check className="h-5 w-5" /> Saved</> : <><Save className="h-5 w-5" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── ABOUT US MODULE ─────────────────────── */
function AboutModule() {
  const content = useStore(s => s.aboutPageContent);
  const update = useStore(s => s.updateAboutPageContent);

  const [form, setForm] = useState(content);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(content);
  }, [content]);

  if (!form) return null;

  const save = () => {
    update(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleValueChange = (index: number, field: string, val: string) => {
    const updated = [...form.values];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, values: updated });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm space-y-6">
        <h2 className="font-extrabold text-gray-900 mb-2">Edit 'About Us' Content</h2>
        
        {/* HERO SECTION */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">1. Hero Section</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-primary">🇸🇴 Somali</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Title</label>
                <input value={form.heroTitleSo} onChange={e => setForm({...form, heroTitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Subtitle</label>
                <textarea rows={2} value={form.heroSubtitleSo} onChange={e => setForm({...form, heroSubtitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700">🇬🇧 English</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Title</label>
                <input value={form.heroTitleEn} onChange={e => setForm({...form, heroTitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hero Subtitle</label>
                <textarea rows={2} value={form.heroSubtitleEn} onChange={e => setForm({...form, heroSubtitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* OUR STORY */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">2. Our Story / History</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (Somali)</label>
                <input value={form.ourStoryTitleSo} onChange={e => setForm({...form, ourStoryTitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Content (Somali)</label>
                <textarea rows={5} value={form.ourStoryContentSo} onChange={e => setForm({...form, ourStoryContentSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (English)</label>
                <input value={form.ourStoryTitleEn} onChange={e => setForm({...form, ourStoryTitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Content (English)</label>
                <textarea rows={5} value={form.ourStoryContentEn} onChange={e => setForm({...form, ourStoryContentEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">3. Mission & Vision</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-primary">Mission</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (Somali / English)</label>
                <div className="flex gap-2">
                  <input value={form.missionTitleSo} onChange={e => setForm({...form, missionTitleSo: e.target.value})} placeholder="SO" className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input value={form.missionTitleEn} onChange={e => setForm({...form, missionTitleEn: e.target.value})} placeholder="EN" className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (Somali)</label>
                <textarea rows={4} value={form.missionDescriptionSo} onChange={e => setForm({...form, missionDescriptionSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (English)</label>
                <textarea rows={4} value={form.missionDescriptionEn} onChange={e => setForm({...form, missionDescriptionEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700">Vision</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title (Somali / English)</label>
                <div className="flex gap-2">
                  <input value={form.visionTitleSo} onChange={e => setForm({...form, visionTitleSo: e.target.value})} placeholder="SO" className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input value={form.visionTitleEn} onChange={e => setForm({...form, visionTitleEn: e.target.value})} placeholder="EN" className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (Somali)</label>
                <textarea rows={4} value={form.visionDescriptionSo} onChange={e => setForm({...form, visionDescriptionSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description (English)</label>
                <textarea rows={4} value={form.visionDescriptionEn} onChange={e => setForm({...form, visionDescriptionEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">4. Core Values</h3>
          <div className="grid gap-4">
            {form.values.map((v, idx) => (
              <div key={v.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Icon (Lucide)</label>
                    <input value={v.iconName} onChange={e => handleValueChange(idx, 'iconName', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Color (Hex)</label>
                    <input value={v.color} onChange={e => handleValueChange(idx, 'color', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title (SO)</label>
                    <input value={v.titleSo} onChange={e => handleValueChange(idx, 'titleSo', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title (EN)</label>
                    <input value={v.titleEn} onChange={e => handleValueChange(idx, 'titleEn', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Desc (SO)</label>
                    <textarea rows={2} value={v.descSo} onChange={e => handleValueChange(idx, 'descSo', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Desc (EN)</label>
                    <textarea rows={2} value={v.descEn} onChange={e => handleValueChange(idx, 'descEn', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-950 text-sm shadow-sm" style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save About Us</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PRICING MODULE ─────────────────────── */
function PricingModule() {
  const content = useStore(s => s.pricingContent);
  const update = useStore(s => s.updatePricingContent);

  const [form, setForm] = useState(content);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(content);
  }, [content]);

  if (!form) return null;

  const save = () => {
    update(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPlan = () => {
    const newPlan = {
      id: "p" + Date.now(),
      nameSo: "Magaca",
      nameEn: "Plan Name",
      price: "$0",
      periodSo: "/ bishii",
      periodEn: "/ month",
      featuresSo: ["Muhiimada 1"],
      featuresEn: ["Feature 1"],
      buttonTextSo: "Dooro",
      buttonTextEn: "Choose Plan",
      isPopular: false
    };
    setForm({ ...form, plans: [...form.plans, newPlan] });
  };

  const deletePlan = (id: string) => {
    setForm({ ...form, plans: form.plans.filter(p => p.id !== id) });
  };

  const updatePlan = (id: string, field: string, val: any) => {
    setForm({
      ...form,
      plans: form.plans.map(p => p.id === id ? { ...p, [field]: val } : p)
    });
  };

  const updatePlanFeature = (planId: string, lang: 'So' | 'En', index: number, val: string) => {
    setForm({
      ...form,
      plans: form.plans.map(p => {
        if (p.id === planId) {
          const field = `features${lang}` as "featuresSo" | "featuresEn";
          const newFeatures = [...p[field]];
          newFeatures[index] = val;
          return { ...p, [field]: newFeatures };
        }
        return p;
      })
    });
  };

  const addPlanFeature = (planId: string, lang: 'So' | 'En') => {
    setForm({
      ...form,
      plans: form.plans.map(p => {
        if (p.id === planId) {
          const field = `features${lang}` as "featuresSo" | "featuresEn";
          return { ...p, [field]: [...p[field], ""] };
        }
        return p;
      })
    });
  };

  const removePlanFeature = (planId: string, lang: 'So' | 'En', index: number) => {
    setForm({
      ...form,
      plans: form.plans.map(p => {
        if (p.id === planId) {
          const field = `features${lang}` as "featuresSo" | "featuresEn";
          const newFeatures = [...p[field]];
          newFeatures.splice(index, 1);
          return { ...p, [field]: newFeatures };
        }
        return p;
      })
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-gray-900 mb-1">Pricing Section</h2>
            <p className="text-xs text-gray-400">Manage the pricing plans and headers on the home page.</p>
          </div>
          <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-primary-950 text-sm transition-all shadow-sm"
            style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)" }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save All</>}
          </button>
        </div>

        {/* Section Headers */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">Section Headers</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-primary text-xs">🇸🇴 Somali</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Main Title</label>
                <input value={form.mainTitleSo} onChange={e => setForm({...form, mainTitleSo: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                <input value={form.subtitleSo} onChange={e => setForm({...form, subtitleSo: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 text-xs">🇬🇧 English</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Main Title</label>
                <input value={form.mainTitleEn} onChange={e => setForm({...form, mainTitleEn: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                <input value={form.subtitleEn} onChange={e => setForm({...form, subtitleEn: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Pricing Plans</h3>
            <button onClick={addPlan} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Plan
            </button>
          </div>
          
          <div className="grid gap-6">
            {form.plans.map((p, idx) => (
              <div key={p.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-400">#{idx + 1}</span>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={p.isPopular} onChange={e => updatePlan(p.id, 'isPopular', e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
                      Most Popular Plan (Highlight)
                    </label>
                  </div>
                  <button onClick={() => deletePlan(p.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* SO/EN Pairs */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Name (SO)</label>
                    <input value={p.nameSo} onChange={e => updatePlan(p.id, 'nameSo', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Name (EN)</label>
                    <input value={p.nameEn} onChange={e => updatePlan(p.id, 'nameEn', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price (e.g. $30)</label>
                    <input value={p.price} onChange={e => updatePlan(p.id, 'price', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Period (SO / EN)</label>
                    <div className="flex gap-2">
                      <input value={p.periodSo} onChange={e => updatePlan(p.id, 'periodSo', e.target.value)} placeholder="/ bishii" className="w-1/2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                      <input value={p.periodEn} onChange={e => updatePlan(p.id, 'periodEn', e.target.value)} placeholder="/ month" className="w-1/2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Button Text (SO)</label>
                    <input value={p.buttonTextSo} onChange={e => updatePlan(p.id, 'buttonTextSo', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Button Text (EN)</label>
                    <input value={p.buttonTextEn} onChange={e => updatePlan(p.id, 'buttonTextEn', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>
                </div>

                {/* Features Lists */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  {/* SO Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-primary">Features (Somali)</label>
                      <button onClick={() => addPlanFeature(p.id, 'So')} className="text-xs text-primary-600 hover:underline">Add Feature</button>
                    </div>
                    <div className="space-y-2">
                      {p.featuresSo.map((f, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input value={f} onChange={e => updatePlanFeature(p.id, 'So', fi, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                          <button onClick={() => removePlanFeature(p.id, 'So', fi)} className="text-gray-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EN Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-700">Features (English)</label>
                      <button onClick={() => addPlanFeature(p.id, 'En')} className="text-xs text-gray-600 hover:underline">Add Feature</button>
                    </div>
                    <div className="space-y-2">
                      {p.featuresEn.map((f, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input value={f} onChange={e => updatePlanFeature(p.id, 'En', fi, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                          <button onClick={() => removePlanFeature(p.id, 'En', fi)} className="text-gray-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LIBRARY CONTENT MODULE
═══════════════════════════════════════ */
function LibraryContentModule() {
  const libraryPageContent = useStore(state => state.libraryPageContent);
  const updateLibraryPageContent = useStore(state => state.updateLibraryPageContent);
  const [content, setContent] = useState(libraryPageContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (libraryPageContent) {
      setContent(libraryPageContent);
    }
  }, [libraryPageContent]);

  if (!content) return null;

  const handleSave = () => {
    setSaving(true);
    updateLibraryPageContent(content);
    setTimeout(() => {
      setSaving(false);
      toast("Library Content saved successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-primary-950">Manage Library Header</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-sm">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-sm space-y-8">
        {/* Badge */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold-500" />
            Hero Badge
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                Somali <span className="text-lg">🇸🇴</span>
              </label>
              <input type="text" value={content.heroBadgeSo} onChange={e => setContent({...content, heroBadgeSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                English <span className="text-lg">🇬🇧</span>
              </label>
              <input type="text" value={content.heroBadgeEn} onChange={e => setContent({...content, heroBadgeEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Main Title</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                Somali <span className="text-lg">🇸🇴</span>
              </label>
              <input type="text" value={content.heroTitleSo} onChange={e => setContent({...content, heroTitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                English <span className="text-lg">🇬🇧</span>
              </label>
              <input type="text" value={content.heroTitleEn} onChange={e => setContent({...content, heroTitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subtitle</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                Somali <span className="text-lg">🇸🇴</span>
              </label>
              <textarea rows={3} value={content.heroSubtitleSo} onChange={e => setContent({...content, heroSubtitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                English <span className="text-lg">🇬🇧</span>
              </label>
              <textarea rows={3} value={content.heroSubtitleEn} onChange={e => setContent({...content, heroSubtitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {/* Search Placeholder */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Search Placeholder</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                Somali <span className="text-lg">🇸🇴</span>
              </label>
              <input type="text" value={content.searchPlaceholderSo} onChange={e => setContent({...content, searchPlaceholderSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                English <span className="text-lg">🇬🇧</span>
              </label>
              <input type="text" value={content.searchPlaceholderEn} onChange={e => setContent({...content, searchPlaceholderEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   IJAZAH MODULE
═══════════════════════════════════════ */
function IjazahModule() {
  const ijazahContent = useStore(state => state.ijazahContent);
  const updateIjazahContent = useStore(state => state.updateIjazahContent);
  const [content, setContent] = useState(ijazahContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ijazahContent) setContent(ijazahContent);
  }, [ijazahContent]);

  if (!content) return null;

  const handleSave = () => {
    setSaving(true);
    updateIjazahContent(content);
    setTimeout(() => {
      setSaving(false);
      toast("Ijazah Content saved successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-primary-950">Manage Ijazah Section</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-sm">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-sm space-y-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Main Title</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">Somali <span className="text-lg">🇸🇴</span></label>
              <input type="text" value={content.titleSo} onChange={e => setContent({...content, titleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">English <span className="text-lg">🇬🇧</span></label>
              <input type="text" value={content.titleEn} onChange={e => setContent({...content, titleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subtitle</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">Somali <span className="text-lg">🇸🇴</span></label>
              <input type="text" value={content.subtitleSo} onChange={e => setContent({...content, subtitleSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">English <span className="text-lg">🇬🇧</span></label>
              <input type="text" value={content.subtitleEn} onChange={e => setContent({...content, subtitleEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">Somali <span className="text-lg">🇸🇴</span></label>
              <textarea rows={4} value={content.descriptionSo} onChange={e => setContent({...content, descriptionSo: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">English <span className="text-lg">🇬🇧</span></label>
              <textarea rows={4} value={content.descriptionEn} onChange={e => setContent({...content, descriptionEn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Certificate Mockup Image</h3>
          <FileUpload value={content.certificateImage} onChange={v => setContent({...content, certificateImage: v})} accept="image/*" label="Upload Certificate Mockup" />
          {content.certificateImage && (
            <img src={content.certificateImage} alt="Certificate" className="mt-4 h-32 rounded-xl shadow-md border border-gray-200 object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STUDENT MANAGEMENT MODULE
═══════════════════════════════════════ */
function StudentsModule() {
  const students = useStore(s => s.students);
  const teachers = useStore(s => s.teachers);
  const addStudent = useStore(s => s.addStudent);
  const deleteStudent = useStore(s => s.deleteStudent);
  
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: "", studentId: "", status: "Active" as const, classDays: "", classTime: "", enrollments: [] as any[] });

  const handleAdd = () => {
    if (!form.name || !form.studentId) {
      toast("Please provide name and student ID.");
      return;
    }
    if (form.enrollments.length === 0) {
      toast("Please add at least one subject.");
      return;
    }
    addStudent({
      id: "std-" + Date.now(),
      name: form.name,
      studentId: form.studentId,
      status: form.status,
      classDays: form.classDays,
      classTime: form.classTime,
      enrollments: form.enrollments.map(e => ({ ...e, id: "enr-" + Math.random().toString(36).substr(2, 9) }))
    });
    setForm({ name: "", studentId: "", status: "Active", classDays: "", classTime: "", enrollments: [] });
    setIsAdding(false);
    toast("Student added successfully.");
  };

  const addEnrollment = () => {
    setForm({
      ...form,
      enrollments: [...form.enrollments, { subjectName: "Quran", teacherId: "", level: "", status: "Active" }]
    });
  };

  const updateEnrollment = (index: number, key: string, value: string) => {
    const updated = [...form.enrollments];
    updated[index][key] = value;
    setForm({ ...form, enrollments: updated });
  };

  const removeEnrollment = (index: number) => {
    const updated = [...form.enrollments];
    updated.splice(index, 1);
    setForm({ ...form, enrollments: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Student Management / Maamulka Ardayda</h2>
        <button onClick={() => {
          if (!isAdding) {
            setForm({ ...form, studentId: `MQ-${Math.floor(100 + Math.random() * 900)}` });
          }
          setIsAdding(!isAdding);
        }} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm">
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
          {isAdding ? "Cancel / Jooji" : "Add Student / Kudar Arday"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 space-y-4">
          <h3 className="font-bold text-gray-900">New Student / Arday Cusub</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Student ID / ID-ga Ardayga</label>
              <input value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. MQ-001" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Student Name / Magaca Ardayga</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. Ahmed Ali" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status / Xaaladda</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none bg-white">
                <option value="Active">Active / Wuu Dhigtaa</option>
                <option value="Inactive">Inactive / Ma Dhigto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Class Days / Maalmaha</label>
              <input value={form.classDays} onChange={e => setForm({...form, classDays: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. Mon, Wed, Fri" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Class Time / Saacadda</label>
              <input value={form.classTime} onChange={e => setForm({...form, classTime: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. 14:00 - 15:00" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 text-sm">Subjects (Enrollments) / Maaddooyinka</h4>
              <button onClick={addEnrollment} type="button" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Subject
              </button>
            </div>
            
            <div className="space-y-3">
              {form.enrollments.length === 0 && <p className="text-xs text-gray-500 italic">No subjects added. / Maaddo lama ku darin.</p>}
              {form.enrollments.map((enr, i) => (
                <div key={i} className="flex flex-wrap sm:flex-nowrap gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 items-start">
                  <div className="flex-1">
                    <select value={enr.subjectName} onChange={e => updateEnrollment(i, 'subjectName', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none">
                      <option value="Quran">Quran</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Islamic Studies">Islamic Studies</option>
                      <option value="Qaida">Qaida (Farbar)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <select value={enr.teacherId} onChange={e => updateEnrollment(i, 'teacherId', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none">
                      <option value="">-- Select Teacher --</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input value={enr.level} onChange={e => updateEnrollment(i, 'level', e.target.value)} placeholder="Level (e.g. Book 1)" className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none" />
                  </div>
                  <button onClick={() => removeEnrollment(i)} type="button" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">Save Student / Keydi Ardayga</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900">ID</th>
              <th className="px-6 py-4 font-bold text-gray-900">Name / Magaca</th>
              <th className="px-6 py-4 font-bold text-gray-900">Level / Heerka</th>
              <th className="px-6 py-4 font-bold text-gray-900">Teacher / Macalinka</th>
              <th className="px-6 py-4 font-bold text-gray-900">Status / Xaaladda</th>
              <th className="px-6 py-4 font-bold text-gray-900 text-right">Actions / Ficil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No students found. Add one above. / Arday lama helin. Mid ku dar sare.</td></tr>}
            {students.map(std => {
              const enrolledSubjects = std.enrollments?.map(e => e.subjectName).join(', ') || "-";
              const assignedTeachers = std.enrollments?.map(e => {
                const t = teachers.find(t => t.id === e.teacherId);
                return t ? t.name : "Unassigned";
              }).filter((v, i, a) => a.indexOf(v) === i).join(', ') || "-";

              return (
                <tr key={std.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{std.studentId}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{std.name}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[150px] truncate" title={enrolledSubjects}>{enrolledSubjects}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={assignedTeachers}>{assignedTeachers}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${std.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {std.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { if(confirm("Are you sure?")) deleteStudent(std.id); }} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LESSON LOGS MODULE
═══════════════════════════════════════ */
function LessonLogsModule() {
  const logs = useStore(s => s.attendanceLogs);
  const students = useStore(s => s.students);

  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Lesson Logs (Recent) / Diiwaanka Casharada</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900">Date / Taariikhda</th>
              <th className="px-6 py-4 font-bold text-gray-900">Student / Ardayga</th>
              <th className="px-6 py-4 font-bold text-gray-900">Subject / Maaddada</th>
              <th className="px-6 py-4 font-bold text-gray-900">Status / Xaaladda</th>
              <th className="px-6 py-4 font-bold text-gray-900">Started / Bilawga</th>
              <th className="px-6 py-4 font-bold text-gray-900">Ended / Dhammaadka</th>
              <th className="px-6 py-4 font-bold text-gray-900">Notes / Faallo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedLogs.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-medium">No lesson logs recorded yet. / Weli wax diiwaan cashar ah lama qorin.</td></tr>}
            {sortedLogs.map(log => {
              const student = students.find(s => s.id === log.studentId);
              const started = log.subject === "Quran" || log.subject === "Qaida" ? (log.surahStarted ? `${log.surahStarted}:${log.ayahStarted}` : "-") : (log.lessonStarted ? `${log.lessonStarted} (Pg ${log.pageStarted})` : "-");
              const ended = log.subject === "Quran" || log.subject === "Qaida" ? (log.surahEnded ? `${log.surahEnded}:${log.ayahEnded}` : "-") : (log.lessonEnded ? `${log.lessonEnded} (Pg ${log.pageEnded})` : "-");

              return (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{student?.name || "Unknown Student"}</td>
                  <td className="px-6 py-4 font-medium text-primary">{log.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      log.status === 'Qaatay (Attended)' ? 'bg-green-100 text-green-800' :
                      log.status === 'Aan Qaadan (Absent)' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{started}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{ended}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={log.teacherNote}>{log.teacherNote || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
