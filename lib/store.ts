import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFirebaseDb } from './firebase';
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, writeBatch, Timestamp
} from 'firebase/firestore';

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

export interface CMSState {
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
  // â”€â”€ Bootstrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  initializeFirestore: () => Promise<void>;
  /** @deprecated Use initializeFirestore instead */
  initializeSupabase: () => Promise<void>;
}

export const initialHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=900",
    hadithAr: "Ø®ÙŽÙŠÙ’Ø±ÙÙƒÙÙ…Ù’ Ù…ÙŽÙ†Ù’ ØªÙŽØ¹ÙŽÙ„ÙŽÙ‘Ù…ÙŽ Ø§Ù„Ù’Ù‚ÙØ±Ù’Ø¢Ù†ÙŽ ÙˆÙŽØ¹ÙŽÙ„ÙŽÙ‘Ù…ÙŽÙ‡Ù",
    hadithSo: "Kii idiinku khayr badan waa kan barta Qur'aanka ee dadka bara.",
    hadithEn: "The best among you are those who learn the Quran and teach it.",
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&q=80&w=900",
    hadithAr: "Ø§Ù‚Ù’Ø±ÙŽØ¡ÙÙˆØ§ Ø§Ù„Ù’Ù‚ÙØ±Ù’Ø¢Ù†ÙŽ ÙÙŽØ¥ÙÙ†ÙŽÙ‘Ù‡Ù ÙŠÙŽØ£Ù’ØªÙÙŠ ÙŠÙŽÙˆÙ’Ù…ÙŽ Ø§Ù„Ù’Ù‚ÙÙŠÙŽØ§Ù…ÙŽØ©Ù Ø´ÙŽÙÙÙŠØ¹Ù‹Ø§ Ù„Ø£ÙŽØµÙ’Ø­ÙŽØ§Ø¨ÙÙ‡Ù",
    hadithSo: "Akhriya Qur'aanka, wuxuu iman maalinta qiyaame isagoo u shafeecaya ciddii akhrin jirtay.",
    hadithEn: "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.",
  },
  {
    id: "slide-3",
    image: "https://images.unsplash.com/photo-1596720426673-e4e14220b3df?auto=format&fit=crop&q=80&w=900",
    hadithAr: "Ù…ÙŽÙ†Ù’ Ù‚ÙŽØ±ÙŽØ£ÙŽ Ø­ÙŽØ±Ù’ÙÙ‹Ø§ Ù…ÙÙ†Ù’ ÙƒÙØªÙŽØ§Ø¨Ù Ø§Ù„Ù„ÙŽÙ‘Ù‡Ù ÙÙŽÙ„ÙŽÙ‡Ù Ø¨ÙÙ‡Ù Ø­ÙŽØ³ÙŽÙ†ÙŽØ©ÙŒ",
    hadithSo: "Qofkii akhriya xaraf ka mid ah kitaabka Ilaahay wuxuu leeyahay hal xasanad.",
    hadithEn: "Whoever recites a letter from the Book of Allah, he will be credited with a good deed.",
  },
];

