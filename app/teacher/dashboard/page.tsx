"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Student, Enrollment, AttendanceLog, AttendanceStatus } from "@/lib/store";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import Image from "next/image";
import { LogOut, BookOpen, Clock, Check, Save, X, Settings, User, AlertCircle, FileText, Loader2 } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  
  const teachers = useStore(s => s.teachers);
  const students = useStore(s => s.students);
  const addAttendanceLog = useStore(s => s.addAttendanceLog);
  const updateStudent = useStore(s => s.updateStudent);
  
  const [teacher, setTeacher] = useState<any>(null);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Daily Progress Form state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  const [logForm, setLogForm] = useState<Partial<AttendanceLog>>({
    status: "Qaatay (Attended)",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const session = localStorage.getItem("teacher_session");
    if (!session) {
      router.push("/teacher/login");
      return;
    }
    const tchr = teachers.find(t => t.id === session);
    if (!tchr) {
      localStorage.removeItem("teacher_session");
      router.push("/teacher/login");
      return;
    }
    setTeacher(tchr);

    // Filter students assigned to this teacher
    const filtered = students.filter(s => 
      s.enrollments.some(e => e.teacherId === tchr.id)
    );
    setAssignedStudents(filtered);
    setLoading(false);
  }, [router, teachers, students]);

  const handleLogout = () => {
    localStorage.removeItem("teacher_session");
    router.push("/teacher/login");
  };

  const openProgressForm = (student: Student, enrollment: Enrollment) => {
    setSelectedStudent(student);
    setSelectedEnrollment(enrollment);
    
    // Initialize form with current progress
    setLogForm({
      date: new Date().toISOString().split('T')[0],
      subject: enrollment.subjectName,
      subjectId: enrollment.id,
      status: "Qaatay (Attended)",
      juz: enrollment.currentJuz || "",
      hizb: enrollment.currentHizb || "",
      surahStarted: enrollment.currentSurah || "",
      ayahStarted: enrollment.currentAyah || "",
      surahEnded: "",
      ayahEnded: "",
      bookName: enrollment.subjectName,
      lessonStarted: enrollment.currentLesson || "",
      pageStarted: enrollment.currentPage || "",
      lessonEnded: "",
      pageEnded: "",
      teacherNote: "",
      parentNote: ""
    });
  };

  const saveProgress = () => {
    if (!selectedStudent || !selectedEnrollment) return;
    
    const newLog: AttendanceLog = {
      id: `log-${Date.now()}`,
      studentId: selectedStudent.id,
      date: logForm.date || new Date().toISOString().split('T')[0],
      subject: selectedEnrollment.subjectName,
      subjectId: selectedEnrollment.id,
      status: logForm.status as AttendanceStatus,
      juz: logForm.juz,
      hizb: logForm.hizb,
      surahStarted: logForm.surahStarted,
      ayahStarted: logForm.ayahStarted,
      surahEnded: logForm.surahEnded,
      ayahEnded: logForm.ayahEnded,
      bookName: logForm.bookName,
      lessonStarted: logForm.lessonStarted,
      pageStarted: logForm.pageStarted,
      lessonEnded: logForm.lessonEnded,
      pageEnded: logForm.pageEnded,
      teacherNote: logForm.teacherNote,
      parentNote: logForm.parentNote,
    };
    
    addAttendanceLog(newLog);

    // Update the enrollment's current pointers
    const updatedEnrollments = selectedStudent.enrollments?.map(e => {
      if (e.id === selectedEnrollment.id) {
        return {
          ...e,
          currentJuz: logForm.juz || e.currentJuz,
          currentHizb: logForm.hizb || e.currentHizb,
          currentSurah: logForm.surahEnded || logForm.surahStarted || e.currentSurah,
          currentAyah: logForm.ayahEnded || logForm.ayahStarted || e.currentAyah,
          currentLesson: logForm.lessonEnded || logForm.lessonStarted || e.currentLesson,
          currentPage: logForm.pageEnded || logForm.pageStarted || e.currentPage,
        };
      }
      return e;
    });

    updateStudent(selectedStudent.id, {
      ...selectedStudent,
      enrollments: updatedEnrollments
    });

    setSelectedStudent(null);
    setSelectedEnrollment(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center p-1 border border-primary-100">
              <Image src="/logo.png" alt="MQ" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F0AE20] tracking-wider uppercase">{t("Macallinka", "Teacher Portal")}</p>
              <h1 className="text-sm sm:text-base font-extrabold text-gray-900 leading-none">{teacher?.name}</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("Ka bax", "Logout")}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{t("Ardayda Kugu Qoran", "Your Assigned Students")}</h2>
          <p className="text-gray-500 text-sm">{t("Kudar warbixinta horumarka maalinlaha ah ee ardaydaada.", "Add daily progress reports for your students.")}</p>
        </div>

        {assignedStudents.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center shadow-sm">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t("Arday kuguma qorna", "No students assigned")}</h3>
            <p className="text-sm text-gray-500">{t("Fadlan sug maamulka inuu kugu xiro arday.", "Please wait for the admin to assign students to you.")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedStudents?.map(student => (
              <div key={student.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-gray-900 truncate">{student.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${student.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-300"}`}>
                      {student.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">ID: {student.studentId}</p>
                  {(student.classDays || student.classTime) && (
                    <p className="text-xs text-primary-700 font-bold mt-1">
                      {student.classDays} {student.classTime ? `• ${student.classTime}` : ''}
                    </p>
                  )}
                </div>
                
                <div className="p-5 flex-1 space-y-4">
                  {student.enrollments.filter(e => e.teacherId === teacher.id)?.map(enroll => (
                    <div key={enroll.id} className="rounded-xl border border-primary-100 bg-primary-50/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm text-gray-900">{enroll.subjectName}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        {(enroll.subjectName.toLowerCase().includes("quran") || enroll.subjectName.toLowerCase().includes("tajweed")) ? (
                          <>
                            {enroll.currentSurah && <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Surah:</span> {enroll.currentSurah}</p>}
                            {enroll.currentAyah && <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Ayah:</span> {enroll.currentAyah}</p>}
                            {enroll.currentJuz && <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Juz:</span> {enroll.currentJuz}</p>}
                          </>
                        ) : (
                          <>
                            {enroll.currentLesson && <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Lesson:</span> {enroll.currentLesson}</p>}
                            {enroll.currentPage && <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">Page:</span> {enroll.currentPage}</p>}
                          </>
                        )}
                        {(!enroll.currentSurah && !enroll.currentLesson) && (
                          <p className="text-xs text-gray-400 italic">No progress recorded yet.</p>
                        )}
                      </div>

                      <button
                        onClick={() => openProgressForm(student, enroll)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg,#F5C84A,#F0AE20)", color: "#1a1a1a", boxShadow: "0 4px 10px rgba(240,174,32,0.3)" }}
                      >
                        <Clock className="h-3.5 w-3.5" /> {t("Diiwaangeli Maanta", "Log Today's Progress")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Progress Form Modal */}
      {selectedStudent && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-extrabold text-gray-900">{t("Warbixinta Maalinlaha ah", "Daily Progress Form")}</h3>
                <p className="text-xs text-gray-500">{selectedStudent.name} • {selectedEnrollment.subjectName}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Date & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Taariikhda", "Date")}</label>
                  <input type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Xaadirka", "Status")}</label>
                  <select value={logForm.status} onChange={e => setLogForm({...logForm, status: e.target.value as any})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="Qaatay (Attended)">{t("Qaatay (Attended)", "Attended")}</option>
                    <option value="Aan Qaadan (Absent)">{t("Aan Qaadan (Absent)", "Absent")}</option>
                    <option value="Fasax (On Leave)">{t("Fasax (On Leave)", "On Leave")}</option>
                    <option value="Ku Maqan Fasax la'aan (AWOL)">{t("Fasax la'aan (AWOL)", "AWOL")}</option>
                  </select>
                </div>
              </div>

              {logForm.status === "Qaatay (Attended)" && (
                <div className="space-y-6">
                  {/* Progress Inputs depending on subject */}
                  {(selectedEnrollment.subjectName.toLowerCase().includes("quran") || selectedEnrollment.subjectName.toLowerCase().includes("tajweed")) ? (
                    <div className="space-y-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Juz</label>
                          <input type="text" value={logForm.juz || ""} onChange={e => setLogForm({...logForm, juz: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="e.g. 30" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Hizb</label>
                          <input type="text" value={logForm.hizb || ""} onChange={e => setLogForm({...logForm, hizb: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="e.g. 60" />
                        </div>
                      </div>
                      
                      <div className="border-t border-primary-100 pt-4">
                        <label className="block text-xs font-bold text-gray-700 mb-3">Today's Reading (Started → Ended)</label>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <input type="text" value={logForm.surahStarted || ""} onChange={e => setLogForm({...logForm, surahStarted: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Surah Started" />
                          </div>
                          <div>
                            <input type="text" value={logForm.ayahStarted || ""} onChange={e => setLogForm({...logForm, ayahStarted: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Ayah Started" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input type="text" value={logForm.surahEnded || ""} onChange={e => setLogForm({...logForm, surahEnded: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Surah Ended" />
                          </div>
                          <div>
                            <input type="text" value={logForm.ayahEnded || ""} onChange={e => setLogForm({...logForm, ayahEnded: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Ayah Ended" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Book Name</label>
                        <input type="text" value={logForm.bookName || ""} onChange={e => setLogForm({...logForm, bookName: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                      </div>
                      <div className="border-t border-blue-100 pt-4">
                        <label className="block text-xs font-bold text-gray-700 mb-3">Today's Progress (Started → Ended)</label>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <input type="text" value={logForm.lessonStarted || ""} onChange={e => setLogForm({...logForm, lessonStarted: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Lesson Started" />
                          </div>
                          <div>
                            <input type="text" value={logForm.pageStarted || ""} onChange={e => setLogForm({...logForm, pageStarted: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Page Started" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input type="text" value={logForm.lessonEnded || ""} onChange={e => setLogForm({...logForm, lessonEnded: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Lesson Ended" />
                          </div>
                          <div>
                            <input type="text" value={logForm.pageEnded || ""} onChange={e => setLogForm({...logForm, pageEnded: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" placeholder="Page Ended" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Fariinta Waalidka", "Note for Parents")} <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <textarea rows={2} value={logForm.parentNote || ""} onChange={e => setLogForm({...logForm, parentNote: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Feedback visible to parents..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("Xusuusin Macallinka", "Teacher's Internal Note")} <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <textarea rows={2} value={logForm.teacherNote || ""} onChange={e => setLogForm({...logForm, teacherNote: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Private note for yourself or admin..." />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setSelectedStudent(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                {t("Jooji", "Cancel")}
              </button>
              <button onClick={saveProgress} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #0D5C2E 0%, #083D1F 100%)" }}>
                <Save className="h-4 w-4" /> {t("Keydi", "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
