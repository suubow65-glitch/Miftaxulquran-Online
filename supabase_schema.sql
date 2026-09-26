-- =============================================================
--  Miftaxul Quran Online — Supabase Schema
--  Run this entire script once in the Supabase SQL Editor.
--  Tables: teachers, students, enrollments, attendance_logs,
--          payments, exams, hero_slides, insights,
--          leads, testimonials, books, courses, posts
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. TEACHERS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teachers (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  title_so    TEXT,
  title_en    TEXT,
  bio_so      TEXT,
  bio_en      TEXT,
  image_url   TEXT,
  username    TEXT,
  password    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.teachers TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 2. STUDENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id          TEXT PRIMARY KEY,
  student_id  TEXT,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'Active',
  class_days  TEXT,
  class_time  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.students TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 3. ENROLLMENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrollments (
  id             TEXT PRIMARY KEY,
  student_id     TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_name   TEXT NOT NULL,
  teacher_id     TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
  level          TEXT,
  status         TEXT DEFAULT 'Active',
  total_lessons  INTEGER,
  current_juz    TEXT,
  current_hizb   TEXT,
  current_surah  TEXT,
  current_ayah   TEXT,
  current_lesson TEXT,
  current_page   TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.enrollments TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 4. ATTENDANCE LOGS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id             TEXT PRIMARY KEY,
  student_id     TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date           TEXT NOT NULL,
  subject        TEXT NOT NULL,
  subject_id     TEXT,
  status         TEXT NOT NULL,
  juz            TEXT,
  hizb           TEXT,
  surah_started  TEXT,
  ayah_started   TEXT,
  surah_ended    TEXT,
  ayah_ended     TEXT,
  book_name      TEXT,
  lesson_started TEXT,
  page_started   TEXT,
  lesson_ended   TEXT,
  page_ended     TEXT,
  teacher_note   TEXT,
  parent_note    TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.attendance_logs DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.attendance_logs TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 5. PAYMENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id          TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  month       TEXT NOT NULL,
  amount      TEXT NOT NULL,
  status      TEXT DEFAULT 'Pending',
  date_paid   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.payments TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 6. EXAMS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exams (
  id          TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  teacher_id  TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
  score       TEXT,
  grade       TEXT,
  term        TEXT,
  date        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.exams TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 7. HERO SLIDES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id          TEXT PRIMARY KEY,
  image       TEXT,
  hadith_ar   TEXT,
  hadith_so   TEXT,
  hadith_en   TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.hero_slides DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.hero_slides TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 8. INSIGHTS (Blog Articles)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insights (
  id          TEXT PRIMARY KEY,
  image       TEXT,
  category_so TEXT,
  category_en TEXT,
  title_so    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  content_so  TEXT,
  content_en  TEXT,
  date        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.insights DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.insights TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 9. LEADS (Registration / Enquiry Forms)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  age         TEXT,
  phone       TEXT,
  email       TEXT,
  course      TEXT,
  level       TEXT,
  schedule    TEXT,
  message     TEXT,
  status      TEXT DEFAULT 'Pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.leads TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 10. TESTIMONIALS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  location    TEXT,
  rating      INTEGER DEFAULT 5,
  content     TEXT NOT NULL,
  image       TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.testimonials TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 11. BOOKS (Islamic Library)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.books (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT,
  category      TEXT,
  size_mb       NUMERIC,
  pages_so      TEXT,
  pages_en      TEXT,
  download_url  TEXT,
  cover_image   TEXT,
  color         TEXT,
  emoji         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.books TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 12. COURSES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id             TEXT PRIMARY KEY,
  title_so       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  desc_so        TEXT,
  desc_en        TEXT,
  category       TEXT,
  duration       TEXT,
  level          TEXT,
  students       INTEGER DEFAULT 0,
  rating         NUMERIC DEFAULT 0,
  price_so       TEXT,
  price_en       TEXT,
  features_so    JSONB DEFAULT '[]',
  features_en    JSONB DEFAULT '[]',
  image_url      TEXT,
  icon           TEXT,
  badge_so       TEXT,
  badge_en       TEXT,
  learning_paths JSONB DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.courses TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 13. POSTS (News / Blog Posts)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id          TEXT PRIMARY KEY,
  title_so    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  content_so  TEXT,
  content_en  TEXT,
  image_url   TEXT,
  date        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.posts TO anon, authenticated;

-- =============================================================
--  Done. All 13 tables created with public read/write access.
--  You can now run your Next.js app against this Supabase project.
-- =============================================================
