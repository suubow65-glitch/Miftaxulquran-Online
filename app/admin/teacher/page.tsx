"use client";
import { useState } from "react";
import { useStore, AttendanceStatus, Student, Enrollment } from "@/lib/store";
import {
  Users, LogOut, Save, BookOpen, X, ChevronRight,
  Layers, Shield, Clock, GraduationCap, ScrollText, Award
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


// ── Subject helpers ────────────────────────────────────────────────────────────
const SUBJECT_CONFIG: Record<string, { icon: string; color: string; bg: string; border: string; type: "quran" | "arabic" }> = {
  "Quran":          { icon: "📖", color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", type: "quran"  },
  "Qaida":          { icon: "🔤", color: "text-teal-700",    bg: "bg-teal-50",     border: "border-teal-200",    type: "quran"  },
  "Tajweed":        { icon: "📜", color: "text-indigo-700",  bg: "bg-indigo-50",   border: "border-indigo-200",  type: "quran"  },
  "Arabic":         { icon: "🖋️", color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   type: "arabic" },
  "Islamic Studies":{ icon: "🕌", color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-200",    type: "arabic" },
};
function subjectCfg(name: string) {
  return SUBJECT_CONFIG[name] ?? { icon: "📚", color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", type: "arabic" as const };
}
function isQuranType(name: string) { return subjectCfg(name).type === "quran"; }

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "Qaatay (Attended)",
  "Aan Qaadan (Absent)",
  "Fasax (On Leave)",
  "Ku Maqan Fasax la'aan (AWOL)",
];
const STATUS_STYLE: Record<AttendanceStatus, string> = {
  "Qaatay (Attended)":           "border-emerald-500 bg-emerald-50 text-emerald-800",
  "Aan Qaadan (Absent)":         "border-red-500 bg-red-50 text-red-800",
  "Fasax (On Leave)":            "border-amber-500 bg-amber-50 text-amber-800",
  "Ku Maqan Fasax la'aan (AWOL)":"border-rose-900 bg-rose-100 text-rose-900",
};

const blankForm = {
  status: "Qaatay (Attended)" as AttendanceStatus,
  juz: "", hizb: "",
  surahStarted: "", ayahStarted: "",
  surahEnded:   "", ayahEnded:   "",
  bookName: "",
  lessonStarted: "", pageStarted: "",
  lessonEnded:   "", pageEnded:   "",
  teacherNote: "", parentNote: "",
};

const AVATAR_GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-primary to-primary-700",
  "from-amber-400 to-orange-500",
  "from-indigo-500 to-purple-600",
  "from-rose-400 to-pink-600",
];
function avatarGradient(id: string) {
  const index = id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function StudentCard({
  student,
  teacherId,
  onSelectSubject,
}: {
  student: Student;
  teacherId: string;
  onSelectSubject: (studentId: string, subject: string) => void;
}) {
  const mySubjects = student.enrollments?.filter(e => e.teacherId === teacherId) ?? [];
  const initials = student.name.split(" ")?.map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const grad = avatarGradient(student.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-400 to-gold-400 opacity-80" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-gray-900 text-lg leading-tight truncate">{student.name}</h3>
            <p className="text-xs text-primary-700 font-bold mt-0.5 bg-primary/10 px-2 py-0.5 rounded-full inline-block">
              ID: {student.studentId}
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              student.status === "Active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}>
              {student.status === "Active" ? "🟢 Active" : "⚪ Inactive"}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Layers className="h-3 w-3" />
            Active Subjects / Maaddooyinka
          </p>
          <div className="space-y-2">
            {mySubjects.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No subjects assigned</p>
            ) : (
              mySubjects?.map(enr => {
                const cfg = subjectCfg(enr.subjectName);
                return (
                  <button
                    key={enr.id}
                    onClick={() => onSelectSubject(student.id, enr.subjectName)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${cfg.bg} ${cfg.border} ${cfg.color} hover:scale-[1.02] hover:shadow-md transition-all duration-200 group/btn`}
                  >
                    <span className="flex items-center gap-2.5 font-bold text-sm">
                      <span className="text-lg">{cfg.icon}</span>
                      {enr.subjectName}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs opacity-70 group-hover/btn:opacity-100 transition-opacity">
                      {enr.level && <span className="hidden sm:inline font-medium">{enr.level}</span>}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeacherDashboard() {
  const teachers       = useStore(s => s.teachers);
  const students       = useStore(s => s.students);
  const attendanceLogs = useStore(s => s.attendanceLogs);
  const addAttendanceLog = useStore(s => s.addAttendanceLog);
  const updateStudent    = useStore(s => s.updateStudent);

  const [teacherId,       setTeacherId]       = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [form,            setForm]            = useState(blankForm);
  const [saved,           setSaved]           = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const t = teachers.find(t => t.username === loginUsername && t.password === loginPassword);
    if (t) {
      setTeacherId(t.id);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  // ── Teacher login screen ─────────────────────────────────────────────────
  if (!teacherId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-400 rounded-full blur-[120px] opacity-10" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-300 rounded-full blur-[120px] opacity-10" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-xl mb-4 rotate-3">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Teacher Portal</h1>
            <p className="text-primary-200 text-sm font-medium">Gudiga Macalinka / Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-primary-200 uppercase tracking-widest mb-2">Username / Magaca Galitaanka</label>
              <input 
                type="text" 
                value={loginUsername} 
                onChange={e => setLoginUsername(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400/50" 
                placeholder="Enter your username" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-primary-200 uppercase tracking-widest mb-2">Password / Furaha Sirta</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400/50" 
                placeholder="Enter your password" 
              />
            </div>
            {loginError && <p className="text-rose-400 text-sm font-medium">{loginError}</p>}
            <button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-primary-950 font-black text-sm py-3 rounded-xl shadow-lg transition-all"
            >
              Secure Login / Soo Gal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const teacher       = teachers.find(t => t.id === teacherId);
  const myStudents    = students.filter(s => s.enrollments?.some(e => e.teacherId === teacherId));
  const activeStudent = students.find(s => s.id === selectedStudent);
  const isQuran       = isQuranType(selectedSubject);
  const cfg           = subjectCfg(selectedSubject);

  // Stats
  const myLogCount   = attendanceLogs.filter(l => myStudents.some(s => s.id === l.studentId)).length;
  const todayStr     = new Date().toISOString().split("T")[0];
  const todayCount   = attendanceLogs.filter(l => myStudents.some(s => s.id === l.studentId) && l.date.startsWith(todayStr)).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedSubject || !activeStudent) return;

    addAttendanceLog({
      id: "log-" + Date.now(),
      studentId: selectedStudent,
      date:    new Date().toISOString(),
      subject: selectedSubject,
      status:  form.status,
      juz: form.juz, hizb: form.hizb,
      surahStarted: form.surahStarted, ayahStarted: form.ayahStarted,
      surahEnded:   form.surahEnded,   ayahEnded:   form.ayahEnded,
      lessonStarted: form.lessonStarted, pageStarted: form.pageStarted,
      lessonEnded:   form.lessonEnded,   pageEnded:   form.pageEnded,
      teacherNote: form.teacherNote,
      parentNote:  form.parentNote,
    });

    const updatedEnrollments = activeStudent.enrollments?.map((enr: Enrollment) => {
      if (enr.subjectName !== selectedSubject) return enr;
      if (isQuran && form.surahEnded && form.ayahEnded) {
        return { ...enr, currentJuz: form.juz || enr.currentJuz, currentHizb: form.hizb || enr.currentHizb, currentSurah: form.surahEnded, currentAyah: form.ayahEnded };
      }
      if (!isQuran && form.lessonEnded && form.pageEnded) {
        return { ...enr, currentLesson: form.lessonEnded, currentPage: form.pageEnded };
      }
      return enr;
    });
    updateStudent(selectedStudent, { ...activeStudent, enrollments: updatedEnrollments });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedStudent(null);
      setSelectedSubject("");
      setForm(blankForm);
    }, 1800);
  };

  const closePanel = () => { setSelectedStudent(null); setSelectedSubject(""); setForm(blankForm); setSaved(false); };

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-base leading-tight">Teacher Dashboard / Gudiga Macalinka</h1>
              <p className="text-xs text-gray-400 font-medium">Soo dhawoow — Welcome, <span className="text-primary font-bold">{teacher?.name}</span></p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900 leading-none">{myStudents.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">Students / Arday</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="text-center">
              <p className="text-xl font-black text-primary leading-none">{myLogCount}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">Sessions / Cashar</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="text-center">
              <p className="text-xl font-black text-gold-600 leading-none">{todayCount}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">Today / Maanta</p>
            </div>
          </div>
          <button
            onClick={() => setTeacherId("")}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors text-sm font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout / Ka Bax</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">My Students / Ardaydayda</h2>
          <p className="text-gray-500 mt-1.5 text-sm">
            Click a subject to log progress for that session. / Riix maaddada si horumarka casharka loogu galiyo.
          </p>
        </div>

        {myStudents.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Users className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No Students Assigned / Arday Laguu Xilsaaray Ma Jiro</h3>
            <p className="text-gray-500 text-sm">Students assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStudents?.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                teacherId={teacherId}
                onSelectSubject={(sid, sub) => { setSelectedStudent(sid); setSelectedSubject(sub); setForm(blankForm); setSaved(false); }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {selectedStudent && selectedSubject && activeStudent && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm z-40"
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
            >
              {/* Panel Header */}
              <div className="relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400 rounded-full blur-[80px] opacity-15 -translate-y-1/2 translate-x-1/2" />
                <div className="relative px-6 py-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-primary-300 uppercase tracking-widest mb-1">Log Progress / Diiwaangeli Horumarka</p>
                    <h3 className="text-xl font-black text-white leading-tight">{activeStudent.name}</h3>
                    <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      <span className="text-base">{cfg.icon}</span>
                      <span className="font-bold text-sm">{selectedSubject}</span>
                    </div>
                  </div>
                  <button onClick={closePanel} className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors flex-shrink-0">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto">
                {saved ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4 p-8"
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                        <Award className="h-12 w-12 text-emerald-500" />
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-black text-gray-900 mb-1">Saved! / La Keydiyay!</h4>
                      <p className="text-gray-500 text-sm">Progress logged successfully</p>
                    </div>
                  </motion.div>
                ) : (
                  <form id="log-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Attendance */}
                    <fieldset>
                      <legend className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Attendance Status / Xaaladda Soo-xaadirka
                      </legend>
                      <div className="grid grid-cols-2 gap-2.5">
                        {ATTENDANCE_STATUSES?.map(st => (
                          <label key={st} className={`flex items-center justify-center text-center py-3 px-3 rounded-2xl border-2 cursor-pointer transition-all font-bold text-xs leading-tight ${
                            form.status === st ? STATUS_STYLE[st] : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                          }`}>
                            <input type="radio" name="status" className="sr-only" checked={form.status === st} onChange={() => setForm({ ...form, status: st })} />
                            {st}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* Lesson details */}
                    {form.status === "Qaatay (Attended)" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-5">
                          <h4 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Lesson Details / Faahfaahinta Casharka
                          </h4>

                          {/* Quran / Qaida */}
                          {isQuran && (
                            <>
                              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                                {[
                                  { label: "Juz / Juska", field: "juz", placeholder: "e.g. 30" },
                                  { label: "Hizb / Xisbiga", field: "hizb", placeholder: "e.g. 60" },
                                ]?.map(({ label, field, placeholder }) => (
                                  <div key={field}>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
                                    <input value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 bg-white text-sm" placeholder={placeholder} />
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {[
                                  { label: "Surah Started / Suuradda Bilawga",   field: "surahStarted", ph: "e.g. Al-Baqarah" },
                                  { label: "Ayah Started / Aayadda Bilawga",     field: "ayahStarted",  ph: "e.g. 1" },
                                  { label: "Surah Ended / Suuradda Dhammaadka", field: "surahEnded",   ph: "e.g. Al-Baqarah" },
                                  { label: "Ayah Ended / Aayadda Dhammaadka",   field: "ayahEnded",    ph: "e.g. 5" },
                                ]?.map(({ label, field, ph }) => (
                                  <div key={field}>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
                                    <input required value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 bg-white text-sm" placeholder={ph} />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Arabic / Books */}
                          {!isQuran && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Book Name / Magaca Kitaabka</label>
                                <input value={form.bookName} onChange={e => setForm({ ...form, bookName: e.target.value })}
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 bg-white text-sm" placeholder="e.g. Madinah Arabic Book 1" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {[
                                  { label: "Lesson Started / Casharka Bilawga",  field: "lessonStarted", ph: "e.g. Lesson 1" },
                                  { label: "Page Started / Bogga Bilawga",        field: "pageStarted",   ph: "e.g. 12" },
                                  { label: "Lesson Ended / Casharka Dhammaadka", field: "lessonEnded",   ph: "e.g. Lesson 2" },
                                  { label: "Page Ended / Bogga Dhammaadka",       field: "pageEnded",     ph: "e.g. 15" },
                                ]?.map(({ label, field, ph }) => (
                                  <div key={field}>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
                                    <input required value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 bg-white text-sm" placeholder={ph} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Teacher note */}
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ScrollText className="h-3.5 w-3.5" />
                        Internal Note / Xusuusta Macalinka (Optional)
                      </label>
                      <textarea value={form.teacherNote} onChange={e => setForm({ ...form, teacherNote: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 h-20 resize-none text-sm bg-white"
                        placeholder="For academy records only... / Kaydka mac-hadka keliya..." />
                    </div>

                    {/* Confidential parent note */}
                    <div className="bg-gradient-to-br from-gold-50 to-amber-50 border-2 border-gold-200 rounded-2xl p-5">
                      <label className="block text-xs font-black text-gold-700 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5" />
                        Confidential Parent Feedback / Xogta Qarsoon ee Waalidka
                      </label>
                      <p className="text-[11px] text-gold-600/80 mb-3 font-medium">
                        This message will appear on the parent's Digital Passport — keep it professional. / Fariintani waxay u muuqan doontaa waalidka.
                      </p>
                      <textarea value={form.parentNote} onChange={e => setForm({ ...form, parentNote: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gold-200 rounded-xl outline-none focus:ring-2 focus:ring-gold-400/40 h-28 resize-none text-sm bg-white/70"
                        placeholder="Dear Parent, today your child... / Waalidkiis naxariis leh, maanta xiligan..." />
                    </div>
                  </form>
                )}
              </div>

              {/* Panel Footer */}
              {!saved && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                  <button type="submit" form="log-form"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Save className="h-5 w-5" />
                    Save Progress / Keydi Horumarka
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
