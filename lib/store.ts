import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

export type Category = "quran" | "tajweed" | "arabic" | "islamic" | "seerah" | "all";

export interface LearningPath {
  id: string;
  levelNameSo: string;
  levelNameEn: string;
  durationSo: string;
  durationEn: string;
  targetAudienceSo: string;
  targetAudienceEn: string;
}

export interface Course {
  id: string;
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
  category: Category;
  duration: string;
  level: string;
  students: number;
  rating: number;
  priceSo: string;
  priceEn: string;
  featuresSo: string[];
  featuresEn: string[];
  imageUrl: string;
  icon: string;
  badgeSo: string;
  badgeEn: string;
  learningPaths?: LearningPath[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  sizeMB: number;
  pagesSo: string;
  pagesEn: string;
  downloadUrl: string; // Will store PDF base64
  coverImage: string; // Will store Image base64
  color: string;
  emoji: string;
}

export interface Faq {
  id: string;
  questionSo: string;
  questionEn: string;
  answerSo: string;
  answerEn: string;
}

export interface FaqContent {
  mainHeadingSo: string;
  mainHeadingEn: string;
  faqs: Faq[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number; // 1-5
  content: string;
  image?: string; // Base64
  isApproved: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  titleSo: string;
  titleEn: string;
  contentSo: string;
  contentEn: string;
  imageUrl: string;
  date: string;
}

export interface Insight {
  id: string;
  image: string; // Base64
  categorySo: string;
  categoryEn: string;
  titleSo: string;
  titleEn: string;
  contentSo: string;
  contentEn: string;
  date: string;
}

export interface ChallengeCard {
  id: string;
  icon: string;
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
}

export interface ChallengesContent {
  badgeTextSo: string;
  badgeTextEn: string;
  mainTitleSo: string;
  mainTitleEn: string;
  cards: ChallengeCard[];
  bannerTitleSo: string;
  bannerTitleEn: string;
  bannerDescSo: string;
  bannerDescEn: string;
  buttonTextSo: string;
  buttonTextEn: string;
}

export interface FeatureItem {
  id: string;
  iconName: string;
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
}

export interface FeaturesContent {
  mainHeadingSo: string;
  mainHeadingEn: string;
  subHeadingSo: string;
  subHeadingEn: string;
  features: FeatureItem[];
}

export interface StepItem {
  id: string;
  iconName: string;
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
}

export interface StepsContent {
  mainTitleSo: string;
  mainTitleEn: string;
  ctaButtonTextSo: string;
  ctaButtonTextEn: string;
  steps: StepItem[];
}

export interface StatItem {
  id: string;
  iconName: string;
  value: string;
  labelSo: string;
  labelEn: string;
  subLabelSo: string;
  subLabelEn: string;
}

export interface StatsContent {
  mainTitleSo: string;
  mainTitleEn: string;
  stats: StatItem[];
}

export interface BottomCTAContent {
  badgeSo: string;
  badgeEn: string;
  titleSo: string;
  titleEn: string;
  descriptionSo: string;
  descriptionEn: string;
  primaryButtonTextSo: string;
  primaryButtonTextEn: string;
  whatsappButtonTextSo: string;
  whatsappButtonTextEn: string;
  contactButtonTextSo: string;
  contactButtonTextEn: string;
}

export interface FooterContent {
  aboutSo: string;
  aboutEn: string;
  copyrightSo: string;
  copyrightEn: string;
}

export interface AboutValue {
  id: string;
  iconName: string;
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
  color: string;
}

export interface AboutPageContent {
  heroTitleSo: string;
  heroTitleEn: string;
  heroSubtitleSo: string;
  heroSubtitleEn: string;
  ourStoryTitleSo: string;
  ourStoryTitleEn: string;
  ourStoryContentSo: string;
  ourStoryContentEn: string;
  visionTitleSo: string;
  visionTitleEn: string;
  visionDescriptionSo: string;
  visionDescriptionEn: string;
  missionTitleSo: string;
  missionTitleEn: string;
  missionDescriptionSo: string;
  missionDescriptionEn: string;
  values: AboutValue[];
}

export interface PricingPlan {
  id: string;
  nameSo: string;
  nameEn: string;
  price: string;
  periodSo: string;
  periodEn: string;
  featuresSo: string[];
  featuresEn: string[];
  buttonTextSo: string;
  buttonTextEn: string;
  isPopular: boolean;
}

export interface PricingContent {
  mainTitleSo: string;
  mainTitleEn: string;
  subtitleSo: string;
  subtitleEn: string;
  plans: PricingPlan[];
}

export interface LibraryPageContent {
  heroBadgeSo: string;
  heroBadgeEn: string;
  heroTitleSo: string;
  heroTitleEn: string;
  heroSubtitleSo: string;
  heroSubtitleEn: string;
  searchPlaceholderSo: string;
  searchPlaceholderEn: string;
}

export interface InsightsHeader {
  titleSo: string;
  titleEn: string;
  subtitleSo: string;
  subtitleEn: string;
}

export interface IjazahContent {
  titleSo: string;
  titleEn: string;
  subtitleSo: string;
  subtitleEn: string;
  descriptionSo: string;
  descriptionEn: string;
  certificateImage: string; // Base64 or URL
}

export interface HeroSlide {
  id: string;
  image: string; // Base64 or URL
  hadithAr: string;
  hadithSo: string;
  hadithEn: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  reciter?: string;
  audioDataUrl: string;
  isActive: boolean;
}

export interface HeroContent {
  headlineSo: string;
  headlineEn: string;
  subheadlineSo: string;
  subheadlineEn: string;
  ctaTextSo: string;
  ctaTextEn: string;
  bgImageUrl: string;
}

export interface SiteStats {
  students: string;
  teachers: string;
  years: string;
  countries: string;
}

export interface CourseHelpCTA {
  titleSo: string;
  titleEn: string;
  descSo: string;
  descEn: string;
  contactButtonSo: string;
  contactButtonEn: string;
  whatsappButtonSo: string;
  whatsappButtonEn: string;
  whatsappNumber: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  addressSo: string;
  addressEn: string;
  whatsapp: string;
  facebook: string;
  youtube: string;
  instagram: string;
  mapEmbedCode: string;
  seoDescriptionSo: string;
  seoDescriptionEn: string;
  adminUser: string;
  adminPass: string;
  isTeacherLive: boolean;
}

export interface Lead {
  id: string;
  name: string;
  age: string;
  phone: string;
  email: string;
  course: string;
  level: string;
  schedule: string;
  message: string;
  status: "Pending" | "Contacted" | "Enrolled";
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  titleSo: string;
  titleEn: string;
  bioSo: string;
  bioEn: string;
  imageUrl: string;
  username?: string;  // Teacher portal login username
  password?: string;  // Teacher portal login password (plain text, client-side only)
}

export interface Enrollment {
  id: string;
  subjectName: string; // e.g., "Quran", "Arabic", "Islamic Studies"
  teacherId: string;
  level: string;
  status: "Active" | "Inactive";
  totalLessons?: number; // Target total lessons for this enrollment
  currentJuz?: string;
  currentHizb?: string;
  currentSurah?: string;
  currentAyah?: string;
  currentLesson?: string;
  currentPage?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  status: "Active" | "Inactive";
  classDays?: string;
  classTime?: string;
  enrollments: Enrollment[];
}

export interface Payment {
  id: string;
  studentId: string;
  month: string;
  amount: string;
  status: "Paid" | "Pending";
  datePaid?: string;
}

export interface Exam {
  id: string;
  studentId: string;
  subject: string;
  teacherId: string;
  score: string;
  grade: string;
  term: string;
  date: string;
}

export type AttendanceStatus = "Qaatay (Attended)" | "Aan Qaadan (Absent)" | "Fasax (On Leave)" | "Ku Maqan Fasax la'aan (AWOL)";

export interface AttendanceLog {
  id: string;
  studentId: string;
  date: string;
  subject: string;      // Subject name (e.g. "Quran", "Arabic")
  subjectId?: string;   // Optional linked subjectId for strict separation
  status: AttendanceStatus;
  // For Quran / Qaida / Tajweed
  juz?: string;
  hizb?: string;
  surahStarted?: string;
  ayahStarted?: string;
  surahEnded?: string;
  ayahEnded?: string;
  // For Arabic / Books / Islamic Studies
  bookName?: string;
  lessonStarted?: string;
  pageStarted?: string;
  lessonEnded?: string;
  pageEnded?: string;

