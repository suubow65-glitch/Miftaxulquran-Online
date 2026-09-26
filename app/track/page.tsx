"use client";
import { useState, useEffect, useMemo } from 'react';
import { useStore } from "@/lib/store";
import { initialTeachers } from "@/lib/store";
import {
  Search, Award, AlertCircle, Calendar, BookOpen,
  Quote, Download, Star, TrendingUp, Flame, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


// ── subject tab labels: bilingual ─────────────────────────────────────────────
const SUBJECT_LABELS: Record<string, { so: string; en: string; icon: string }> = {
  "Quran":          { so: "Qur'aan",          en: "Qur'aan",       icon: "📖" },
  "Qaida":          { so: "Qa'idah",           en: "Qa'idah",       icon: "🔤" },
  "Tajweed":        { so: "Tajwiid",           en: "Tajweed",       icon: "📜" },
  "Arabic":         { so: "Carabi",            en: "Arabic",        icon: "🖋️" },
  "Islamic Studies":{ so: "Duruusta Diinta",   en: "Islamic Studies",icon: "🕌" },
};
function subjectLabel(name: string) {
  return SUBJECT_LABELS[name] ?? { so: name, en: name, icon: "📚" };
}
function isQuranType(name: string) {
  return name === "Quran" || name === "Qaida" || name === "Tajweed";
}

// ── 30-day heatmap ────────────────────────────────────────────────────────────
type HeatStatus = "attended" | "absent" | "leave" | "none";

export default function TrackPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const storeStudents       = useStore(s => s.students) || [];
  const storeAttendanceLogs = useStore(s => s.attendanceLogs) || [];
  const storeTeachers       = useStore(s => s.teachers) || [];
  const storePayments       = useStore(s => s.payments) || [];
  const storeExams          = useStore(s => s.exams) || [];

  const students = storeStudents.length > 0 ? storeStudents : [];
  const attendanceLogs = storeAttendanceLogs.length > 0 ? storeAttendanceLogs : [];
  const teachers = storeTeachers.length > 0 ? storeTeachers : initialTeachers;
  const payments = storePayments.length > 0 ? storePayments : [];
  const exams = storeExams.length > 0 ? storeExams : [];

  const [query,        setQuery]        = useState("");
  const [hasSearched,  setHasSearched]  = useState(false);
  const [student,      setStudent]      = useState<any>(null);
  const [activeSubject, setActiveSubject] = useState<string>("");

  if (!mounted) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = students.find(s => s.studentId === query.trim().toUpperCase());
    setStudent(found || null);
    setHasSearched(true);
    if (found?.enrollments?.length) {
      setActiveSubject(found.enrollments[0].subjectName);
    } else {
      setActiveSubject("");
    }
  };

  const activeEnrollment  = student?.enrollments?.find((e: any) => e.subjectName === activeSubject);
  const assignedTeacher   = teachers.find(t => t.id === activeEnrollment?.teacherId);

  const subjectLogs = useMemo(() => {
    if (!student || !activeSubject) return [];
    return [...attendanceLogs]
      .filter(l => l.studentId === student.id && l.subject === activeSubject)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceLogs, student, activeSubject]);

  const studentExams = exams?.filter(e => e.studentId === student?.id) || [];
  const activeMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const isPaid = payments?.some(p => p.studentId === student?.id && p.month === activeMonth && p.status === "Paid");

  const presentCount   = subjectLogs.filter(l => l.status.includes("Qaatay")).length;
  const attendanceRate = subjectLogs.length === 0 ? 0 : Math.round((presentCount / subjectLogs.length) * 100);
  const recentLogs     = subjectLogs.slice(0, 6);
  const lastParentNote = subjectLogs.find(l => l.parentNote?.trim());
  const currentJuz     = activeEnrollment?.currentJuz ? parseInt(activeEnrollment.currentJuz) : 0;
  const quranPct       = Math.min(Math.round((currentJuz / 30) * 100), 100);
  const isQuran        = isQuranType(activeSubject);

  // Heatmap: last 30 days
  const heatmapDays = useMemo((): Array<{ date: Date; status: HeatStatus }> => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const log = subjectLogs.find(l => l.date.split("T")[0] === ds);
      let status: HeatStatus = "none";
      if (log) {
        if (log.status.includes("Qaatay")) status = "attended";
        else if (log.status.includes("Aan Qaadan")) status = "absent";
        else status = "leave";
      }
      days.push({ date: d, status });
    }
    return days;
  }, [subjectLogs]);

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #fefce8 50%, #f0fdf4 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gold-400/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* ── Page Header ── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-white/80 backdrop-blur px-4 py-2 text-sm font-bold text-gold-700 shadow-sm">
            <Award className="h-4 w-4" />
            Student Portal / Bogga Ardayga
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Digital Learning{" "}
            <span className="text-gradient-gold">Passport</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Enter the Student ID to view their progress, attendance, and teacher's message.<br />
            <span className="text-gray-400">Geli ID-ga ardayga si aad u aragto horumarkooda, xaadiriskooda, iyo fariinta macalinka.</span>
          </p>
        </div>

        {/* ── Search Box ── */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSearch}
            className="flex bg-white rounded-2xl shadow-lg border border-gold-200/60 overflow-hidden"
          >
            <div className="flex items-center pl-4 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Student ID / Geli ID-ga (e.g. MQ-001)"
              className="flex-1 px-4 py-4 outline-none text-gray-900 bg-transparent placeholder:text-gray-400 font-medium text-sm"
              required
            />
            <button type="submit"
              className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-6 py-4 font-black text-sm transition-all"
            >
              Search / Raadi
            </button>
          </form>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">

          {/* Not found */}
          {hasSearched && !student && (
            <motion.div key="notfound"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-lg mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-md border border-red-100 p-10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Student Not Found / Arday Lama Helin</h2>
              <p className="text-gray-500 text-sm">Please check the ID and try again. / Fadlan hubi ID-ga oo mar kale isku day.</p>
            </motion.div>
          )}

          {/* Found */}
          {hasSearched && student && (
            <motion.div key="found"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6"
            >

              {/* Download Button */}
              <div className="flex justify-end">
                <button onClick={() => alert("Report coming soon / Warbixinta dhawaan ayay imaanaysaa!")}
                  className="flex items-center gap-2 bg-white/80 hover:bg-white border border-gray-200 hover:border-gold-300 text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Report / Soo Dej Warbixinta
                </button>
              </div>

              {/* Subject Tabs */}
              {student.enrollments?.length > 0 ? (
                <div className="flex overflow-x-auto gap-2 pb-1 justify-center">
                  {student.enrollments?.map((enr: any) => {
                    const lbl = subjectLabel(enr.subjectName);
                    const isActive = activeSubject === enr.subjectName;
                    return (
                      <button
                        key={enr.subjectName}
                        onClick={() => setActiveSubject(enr.subjectName)}
                        className={`whitespace-nowrap flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex-shrink-0 ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-primary-700 text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-white/80 text-gray-600 border border-gray-200 hover:border-primary/30 hover:bg-white backdrop-blur"
                        }`}
                      >
                        <span className="text-base">{lbl.icon}</span>
                        <span>{lbl.so} / {lbl.en}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white/80 rounded-2xl p-6 text-center text-gray-500 text-sm border border-gray-100">
                  No subjects enrolled. / Maaddo lama diiwaan gelin.
                </div>
              )}

              {/* Passport Card */}
              {activeSubject && activeEnrollment && (
                <motion.div
                  key={activeSubject}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] shadow-2xl border-4 border-double border-gold-200 overflow-hidden relative"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, #0D5C2E 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                  />

                  {/* Top gold stripe */}
                  <div className="h-2 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

                  {/* Passport Header */}
                  <div className="relative bg-gradient-to-b from-primary/8 via-primary/4 to-transparent px-8 sm:px-12 py-10 pb-8 text-center border-b border-gold-100">
                    <div className="h-20 w-20 bg-white rounded-2xl shadow-md border border-gold-200 flex items-center justify-center text-gold-500 mx-auto mb-4 rotate-3">
                      <Award className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 font-serif">{student.name}</h2>
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-800 px-4 py-1.5 rounded-full text-sm font-bold">
                      ID: {student.studentId}
                      <span className="text-gold-500">•</span>
                      {subjectLabel(activeSubject).so} / {subjectLabel(activeSubject).en}
                      {activeEnrollment.level && (
                        <><span className="text-gold-500">•</span> {activeEnrollment.level}</>
                      )}
                    </div>
                    {assignedTeacher && (
                      <p className="text-gray-500 font-medium mt-2 text-xs uppercase tracking-widest">
                        Instructor / Macalin: {assignedTeacher.name}
                      </p>
                    )}
                    {(student.classDays || student.classTime) && (
                      <p className="text-gray-500 font-medium mt-1 text-xs uppercase tracking-widest">
                        Class Schedule / Jadwalka: {student.classDays} {student.classTime ? `• ${student.classTime}` : ''}
                      </p>
                    )}
                    <div className="mt-3 flex justify-center">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                        isPaid 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {isPaid ? <Star className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Fee Status: {isPaid ? "Paid / Waa Bixiyay" : "Pending / Waa Lagu Leeyahay"}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-12 py-8 space-y-10 relative">

                    {/* ── Teacher's Message ── */}
                    {lastParentNote && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-gradient-to-br from-gold-50 via-amber-50 to-white p-8 rounded-3xl border border-gold-200 shadow-lg overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 opacity-[0.06] rounded-bl-[100px]" />
                        <Quote className="absolute top-5 right-5 h-10 w-10 text-gold-300 rotate-180 opacity-80" />
                        <p className="text-[10px] font-black text-gold-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Star className="h-3 w-3 fill-gold-500" />
                          Teacher's Message / Fariinta Macalinka — Confidential for Parent / Waalidka Keliya
                        </p>
                        <p className="text-gray-800 italic text-lg sm:text-xl leading-relaxed font-serif relative z-10">
                          "{lastParentNote.parentNote}"
                        </p>
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gold-200/60">
                          <p className="text-sm font-bold text-gray-900">{assignedTeacher?.name ?? "Teacher"}</p>
                          <p className="text-xs text-gray-400 font-medium">
                            {new Date(lastParentNote.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Stats Row ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Current Position */}
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gold-200 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-4 group-hover:opacity-8 transition-opacity">
                          <BookOpen className="h-20 w-20 text-primary" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Position / Xaaladda Hadda</p>
                        {isQuran ? (
                          <>
                            <div className="text-2xl font-black text-gray-900">{activeEnrollment.currentSurah || "—"}</div>
                            <div className="text-primary font-bold text-sm mt-1">
                              Juz {activeEnrollment.currentJuz || "—"} • Hizb {activeEnrollment.currentHizb || "—"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-black text-gray-900">{activeEnrollment.currentLesson || "—"}</div>
                            <div className="text-primary font-bold text-sm mt-1">Page {activeEnrollment.currentPage || "—"}</div>
                          </>
                        )}
                      </div>

                      {/* Lessons Attended */}
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gold-200 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-4 group-hover:opacity-8 transition-opacity">
                          <Calendar className="h-20 w-20 text-gold-400" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lessons Attended / Cashar La Qaatay</p>
                        <div className="text-4xl font-black text-gray-900">{presentCount}</div>
                        <div className="text-gold-600 font-bold text-sm mt-1">of {subjectLogs.length} Total / Guud ahaanba</div>
                      </div>

                      {/* Attendance Rate */}
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gold-200 transition-colors flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Attendance / Xaadiris</p>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-black text-gray-900">{attendanceRate}</span>
                          <span className="text-xl font-bold text-gray-400 mb-1">%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* ── Analytics ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Quran Progress Bar */}
                      {isQuran && (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5 text-primary" />
                            Quran Mastery / Horumarka Qur'aanka
                          </h3>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-4xl font-black text-primary">{quranPct}%</span>
                            <span className="text-sm font-bold text-gray-500">Juz {currentJuz} / 30</span>
                          </div>
                          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${quranPct}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full rounded-full relative"
                              style={{ background: "linear-gradient(90deg, #F0AE20, #27AE60)" }}
                            >
                              <div className="absolute inset-0 bg-white/10 rounded-full" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between mt-2">
                            {[0, 10, 20, 30]?.map(n => (
                              <span key={n} className="text-[10px] text-gray-400 font-bold">{n}</span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">Juz Completed / Juus la Dhammeeyay</p>
                        </div>
                      )}

                      {/* 30-Day Attendance Heatmap */}
                      <div className={`bg-gray-50 rounded-2xl p-6 border border-gray-100 ${!isQuran ? "lg:col-span-2" : ""}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Flame className="h-3.5 w-3.5 text-primary" />
                            30-Day Consistency / Joogitaanka 30 Maalmood
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /><span className="text-[10px] text-gray-400 font-bold">Attended / Qaatay</span></div>
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /><span className="text-[10px] text-gray-400 font-bold">Absent / Maqan</span></div>
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-200 inline-block" /><span className="text-[10px] text-gray-400 font-bold">None / Maqna</span></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5">
                          {heatmapDays?.map((day, i) => (
                            <div
                              key={i}
                              title={`${day.date.toLocaleDateString()} — ${day.status}`}
                              className={`aspect-square rounded-md border transition-transform hover:scale-125 cursor-default ${
                                day.status === "attended" ? "bg-emerald-500 border-emerald-600 shadow-sm shadow-emerald-200" :
                                day.status === "absent"   ? "bg-red-400 border-red-500" :
                                day.status === "leave"    ? "bg-amber-400 border-amber-500" :
                                "bg-gray-100 border-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Exam Results ── */}
                    {studentExams.length > 0 && (
                      <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                          <Star className="h-4 w-4 text-primary" />
                          Exam Results / Natiijada Imtixaanka
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {studentExams?.map(exam => (
                            <div key={exam.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-center">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{exam.subject}</p>
                                <p className="text-xs text-gray-500">{exam.term}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-primary">{exam.grade}</p>
                                <p className="text-[10px] font-bold text-gray-400">SCORE: {exam.score}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Lesson History ── */}
                    <div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        Lesson History / Taariikhda Casharada
                      </h3>
                      {recentLogs.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-400 text-sm">
                          No lesson history yet. / Taariikh cashar kuma jiro weli.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentLogs?.map((log, i) => (
                            <div key={log.id}
                              className="group flex items-stretch bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-200 transition-all"
                            >
                              <div className={`w-1.5 flex-shrink-0 ${
                                log.status.includes("Qaatay") ? "bg-primary" :
                                log.status.includes("Aan Qaadan") ? "bg-red-400" :
                                "bg-gold-500"
                              }`} />
                              <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-gray-400 mb-1">
                                    {new Date(log.date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                  </p>
                                  {log.status.includes("Qaatay") ? (
                                    <p className="font-bold text-gray-900 text-sm">
                                      {isQuran ? (
                                        <span>
                                          {log.surahStarted}:{log.ayahStarted}
                                          <span className="mx-1 text-gray-300">→</span>
                                          {log.surahEnded}:{log.ayahEnded}
                                          {log.juz && <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Juz {log.juz}</span>}
                                        </span>
                                      ) : (
                                        <span>
                                          {log.lessonStarted} (Pg {log.pageStarted})
                                          <span className="mx-1 text-gray-300">→</span>
                                          {log.lessonEnded} (Pg {log.pageEnded})
                                        </span>
                                      )}
                                    </p>
                                  ) : (
                                    <p className={`font-black text-xs uppercase tracking-wide ${
                                      log.status.includes("Aan Qaadan") ? "text-red-500" : "text-gold-600"
                                    }`}>{log.status}</p>
                                  )}
                                </div>
                                {log.teacherNote && (
                                  <div className="sm:max-w-xs text-xs text-gray-500 italic bg-gray-50 group-hover:bg-gold-50/50 transition-colors p-3 rounded-xl border border-gray-100">
                                    {log.teacherNote}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Bottom gold stripe */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 mt-4" />
                </motion.div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

