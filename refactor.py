import re
import sys

def main():
    try:
        with open('lib/store.ts', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("lib/store.ts not found.")
        sys.exit(1)

    # 1. Teachers
    content = re.sub(
        r'addTeacher: \(teacher\) => \{\n\s*set\(state => \(\{ teachers: \[\.\.\.state\.teachers, teacher\] \}\)\);\n\s*supabase\.from\(\'teachers\'\)\.insert\(\{\n\s*id: teacher\.id, name: teacher\.name,\n\s*title_so: teacher\.titleSo, title_en: teacher\.titleEn,\n\s*bio_so: teacher\.bioSo, bio_en: teacher\.bioEn,\n\s*image_url: teacher\.imageUrl,\n\s*username: teacher\.username, password: teacher\.password,\n\s*\}\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Teacher insert:\', error\.message\); \}\);\n\s*\},',
        r'''addTeacher: async (teacher) => {
        set(state => ({ teachers: [...state.teachers, teacher] }));
        try {
          const { error } = await supabase.from('teachers').insert({
            id: teacher.id, name: teacher.name,
            title_so: teacher.titleSo, title_en: teacher.titleEn,
            bio_so: teacher.bioSo, bio_en: teacher.bioEn,
            image_url: teacher.imageUrl,
            username: teacher.username, password: teacher.password,
          });
          if (error) console.warn('Teacher insert:', error.message);
        } catch (err) { console.error('Teacher insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateTeacher: \(id, teacher\) => \{\n\s*set\(state => \(\{ teachers: state\.teachers\.map\(t => t\.id === id \? teacher : t\) \}\)\);\n\s*supabase\.from\(\'teachers\'\)\.update\(\{\n\s*name: teacher\.name,\n\s*title_so: teacher\.titleSo, title_en: teacher\.titleEn,\n\s*bio_so: teacher\.bioSo, bio_en: teacher\.bioEn,\n\s*image_url: teacher\.imageUrl,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Teacher update:\', error\.message\); \}\);\n\s*\},',
        r'''updateTeacher: async (id, teacher) => {
        set(state => ({ teachers: state.teachers.map(t => t.id === id ? teacher : t) }));
        try {
          const { error } = await supabase.from('teachers').update({
            name: teacher.name,
            title_so: teacher.titleSo, title_en: teacher.titleEn,
            bio_so: teacher.bioSo, bio_en: teacher.bioEn,
            image_url: teacher.imageUrl,
          }).eq('id', id);
          if (error) console.warn('Teacher update:', error.message);
        } catch (err) { console.error('Teacher update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteTeacher: \(id\) => \{\n\s*set\(state => \(\{ teachers: state\.teachers\.filter\(t => t\.id !== id\) \}\)\);\n\s*supabase\.from\(\'teachers\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Teacher delete:\', error\.message\); \}\);\n\s*\},',
        r'''deleteTeacher: async (id) => {
        set(state => ({ teachers: state.teachers.filter(t => t.id !== id) }));
        try {
          const { error } = await supabase.from('teachers').delete().eq('id', id);
          if (error) console.warn('Teacher delete:', error.message);
        } catch (err) { console.error('Teacher delete failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateTeacherCredentials: \(id, username, password\) => \{\n\s*set\(state => \(\{ teachers: state\.teachers\.map\(t => t\.id === id \? \{ \.\.\.t, username, password \} : t\) \}\)\);\n\s*supabase\.from\(\'teachers\'\)\.update\(\{ username, password \}\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Teacher creds update:\', error\.message\); \}\);\n\s*\},',
        r'''updateTeacherCredentials: async (id, username, password) => {
        set(state => ({ teachers: state.teachers.map(t => t.id === id ? { ...t, username, password } : t) }));
        try {
          const { error } = await supabase.from('teachers').update({ username, password }).eq('id', id);
          if (error) console.warn('Teacher creds update:', error.message);
        } catch (err) { console.error('Teacher creds update failed:', err); }
      },''',
        content
    )

    # Insights
    content = re.sub(
        r'addInsight: \(insight\) => \{\n\s*set\(state => \(\{ insights: \[insight, \.\.\.state\.insights\] \}\)\);\n\s*supabase\.from\(\'insights\'\)\.insert\(\{\n\s*id: insight\.id, image: insight\.image,\n\s*category_so: insight\.categorySo, category_en: insight\.categoryEn,\n\s*title_so: insight\.titleSo, title_en: insight\.titleEn,\n\s*content_so: insight\.contentSo, content_en: insight\.contentEn,\n\s*date: insight\.date,\n\s*\}\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Insight insert:\', error\.message\); \}\);\n\s*\},',
        r'''addInsight: async (insight) => {
        set(state => ({ insights: [insight, ...state.insights] }));
        try {
          const { error } = await supabase.from('insights').insert({
            id: insight.id, image: insight.image,
            category_so: insight.categorySo, category_en: insight.categoryEn,
            title_so: insight.titleSo, title_en: insight.titleEn,
            content_so: insight.contentSo, content_en: insight.contentEn,
            date: insight.date,
          });
          if (error) console.warn('Insight insert:', error.message);
        } catch (err) { console.error('Insight insert failed:', err); }
      },''',
        content
    )
    
    content = re.sub(
        r'updateInsight: \(id, insight\) => \{\n\s*set\(state => \(\{ insights: state\.insights\.map\(p => p\.id === id \? insight : p\) \}\)\);\n\s*supabase\.from\(\'insights\'\)\.update\(\{\n\s*image: insight\.image,\n\s*category_so: insight\.categorySo, category_en: insight\.categoryEn,\n\s*title_so: insight\.titleSo, title_en: insight\.titleEn,\n\s*content_so: insight\.contentSo, content_en: insight\.contentEn,\n\s*date: insight\.date,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Insight update:\', error\.message\); \}\);\n\s*\},',
        r'''updateInsight: async (id, insight) => {
        set(state => ({ insights: state.insights.map(p => p.id === id ? insight : p) }));
        try {
          const { error } = await supabase.from('insights').update({
            image: insight.image,
            category_so: insight.categorySo, category_en: insight.categoryEn,
            title_so: insight.titleSo, title_en: insight.titleEn,
            content_so: insight.contentSo, content_en: insight.contentEn,
            date: insight.date,
          }).eq('id', id);
          if (error) console.warn('Insight update:', error.message);
        } catch (err) { console.error('Insight update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteInsight: \(id\) => \{\n\s*set\(state => \(\{ insights: state\.insights\.filter\(p => p\.id !== id\) \}\)\);\n\s*supabase\.from\(\'insights\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Insight delete:\', error\.message\); \}\);\n\s*\},',
        r'''deleteInsight: async (id) => {
        set(state => ({ insights: state.insights.filter(p => p.id !== id) }));
        try {
          const { error } = await supabase.from('insights').delete().eq('id', id);
          if (error) console.warn('Insight delete:', error.message);
        } catch (err) { console.error('Insight delete failed:', err); }
      },''',
        content
    )

    # Hero Slides
    content = re.sub(
        r'addHeroSlide: \(slide\) => set\(\(state\) => \(\{ heroSlides: \[\.\.\.state\.heroSlides, slide\] \}\)\),',
        r'''addHeroSlide: async (slide) => {
        set((state) => ({ heroSlides: [...state.heroSlides, slide] }));
        try {
          const { error } = await supabase.from('hero_slides').insert({
            id: slide.id, image: slide.image,
            hadith_ar: slide.hadithAr, hadith_so: slide.hadithSo, hadith_en: slide.hadithEn,
            sort_order: 0 // Optional, default handling
          });
          if (error) console.warn('HeroSlide insert:', error.message);
        } catch (err) { console.error('HeroSlide insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateHeroSlide: \(id, slide\) => set\(\(state\) => \(\{ heroSlides: state\.heroSlides\.map\(\(s\) => \(s\.id === id \? slide : s\)\) \}\)\),',
        r'''updateHeroSlide: async (id, slide) => {
        set((state) => ({ heroSlides: state.heroSlides.map((s) => (s.id === id ? slide : s)) }));
        try {
          const { error } = await supabase.from('hero_slides').update({
            image: slide.image,
            hadith_ar: slide.hadithAr, hadith_so: slide.hadithSo, hadith_en: slide.hadithEn,
          }).eq('id', id);
          if (error) console.warn('HeroSlide update:', error.message);
        } catch (err) { console.error('HeroSlide update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteHeroSlide: \(id\) => set\(\(state\) => \(\{ heroSlides: state\.heroSlides\.filter\(\(s\) => s\.id !== id\) \}\)\),',
        r'''deleteHeroSlide: async (id) => {
        set((state) => ({ heroSlides: state.heroSlides.filter((s) => s.id !== id) }));
        try {
          const { error } = await supabase.from('hero_slides').delete().eq('id', id);
          if (error) console.warn('HeroSlide delete:', error.message);
        } catch (err) { console.error('HeroSlide delete failed:', err); }
      },''',
        content
    )


    # Students
    content = re.sub(
        r'addStudent: \(student\) => \{\n\s*set\(state => \(\{ students: \[\.\.\.state\.students, student\] \}\)\);\n\s*supabase\.from\(\'students\'\)\.insert\(\{\n\s*id: student\.id, student_id: student\.studentId,\n\s*name: student\.name, status: student\.status,\n\s*class_days: student\.classDays, class_time: student\.classTime,\n\s*\}\)\.then\(\(\{ error \}\) => \{\n\s*if \(error\) \{ console\.warn\(\'Student insert:\', error\.message\); return; \}\n\s*// persist enrollments\n\s*if \(student\.enrollments\?\.length\) \{\n\s*supabase\.from\(\'enrollments\'\)\.insert\(\n\s*student\.enrollments\.map\(e => \(\{\n\s*id: e\.id, student_id: student\.id,\n\s*subject_name: e\.subjectName, teacher_id: e\.teacherId,\n\s*level: e\.level, status: e\.status,\n\s*total_lessons: e\.totalLessons,\n\s*current_juz: e\.currentJuz, current_hizb: e\.currentHizb,\n\s*current_surah: e\.currentSurah, current_ayah: e\.currentAyah,\n\s*current_lesson: e\.currentLesson, current_page: e\.currentPage,\n\s*\}\)\)\n\s*\)\.then\(\(\{ error: ee \}\) => \{ if \(ee\) console\.warn\(\'Enroll insert:\', ee\.message\); \}\);\n\s*\}\n\s*\}\);\n\s*\},',
        r'''addStudent: async (student) => {
        set(state => ({ students: [...state.students, student] }));
        try {
          const { error } = await supabase.from('students').insert({
            id: student.id, student_id: student.studentId,
            name: student.name, status: student.status,
            class_days: student.classDays, class_time: student.classTime,
          });
          if (error) { console.warn('Student insert:', error.message); return; }
          
          if (student.enrollments?.length) {
            const { error: ee } = await supabase.from('enrollments').insert(
              student.enrollments.map(e => ({
                id: e.id, student_id: student.id,
                subject_name: e.subjectName, teacher_id: e.teacherId,
                level: e.level, status: e.status,
                total_lessons: e.totalLessons,
                current_juz: e.currentJuz, current_hizb: e.currentHizb,
                current_surah: e.currentSurah, current_ayah: e.currentAyah,
                current_lesson: e.currentLesson, current_page: e.currentPage,
              }))
            );
            if (ee) console.warn('Enroll insert:', ee.message);
          }
        } catch (err) { console.error('Student insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateStudent: \(id, student\) => \{\n\s*set\(state => \(\{ students: state\.students\.map\(s => s\.id === id \? student : s\) \}\)\);\n\s*supabase\.from\(\'students\'\)\.update\(\{\n\s*student_id: student\.studentId, name: student\.name,\n\s*status: student\.status, class_days: student\.classDays, class_time: student\.classTime,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Student update:\', error\.message\); \}\);\n\s*\},',
        r'''updateStudent: async (id, student) => {
        set(state => ({ students: state.students.map(s => s.id === id ? student : s) }));
        try {
          const { error } = await supabase.from('students').update({
            student_id: student.studentId, name: student.name,
            status: student.status, class_days: student.classDays, class_time: student.classTime,
          }).eq('id', id);
          if (error) console.warn('Student update:', error.message);
        } catch (err) { console.error('Student update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteStudent: \(id\) => \{\n\s*set\(state => \(\{ students: state\.students\.filter\(s => s\.id !== id\) \}\)\);\n\s*supabase\.from\(\'students\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Student delete:\', error\.message\); \}\);\n\s*\},',
        r'''deleteStudent: async (id) => {
        set(state => ({ students: state.students.filter(s => s.id !== id) }));
        try {
          const { error } = await supabase.from('students').delete().eq('id', id);
          if (error) console.warn('Student delete:', error.message);
        } catch (err) { console.error('Student delete failed:', err); }
      },''',
        content
    )

    # Attendance
    content = re.sub(
        r'addAttendanceLog: \(log\) => \{\n\s*set\(state => \(\{ attendanceLogs: \[\.\.\.state\.attendanceLogs, log\] \}\)\);\n\s*supabase\.from\(\'attendance_logs\'\)\.insert\(\{\n\s*id: log\.id, student_id: log\.studentId,\n\s*date: log\.date, subject: log\.subject, subject_id: log\.subjectId,\n\s*status: log\.status,\n\s*juz: log\.juz, hizb: log\.hizb,\n\s*surah_started: log\.surahStarted, ayah_started: log\.ayahStarted,\n\s*surah_ended: log\.surahEnded, ayah_ended: log\.ayahEnded,\n\s*book_name: log\.bookName,\n\s*lesson_started: log\.lessonStarted, page_started: log\.pageStarted,\n\s*lesson_ended: log\.lessonEnded, page_ended: log\.pageEnded,\n\s*teacher_note: log\.teacherNote, parent_note: log\.parentNote,\n\s*\}\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Attendance insert:\', error\.message\); \}\);\n\s*\},',
        r'''addAttendanceLog: async (log) => {
        set(state => ({ attendanceLogs: [...state.attendanceLogs, log] }));
        try {
          const { error } = await supabase.from('attendance_logs').insert({
            id: log.id, student_id: log.studentId,
            date: log.date, subject: log.subject, subject_id: log.subjectId,
            status: log.status,
            juz: log.juz, hizb: log.hizb,
            surah_started: log.surahStarted, ayah_started: log.ayahStarted,
            surah_ended: log.surahEnded, ayah_ended: log.ayahEnded,
            book_name: log.bookName,
            lesson_started: log.lessonStarted, page_started: log.pageStarted,
            lesson_ended: log.lessonEnded, page_ended: log.pageEnded,
            teacher_note: log.teacherNote, parent_note: log.parentNote,
          });
          if (error) console.warn('Attendance insert:', error.message);
        } catch (err) { console.error('Attendance insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateAttendanceLog: \(id, log\) => \{\n\s*set\(state => \(\{ attendanceLogs: state\.attendanceLogs\.map\(l => l\.id === id \? log : l\) \}\)\);\n\s*supabase\.from\(\'attendance_logs\'\)\.update\(\{\n\s*date: log\.date, subject: log\.subject,\n\s*status: log\.status, juz: log\.juz, hizb: log\.hizb,\n\s*surah_started: log\.surahStarted, ayah_started: log\.ayahStarted,\n\s*surah_ended: log\.surahEnded, ayah_ended: log\.ayahEnded,\n\s*book_name: log\.bookName,\n\s*lesson_started: log\.lessonStarted, page_started: log\.pageStarted,\n\s*lesson_ended: log\.lessonEnded, page_ended: log\.pageEnded,\n\s*teacher_note: log\.teacherNote, parent_note: log\.parentNote,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Attendance update:\', error\.message\); \}\);\n\s*\},',
        r'''updateAttendanceLog: async (id, log) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.map(l => l.id === id ? log : l) }));
        try {
          const { error } = await supabase.from('attendance_logs').update({
            date: log.date, subject: log.subject,
            status: log.status, juz: log.juz, hizb: log.hizb,
            surah_started: log.surahStarted, ayah_started: log.ayahStarted,
            surah_ended: log.surahEnded, ayah_ended: log.ayahEnded,
            book_name: log.bookName,
            lesson_started: log.lessonStarted, page_started: log.pageStarted,
            lesson_ended: log.lessonEnded, page_ended: log.pageEnded,
            teacher_note: log.teacherNote, parent_note: log.parentNote,
          }).eq('id', id);
          if (error) console.warn('Attendance update:', error.message);
        } catch (err) { console.error('Attendance update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteAttendanceLog: \(id\) => \{\n\s*set\(state => \(\{ attendanceLogs: state\.attendanceLogs\.filter\(l => l\.id !== id\) \}\)\);\n\s*supabase\.from\(\'attendance_logs\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Attendance delete:\', error\.message\); \}\);\n\s*\},',
        r'''deleteAttendanceLog: async (id) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.filter(l => l.id !== id) }));
        try {
          const { error } = await supabase.from('attendance_logs').delete().eq('id', id);
          if (error) console.warn('Attendance delete:', error.message);
        } catch (err) { console.error('Attendance delete failed:', err); }
      },''',
        content
    )

    # Payments
    content = re.sub(
        r'addPayment: \(payment\) => \{\n\s*set\(state => \(\{ payments: \[payment, \.\.\.state\.payments\] \}\)\);\n\s*supabase\.from\(\'payments\'\)\.insert\(\{\n\s*id: payment\.id, student_id: payment\.studentId,\n\s*month: payment\.month, amount: payment\.amount,\n\s*status: payment\.status, date_paid: payment\.datePaid,\n\s*\}\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Payment insert:\', error\.message\); \}\);\n\s*\},',
        r'''addPayment: async (payment) => {
        set(state => ({ payments: [payment, ...state.payments] }));
        try {
          const { error } = await supabase.from('payments').insert({
            id: payment.id, student_id: payment.studentId,
            month: payment.month, amount: payment.amount,
            status: payment.status, date_paid: payment.datePaid,
          });
          if (error) console.warn('Payment insert:', error.message);
        } catch (err) { console.error('Payment insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updatePayment: \(id, payment\) => \{\n\s*set\(state => \(\{ payments: state\.payments\.map\(p => p\.id === id \? payment : p\) \}\)\);\n\s*supabase\.from\(\'payments\'\)\.update\(\{\n\s*month: payment\.month, amount: payment\.amount,\n\s*status: payment\.status, date_paid: payment\.datePaid,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Payment update:\', error\.message\); \}\);\n\s*\},',
        r'''updatePayment: async (id, payment) => {
        set(state => ({ payments: state.payments.map(p => p.id === id ? payment : p) }));
        try {
          const { error } = await supabase.from('payments').update({
            month: payment.month, amount: payment.amount,
            status: payment.status, date_paid: payment.datePaid,
          }).eq('id', id);
          if (error) console.warn('Payment update:', error.message);
        } catch (err) { console.error('Payment update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deletePayment: \(id\) => \{\n\s*set\(state => \(\{ payments: state\.payments\.filter\(p => p\.id !== id\) \}\)\);\n\s*supabase\.from\(\'payments\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Payment delete:\', error\.message\); \}\);\n\s*\},',
        r'''deletePayment: async (id) => {
        set(state => ({ payments: state.payments.filter(p => p.id !== id) }));
        try {
          const { error } = await supabase.from('payments').delete().eq('id', id);
          if (error) console.warn('Payment delete:', error.message);
        } catch (err) { console.error('Payment delete failed:', err); }
      },''',
        content
    )

    # Exams
    content = re.sub(
        r'addExam: \(exam\) => \{\n\s*set\(state => \(\{ exams: \[exam, \.\.\.state\.exams\] \}\)\);\n\s*supabase\.from\(\'exams\'\)\.insert\(\{\n\s*id: exam\.id, student_id: exam\.studentId,\n\s*subject: exam\.subject, teacher_id: exam\.teacherId,\n\s*score: exam\.score, grade: exam\.grade,\n\s*term: exam\.term, date: exam\.date,\n\s*\}\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Exam insert:\', error\.message\); \}\);\n\s*\},',
        r'''addExam: async (exam) => {
        set(state => ({ exams: [exam, ...state.exams] }));
        try {
          const { error } = await supabase.from('exams').insert({
            id: exam.id, student_id: exam.studentId,
            subject: exam.subject, teacher_id: exam.teacherId,
            score: exam.score, grade: exam.grade,
            term: exam.term, date: exam.date,
          });
          if (error) console.warn('Exam insert:', error.message);
        } catch (err) { console.error('Exam insert failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'updateExam: \(id, exam\) => \{\n\s*set\(state => \(\{ exams: state\.exams\.map\(e => e\.id === id \? exam : e\) \}\)\);\n\s*supabase\.from\(\'exams\'\)\.update\(\{\n\s*subject: exam\.subject, teacher_id: exam\.teacherId,\n\s*score: exam\.score, grade: exam\.grade,\n\s*term: exam\.term, date: exam\.date,\n\s*\}\)\.eq\(\'id\', id\)\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Exam update:\', error\.message\); \}\);\n\s*\},',
        r'''updateExam: async (id, exam) => {
        set(state => ({ exams: state.exams.map(e => e.id === id ? exam : e) }));
        try {
          const { error } = await supabase.from('exams').update({
            subject: exam.subject, teacher_id: exam.teacherId,
            score: exam.score, grade: exam.grade,
            term: exam.term, date: exam.date,
          }).eq('id', id);
          if (error) console.warn('Exam update:', error.message);
        } catch (err) { console.error('Exam update failed:', err); }
      },''',
        content
    )

    content = re.sub(
        r'deleteExam: \(id\) => \{\n\s*set\(state => \(\{ exams: state\.exams\.filter\(e => e\.id !== id\) \}\)\);\n\s*supabase\.from\(\'exams\'\)\.delete\(\)\.eq\(\'id\', id\)\n\s*\.then\(\(\{ error \}\) => \{ if \(error\) console\.warn\(\'Exam delete:\', error\.message\); \}\);\n\s*\},',
        r'''deleteExam: async (id) => {
        set(state => ({ exams: state.exams.filter(e => e.id !== id) }));
        try {
          const { error } = await supabase.from('exams').delete().eq('id', id);
          if (error) console.warn('Exam delete:', error.message);
        } catch (err) { console.error('Exam delete failed:', err); }
      },''',
        content
    )

    with open('lib/store.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Success")

if __name__ == "__main__":
    main()