  teacherNote?: string;  // Internal academy record
  parentNote?: string;   // Confidential parent feedback
}

interface CMSState {
  // Data
  hero: HeroContent;
  heroSlides: HeroSlide[];
  challengesContent: ChallengesContent;
  featuresContent: FeaturesContent;
  stepsContent: StepsContent;
  statsContent: StatsContent;
  courseHelpCTA: CourseHelpCTA;
  bottomCTA: BottomCTAContent;
  footerContent: FooterContent;
  aboutPageContent: AboutPageContent;
  pricingContent: PricingContent;
  libraryPageContent: LibraryPageContent;
  insightsHeader: InsightsHeader;
  ijazahContent: IjazahContent;
  stats: SiteStats;
  settings: SiteSettings;
  courses: Course[];
  library: Book[];
  faqContent: FaqContent;
  testimonials: Testimonial[];
  leads: Lead[];
  teachers: Teacher[];
  posts: Post[];
  insights: Insight[];
  tracks: AudioTrack[];
  hasInteractedAudio: boolean;
  students: Student[];
  attendanceLogs: AttendanceLog[];
  payments: Payment[];
  exams: Exam[];

  // Actions
  updateHero: (hero: HeroContent) => void;
  updateChallengesContent: (c: ChallengesContent) => void;
  updateFeaturesContent: (c: FeaturesContent) => void;
  updateStepsContent: (c: StepsContent) => void;
  updateStatsContent: (c: StatsContent) => void;
  updateCourseHelpCTA: (c: CourseHelpCTA) => void;
  updateBottomCTA: (c: BottomCTAContent) => void;
  updateFooterContent: (c: FooterContent) => void;
  updateAboutPageContent: (c: AboutPageContent) => void;
  updatePricingContent: (c: PricingContent) => void;
  updateLibraryPageContent: (c: LibraryPageContent) => void;
  updateInsightsHeader: (c: InsightsHeader) => void;
  updateIjazahContent: (c: IjazahContent) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (id: string, slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  updateStats: (stats: SiteStats) => void;
  updateSettings: (settings: SiteSettings) => void;
  
  // CRUD actions for arrays
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Course) => void;
  deleteCourse: (id: string) => void;
  
  addBook: (book: Book) => void;
  updateBook: (id: string, book: Book) => void;
  deleteBook: (id: string) => void;

  updateFaqContent: (c: FaqContent) => void;

  submitTestimonial: (testimonial: Omit<Testimonial, 'id' | 'isApproved' | 'createdAt'>) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;

  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  deleteLead: (id: string) => void;

  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  updateTeacherCredentials: (id: string, username: string, password: string) => void;

  addPost: (post: Post) => void;
  updatePost: (id: string, post: Post) => void;
  deletePost: (id: string) => void;

  addInsight: (insight: Insight) => void;
  updateInsight: (id: string, insight: Insight) => void;
  deleteInsight: (id: string) => void;

  addTrack: (track: AudioTrack) => void;
  deleteTrack: (id: string) => void;
  toggleTrackActive: (id: string) => void;
  setHasInteractedAudio: (val: boolean) => void;
  
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Student) => void;
  deleteStudent: (id: string) => void;
  
  addAttendanceLog: (log: AttendanceLog) => void;
  updateAttendanceLog: (id: string, log: AttendanceLog) => void;
  deleteAttendanceLog: (id: string) => void;

  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Payment) => void;
  deletePayment: (id: string) => void;

  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Exam) => void;
  deleteExam: (id: string) => void;
  initializeSupabase: () => Promise<void>;
}

const initialHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=900",
    hadithAr: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    hadithSo: "Kii idiinku khayr badan waa kan barta Qur'aanka ee dadka bara.",
    hadithEn: "The best among you are those who learn the Quran and teach it.",
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&q=80&w=900",
    hadithAr: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    hadithSo: "Akhriya Qur'aanka, wuxuu iman maalinta qiyaame isagoo u shafeecaya ciddii akhrin jirtay.",
    hadithEn: "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.",
  },
  {
    id: "slide-3",
    image: "https://images.unsplash.com/photo-1596720426673-e4e14220b3df?auto=format&fit=crop&q=80&w=900",
    hadithAr: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ",
    hadithSo: "Qofkii akhriya xaraf ka mid ah kitaabka Ilaahay wuxuu leeyahay hal xasanad.",
    hadithEn: "Whoever recites a letter from the Book of Allah, he will be credited with a good deed.",
  },
];