// Initial default data matching the original hardcoded arrays
export const initialLeads: Lead[] = [
  { id: "lead-1", name: "Axmed Cali", age: "15", phone: "+252611234567", email: "axmed@example.com", course: "quran", level: "beginner", schedule: "afternoon", message: "Waxaan rabaa inaan barto qur'aanka.", status: "Pending", createdAt: new Date().toISOString() },
  { id: "lead-2", name: "Aisha Maxamed", age: "22", phone: "+252617654321", email: "", course: "arabic", level: "elementary", schedule: "evening", message: "", status: "Contacted", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const initialTeachers: Teacher[] = [
  { id: "t-1", name: "Sh. Axmed C.", titleSo: "Macallimka Sarreea â€” Qur'aan & Tajwiid", titleEn: "Senior Teacher â€” Quran & Tajweed", bioSo: "Khibrad 15 sano ah oo dhigista Qur'aanka. Wuxuu hayaa Ijazah qira'at toban ah.", bioEn: "15 years of experience teaching Quran. Holds Ijazah in 10 Qira'at.", imageUrl: "https://i.pravatar.cc/150?img=11" },
  { id: "t-2", name: "Ustaa Maxamed X.", titleSo: "Macallim â€” Luqadda Carabiga", titleEn: "Teacher â€” Arabic Language", bioSo: "Macallin ku takhasusay luqadda Carabiga, wuxuuna ka qalin jabiyay Jaamacadda Madiina.", bioEn: "Specialized Arabic teacher, graduated from the Islamic University of Madinah.", imageUrl: "https://i.pravatar.cc/150?img=12" },
  { id: "t-3", name: "Macallimad Faadumo", titleSo: "Macallimad â€” Dumartu Qur'aan", titleEn: "Female Teacher â€” Women's Quran", bioSo: "Macallimad u heellan bixinta casharada haweenka iyo gabdhaha. Waxay haysataa Ijazah caafimaad ah.", bioEn: "Dedicated teacher for women and girls. Holds authentic Ijazah.", imageUrl: "https://i.pravatar.cc/150?img=9" },
  { id: "t-4", name: "Sh. Cali I.", titleSo: "Macallim â€” Daraasadaha Diinta", titleEn: "Teacher â€” Islamic Studies", bioSo: "Khibrad ballaaran u leh dhigista Aqiidada iyo Fiqhiga Islaamka.", bioEn: "Extensive experience teaching Islamic Aqeedah and Fiqh.", imageUrl: "https://i.pravatar.cc/150?img=14" },
];

export const initialHero: HeroContent = {
  headlineSo: "Baro Qur'aanka Kariimka adigoo gurigaaga jooga",
  headlineEn: "Learn the Holy Quran from the comfort of your home",
  subheadlineSo: "Miftaxul Quran Online waa dugsi onlayn ah oo kuu fududeynaya barashada Qur'aanka. Waxaan bixinaa fasallo toos ah, macalimiin khibrad leh, iyo jadwal ku habboon waqtigaaga.",
  subheadlineEn: "Miftaxul Quran Online is an online school that makes learning the Quran easy. We offer live classes, experienced teachers, and flexible schedules.",
  ctaTextSo: "Halkan iska qor",
  ctaTextEn: "Enrol Now",
  bgImageUrl: ""
};

export const initialChallengesContent: ChallengesContent = {
  badgeTextSo: "Su'aalo muhiim ah",
  badgeTextEn: "Important questions",
  mainTitleSo: "Ma la kulantaa caqabadahan?",
  mainTitleEn: "Do you face these challenges?",
  cards: [
    { id: "c-1", icon: "ðŸ˜Ÿ", titleSo: "Walwal diinta ah", titleEn: "Worry about religious education", descSo: "Ma tahay waalid ka fikiraya inaad iyo ubadkaagu bartaan Qur'aanka iyo diinta?", descEn: "Are you a parent concerned about you and your children learning the Quran and religion?" },
    { id: "c-2", icon: "â°", titleSo: "Waqti la'aan iyo mashquul", titleEn: "Lack of time & busy schedule", descSo: "Shaqada iyo maalmaha mashquulka ah ayaa caqabad kuu ah inaad masjidka ama goobtaad barato ka gaadho?", descEn: "Does work and a busy schedule make it hard to reach the mosque or school?" },
    { id: "c-3", icon: "ðŸ“–", titleSo: "Akhriska Qur'aanka oo adag", titleEn: "Difficulty reading the Quran", descSo: "Ma ku dhibantahay adiga iyo ubadkaaguba kicinta iyo akhrinta Qur'aanka kariimka?", descEn: "Do you and your children find it difficult to recite and read the Holy Quran?" },
    { id: "c-4", icon: "ðŸ‘¨â€ðŸ«", titleSo: "Macalin bilaa tayo", titleEn: "Poor-quality teaching", descSo: "Ma raadinaysaa macalimiin khibrad leh oo leh Ijazah dhab ah iyo manhaj tayo sare leh?", descEn: "Are you looking for experienced teachers with authentic Ijazah and a high-quality curriculum?" },
    { id: "c-5", icon: "ðŸŒ", titleSo: "Fog badan oo heli wayday", titleEn: "Too far, no access", descSo: "Ma joogtaa waddan aan dugsi Qur'aan onlayn ah lagu heli karin? Anagaa halkaa ku jirna.", descEn: "Do you live in a country where Quran schools are hard to find? We are here for you." },
    { id: "c-6", icon: "ðŸ“…", titleSo: "Jadwal aan la habaynayn", titleEn: "Inflexible schedule", descSo: "Ma raadinaysaa dugsi aad dooran kartid maalmaha iyo saacadaha aad dhigtid?", descEn: "Are you looking for a school where you choose your own days and hours?" },
  ],
  bannerTitleSo: "Taasi waa sababta Miftaxul Quran Online uu ku jiro!",
  bannerTitleEn: "That's exactly why Miftaxul Quran Online exists!",
  bannerDescSo: "Waxaan bixinaa waxbarasho nidaamsan oo leh tayo sare, macalimiin khibrad leh oo Ijazah haysta, iyo manhaj ku salaysan natiijada â€” meel kasta, waqti kasta.",
  bannerDescEn: "We provide structured, high-quality education with experienced Ijazah-certified teachers and a results-based curriculum â€” anywhere, anytime.",
  buttonTextSo: "Eeg Faahfaahinta",
  buttonTextEn: "Learn More",
};

export const initialFeaturesContent: FeaturesContent = {
  mainHeadingSo: "Maxaad noo dooranaysaa?",
  mainHeadingEn: "Why do you choose us?",
  subHeadingSo: "Miftaxul Quran Online wuxuu isku daraa barnaamij diimeed la hub-siiyey iyo tignoolajiyada tacliinta casri ah.",
  subHeadingEn: "Miftaxul Quran Online combines a verified Islamic curriculum with modern teaching technology.",
  features: [
    { id: "f-1", iconName: "Users", titleSo: "Fasallo One-to-One", titleEn: "One-to-One Classes", descSo: "Macalin gaaar ahaan kuu xidhan wuxuu kugu dhigayaa si shakhsi ah.", descEn: "A dedicated teacher guides you personally in every session." },
    { id: "f-2", iconName: "Clock", titleSo: "Jadwal Kugu Haboon", titleEn: "Flexible Schedule", descSo: "Waxaad dooranaysaa maalmaha iyo saacadaha kugu haboon.", descEn: "You choose the days and times that suit your schedule." },
    { id: "f-3", iconName: "GraduationCap", titleSo: "Macalimiin Khibrad leh", titleEn: "Expert Teachers", descSo: "Macalimiin Ijazah haysta oo leh aqoon iyo khibrad sare.", descEn: "Ijazah-certified teachers with deep knowledge and experience." },
    { id: "f-4", iconName: "Globe", titleSo: "Meelkasta & Alaadkasta", titleEn: "Anywhere & Any Device", descSo: "Computer, tablet, ama mobile â€” meelkasta oo aad joogto.", descEn: "Computer, tablet, or mobile â€” learn from anywhere." },
    { id: "f-5", iconName: "Shield", titleSo: "Jawi Nabdoon", titleEn: "Safe Environment", descSo: "Jawi diimeed oo nabdoon, heer walba oo carruurta iyo waalidkaba.", descEn: "A safe Islamic environment for children and adults alike." },
    { id: "f-6", iconName: "Award", titleSo: "Warbixin Joogto ah", titleEn: "Regular Progress Reports", descSo: "Warbixin toddobaadleed oo ku saabsan horumarkaaga waxbarashada.", descEn: "Weekly reports keeping you informed about learning progress." },
    { id: "f-7", iconName: "Heart", titleSo: "Shahaadada Ijazah", titleEn: "Ijazah Certificate", descSo: "Ardaygu waxa uu heli doonaa Ijazah marka uu dhameeyo barashada.", descEn: "Students receive authentic Ijazah upon program completion." },
    { id: "f-8", iconName: "BookOpen", titleSo: "Manhaj Tayo leh", titleEn: "Quality Curriculum", descSo: "Manhaj ku salaysan cilmi-baaris iyo natiijada ardayga.", descEn: "A research-backed curriculum designed for results." },
  ]
};

export const initialStepsContent: StepsContent = {
  mainTitleSo: "Sideen u bilaabaa?",
  mainTitleEn: "How do we get started?",
  ctaButtonTextSo: "Bilaw Hadda â€” Bilaash",
  ctaButtonTextEn: "Start Now â€” Free",
  steps: [
    { id: "step-1", iconName: "FileText", titleSo: "Is-diiwaangeli", titleEn: "Register", descSo: "Buuxi foomka is-diiwaangelinta si fudud", descEn: "Fill in the simple registration form" },
    { id: "step-2", iconName: "BarChart", titleSo: "Qiimaynta Ardayga", titleEn: "Student Assessment", descSo: "Xaqiijin heerka waxbarashada si macalin ku habboon lagugu dooro", descEn: "Assessment to match you with the right teacher" },
    { id: "step-3", iconName: "GraduationCap", titleSo: "Bilawga Fasalka", titleEn: "Start Learning", descSo: "Bilaw waxbarashadaada one-to-one", descEn: "Begin your personalized one-to-one sessions" }
  ]
};

export const initialStatsContent: StatsContent = {
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

export const initialCourseHelpCTA: CourseHelpCTA = {
  titleSo: "Ma hubtid koorse kuu haboon?",
  titleEn: "Not sure which course fits you?",
  descSo: "Nagala xiriir â€” 3 maalmood oo tijaabo bilaash ah baa lagugu qaban doonaa si aad u aragto koorse kuu habboon.",
  descEn: "Contact us â€” we'll arrange a free 3-day trial to help you find the right course.",
  contactButtonSo: "Nagala Xiriir",
  contactButtonEn: "Contact Us",
  whatsappButtonSo: "WhatsApp",
  whatsappButtonEn: "WhatsApp",
  whatsappNumber: "252619337904",
};

export const initialStats: SiteStats = {
  students: "2,000+",
  teachers: "50+",
  years: "15+",
  countries: "40+"
};

export const initialSettings: SiteSettings = {
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

export const initialCourses: Course[] = [
  {
    id: "quran", category: "quran",
    titleSo: "Xifdinta Qur'aanka (Hifz)", titleEn: "Quran Memorization (Hifz)",
    descSo: "Koorse dhameystiran oo xifdinta Qur'aanka lagu baranayo, iyada oo macalimiin Ijazah haysta si gaar ah u xidhan.",
    descEn: "A complete Quran memorization program with certified Ijazah teachers in dedicated one-to-one sessions.",
    duration: "24â€“36 months", level: "All Levels", students: 850, rating: 4.9,
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
    duration: "6â€“18 months", level: "Beginner to Advanced", students: 1200, rating: 4.95,
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
    descSo: "Baro Carabiga Fudciga si aad si toos ah u fahanto Qur'aanka â€” Naxwe, Sarf, iyo Mufradaadka.",
    descEn: "Learn classical Arabic to understand the Quran directly â€” Nahw, Sarf, and Quranic vocabulary.",
    duration: "12â€“24 months", level: "Absolute Beginner+", students: 640, rating: 4.8,
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
    featuresSo: ["Aqiidada Islaamka", "Fiqhiga Cibaadada", "Seerta Nabiga ï·º", "Khuluuqa & Tarbiyada", "Su'aalo iyo Jawaabo"],
    featuresEn: ["Islamic Aqeedah", "Fiqh of Worship", "Seerah of the Prophet", "Islamic character", "Q&A sessions"],
    imageUrl: "",
    icon: "Award", badgeSo: "Diinta", badgeEn: "Islamic",
  },
];

export const initialLibrary: Book[] = [
  { id: "1", title: "Nooraniyya Qaaidah", author: "Sh. Nooraniy", category: "quran", sizeMB: 2.4, pagesSo: "64 bog", pagesEn: "64 pages", downloadUrl: "#", coverImage: "", color: "#27AE60", emoji: "ðŸ“–" },
  { id: "2", title: "Tajweed Rules", author: "Ibn al-Jazari", category: "tajweed", sizeMB: 3.8, pagesSo: "128 bog", pagesEn: "128 pages", downloadUrl: "#", coverImage: "", color: "#F0AE20", emoji: "ðŸ“œ" },
  { id: "3", title: "Madinah Arabic Book 1", author: "Dr. V. Abdur Rahim", category: "arabic", sizeMB: 12.1, pagesSo: "320 bog", pagesEn: "320 pages", downloadUrl: "#", coverImage: "", color: "#1A8049", emoji: "ðŸ”¤" },
];

export const initialFaqContent: FaqContent = {
  mainHeadingSo: "Su'aalaha Badanaa la Waydiiyo",
  mainHeadingEn: "Frequently Asked Questions",
  faqs: [
    { id: "1", questionSo: "Sideen u bilaabi karaa?", questionEn: "How do I get started?", answerSo: "Is-diiwaangeli boggeena, kaddib macalin ayaa kula soo xiriiri doona si uu kuugu qabto tijaabadaada bilaashka ah.", answerEn: "Register on our website, then a teacher will contact you to schedule your free trial session." },
    { id: "2", questionSo: "Waa maxay qaabka lacag-bixinta?", questionEn: "What are the payment methods?", answerSo: "Lacag-bixinta waxaa lagu bixin karaa Evc Plus, Zaad, Sahal, E-Dahab, ama xawaaladaha caalamiga ah.", answerEn: "Payments can be made via mobile money (Evc Plus, Zaad, Sahal) or international remittance." },
    { id: "3", questionSo: "Ma jiraan macalimiin dumar ah?", questionEn: "Are there female teachers?", answerSo: "Haa, waxaan leenahay macalimiin dumar ah oo khibrad leh oo si gaar ah wax u bara gabdhaha iyo dumarka.", answerEn: "Yes, we have experienced female teachers dedicated specifically to teaching girls and women." },
  ]
};

export const initialTestimonials: Testimonial[] = [
  { 
    id: "test-1", 
    name: "Faadumo A.", 
    location: "ðŸ‡¸ðŸ‡ª Sweden", 
    rating: 5, 
    content: "Macalimadu way da'i-jeclid oo aad u sabar badan. Gabadhaydii yar markii 3 bilood gudahood ay Qur'aanka akhrin kartay, farxadaydii ma laha daraf! | The teacher is very patient and kind. When my young daughter could read the Quran after 3 months, my joy was indescribable!", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "test-2", 
    name: "Maxamed C.", 
    location: "ðŸ‡¬ðŸ‡§ UK", 
    rating: 5, 
    content: "Jadwalka dabacsan ayaa ii fududeeyey. Shaqada ka dib saacado goor dambe ayaan wax ku baran karaa â€” dugsi kale ma helin sidii. | The flexible schedule made it easy for me. I can learn late evening after work â€” I haven't found another school like this.", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: "test-3", 
    name: "Xamdi I.", 
    location: "ðŸ‡ºðŸ‡¸ USA", 
    rating: 5, 
    content: "Macalimka Tajwiidka ayaa si fiican u baray. Waxaan hadda ka dhigoddaa waxaa idhi isagoo dabacsanyahay. Mahadsanid Miftaxul Quran! | The Tajweed teacher taught me thoroughly. I now recite with confidence. Thank you Miftaxul Quran!", 
    isApproved: true, 
    createdAt: new Date().toISOString() 
  },
];

export const initialBottomCTA: BottomCTAContent = {
  badgeSo: "Ku bilow Safarkaga Maanta",
  badgeEn: "Start Your Journey Today",
  titleSo: "Diyaar u tahay inaad furto Buugta Ilaahow?",
  titleEn: "Ready to unlock the Book of Allah?",
  descriptionSo: "Ku biir arday 2,000+ ah oo Miftaxul Quran Online ku baraya Qur'aanka. Casharkii ugu horreeyad bilaash â€” ballan-quul ma jirto.",
  descriptionEn: "Join 2,000+ students learning the Quran with Miftaxul Quran Online. First lesson is free â€” no commitment required.",
  primaryButtonTextSo: "Is-diiwaangeli â€” Bilaash",
  primaryButtonTextEn: "Register â€” Free Trial",
  whatsappButtonTextSo: "WhatsApp",
  whatsappButtonTextEn: "WhatsApp",
  contactButtonTextSo: "Nagala Xiriir",
  contactButtonTextEn: "Contact Us"
};

export const initialFooterContent: FooterContent = {
  aboutSo: "Waxaan bixinaa barashada Qur'aanka, Tacwiidka, iyo Luqadda Carabiga iyada oo macalimiin Ijazah haysta. Meel kasta, waqti kasta.",
  aboutEn: "We provide Quran, Tajweed, and Arabic education with certified Ijazah teachers. Anywhere, anytime.",
  copyrightSo: "Miftaxul Quran Online. Dhammaan xuquuqda way dhowrsan yihihiin.",
  copyrightEn: "Miftaxul Quran Online. All rights reserved."
};

export const initialAboutPageContent: AboutPageContent = {
  heroTitleSo: "Magac la aqoontay Barashada Qur'aanka",
  heroTitleEn: "A trusted name in Quran Education",
  heroSubtitleSo: "\"Miftaxul Quran\" wuxuu ula macno yahay \"Furaha Qur'aanka\" â€” taas ayaan bixinaa: furayaasha Buugta Ilaahow.",
  heroSubtitleEn: "\"Miftaxul Quran\" means \"The Key of the Quran\" â€” and that is exactly what we provide: the keys to the Book of Allah.",
  ourStoryTitleSo: "Taariikhda Dugsigu",
  ourStoryTitleEn: "Our Journey",
  ourStoryContentSo: "Miftaxul Quran waxaa la aasasay 2009 Muqdisho si loo adeego ardayda diinta raadsan. Sannadkii 2015, waxaan bilaabay barnaamijka onlaynka ah si ardayda dibedda loo gaadho. Hadda waxaan haynaa in ka badan 2,000 oo arday adduunka dacalladiisa ah.",
  ourStoryContentEn: "Miftaxul Quran was founded in 2009 in Mogadishu to serve students seeking religious education. In 2015, we launched our online program to reach students in the diaspora. Today, we have over 2,000 students worldwide.",
  missionTitleSo: "Hadafkayaga",
  missionTitleEn: "Our Mission",
  missionDescriptionSo: "Dugsiga Miftaxul Quran Online wuxuu u taaganyahay fidinta iyo barashada cilmiga diinta. Waxaa la aasasay hadafka loo dhigo in tacliinta diinta sax ah ay heli karaan qoyska Muslim ah kasta oo dunida ku jira.\n\nWaxaan isku xirnaa arday dadaal badan iyo aqoon khubaro ah oo haysta Ijazaha dhab ah â€” silsiladda sheekooyinka oo lagu raacin doonaa Nabi Maxamed ï·º.",
  missionDescriptionEn: "Miftaxul Quran Online school stands for spreading and teaching religious knowledge. It was founded with the goal of making authentic Islamic education accessible to every Muslim family worldwide.\n\nWe connect dedicated students with scholars holding authentic Ijazah â€” chains of narration tracing back to Prophet Muhammad ï·º.",
  visionTitleSo: "Hiigsigayaga",
  visionTitleEn: "Our Vision",
  visionDescriptionSo: "Si aan u noqono dugsiga ugu horeeya ee laga barto Qur'aanka onlayn adduunka oo dhan, anagoo adeegsanayna tignoolajiyada casriga ah si aan u gaadhsiino waxbarasho diimeed oo asal ah.",
  visionDescriptionEn: "To be the leading online Quran school worldwide, utilizing modern technology to deliver authentic Islamic education.",
  values: [
    { id: "v1", iconName: "BookOpen", titleSo: "Tayo Waxbarashada", titleEn: "Educational Excellence", descSo: "Waxaan bixinaa manhaj ku salaysan Qur'aanka iyo Sunnada sax ah.", descEn: "We deliver a curriculum grounded in the authentic Quran and Sunnah.", color: "#27AE60" },
    { id: "v2", iconName: "Heart", titleSo: "Dabciga Jaceylka", titleEn: "Compassionate Approach", descSo: "Macalimiin sabar badan oo ardayga kasta si shakhsi ah u xidhan.", descEn: "Patient teachers who are personally committed to each student.", color: "#F0AE20" },
    { id: "v3", iconName: "Globe", titleSo: "Helitaan Caalami ah", titleEn: "Global Accessibility", descSo: "Meel kasta oo aad dunida ka joogto â€” waxbarashadu waa suurtogal.", descEn: "Wherever you are in the world â€” learning is possible.", color: "#1A8049" },
    { id: "v4", iconName: "Award", titleSo: "Shahaadada Ijazah", titleEn: "Authentic Ijazah", descSo: "Silsilada Ijazah ee asal ah oo lagu raacin doonaa Nabiga ï·º.", descEn: "Authentic Ijazah chain tracing back to the Prophet ï·º.", color: "#D4920F" },
  ]
};

export const initialLibraryPageContent: LibraryPageContent = {
  heroBadgeSo: "Buugaagta Bilaashka ah",
  heroBadgeEn: "Free Islamic Books",
  heroTitleSo: "Maktabadda Islaamiga",
  heroTitleEn: "Islamic Library",
  heroSubtitleSo: "Buugaag diimeed oo bilaash ah oo PDF ah â€” Qur'aan, Tajwiid, Carabiga, iyo Seerada.",
  heroSubtitleEn: "Free Islamic PDF books â€” Quran, Tajweed, Arabic, and Seerah.",
  searchPlaceholderSo: "Raadi buug...",
  searchPlaceholderEn: "Search books..."
};

export const initialInsightsHeader: InsightsHeader = {
  titleSo: "Maqaallo & Warar",
  titleEn: "Blog & News",
  subtitleSo: "La soco wararkii ugu dambeeyay iyo maqaallo faa'iido leh oo ku saabsan barashada Qur'aanka.",
  subtitleEn: "Stay updated with our latest news and beneficial articles about Quran learning."
};

export const initialIjazahContent: IjazahContent = {
  titleSo: "Hel Shahaadadaada Ijazada",
  titleEn: "Get Your Ijazah Certificate",
  subtitleSo: "Shahaado Caalami Ah",
  subtitleEn: "Internationally Recognized Certification",
  descriptionSo: "Markaad dhamayso barashada Qur'aanka iyo Tajwiidka, waxaad heli doontaa shahaadada Ijazada oo caddaynaysa inaad xifdisay Qur'aanka kariimka ah oo aad ku akhrin karto si sax ah.",
  descriptionEn: "Upon completing your Quran and Tajweed studies, you will receive an Ijazah certificate verifying your memorization and correct recitation of the Holy Quran.",
  certificateImage: ""
};

export const initialPricingContent: PricingContent = {
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

export const initialPosts: Post[] = [
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

export const initialInsights: Insight[] = [
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

export const initialStudents: Student[] = [];
export const initialAttendanceLogs: AttendanceLog[] = [];

// â”€â”€â”€â”€â”€â”€â”€ Firestore helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Strip undefined fields (Firestore rejects them) */
function clean<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

// â”€â”€ CMS singleton collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// All single-document sections are stored in the "cms_content" collection,
// each with a predictable document ID so we can setDoc (upsert) reliably.
const CMS = 'cms_content';

async function saveCmsDoc(docId: string, data: Record<string, unknown>) {
  try {
    const db = getFirebaseDb();
    await setDoc(doc(db, CMS, docId), clean(data), { merge: true });
  } catch (err) {
    console.error(`[Firestore] Failed to save cms_content/${docId}:`, err);
  }
}

export const useStore = create<CMSState>()(
  persist(
    (set, get) => ({
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

      // â”€â”€ CMS CONTENT UPDATES (all optimistic-update + Firestore save) â”€â”€â”€â”€â”€â”€

      updateHero: async (hero) => {
        set({ hero });
        await saveCmsDoc('hero', hero as unknown as Record<string, unknown>);
      },
      updateChallengesContent: async (c) => {
        set({ challengesContent: c });
        await saveCmsDoc('challengesContent', c as unknown as Record<string, unknown>);
      },
      updateFeaturesContent: async (c) => {
        set({ featuresContent: c });
        await saveCmsDoc('featuresContent', c as unknown as Record<string, unknown>);
      },
      updateStepsContent: async (c) => {
        set({ stepsContent: c });
        await saveCmsDoc('stepsContent', c as unknown as Record<string, unknown>);
      },
      updateStatsContent: async (c) => {
        set({ statsContent: c });
        await saveCmsDoc('statsContent', c as unknown as Record<string, unknown>);
      },
      updateCourseHelpCTA: async (c) => {
        set({ courseHelpCTA: c });
        await saveCmsDoc('courseHelpCTA', c as unknown as Record<string, unknown>);
      },
      updateBottomCTA: async (c) => {
        set({ bottomCTA: c });
        await saveCmsDoc('bottomCTA', c as unknown as Record<string, unknown>);
      },
      updateFooterContent: async (c) => {
        set({ footerContent: c });
        await saveCmsDoc('footerContent', c as unknown as Record<string, unknown>);
      },
      updateAboutPageContent: async (c) => {
        set({ aboutPageContent: c });
        await saveCmsDoc('aboutPageContent', c as unknown as Record<string, unknown>);
      },
      updatePricingContent: async (c) => {
        set({ pricingContent: c });
        await saveCmsDoc('pricingContent', c as unknown as Record<string, unknown>);
      },
      updateLibraryPageContent: async (c) => {
        set({ libraryPageContent: c });
        await saveCmsDoc('libraryPageContent', c as unknown as Record<string, unknown>);
      },
      updateInsightsHeader: async (c) => {
        set({ insightsHeader: c });
        await saveCmsDoc('insightsHeader', c as unknown as Record<string, unknown>);
      },
      updateIjazahContent: async (c) => {
        set({ ijazahContent: c });
        await saveCmsDoc('ijazahContent', c as unknown as Record<string, unknown>);
      },
      updateStats: async (stats) => {
        set({ stats });
        await saveCmsDoc('stats', stats as unknown as Record<string, unknown>);
      },
      updateSettings: async (settings) => {
        set({ settings });
        await saveCmsDoc('settings', settings as unknown as Record<string, unknown>);
      },

      // â”€â”€ HERO SLIDES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addHeroSlide: async (slide) => {
        set((state) => ({ heroSlides: [...state.heroSlides, slide] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'hero_slides', slide.id), clean({
            image: slide.image,
            hadithAr: slide.hadithAr,
            hadithSo: slide.hadithSo,
            hadithEn: slide.hadithEn,
            sortOrder: Date.now(),
          }));
        } catch (err) { console.error('HeroSlide insert failed:', err); }
      },
      updateHeroSlide: async (id, slide) => {
        set((state) => ({ heroSlides: state.heroSlides.map((s) => (s.id === id ? slide : s)) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'hero_slides', id), clean({
            image: slide.image,
            hadithAr: slide.hadithAr,
            hadithSo: slide.hadithSo,
            hadithEn: slide.hadithEn,
          }));
        } catch (err) { console.error('HeroSlide update failed:', err); }
      },
      deleteHeroSlide: async (id) => {
        set((state) => ({ heroSlides: state.heroSlides.filter((s) => s.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'hero_slides', id));
        } catch (err) { console.error('HeroSlide delete failed:', err); }
      },
      reorderHeroSlides: (slides) => set({ heroSlides: slides }),

      // â”€â”€ COURSES (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addCourse: async (course) => {
        set((state) => ({ courses: [...state.courses, course] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'courses', course.id), clean(course as unknown as Record<string, unknown>));
        } catch (err) { console.error('Course insert failed:', err); }
      },
      updateCourse: async (id, course) => {
        set((state) => ({ courses: state.courses.map((c) => (c.id === id ? course : c)) }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'courses', id), clean(course as unknown as Record<string, unknown>), { merge: true });
        } catch (err) { console.error('Course update failed:', err); }
      },
      deleteCourse: async (id) => {
        set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'courses', id));
        } catch (err) { console.error('Course delete failed:', err); }
      },

      // â”€â”€ BOOKS / LIBRARY (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addBook: async (book) => {
        set((state) => ({ library: [...state.library, book] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'library', book.id), clean(book as unknown as Record<string, unknown>));
        } catch (err) { console.error('Book insert failed:', err); }
      },
      updateBook: async (id, book) => {
        set((state) => ({ library: state.library.map((b) => (b.id === id ? book : b)) }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'library', id), clean(book as unknown as Record<string, unknown>), { merge: true });
        } catch (err) { console.error('Book update failed:', err); }
      },
      deleteBook: async (id) => {
        set((state) => ({ library: state.library.filter((b) => b.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'library', id));
        } catch (err) { console.error('Book delete failed:', err); }
      },

      // â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      updateFaqContent: async (c) => {
        set({ faqContent: c });
        await saveCmsDoc('faqContent', c as unknown as Record<string, unknown>);
      },

      // â”€â”€ TESTIMONIALS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      submitTestimonial: async (t) => {
        const newItem: Testimonial = { ...t, id: `test-${Date.now()}`, isApproved: false, createdAt: new Date().toISOString() };
        set(state => ({ testimonials: [...state.testimonials, newItem] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'testimonials', newItem.id), clean(newItem as unknown as Record<string, unknown>));
        } catch (err) { console.error('Testimonial insert failed:', err); }
      },
      approveTestimonial: async (id) => {
        set(state => ({ testimonials: state.testimonials.map(item => item.id === id ? { ...item, isApproved: true } : item) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'testimonials', id), { isApproved: true });
        } catch (err) { console.error('Testimonial approve failed:', err); }
      },
      updateTestimonial: async (id, updates) => {
        set(state => ({ testimonials: state.testimonials.map(item => item.id === id ? { ...item, ...updates } : item) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'testimonials', id), clean(updates as unknown as Record<string, unknown>));
        } catch (err) { console.error('Testimonial update failed:', err); }
      },
      deleteTestimonial: async (id) => {
        set(state => ({ testimonials: state.testimonials.filter(item => item.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'testimonials', id));
        } catch (err) { console.error('Testimonial delete failed:', err); }
      },

      // â”€â”€ LEADS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addLead: async (lead) => {
        set(state => ({ leads: [lead, ...state.leads] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'leads', lead.id), clean(lead as unknown as Record<string, unknown>));
        } catch (err) { console.error('Lead insert failed:', err); }
      },
      updateLeadStatus: async (id, status) => {
        set(state => ({ leads: state.leads.map(l => l.id === id ? { ...l, status } : l) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'leads', id), { status });
        } catch (err) { console.error('Lead status update failed:', err); }
      },
      deleteLead: async (id) => {
        set(state => ({ leads: state.leads.filter(l => l.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'leads', id));
        } catch (err) { console.error('Lead delete failed:', err); }
      },

      // â”€â”€ TEACHERS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addTeacher: async (teacher) => {
        set(state => ({ teachers: [...state.teachers, teacher] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'teachers', teacher.id), clean({
            name: teacher.name,
            titleSo: teacher.titleSo,
            titleEn: teacher.titleEn,
            bioSo: teacher.bioSo,
            bioEn: teacher.bioEn,
            imageUrl: teacher.imageUrl,
            username: teacher.username,
            password: teacher.password,
          }));
        } catch (err) { console.error('Teacher insert failed:', err); }
      },
      updateTeacher: async (id, teacher) => {
        set(state => ({ teachers: state.teachers.map(t => t.id === id ? teacher : t) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'teachers', id), clean({
            name: teacher.name,
            titleSo: teacher.titleSo,
            titleEn: teacher.titleEn,
            bioSo: teacher.bioSo,
            bioEn: teacher.bioEn,
            imageUrl: teacher.imageUrl,
          }));
        } catch (err) { console.error('Teacher update failed:', err); }
      },
      deleteTeacher: async (id) => {
        set(state => ({ teachers: state.teachers.filter(t => t.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'teachers', id));
        } catch (err) { console.error('Teacher delete failed:', err); }
      },
      updateTeacherCredentials: async (id, username, password) => {
        set(state => ({ teachers: state.teachers.map(t => t.id === id ? { ...t, username, password } : t) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'teachers', id), { username, password });
        } catch (err) { console.error('Teacher creds update failed:', err); }
      },

      // â”€â”€ POSTS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addPost: async (post) => {
        set(state => ({ posts: [post, ...state.posts] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'posts', post.id), clean(post as unknown as Record<string, unknown>));
        } catch (err) { console.error('Post insert failed:', err); }
      },
      updatePost: async (id, post) => {
        set(state => ({ posts: state.posts.map(p => p.id === id ? post : p) }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'posts', id), clean(post as unknown as Record<string, unknown>), { merge: true });
        } catch (err) { console.error('Post update failed:', err); }
      },
      deletePost: async (id) => {
        set(state => ({ posts: state.posts.filter(p => p.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'posts', id));
        } catch (err) { console.error('Post delete failed:', err); }
      },

      // â”€â”€ INSIGHTS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addInsight: async (insight) => {
        set(state => ({ insights: [insight, ...state.insights] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'insights', insight.id), clean({
            image: insight.image,
            categorySo: insight.categorySo,
            categoryEn: insight.categoryEn,
            titleSo: insight.titleSo,
            titleEn: insight.titleEn,
            contentSo: insight.contentSo,
            contentEn: insight.contentEn,
            date: insight.date,
          }));
        } catch (err) { console.error('Insight insert failed:', err); }
      },
      updateInsight: async (id, insight) => {
        set(state => ({ insights: state.insights.map(p => p.id === id ? insight : p) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'insights', id), clean({
            image: insight.image,
            categorySo: insight.categorySo,
            categoryEn: insight.categoryEn,
            titleSo: insight.titleSo,
            titleEn: insight.titleEn,
            contentSo: insight.contentSo,
            contentEn: insight.contentEn,
            date: insight.date,
          }));
        } catch (err) { console.error('Insight update failed:', err); }
      },
      deleteInsight: async (id) => {
        set(state => ({ insights: state.insights.filter(p => p.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'insights', id));
        } catch (err) { console.error('Insight delete failed:', err); }
      },

      // â”€â”€ TRACKS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addTrack: async (track) => {
        set(state => ({ tracks: [track, ...state.tracks] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'tracks', track.id), clean(track as unknown as Record<string, unknown>));
        } catch (err) { console.error('Track insert failed:', err); }
      },
      deleteTrack: async (id) => {
        set(state => ({ tracks: state.tracks.filter(t => t.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'tracks', id));
        } catch (err) { console.error('Track delete failed:', err); }
      },
      toggleTrackActive: async (id) => {
        set(state => ({
          tracks: state.tracks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
        }));
        try {
          const db = getFirebaseDb();
          const updatedTrack = get().tracks.find(t => t.id === id);
          if (updatedTrack) await updateDoc(doc(db, 'tracks', id), { isActive: updatedTrack.isActive });
        } catch (err) { console.error('Track toggle failed:', err); }
      },
      setHasInteractedAudio: (val) => set({ hasInteractedAudio: val }),

      // â”€â”€ STUDENTS (optimistic + Firestore sync) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addStudent: async (student) => {
        set(state => ({ students: [...state.students, student] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'students', student.id), clean({
            studentId: student.studentId,
            name: student.name,
            status: student.status,
            classDays: student.classDays,
            classTime: student.classTime,
          }));

          if (student.enrollments?.length) {
            const batch = writeBatch(db);
            for (const e of student.enrollments) {
              batch.set(doc(db, 'enrollments', e.id), clean({
                studentId: student.id,
                subjectName: e.subjectName,
                teacherId: e.teacherId,
                level: e.level,
                status: e.status,
                totalLessons: e.totalLessons,
                currentJuz: e.currentJuz,
                currentHizb: e.currentHizb,
                currentSurah: e.currentSurah,
                currentAyah: e.currentAyah,
                currentLesson: e.currentLesson,
                currentPage: e.currentPage,
              }));
            }
            await batch.commit();
          }
        } catch (err) { console.error('Student insert failed:', err); }
      },
      updateStudent: async (id, student) => {
        set(state => ({ students: state.students.map(s => s.id === id ? student : s) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'students', id), clean({
            studentId: student.studentId,
            name: student.name,
            status: student.status,
            classDays: student.classDays,
            classTime: student.classTime,
          }));
        } catch (err) { console.error('Student update failed:', err); }
      },
      deleteStudent: async (id) => {
        set(state => ({ students: state.students.filter(s => s.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'students', id));
        } catch (err) { console.error('Student delete failed:', err); }
      },

      // â”€â”€ ATTENDANCE LOGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addAttendanceLog: async (log) => {
        set(state => ({ attendanceLogs: [...state.attendanceLogs, log] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'attendance_logs', log.id), clean({
            studentId: log.studentId,
            date: log.date,
            subject: log.subject,
            subjectId: log.subjectId,
            status: log.status,
            juz: log.juz,
            hizb: log.hizb,
            surahStarted: log.surahStarted,
            ayahStarted: log.ayahStarted,
            surahEnded: log.surahEnded,
            ayahEnded: log.ayahEnded,
            bookName: log.bookName,
            lessonStarted: log.lessonStarted,
            pageStarted: log.pageStarted,
            lessonEnded: log.lessonEnded,
            pageEnded: log.pageEnded,
            teacherNote: log.teacherNote,
            parentNote: log.parentNote,
          }));
        } catch (err) { console.error('Attendance insert failed:', err); }
      },
      updateAttendanceLog: async (id, log) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.map(l => l.id === id ? log : l) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'attendance_logs', id), clean({
            date: log.date,
            subject: log.subject,
            status: log.status,
            juz: log.juz,
            hizb: log.hizb,
            surahStarted: log.surahStarted,
            ayahStarted: log.ayahStarted,
            surahEnded: log.surahEnded,
            ayahEnded: log.ayahEnded,
            bookName: log.bookName,
            lessonStarted: log.lessonStarted,
            pageStarted: log.pageStarted,
            lessonEnded: log.lessonEnded,
            pageEnded: log.pageEnded,
            teacherNote: log.teacherNote,
            parentNote: log.parentNote,
          }));
        } catch (err) { console.error('Attendance update failed:', err); }
      },
      deleteAttendanceLog: async (id) => {
        set(state => ({ attendanceLogs: state.attendanceLogs.filter(l => l.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'attendance_logs', id));
        } catch (err) { console.error('Attendance delete failed:', err); }
      },

      // â”€â”€ PAYMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addPayment: async (payment) => {
        set(state => ({ payments: [payment, ...state.payments] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'payments', payment.id), clean({
            studentId: payment.studentId,
            month: payment.month,
            amount: payment.amount,
            status: payment.status,
            datePaid: payment.datePaid,
          }));
        } catch (err) { console.error('Payment insert failed:', err); }
      },
      updatePayment: async (id, payment) => {
        set(state => ({ payments: state.payments.map(p => p.id === id ? payment : p) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'payments', id), clean({
            month: payment.month,
            amount: payment.amount,
            status: payment.status,
            datePaid: payment.datePaid,
          }));
        } catch (err) { console.error('Payment update failed:', err); }
      },
      deletePayment: async (id) => {
        set(state => ({ payments: state.payments.filter(p => p.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'payments', id));
        } catch (err) { console.error('Payment delete failed:', err); }
      },

      // â”€â”€ EXAMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      addExam: async (exam) => {
        set(state => ({ exams: [exam, ...state.exams] }));
        try {
          const db = getFirebaseDb();
          await setDoc(doc(db, 'exams', exam.id), clean({
            studentId: exam.studentId,
            subject: exam.subject,
            teacherId: exam.teacherId,
            score: exam.score,
            grade: exam.grade,
            term: exam.term,
            date: exam.date,
          }));
        } catch (err) { console.error('Exam insert failed:', err); }
      },
      updateExam: async (id, exam) => {
        set(state => ({ exams: state.exams.map(e => e.id === id ? exam : e) }));
        try {
          const db = getFirebaseDb();
          await updateDoc(doc(db, 'exams', id), clean({
            subject: exam.subject,
            teacherId: exam.teacherId,
            score: exam.score,
            grade: exam.grade,
            term: exam.term,
            date: exam.date,
          }));
        } catch (err) { console.error('Exam update failed:', err); }
      },
      deleteExam: async (id) => {
        set(state => ({ exams: state.exams.filter(e => e.id !== id) }));
        try {
          const db = getFirebaseDb();
          await deleteDoc(doc(db, 'exams', id));
        } catch (err) { console.error('Exam delete failed:', err); }
      },

      // â”€â”€ BOOTSTRAP: load ALL live data from Firestore on app start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // Strategy: For each section, if Firestore has data â†’ use it.
      //           If Firestore is empty â†’ keep initialMockData in state.
      //           Admin's first "Save" click triggers an update* action which
      //           writes to Firestore, seeding it permanently.
      initializeFirestore: async () => {
        try {
          const db = getFirebaseDb();

          // â”€â”€ Fetch all CMS singleton documents in parallel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          const [
            heroDoc,
            challengesDoc,
            featuresDoc,
            stepsDoc,
            statsContentDoc,
            courseHelpCTADoc,
            bottomCTADoc,
            footerDoc,
            aboutDoc,
            pricingDoc,
            libraryPageDoc,
            insightsHeaderDoc,
            ijazahDoc,
            statsDoc,
            settingsDoc,
            faqDoc,
          ] = await Promise.all([
            getDoc(doc(db, CMS, 'hero')),
            getDoc(doc(db, CMS, 'challengesContent')),
            getDoc(doc(db, CMS, 'featuresContent')),
            getDoc(doc(db, CMS, 'stepsContent')),
            getDoc(doc(db, CMS, 'statsContent')),
            getDoc(doc(db, CMS, 'courseHelpCTA')),
            getDoc(doc(db, CMS, 'bottomCTA')),
            getDoc(doc(db, CMS, 'footerContent')),
            getDoc(doc(db, CMS, 'aboutPageContent')),
            getDoc(doc(db, CMS, 'pricingContent')),
            getDoc(doc(db, CMS, 'libraryPageContent')),
            getDoc(doc(db, CMS, 'insightsHeader')),
            getDoc(doc(db, CMS, 'ijazahContent')),
            getDoc(doc(db, CMS, 'stats')),
            getDoc(doc(db, CMS, 'settings')),
            getDoc(doc(db, CMS, 'faqContent')),
          ]);

          // Apply each singleton only if it exists in Firestore
          if (heroDoc.exists()) set({ hero: heroDoc.data() as HeroContent });
          if (challengesDoc.exists()) set({ challengesContent: challengesDoc.data() as ChallengesContent });
          if (featuresDoc.exists()) set({ featuresContent: featuresDoc.data() as FeaturesContent });
          if (stepsDoc.exists()) set({ stepsContent: stepsDoc.data() as StepsContent });
          if (statsContentDoc.exists()) set({ statsContent: statsContentDoc.data() as StatsContent });
          if (courseHelpCTADoc.exists()) set({ courseHelpCTA: courseHelpCTADoc.data() as CourseHelpCTA });
          if (bottomCTADoc.exists()) set({ bottomCTA: bottomCTADoc.data() as BottomCTAContent });
          if (footerDoc.exists()) set({ footerContent: footerDoc.data() as FooterContent });
          if (aboutDoc.exists()) set({ aboutPageContent: aboutDoc.data() as AboutPageContent });
          if (pricingDoc.exists()) set({ pricingContent: pricingDoc.data() as PricingContent });
          if (libraryPageDoc.exists()) set({ libraryPageContent: libraryPageDoc.data() as LibraryPageContent });
          if (insightsHeaderDoc.exists()) set({ insightsHeader: insightsHeaderDoc.data() as InsightsHeader });
          if (ijazahDoc.exists()) set({ ijazahContent: ijazahDoc.data() as IjazahContent });
          if (statsDoc.exists()) set({ stats: statsDoc.data() as SiteStats });
          if (settingsDoc.exists()) set({ settings: settingsDoc.data() as SiteSettings });
          if (faqDoc.exists()) set({ faqContent: faqDoc.data() as FaqContent });

          // â”€â”€ Fetch all collection-based data in parallel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          const [
            studentsSnap,
            teachersSnap,
            attendanceSnap,
            paymentsSnap,
            examsSnap,
            enrollmentsSnap,
            heroSlidesSnap,
            insightsSnap,
            coursesSnap,
            librarySnap,
            testimonialsSnap,
            leadsSnap,
            postsSnap,
            tracksSnap,
          ] = await Promise.all([
            getDocs(collection(db, 'students')),
            getDocs(collection(db, 'teachers')),
            getDocs(collection(db, 'attendance_logs')),
            getDocs(collection(db, 'payments')),
            getDocs(collection(db, 'exams')),
            getDocs(collection(db, 'enrollments')),
            getDocs(query(collection(db, 'hero_slides'), orderBy('sortOrder'))),
            getDocs(query(collection(db, 'insights'), orderBy('date', 'desc'))),
            getDocs(collection(db, 'courses')),
            getDocs(collection(db, 'library')),
            getDocs(collection(db, 'testimonials')),
            getDocs(collection(db, 'leads')),
            getDocs(query(collection(db, 'posts'), orderBy('date', 'desc'))),
            getDocs(collection(db, 'tracks')),
          ]);

          // Students + enrollments
          if (!studentsSnap.empty) {
            const enrollments = enrollmentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
            const mapped = studentsSnap.docs.map(d => {
              const s = d.data() as any;
              return {
                id: d.id,
                studentId: s.studentId,
                name: s.name,
                status: s.status,
                classDays: s.classDays,
                classTime: s.classTime,
                enrollments: enrollments
                  .filter(e => e.studentId === d.id)
                  .map(e => ({
                    id: e.id,
                    subjectName: e.subjectName,
                    teacherId: e.teacherId,
                    level: e.level,
                    status: e.status,
                    totalLessons: e.totalLessons,
                    currentJuz: e.currentJuz,
                    currentHizb: e.currentHizb,
                    currentSurah: e.currentSurah,
                    currentAyah: e.currentAyah,
                    currentLesson: e.currentLesson,
                    currentPage: e.currentPage,
                  })),
              };
            });
            set({ students: mapped });
          }

          if (!teachersSnap.empty) {
            set({
              teachers: teachersSnap.docs.map(d => {
                const t = d.data() as any;
                return {
                  id: d.id,
                  name: t.name,
                  titleSo: t.titleSo,
                  titleEn: t.titleEn,
                  bioSo: t.bioSo,
                  bioEn: t.bioEn,
                  imageUrl: t.imageUrl,
                  username: t.username,
                  password: t.password,
                };
              })
            });
          }

          if (!attendanceSnap.empty) {
            set({
              attendanceLogs: attendanceSnap.docs.map(d => {
                const l = d.data() as any;
                return {
                  id: d.id,
                  studentId: l.studentId,
                  date: l.date,
                  subject: l.subject,
                  subjectId: l.subjectId,
                  status: l.status,
                  juz: l.juz,
                  hizb: l.hizb,
                  surahStarted: l.surahStarted,
                  ayahStarted: l.ayahStarted,
                  surahEnded: l.surahEnded,
                  ayahEnded: l.ayahEnded,
                  bookName: l.bookName,
                  lessonStarted: l.lessonStarted,
                  pageStarted: l.pageStarted,
                  lessonEnded: l.lessonEnded,
                  pageEnded: l.pageEnded,
                  teacherNote: l.teacherNote,
                  parentNote: l.parentNote,
                };
              })
            });
          }

          if (!paymentsSnap.empty) {
            set({
              payments: paymentsSnap.docs.map(d => {
                const p = d.data() as any;
                return {
                  id: d.id,
                  studentId: p.studentId,
                  month: p.month,
                  amount: p.amount,
                  status: p.status,
                  datePaid: p.datePaid,
                };
              })
            });
          }

          if (!examsSnap.empty) {
            set({
              exams: examsSnap.docs.map(d => {
                const e = d.data() as any;
                return {
                  id: d.id,
                  studentId: e.studentId,
                  subject: e.subject,
                  teacherId: e.teacherId,
                  score: e.score,
                  grade: e.grade,
                  term: e.term,
                  date: e.date,
                };
              })
            });
          }

          if (!heroSlidesSnap.empty) {
            set({
              heroSlides: heroSlidesSnap.docs.map(d => {
                const s = d.data() as any;
                return {
                  id: d.id,
                  image: s.image,
                  hadithAr: s.hadithAr,
                  hadithSo: s.hadithSo,
                  hadithEn: s.hadithEn,
                };
              })
            });
          }

          if (!insightsSnap.empty) {
            set({
              insights: insightsSnap.docs.map(d => {
                const i = d.data() as any;
                return {
                  id: d.id,
                  image: i.image,
                  categorySo: i.categorySo,
                  categoryEn: i.categoryEn,
                  titleSo: i.titleSo,
                  titleEn: i.titleEn,
                  contentSo: i.contentSo,
                  contentEn: i.contentEn,
                  date: i.date,
                };
              })
            });
          }

          if (!coursesSnap.empty) {
            set({ courses: coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course)) });
          }

          if (!librarySnap.empty) {
            set({ library: librarySnap.docs.map(d => ({ id: d.id, ...d.data() } as Book)) });
          }

          if (!testimonialsSnap.empty) {
            set({ testimonials: testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)) });
          }

          if (!leadsSnap.empty) {
            set({ leads: leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)) });
          }

          if (!postsSnap.empty) {
            set({ posts: postsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Post)) });
          }

          if (!tracksSnap.empty) {
            set({ tracks: tracksSnap.docs.map(d => ({ id: d.id, ...d.data() } as AudioTrack)) });
          }

        } catch (error) {
          console.error('Firestore init failed. Catching error to prevent hydration crash:', error);
        }
      },

      /** @deprecated alias for backward compatibility */
      initializeSupabase: async () => {
        return get().initializeFirestore();
      },
    }),
    {
      name: 'miftaxul-cms-storage',
    }
  )
);