// Initial default data matching the original hardcoded arrays
const initialLeads: Lead[] = [
  { id: "lead-1", name: "Axmed Cali", age: "15", phone: "+252611234567", email: "axmed@example.com", course: "quran", level: "beginner", schedule: "afternoon", message: "Waxaan rabaa inaan barto qur'aanka.", status: "Pending", createdAt: new Date().toISOString() },
  { id: "lead-2", name: "Aisha Maxamed", age: "22", phone: "+252617654321", email: "", course: "arabic", level: "elementary", schedule: "evening", message: "", status: "Contacted", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const initialTeachers: Teacher[] = [
  { id: "t-1", name: "Sh. Axmed C.", titleSo: "Macallimka Sarreea — Qur'aan & Tajwiid", titleEn: "Senior Teacher — Quran & Tajweed", bioSo: "Khibrad 15 sano ah oo dhigista Qur'aanka. Wuxuu hayaa Ijazah qira'at toban ah.", bioEn: "15 years of experience teaching Quran. Holds Ijazah in 10 Qira'at.", imageUrl: "https://i.pravatar.cc/150?img=11" },
  { id: "t-2", name: "Ustaa Maxamed X.", titleSo: "Macallim — Luqadda Carabiga", titleEn: "Teacher — Arabic Language", bioSo: "Macallin ku takhasusay luqadda Carabiga, wuxuuna ka qalin jabiyay Jaamacadda Madiina.", bioEn: "Specialized Arabic teacher, graduated from the Islamic University of Madinah.", imageUrl: "https://i.pravatar.cc/150?img=12" },
  { id: "t-3", name: "Macallimad Faadumo", titleSo: "Macallimad — Dumartu Qur'aan", titleEn: "Female Teacher — Women's Quran", bioSo: "Macallimad u heellan bixinta casharada haweenka iyo gabdhaha. Waxay haysataa Ijazah caafimaad ah.", bioEn: "Dedicated teacher for women and girls. Holds authentic Ijazah.", imageUrl: "https://i.pravatar.cc/150?img=9" },
  { id: "t-4", name: "Sh. Cali I.", titleSo: "Macallim — Daraasadaha Diinta", titleEn: "Teacher — Islamic Studies", bioSo: "Khibrad ballaaran u leh dhigista Aqiidada iyo Fiqhiga Islaamka.", bioEn: "Extensive experience teaching Islamic Aqeedah and Fiqh.", imageUrl: "https://i.pravatar.cc/150?img=14" },
];

const initialHero: HeroContent = {
  headlineSo: "Baro Qur'aanka Kariimka adigoo gurigaaga jooga",
  headlineEn: "Learn the Holy Quran from the comfort of your home",
  subheadlineSo: "Miftaxul Quran Online waa dugsi onlayn ah oo kuu fududeynaya barashada Qur'aanka. Waxaan bixinaa fasallo toos ah, macalimiin khibrad leh, iyo jadwal ku habboon waqtigaaga.",
  subheadlineEn: "Miftaxul Quran Online is an online school that makes learning the Quran easy. We offer live classes, experienced teachers, and flexible schedules.",
  ctaTextSo: "Halkan iska qor",
  ctaTextEn: "Enrol Now",
  bgImageUrl: ""
};

const initialChallengesContent: ChallengesContent = {
  badgeTextSo: "Su'aalo muhiim ah",
  badgeTextEn: "Important questions",
  mainTitleSo: "Ma la kulantaa caqabadahan?",
  mainTitleEn: "Do you face these challenges?",
  cards: [
    { id: "c-1", icon: "😟", titleSo: "Walwal diinta ah", titleEn: "Worry about religious education", descSo: "Ma tahay waalid ka fikiraya inaad iyo ubadkaagu bartaan Qur'aanka iyo diinta?", descEn: "Are you a parent concerned about you and your children learning the Quran and religion?" },
    { id: "c-2", icon: "⏰", titleSo: "Waqti la'aan iyo mashquul", titleEn: "Lack of time & busy schedule", descSo: "Shaqada iyo maalmaha mashquulka ah ayaa caqabad kuu ah inaad masjidka ama goobtaad barato ka gaadho?", descEn: "Does work and a busy schedule make it hard to reach the mosque or school?" },
    { id: "c-3", icon: "📖", titleSo: "Akhriska Qur'aanka oo adag", titleEn: "Difficulty reading the Quran", descSo: "Ma ku dhibantahay adiga iyo ubadkaaguba kicinta iyo akhrinta Qur'aanka kariimka?", descEn: "Do you and your children find it difficult to recite and read the Holy Quran?" },
    { id: "c-4", icon: "👨‍🏫", titleSo: "Macalin bilaa tayo", titleEn: "Poor-quality teaching", descSo: "Ma raadinaysaa macalimiin khibrad leh oo leh Ijazah dhab ah iyo manhaj tayo sare leh?", descEn: "Are you looking for experienced teachers with authentic Ijazah and a high-quality curriculum?" },
    { id: "c-5", icon: "🌍", titleSo: "Fog badan oo heli wayday", titleEn: "Too far, no access", descSo: "Ma joogtaa waddan aan dugsi Qur'aan onlayn ah lagu heli karin? Anagaa halkaa ku jirna.", descEn: "Do you live in a country where Quran schools are hard to find? We are here for you." },
    { id: "c-6", icon: "📅", titleSo: "Jadwal aan la habaynayn", titleEn: "Inflexible schedule", descSo: "Ma raadinaysaa dugsi aad dooran kartid maalmaha iyo saacadaha aad dhigtid?", descEn: "Are you looking for a school where you choose your own days and hours?" },
  ],
  bannerTitleSo: "Taasi waa sababta Miftaxul Quran Online uu ku jiro!",
  bannerTitleEn: "That's exactly why Miftaxul Quran Online exists!",
  bannerDescSo: "Waxaan bixinaa waxbarasho nidaamsan oo leh tayo sare, macalimiin khibrad leh oo Ijazah haysta, iyo manhaj ku salaysan natiijada — meel kasta, waqti kasta.",
  bannerDescEn: "We provide structured, high-quality education with experienced Ijazah-certified teachers and a results-based curriculum — anywhere, anytime.",
  buttonTextSo: "Eeg Faahfaahinta",
  buttonTextEn: "Learn More",
};

const initialFeaturesContent: FeaturesContent = {
  mainHeadingSo: "Maxaad noo dooranaysaa?",
  mainHeadingEn: "Why do you choose us?",
  subHeadingSo: "Miftaxul Quran Online wuxuu isku daraa barnaamij diimeed la hub-siiyey iyo tignoolajiyada tacliinta casri ah.",
  subHeadingEn: "Miftaxul Quran Online combines a verified Islamic curriculum with modern teaching technology.",
  features: [
    { id: "f-1", iconName: "Users", titleSo: "Fasallo One-to-One", titleEn: "One-to-One Classes", descSo: "Macalin gaار ahaan kuu xidhan wuxuu kugu dhigayaa si shakhsi ah.", descEn: "A dedicated teacher guides you personally in every session." },
    { id: "f-2", iconName: "Clock", titleSo: "Jadwal Kugu Haboon", titleEn: "Flexible Schedule", descSo: "Waxaad dooranaysaa maalmaha iyo saacadaha kugu haboon.", descEn: "You choose the days and times that suit your schedule." },
    { id: "f-3", iconName: "GraduationCap", titleSo: "Macalimiin Khibrad leh", titleEn: "Expert Teachers", descSo: "Macalimiin Ijazah haysta oo leh aqoon iyo khibrad sare.", descEn: "Ijazah-certified teachers with deep knowledge and experience." },
    { id: "f-4", iconName: "Globe", titleSo: "Meelkasta & Alaadkasta", titleEn: "Anywhere & Any Device", descSo: "Computer, tablet, ama mobile — meelkasta oo aad joogto.", descEn: "Computer, tablet, or mobile — learn from anywhere." },
    { id: "f-5", iconName: "Shield", titleSo: "Jawi Nabdoon", titleEn: "Safe Environment", descSo: "Jawi diimeed oo nabdoon, heer walba oo carruurta iyo waalidkaba.", descEn: "A safe Islamic environment for children and adults alike." },
    { id: "f-6", iconName: "Award", titleSo: "Warbixin Joogto ah", titleEn: "Regular Progress Reports", descSo: "Warbixin toddobaadleed oo ku saabsan horumarkaaga waxbarashada.", descEn: "Weekly reports keeping you informed about learning progress." },
    { id: "f-7", iconName: "Heart", titleSo: "Shahaadada Ijazah", titleEn: "Ijazah Certificate", descSo: "Ardaygu waxa uu heli doonaa Ijazah marka uu dhameeyo barashada.", descEn: "Students receive authentic Ijazah upon program completion." },
    { id: "f-8", iconName: "BookOpen", titleSo: "Manhaj Tayo leh", titleEn: "Quality Curriculum", descSo: "Manhaj ku salaysan cilmi-baaris iyo natiijada ardayga.", descEn: "A research-backed curriculum designed for results." },
  ]
};

const initialStepsContent: StepsContent = {
  mainTitleSo: "Sideen u bilaabaa?",
  mainTitleEn: "How do we get started?",
  ctaButtonTextSo: "Bilaw Hadda — Bilaash",
  ctaButtonTextEn: "Start Now — Free",
  steps: [
    { id: "step-1", iconName: "FileText", titleSo: "Is-diiwaangeli", titleEn: "Register", descSo: "Buuxi foomka is-diiwaangelinta si fudud", descEn: "Fill in the simple registration form" },
    { id: "step-2", iconName: "BarChart", titleSo: "Qiimaynta Ardayga", titleEn: "Student Assessment", descSo: "Xaqiijin heerka waxbarashada si macalin ku habboon lagugu dooro", descEn: "Assessment to match you with the right teacher" },
    { id: "step-3", iconName: "GraduationCap", titleSo: "Bilawga Fasalka", titleEn: "Start Learning", descSo: "Bilaw waxbarashadaada one-to-one", descEn: "Begin your personalized one-to-one sessions" }
  ]
};

const initialStatsContent: StatsContent = {
  mainTitleSo: "Tirooyinka noo sheega",
  mainTitleEn: "The numbers speak for themselves",
  stats: [
    { id: "stat-1", iconName: "Users", value: "2,000+", labelSo: "Arday Dhaqdhaqaaqa", labelEn: "Active Students", subLabelSo: "Dhammaan Dunida", subLabelEn: "Worldwide" },
    { id: "stat-2", iconName: "GraduationCap", value: "50+", labelSo: "Macalimiin Khibrad leh", labelEn: "Expert Teachers", subLabelSo: "Ijazah Haysta", subLabelEn: "Ijazah Certified" },
    { id: "stat-3", iconName: "Clock", value: "24/7", labelSo: "Helitaan Joogto ah", labelEn: "Always Available", subLabelSo: "Waqti kasta", subLabelEn: "Any time" },
    { id: "stat-4", iconName: "Award", value: "15+", labelSo: "Sano oo Khibrad", labelEn: "Years of Experience", subLabelSo: "La adeecay Umadda", subLabelEn: "Serving the Ummah" },
    { id: "stat-5", iconName: "Globe", value: "40+", labelSo: "Waddanood", labelEn: "Countries", subLabelSo: "Arday ka yimaada", subLabelEn: "Students from" },
    { id: "stat-6", iconName: "Heart", value: "100%", labelSo: "Shahaadada Ijazah", labelEn: "Ijazah Certified", subLabelSo: "Macalimiin", subLabelEn: "Teachers" }
  ]
};

const initialCourseHelpCTA: CourseHelpCTA = {
  titleSo: "Ma hubtid koorse kuu haboon?",
  titleEn: "Not sure which course fits you?",
  descSo: "Nagala xiriir — 3 maalmood oo tijaabo bilaash ah baa lagugu qaban doonaa si aad u aragto koorse kuu habboon.",
  descEn: "Contact us — we'll arrange a free 3-day trial to help you find the right course.",
  contactButtonSo: "Nagala Xiriir",
  contactButtonEn: "Contact Us",
  whatsappButtonSo: "WhatsApp",
  whatsappButtonEn: "WhatsApp",
  whatsappNumber: "252619337904",
};

const initialStats: SiteStats = {
  students: "2,000+",
  teachers: "50+",
  years: "15+",
  countries: "40+"
};

const initialSettings: SiteSettings = {
  phone: "+252 619 337 904",
  email: "info@miftaxulquran.com",
  addressSo: "Muqdisho, Buulaxuubey, Soomaaliya",
  addressEn: "Mogadishu, Buulaxuubey, Somalia",
  whatsapp: "252619337904",
  facebook: "",
  youtube: "",
  instagram: "",
  mapEmbedCode: "",
  seoDescriptionSo: "Miftaxul Quran Online waa dugsi onlayn ah...",
  seoDescriptionEn: "Miftaxul Quran Online is an online school...",
  adminUser: "admin",
  adminPass: "miftaxul2024",
  isTeacherLive: true
};

const initialCourses: Course[] = [
  {
    id: "quran", category: "quran",
    titleSo: "Xifdinta Qur'aanka (Hifz)", titleEn: "Quran Memorization (Hifz)",
    descSo: "Koorse dhameystiran oo xifdinta Qur'aanka lagu baranayo, iyada oo macalimiin Ijazah haysta si gaar ah u xidhan.",
    descEn: "A complete Quran memorization program with certified Ijazah teachers in dedicated one-to-one sessions.",
    duration: "24–36 months", level: "All Levels", students: 850, rating: 4.9,
    priceSo: "La xidhiidh", priceEn: "Contact Us",
    featuresSo: ["Xifdi maalinlaha ah oo shakhsi ah", "Nidaam muraja'ah adag", "Tajwiid lagu xaqiijiyey", "Ijazah marka la dhameeyo", "Dashboard horumar"],
    featuresEn: ["Daily personalized targets", "Strong Muraja'ah system", "Tajweed verified", "Ijazah certificate", "Progress tracking"],
    imageUrl: "",
    icon: "BookOpen", badgeSo: "Qur'aan", badgeEn: "Quran",
    learningPaths: [
      {
        id: "lp-quran-1",
        levelNameSo: "Aasaasi (Noorani Qa'idah)", levelNameEn: "Foundation (Noorani Qa'idah)",
        durationSo: "4-6 Bilood", durationEn: "4-6 Months",
        targetAudienceSo: "Carruurta iyo bilowga aan weli baran akhriska", targetAudienceEn: "Children and absolute beginners",
      },
      {
        id: "lp-quran-2",
        levelNameSo: "Xifdinta Dhexdhexaadka", levelNameEn: "Intermediate Hifz",
        durationSo: "12-18 Bilood", durationEn: "12-18 Months",
        targetAudienceSo: "Kuwa yaqaan akhriska oo raba inay xifdiyaan", targetAudienceEn: "Those who can read and want to memorize",
      },
      {
        id: "lp-quran-3",
        levelNameSo: "Ijazah & Kaamilinta", levelNameEn: "Ijazah & Perfection",
        durationSo: "12+ Bilood", durationEn: "12+ Months",
        targetAudienceSo: "Xufaada raba Ijazah iyo muraja'ah adag", targetAudienceEn: "Huffaz seeking Ijazah and strong revision",
      }
    ],
  },
  {
    id: "tajweed", category: "tajweed",
    titleSo: "Tacwiid & Qira'ad", titleEn: "Tajweed & Qirat Mastery",
    descSo: "Kaamilinta akhrinta Qur'aanka iyada oo la bartayo xeerarka Tajwiidka iyo Qira'adda Siddeed.",
    descEn: "Perfect your Quranic recitation by mastering Tajweed rules and authentic Qira'at from qualified Qaris.",
    duration: "6–18 months", level: "Beginner to Advanced", students: 1200, rating: 4.95,
    priceSo: "La xidhiidh", priceEn: "Contact Us",
    featuresSo: ["Makhaarijul Xuruf", "Sifaatil Xuruf", "Axkaam Nuun & Miim", "Xeerarka Madd", "Hordhac 10-da Qira'at"],
    featuresEn: ["Makharij al-Huruf", "Sifaat al-Huruf", "Ahkam an-Nun wa al-Mim", "Rules of Madd", "Intro to 10 Qira'at"],
    imageUrl: "",
    icon: "ScrollText", badgeSo: "Tajwiid", badgeEn: "Tajweed",
    learningPaths: [
      {
        id: "lp-tajweed-1",
        levelNameSo: "Bilow", levelNameEn: "Beginner",
        durationSo: "6 Bilood", durationEn: "6 Months",
        targetAudienceSo: "Kuwa raba inay saxaan akhriskooda aasaasiga ah", targetAudienceEn: "Those who want to correct basic recitation",
      },
      {
        id: "lp-tajweed-2",
        levelNameSo: "Sare (Qira'at)", levelNameEn: "Advanced (Qira'at)",
        durationSo: "12 Bilood", durationEn: "12 Months",
        targetAudienceSo: "Ardayda raba inay bartaan Qira'adda kala duwan", targetAudienceEn: "Students wanting to learn different Qira'at",
      }
    ],
  },
  {
    id: "arabic", category: "arabic",
    titleSo: "Luqadda Carabiga", titleEn: "Arabic Language & Grammar",
    descSo: "Baro Carabiga Fudciga si aad si toos ah u fahanto Qur'aanka — Naxwe, Sarf, iyo Mufradaadka.",
    descEn: "Learn classical Arabic to understand the Quran directly — Nahw, Sarf, and Quranic vocabulary.",
    duration: "12–24 months", level: "Absolute Beginner+", students: 640, rating: 4.8,
    priceSo: "La xidhiidh", priceEn: "Contact Us",
    featuresSo: ["Xuruufta Carabiga", "Aasaaska Naxwaha", "Aasaaska Sarfiga", "Vocabulary Qur'aaniga", "Akhris iyo Fahanka"],
    featuresEn: ["Arabic alphabet", "Nahw fundamentals", "Sarf essentials", "Quranic vocabulary", "Reading comprehension"],
    imageUrl: "",
    icon: "Languages", badgeSo: "Carabi", badgeEn: "Arabic",
    learningPaths: [
      {
        id: "lp-arabic-1",
        levelNameSo: "Heerka 1-aad", levelNameEn: "Level 1",
        durationSo: "6 Bilood", durationEn: "6 Months",
        targetAudienceSo: "Kuwa aan horey u baran luqadda Carabiga", targetAudienceEn: "Absolute beginners to the Arabic language",
      },
      {
        id: "lp-arabic-2",
        levelNameSo: "Heerka 2-aad (Fahanka Qur'aanka)", levelNameEn: "Level 2 (Quranic Comprehension)",
        durationSo: "8-12 Bilood", durationEn: "8-12 Months",
        targetAudienceSo: "Kuwa raba inay toos u fahmaan Qur'aanka", targetAudienceEn: "Those who want to understand the Quran directly",
      }
    ],
  },
  {
    id: "islamic", category: "islamic",
    titleSo: "Daraasadaha Diinta Islaamka", titleEn: "Islamic Studies",
    descSo: "Barnaamij dhamaystiran oo ku saabsan Aqiidada, Fiqhiga, Seerada, iyo Khuluuqa Islaamka.",
    descEn: "A comprehensive program covering Aqeedah, Fiqh, Seerah, and Islamic character development.",
    duration: "Ongoing", level: "All Ages", students: 420, rating: 4.85,
    priceSo: "La xidhiidh", priceEn: "Contact Us",
    featuresSo: ["Aqiidada Islaamka", "Fiqhiga Cibaadada", "Seerta Nabiga ﷺ", "Khuluuqa & Tarbiyada", "Su'aalo iyo Jawaabo"],
    featuresEn: ["Islamic Aqeedah", "Fiqh of Worship", "Seerah of the Prophet", "Islamic character", "Q&A sessions"],
    imageUrl: "",
    icon: "Award", badgeSo: "Diinta", badgeEn: "Islamic",
  },
];

const initialLibrary: Book[] = [
  { id: "1", title: "Nooraniyya Qaaidah", author: "Sh. Nooraniy", category: "quran", sizeMB: 2.4, pagesSo: "64 bog", pagesEn: "64 pages", downloadUrl: "#", coverImage: "", color: "#27AE60", emoji: "📖" },
  { id: "2", title: "Tajweed Rules", author: "Ibn al-Jazari", category: "tajweed", sizeMB: 3.8, pagesSo: "128 bog", pagesEn: "128 pages", downloadUrl: "#", coverImage: "", color: "#F0AE20", emoji: "📜" },
  { id: "3", title: "Madinah Arabic Book 1", author: "Dr. V. Abdur Rahim", category: "arabic", sizeMB: 12.1, pagesSo: "320 bog", pagesEn: "320 pages", downloadUrl: "#", coverImage: "", color: "#1A8049", emoji: "🔤" },
];

const initialFaqContent: FaqContent = {
  mainHeadingSo: "Su'aalaha Badanaa la Waydiiyo",
  mainHeadingEn: "Frequently Asked Questions",
  faqs: [
    { id: "1", questionSo: "Sideen u bilaabi karaa?", questionEn: "How do I get started?", answerSo: "Is-diiwaangeli boggeena, kaddib macalin ayaa kula soo xiriiri doona si uu kuugu qabto tijaabadaada bilaashka ah.", answerEn: "Register on our website, then a teacher will contact you to schedule your free trial session." },
    { id: "2", questionSo: "Waa maxay qaabka lacag-bixinta?", questionEn: "What are the payment methods?", answerSo: "Lacag-bixinta waxaa lagu bixin karaa Evc Plus, Zaad, Sahal, E-Dahab, ama xawaaladaha caalamiga ah.", answerEn: "Payments can be made via mobile money (Evc Plus, Zaad, Sahal) or international remittance." },
    { id: "3", questionSo: "Ma jiraan macalimiin dumar ah?", questionEn: "Are there female teachers?", answerSo: "Haa, waxaan leenahay macalimiin dumar ah oo khibrad leh oo si gaar ah wax u bara gabdhaha iyo dumarka.", answerEn: "Yes, we have experienced female teachers dedicated specifically to teaching girls and women." },
  ]
};

const initialTestimonials: Testimonial[] = [
  { 
    id: "test-1", 
    name: "Faadumo A.", 
    location: "🇸🇪 Sweden", 
    rating: 5, 
    content: "Macalimadu way da'i-jeclid oo aad u sabar badan. Gabadhaydii yar markii 3 bilood gudahood ay Qur'aanka akhrin kartay, farxadaydii ma laha daraf! | The teacher is very patient and kind. When my young daughter could read the Quran after 3 months, my joy was indescribable!", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "test-2", 
    name: "Maxamed C.", 
    location: "🇬🇧 UK", 
    rating: 5, 
    content: "Jadwalka dabacsan ayaa ii fududeeyey. Shaqada ka dib saacado goor dambe ayaan wax ku baran karaa — dugsi kale ma helin sidii. | The flexible schedule made it easy for me. I can learn late evening after work — I haven't found another school like this.", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "test-3", 
    name: "Xamdi I.", 
    location: "🇺🇸 USA", 
    rating: 5, 
    content: "Macalimka Tajwiidka ayaa si fiican u baray. Waxaan hadda ka dhigoddaa waxaa idhi isagoo dabacsanyahay. Mahadsanid Miftaxul Quran! | The Tajweed teacher taught me thoroughly. I now recite with confidence. Thank you Miftaxul Quran!", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
];

const initialBottomCTA: BottomCTAContent = {
  badgeSo: "Ku bilow Safarkaga Maanta",
  badgeEn: "Start Your Journey Today",
  titleSo: "Diyaar u tahay inaad furto Buugta Ilaahow?",
  titleEn: "Ready to unlock the Book of Allah?",
  descriptionSo: "Ku biir arday 2,000+ ah oo Miftaxul Quran Online ku baraya Qur'aanka. Casharkii ugu horreeyay bilaash — ballan-quul ma jirto.",
  descriptionEn: "Join 2,000+ students learning the Quran with Miftaxul Quran Online. First lesson is free — no commitment required.",
  primaryButtonTextSo: "Is-diiwaangeli — Bilaash",
  primaryButtonTextEn: "Register — Free Trial",
  whatsappButtonTextSo: "WhatsApp",
  whatsappButtonTextEn: "WhatsApp",
  contactButtonTextSo: "Nagala Xiriir",
  contactButtonTextEn: "Contact Us"
};

const initialFooterContent: FooterContent = {
  aboutSo: "Waxaan bixinaa barashada Qur'aanka, Tacwiidka, iyo Luqadda Carabiga iyada oo macalimiin Ijazah haysta. Meel kasta, waqti kasta.",
  aboutEn: "We provide Quran, Tajweed, and Arabic education with certified Ijazah teachers. Anywhere, anytime.",
  copyrightSo: "Miftaxul Quran Online. Dhammaan xuquuqda way dhowrsan yihihiin.",
  copyrightEn: "Miftaxul Quran Online. All rights reserved."
};

const initialAboutPageContent: AboutPageContent = {
  heroTitleSo: "Magac la aqoontay Barashada Qur'aanka",
  heroTitleEn: "A trusted name in Quran Education",
  heroSubtitleSo: "\"Miftaxul Quran\" wuxuu ula macno yahay \"Furaha Qur'aanka\" — taas ayaan bixinaa: furayaasha Buugta Ilaahow.",
  heroSubtitleEn: "\"Miftaxul Quran\" means \"The Key of the Quran\" — and that is exactly what we provide: the keys to the Book of Allah.",
  ourStoryTitleSo: "Taariikhda Dugsigu",
  ourStoryTitleEn: "Our Journey",
  ourStoryContentSo: "Miftaxul Quran waxaa la aasasay 2009 Muqdisho si loo adeego ardayda diinta raadsan. Sannadkii 2015, waxaan bilaabay barnaamijka onlaynka ah si ardayda dibedda loo gaadho. Hadda waxaan haynaa in ka badan 2,000 oo arday adduunka dacalladiisa ah.",
  ourStoryContentEn: "Miftaxul Quran was founded in 2009 in Mogadishu to serve students seeking religious education. In 2015, we launched our online program to reach students in the diaspora. Today, we have over 2,000 students worldwide.",
  missionTitleSo: "Hadafkayaga",
  missionTitleEn: "Our Mission",
  missionDescriptionSo: "Dugsiga Miftaxul Quran Online wuxuu u taaganyahay fidinta iyo barashada cilmiga diinta. Waxaa la aasasay hadafka loo dhigo in tacliinta diinta sax ah ay heli karaan qoyska Muslim ah kasta oo dunida ku jira.\n\nWaxaan isku xirnaa arday dadaal badan iyo aqoon khubaro ah oo haysta Ijazaha dhab ah — silsiladda sheekooyinka oo lagu raacin doonaa Nabi Maxamed ﷺ.",
  missionDescriptionEn: "Miftaxul Quran Online school stands for spreading and teaching religious knowledge. It was founded with the goal of making authentic Islamic education accessible to every Muslim family worldwide.\n\nWe connect dedicated students with scholars holding authentic Ijazah — chains of narration tracing back to Prophet Muhammad ﷺ.",
  visionTitleSo: "Hiigsigayaga",
  visionTitleEn: "Our Vision",
  visionDescriptionSo: "Si aan u noqono dugsiga ugu horeeya ee laga barto Qur'aanka onlayn adduunka oo dhan, anagoo adeegsanayna tignoolajiyada casriga ah si aan u gaadhsiino waxbarasho diimeed oo asal ah.",
  visionDescriptionEn: "To be the leading online Quran school worldwide, utilizing modern technology to deliver authentic Islamic education.",
  values: [
    { id: "v1", iconName: "BookOpen", titleSo: "Tayo Waxbarashada", titleEn: "Educational Excellence", descSo: "Waxaan bixinaa manhaj ku salaysan Qur'aanka iyo Sunnada sax ah.", descEn: "We deliver a curriculum grounded in the authentic Quran and Sunnah.", color: "#27AE60" },
    { id: "v2", iconName: "Heart", titleSo: "Dabciga Jaceylka", titleEn: "Compassionate Approach", descSo: "Macalimiin sabar badan oo ardayga kasta si shakhsi ah u xidhan.", descEn: "Patient teachers who are personally committed to each student.", color: "#F0AE20" },
    { id: "v3", iconName: "Globe", titleSo: "Helitaan Caalami ah", titleEn: "Global Accessibility", descSo: "Meel kasta oo aad dunida ka joogto — waxbarashadu waa suurtogal.", descEn: "Wherever you are in the world — learning is possible.", color: "#1A8049" },
    { id: "v4", iconName: "Award", titleSo: "Shahaadada Ijazah", titleEn: "Authentic Ijazah", descSo: "Silsilada Ijazah ee asal ah oo lagu raacin doonaa Nabiga ﷺ.", descEn: "Authentic Ijazah chain tracing back to the Prophet ﷺ.", color: "#D4920F" },
  ]
};

const initialLibraryPageContent: LibraryPageContent = {
  heroBadgeSo: "Buugaagta Bilaashka ah",
  heroBadgeEn: "Free Islamic Books",
  heroTitleSo: "Maktabadda Islaamiga",
  heroTitleEn: "Islamic Library",
  heroSubtitleSo: "Buugaag diimeed oo bilaash ah oo PDF ah — Qur'aan, Tajwiid, Carabiga, iyo Seerada.",
  heroSubtitleEn: "Free Islamic PDF books — Quran, Tajweed, Arabic, and Seerah.",
  searchPlaceholderSo: "Raadi buug...",
  searchPlaceholderEn: "Search books..."
};

const initialInsightsHeader: InsightsHeader = {
  titleSo: "Maqaallo & Warar",
  titleEn: "Blog & News",
  subtitleSo: "La soco wararkii ugu dambeeyay iyo maqaallo faa'iido leh oo ku saabsan barashada Qur'aanka.",
  subtitleEn: "Stay updated with our latest news and beneficial articles about Quran learning."
};

const initialIjazahContent: IjazahContent = {
  titleSo: "Hel Shahaadadaada Ijazada",
  titleEn: "Get Your Ijazah Certificate",
  subtitleSo: "Shahaado Caalami Ah",
  subtitleEn: "Internationally Recognized Certification",
  descriptionSo: "Markaad dhamayso barashada Qur'aanka iyo Tajwiidka, waxaad heli doontaa shahaadada Ijazada oo caddaynaysa inaad xifdisay Qur'aanka kariimka ah oo aad ku akhrin karto si sax ah.",
  descriptionEn: "Upon completing your Quran and Tajweed studies, you will receive an Ijazah certificate verifying your memorization and correct recitation of the Holy Quran.",
  certificateImage: ""
};

const initialPricingContent: PricingContent = {
  mainTitleSo: "Qiimaha Barnaamijyada",
  mainTitleEn: "Our Pricing Plans",
  subtitleSo: "Doorashooyin la awoodi karo si aad u hesho waxbarasho tayo leh.",
  subtitleEn: "Affordable options for quality Islamic education.",
  plans: [
    {
      id: "p1",
      nameSo: "Aasaasi",
      nameEn: "Basic",
      price: "$30",
      periodSo: "/ bishii",
      periodEn: "/ month",
      featuresSo: [
        "2 maalmood asbuucii",
        "30 daqiiqo casharkiiba",
        "Macalin gaar ah (1-on-1)"
      ],
      featuresEn: [
        "2 days a week",
        "30 mins per session",
        "1-on-1 dedicated teacher"
      ],
      buttonTextSo: "Dooro Aasaasi",
      buttonTextEn: "Choose Basic",
      isPopular: false
    },
    {
      id: "p2",
      nameSo: "Dhexdhexaad",
      nameEn: "Standard",
      price: "$50",
      periodSo: "/ bishii",
      periodEn: "/ month",
      featuresSo: [
        "4 maalmood asbuucii",
        "30 daqiiqo casharkiiba",
        "Macalin gaar ah (1-on-1)",
        "Dabagal joogto ah"
      ],
      featuresEn: [
        "4 days a week",
        "30 mins per session",
        "1-on-1 dedicated teacher",
        "Regular progress tracking"
      ],
      buttonTextSo: "Dooro Dhexdhexaad",
      buttonTextEn: "Choose Standard",
      isPopular: true
    },
    {
      id: "p3",
      nameSo: "Heersare",
      nameEn: "Premium",
      price: "$70",
      periodSo: "/ bishii",
      periodEn: "/ month",
      featuresSo: [
        "6 maalmood asbuucii",
        "30 daqiiqo casharkiiba",
        "Macalin gaar ah (1-on-1)",
        "Barnaamijka Hifz & Ijazah"
      ],
      featuresEn: [
        "6 days a week",
        "30 mins per session",
        "1-on-1 dedicated teacher",
        "Hifz & Ijazah track"
      ],
      buttonTextSo: "Dooro Heersare",
      buttonTextEn: "Choose Premium",
      isPopular: false
    }
  ]
};

const initialPosts: Post[] = [
  {
    id: "post-1",
    titleSo: "Ahmiyadda Barashada Qur'aanka",
    titleEn: "The Importance of Learning Quran",
    contentSo: "<p>Barashada Qur'aanku waa waajib diini ah oo saaran qof kasta oo Muslim ah...</p>",
    contentEn: "<p>Learning the Quran is a religious duty upon every Muslim...</p>",
    imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaab31ce?auto=format&fit=crop&q=80&w=800",
    date: "2024-05-10"
  }
];

const initialInsights: Insight[] = [
  {
    id: "insight-1",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaab31ce?auto=format&fit=crop&q=80&w=800",
    categorySo: "Qur'aanka",
    categoryEn: "Quran",
    titleSo: "Ahmiyadda Barashada Qur'aanka",
    titleEn: "The Importance of Learning Quran",
    contentSo: "<p>Barashada Qur'aanku waa waajib diini ah oo saaran qof kasta oo Muslim ah...</p>",
    contentEn: "<p>Learning the Quran is a religious duty upon every Muslim...</p>",
    date: "2024-05-10"
  },
  {
    id: "insight-2",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
    categorySo: "Tajwiid",
    categoryEn: "Tajweed",
    titleSo: "Barashada Tajwiidka Aasaasiga Ah",
    titleEn: "Learning Basic Tajweed",
    contentSo: "<p>Tajwiidku waa cilmiga lagu barto sida loo akhriyo Qur'aanka si waafaqsan sharciga...</p>",
    contentEn: "<p>Tajweed is the science of reading the Quran according to the rules...</p>",
    date: "2024-05-15"
  }
];

const initialStudents: Student[] = [];
const initialAttendanceLogs: AttendanceLog[] = [];

export const useStore = create<CMSState>()(
  persist(
    (set) => ({
      hero: initialHero,
      heroSlides: initialHeroSlides,
      challengesContent: initialChallengesContent,
      featuresContent: initialFeaturesContent,
      stepsContent: initialStepsContent,
      statsContent: initialStatsContent,
      courseHelpCTA: initialCourseHelpCTA,
      bottomCTA: initialBottomCTA,
      footerContent: initialFooterContent,
      aboutPageContent: initialAboutPageContent,
      pricingContent: initialPricingContent,
      libraryPageContent: initialLibraryPageContent,
      insightsHeader: initialInsightsHeader,
      ijazahContent: initialIjazahContent,
      stats: initialStats,
      settings: initialSettings,
      courses: initialCourses,
      library: initialLibrary,
      faqContent: initialFaqContent,
      testimonials: initialTestimonials,
      leads: initialLeads,
      teachers: initialTeachers,
      posts: initialPosts,
      insights: initialInsights,
      tracks: [
        { id: "audio-1", title: "Al-Fatiha", reciter: "Mishary Al-Afasy", audioDataUrl: "https://server8.mp3quran.net/afs/001.mp3", isActive: true },
        { id: "audio-2", title: "Al-Kahf", reciter: "Mishary Al-Afasy", audioDataUrl: "https://server8.mp3quran.net/afs/018.mp3", isActive: true },
        { id: "audio-3", title: "Ar-Rahman", reciter: "Mishary Al-Afasy", audioDataUrl: "https://server8.mp3quran.net/afs/055.mp3", isActive: true },
        { id: "audio-4", title: "Al-Mulk", reciter: "Mishary Al-Afasy", audioDataUrl: "https://server8.mp3quran.net/afs/067.mp3", isActive: true }
      ],
      hasInteractedAudio: false,
      students: initialStudents,
      attendanceLogs: initialAttendanceLogs,
      payments: [],
      exams: [],

      updateHero: (hero) => set({ hero }),
      updateChallengesContent: (c) => set({ challengesContent: c }),
      updateFeaturesContent: (c) => set({ featuresContent: c }),
      updateStepsContent: (c) => set({ stepsContent: c }),
      updateStatsContent: (c) => set({ statsContent: c }),
      updateCourseHelpCTA: (c) => set({ courseHelpCTA: c }),
      updateBottomCTA: (c) => set({ bottomCTA: c }),
      updateFooterContent: (c) => set({ footerContent: c }),
      updateAboutPageContent: (c) => set({ aboutPageContent: c }),
      updatePricingContent: (c) => set({ pricingContent: c }),
      updateLibraryPageContent: (c) => set({ libraryPageContent: c }),
      updateInsightsHeader: (c) => set({ insightsHeader: c }),
      updateIjazahContent: (c) => set({ ijazahContent: c }),
      addHeroSlide: (slide) => set((state) => ({ heroSlides: [...state.heroSlides, slide] })),
      updateHeroSlide: (id, slide) => set((state) => ({ heroSlides: state.heroSlides.map((s) => (s.id === id ? slide : s)) })),
      deleteHeroSlide: (id) => set((state) => ({ heroSlides: state.heroSlides.filter((s) => s.id !== id) })),
      reorderHeroSlides: (slides) => set({ heroSlides: slides }),
      updateStats: (stats) => set({ stats }),
      updateSettings: (settings) => set({ settings }),

      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (id, course) => set((state) => ({ courses: state.courses.map((c) => (c.id === id ? course : c)) })),
      deleteCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),

      addBook: (book) => set((state) => ({ library: [...state.library, book] })),
      updateBook: (id, book) => set((state) => ({ library: state.library.map((b) => (b.id === id ? book : b)) })),
      deleteBook: (id) => set((state) => ({ library: state.library.filter((b) => b.id !== id) })),

      updateFaqContent: (c) => set({ faqContent: c }),

      submitTestimonial: (t) => set(state => ({ testimonials: [...state.testimonials, { ...t, id: `test-${Date.now()}`, isApproved: false, createdAt: new Date().toISOString() }] })),
      approveTestimonial: (id) => set(state => ({ testimonials: state.testimonials.map(item => item.id === id ? { ...item, isApproved: true } : item) })),
      updateTestimonial: (id, updates) => set(state => ({ testimonials: state.testimonials.map(item => item.id === id ? { ...item, ...updates } : item) })),
      deleteTestimonial: (id) => set(state => ({ testimonials: state.testimonials.filter(item => item.id !== id) })),

      addLead: (lead) => set(state => ({ leads: [lead, ...state.leads] })),
      updateLeadStatus: (id, status) => set(state => ({ leads: state.leads.map(l => l.id === id ? { ...l, status } : l) })),
      deleteLead: (id) => set(state => ({ leads: state.leads.filter(l => l.id !== id) })),

      addTeacher: (teacher) => set(state => ({ teachers: [...state.teachers, teacher] })),
      updateTeacher: (id, teacher) => set(state => ({ teachers: state.teachers.map(t => t.id === id ? teacher : t) })),
      deleteTeacher: (id) => set(state => ({ teachers: state.teachers.filter(t => t.id !== id) })),
      updateTeacherCredentials: (id, username, password) => set(state => ({
        teachers: state.teachers.map(t => t.id === id ? { ...t, username, password } : t)
      })),

      addPost: (post) => set(state => ({ posts: [post, ...state.posts] })),
      updatePost: (id, post) => set(state => ({ posts: state.posts.map(p => p.id === id ? post : p) })),
      deletePost: (id) => set(state => ({ posts: state.posts.filter(p => p.id !== id) })),

      addInsight: (insight) => set(state => ({ insights: [insight, ...state.insights] })),
      updateInsight: (id, insight) => set(state => ({ insights: state.insights.map(p => p.id === id ? insight : p) })),
      deleteInsight: (id) => set(state => ({ insights: state.insights.filter(p => p.id !== id) })),

      addTrack: (track) => set(state => ({ tracks: [track, ...state.tracks] })),
      deleteTrack: (id) => set(state => ({ tracks: state.tracks.filter(t => t.id !== id) })),
      toggleTrackActive: (id) => set(state => ({
        tracks: state.tracks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
      })),
      setHasInteractedAudio: (val) => set({ hasInteractedAudio: val }),

      initializeSupabase: async () => {
        try {
          const [
            { data: students, error: studentsErr },
            { data: teachers, error: teachersErr },
            { data: attendances, error: attendancesErr },
            { data: payments, error: paymentsErr },
            { data: exams, error: examsErr },
          ] = await Promise.all([
            supabase.from('students').select('*'),
            supabase.from('teachers').select('*'),
            supabase.from('attendance_logs').select('*'),
            supabase.from('payments').select('*'),
            supabase.from('exams').select('*'),
          ]);

          if (studentsErr) console.warn("Error fetching students:", studentsErr);
          if (teachersErr) console.warn("Error fetching teachers:", teachersErr);
          if (attendancesErr) console.warn("Error fetching attendances:", attendancesErr);
          if (paymentsErr) console.warn("Error fetching payments:", paymentsErr);
          if (examsErr) console.warn("Error fetching exams:", examsErr);

          if (students && students.length > 0) set({ students: students as any });
          if (teachers && teachers.length > 0) set({ teachers: teachers as any });
          if (attendances && attendances.length > 0) set({ attendanceLogs: attendances as any });
          if (payments && payments.length > 0) set({ payments: payments as any });
          if (exams && exams.length > 0) set({ exams: exams as any });
        } catch (error) {
          console.warn("Failed to fetch Supabase data. Using local fallbacks:", error);
        }
      },

      addStudent: async (student) => {
        set(state => ({ students: [...state.students, student] }));
        await supabase.from('students').insert(student);
      },
      updateStudent: async (id, student) => {
        set(state => ({ students: state.students.map(s => s.id === id ? student : s) }));
        await supabase.from('students').update(student).eq('id', id);
      },
      deleteStudent: async (id) => {
        set(state => ({ students: state.students.filter(s => s.id !== id) }));
        await supabase.from('students').delete().eq('id', id);
      },

      addAttendanceLog: async (log) => {
        set(state => ({ attendanceLogs: [...state.attendanceLogs, log] }));
        await supabase.from('attendance_logs').insert(log);
      },
      updateAttendanceLog: async (id, log) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.map(l => l.id === id ? log : l) }));
        await supabase.from('attendance_logs').update(log).eq('id', id);
      },
      deleteAttendanceLog: async (id) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.filter(l => l.id !== id) }));
        await supabase.from('attendance_logs').delete().eq('id', id);
      },

      addPayment: async (payment) => {
        set(state => ({ payments: [payment, ...state.payments] }));
        await supabase.from('payments').insert(payment);
      },
      updatePayment: async (id, payment) => {
        set(state => ({ payments: state.payments.map(p => p.id === id ? payment : p) }));
        await supabase.from('payments').update(payment).eq('id', id);
      },
      deletePayment: async (id) => {
        set(state => ({ payments: state.payments.filter(p => p.id !== id) }));
        await supabase.from('payments').delete().eq('id', id);
      },

      addExam: async (exam) => {
        set(state => ({ exams: [exam, ...state.exams] }));
        await supabase.from('exams').insert(exam);
      },
      updateExam: async (id, exam) => {
        set(state => ({ exams: state.exams.map(e => e.id === id ? exam : e) }));
        await supabase.from('exams').update(exam).eq('id', id);
      },
      deleteExam: async (id) => {
        set(state => ({ exams: state.exams.filter(e => e.id !== id) }));
        await supabase.from('exams').delete().eq('id', id);
      },
    }),
    {
      name: 'miftaxul-cms-storage',
    }
  )
);
