export type Language = "en" | "so";

export type NavbarTranslations = {
  home: string;
  courses: string;
  whyChooseUs: string;
  about: string;
  contact: string;
  view: string;
  admin: string;
  tagline: string;
};

export type HeroTranslations = {
  welcomeBadge: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  btnJoinNow: string;
  btnViewCourses: string;
  students: string;
  featuredCourse: string;
  courseName: string;
  tajweedMastery: string;
  memorization: string;
  arabicGrammar: string;
  topTeacherName: string;
  topTeacherTitle: string;
};

export type StatsTranslations = {
  items: {
    label: string;
    value: string;
    suffix: string;
  }[];
};

export type CoursesTranslations = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
};

export type WhyChooseUsTranslations = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  reasons: {
    title: string;
    description: string;
  }[];
  stickCardBadge: string;
  stickCardTitle1: string;
  stickCardTitle2: string;
  stickCardList: string[];
  stickCardCta: string;
  addAllPrograms: string;
};

export type AboutTranslations = {
  badge: string;
  title1: string;
  title2: string;
  title3: string;
  description1: string;
  description2: string;
  yearsServing: string;
  countries: string;
  certifiedTeachers: string;
  happyStudents: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  contactTitle: string;
  contactBody: string;
};

export type CTATranslations = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  btnFreeTrial: string;
  btnTeacherLogin: string;
};

export type FooterTranslations = {
  tagline: string;
  description: string;
  quickLinks: string;
  linkCourses: string;
  linkWhyUs: string;
  linkAbout: string;
  linkContact: string;
  linkAdmin: string;
  programs: string;
  progHifz: string;
  progTajweed: string;
  progArabic: string;
  progIslamic: string;
  copyright: string;
  taglineArabic: string;
};

export type LandingTranslations = {
  navbar: NavbarTranslations;
  hero: HeroTranslations;
  stats: StatsTranslations;
  courses: CoursesTranslations;
  whyChooseUs: WhyChooseUsTranslations;
  about: AboutTranslations;
  cta: CTATranslations;
  footer: FooterTranslations;
};

export type DashboardTranslations = {
  dashboard: string;
  signOut: string;
  adminPanel: string;
  toastSuccessTitle: string;
  toastErrorTitle: string;
  addNewLesson: string;
  addNewLessonSub: string;
  lessonTitle: string;
  lessonTitlePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  category: string;
  documentLink: string;
  documentLinkPlaceholder: string;
  resetForm: string;
  save: string;
  saving: string;
  saveSuccess: string;
  saveError: string;
  allLessons: string;
  allLessonsSubLoading: string;
  allLessonsSubCount: (count: number) => string;
  searchPlaceholder: string;
  loadingLessons: string;
  lessonsFetchError: string;
  emptyNoLessonsTitle: string;
  emptyNoLessonsBody: string;
  emptyNoMatchTitle: string;
  emptyNoMatchBody: string;
  noDescription: string;
  openDocument: string;
  deleteAria: (title: string) => string;
  deleteBtn: string;
  confirmDeletePrompt: string;
  confirmCancel: string;
  confirmDelete: string;
  deleting: string;
  deleteSuccess: string;
  deleteError: string;
};

export type Translations = {
  landing: LandingTranslations;
  dashboard: DashboardTranslations;
  languageSwitcher: {
    somali: string;
    english: string;
  };
};

const en: Translations = {
  languageSwitcher: {
    somali: "SO",
    english: "EN",
  },
  landing: {
    navbar: {
      home: "Home",
      courses: "Courses",
      whyChooseUs: "Why Choose Us",
      about: "About",
      contact: "Contact",
      view: "View",
      admin: "Admin",
      tagline: "Online Islamic Academy",
    },
    hero: {
      welcomeBadge: "Welcome to Miftaxulquran Online",
      titleStart: "Learn the ",
      titleHighlight: "Noble Quran",
      titleEnd: " from the comfort of your home",
      subtitle:
        "Miftaxulquran Online is a school that makes it easy for you to learn the religion and memorize the Quran, wherever you are in the world. Expert teachers, a clear and suitable method, and an elevated spiritual atmosphere.",
      btnJoinNow: "Join Now",
      btnViewCourses: "View Courses",
      students: "2,000+ Students",
      featuredCourse: "Featured Course",
      courseName: "Quran Memorization",
      tajweedMastery: "Tajweed Mastery",
      memorization: "Memorization",
      arabicGrammar: "Arabic Grammar",
      topTeacherName: "Sheikh Ahmed",
      topTeacherTitle: "Senior Teacher",
    },
    stats: {
      items: [
        { label: "Active Students", value: "2,000+", suffix: "Around the World" },
        { label: "Expert Teachers", value: "50+", suffix: "Certified Scholars" },
        { label: "Flexible Hours", value: "24/7", suffix: "Whenever you want" },
        { label: "International Certificate", value: "Ijazah", suffix: "Quran Accreditation" },
      ],
    },
    courses: {
      badge: "Our Premium Programs",
      title1: "Our Core ",
      title2: "Courses",
      description:
        "From foundational Arabic to advanced Quran memorization, our programs are designed for learners of all ages and levels — guided by certified scholars in a comfortable spiritual environment.",
    },
    whyChooseUs: {
      badge: "Quality of Islamic Education",
      title1: "Why ",
      title2: " Choose Us?",
      description:
        "Miftaxulquran Online combines a traditional Quran curriculum with modern education technology to deliver an unmatched experience.",
      reasons: [
        {
          title: "Expert Teachers",
          description:
            "All our teachers hold traditional Ijazahs and modern teaching certificates, ensuring authentic, high-quality religious instruction.",
        },
        {
          title: "Flexible Hours",
          description:
            "Learn at your own pace with one-on-one or group sessions scheduled at any time that suits you across all world time zones.",
        },
        {
          title: "Personalized Curriculum",
          description:
            "Learning paths tailored to each student's level, goals, and learning style so progress is optimized as much as possible.",
        },
        {
          title: "Safe & Spiritual Environment",
          description:
            "An uplifting, gender-separate spiritual atmosphere with parent progress updates and continuous follow-up for younger students.",
        },
        {
          title: "Worldwide Accessibility",
          description:
            "Join students from 40+ countries. Top-tier interactive tools accessible from any device, anywhere you are in the world.",
        },
        {
          title: "Holistic Development",
          description:
            "Beyond academics — character building, Islamic manners, and spiritual nourishment integrated into every one of our lessons.",
        },
      ],
      stickCardBadge: "Student Promise",
      stickCardTitle1: "Your Success Is ",
      stickCardTitle2: "Our Priority",
      stickCardList: [
        "30-day convenient satisfaction guarantee",
        "Trial lesson with any teacher you prefer",
        "Weekly progress reports by email",
        "Parent portal for children's lessons",
        "Lifetime access to all recorded lessons",
        "Ijazah Certificate upon completion",
      ],
      stickCardCta: "Start Your Free Trial",
      addAllPrograms: "Includes all programs",
    },
    about: {
      badge: "About Us",
      title1: "A Trusted Name in ",
      title2: "Online Quran",
      title3: "& Islamic Studies",
      description1:
        "<strong>Miftaxulquran Online Academy</strong> is dedicated to spreading and teaching religious knowledge. It was founded with the goal of making authentic religious education accessible to every Muslim family around the world — for more than 15 years it has been a beacon of Quran learning. Our name, &ldquo;Miftaxulquran,&rdquo; means <em>&ldquo;The Key to the Quran,&rdquo;</em> which is also what we deliver: the keys to unlocking the Book of Allah.",
      description2:
        "We connect hardworking students with expert scholars who hold authentic Ijazahs (chains of narration) traceable back to the Prophet Muhammad ﷺ. Our curriculum merges traditional methodology with modern educational technology, ensuring every student receives a comprehensive, interactive, and spiritually uplifting education.",
      yearsServing: "Years Serving the Ummah",
      countries: "Countries",
      certifiedTeachers: "Certified Teachers",
      happyStudents: "Happy Students",
      missionTitle: "Our Mission",
      missionBody:
        "To spread the light of the Quran and authentic Sunnah to every corner of the Ummah.",
      visionTitle: "Our Vision",
      visionBody:
        "A world in which every Muslim reads, understands, and lives by the Noble Quran.",
      contactTitle: "Contact Us",
      contactBody:
        "If you have questions or would like to consult, contact us by email: info@miftaxulquran.online",
    },
    cta: {
      badge: "Begin Your Spiritual Journey Today",
      title1: "Ready to unlock the ",
      title2: "Book of Allah?",
      description:
        "Join thousands of students whose lives have been transformed by the Quran. Your first lesson is completely free — no commitment, no credit card required.",
      btnFreeTrial: "Get Your Free Trial Lesson",
      btnTeacherLogin: "Teacher Login",
    },
    footer: {
      tagline: "Online Islamic Academy",
      description:
        "To uplift the Ummah by providing authentic, traditional Quranic education. Learn to read, memorize, and understand the Noble Quran with certified teachers — anytime, anywhere.",
      quickLinks: "Quick Links",
      linkCourses: "Courses",
      linkWhyUs: "Why Choose Us",
      linkAbout: "About",
      linkContact: "Contact",
      linkAdmin: "Admin Portal",
      programs: "Programs",
      progHifz: "Quran Memorization (Hifz)",
      progTajweed: "Tajweed & Qira'at",
      progArabic: "Arabic Language",
      progIslamic: "Islamic Studies",
      copyright: `© ${new Date().getFullYear()} Miftaxulquran Online. All rights reserved. May Allah accept our deeds.`,
      taglineArabic: "The Key of the Quran — مفتاح القرآن",
    },
  },
  dashboard: {
    dashboard: "Dashboard",
    signOut: "Sign out",
    adminPanel: "Admin Panel",
    toastSuccessTitle: "Success",
    toastErrorTitle: "Something went wrong",
    addNewLesson: "Add New Lesson",
    addNewLessonSub:
      "Publish Quran, Tajweed, or Arabic — it will appear on the website immediately.",
    lessonTitle: "Lesson Title",
    lessonTitlePlaceholder: "e.g. Surah Al-Fatiha — Tajweed Explanation",
    description: "Description",
    descriptionPlaceholder: "Summarize what the student will learn in this lesson…",
    category: "Category",
    documentLink: "Document Link",
    documentLinkPlaceholder: "https://drive.google.com/… or PDF / Google Docs link",
    resetForm: "Clear form",
    save: "Save",
    saving: "Saving…",
    saveSuccess: "The lesson was saved! Ready for the next one.",
    saveError:
      "Could not save the lesson. Make sure Firestore is open and rules allow writes.",
    allLessons: "All Lessons",
    allLessonsSubLoading: "Loading lessons from Firestore…",
    allLessonsSubCount: (count) =>
      `${count} lesson${count === 1 ? "" : "s"} published`,
    searchPlaceholder: "Search lessons…",
    loadingLessons: "Loading lessons…",
    lessonsFetchError:
      "Could not load lessons. Check Firestore is enabled and rules are correct.",
    emptyNoLessonsTitle: "No lessons yet",
    emptyNoLessonsBody:
      "Use the form above to publish your first lesson. It will appear here right away as well as on the landing page.",
    emptyNoMatchTitle: "No lessons match your search",
    emptyNoMatchBody:
      "Try a different search term, or clear the current query.",
    noDescription: "No description",
    openDocument: "Open document",
    deleteAria: (title) => `Delete ${title}`,
    deleteBtn: "Delete",
    confirmDeletePrompt: "Permanently delete?",
    confirmCancel: "Cancel",
    confirmDelete: "Delete",
    deleting: "Deleting…",
    deleteSuccess: "The lesson was deleted.",
    deleteError: "Could not delete the lesson. Check Firestore rules.",
  },
};

const so: Translations = {
  languageSwitcher: {
    somali: "SO",
    english: "EN",
  },
  landing: {
    navbar: {
      home: "Hoyga",
      courses: "Koorsooyinka",
      whyChooseUs: "Maxaad Noo Dooranaysaa?",
      about: "Nagu Saabsan",
      contact: "Nagala Soo Xiriir",
      view: "Eeg",
      admin: "Maareeyaha",
      tagline: "Dugsiga Diinta ee Onlaynka",
    },
    hero: {
      welcomeBadge: "Ku soo dhawoow Miftaxulquran Online",
      titleStart: "Baro ",
      titleHighlight: "Qur'aanka Kariimka",
      titleEnd: " adigoo jooga gurigaaga",
      subtitle:
        "Miftaxulquran Online waa dugsi kuu fududeynaya barashada diinta iyo xifdinta Qur'aanka, meel kasta oo aad dunida ka joogto. Macalimiin khubaro ah, dariiqa leedahay oo ku habboon, iyo jawi diimeed oo kor u qaada.",
      btnJoinNow: "Ku Biir Hadda",
      btnViewCourses: "Eeg Koorsooyinka",
      students: "2,000+ Arday",
      featuredCourse: "Koorisku la muujiyey",
      courseName: "Xifdinta Qur'aanka",
      tajweedMastery: "Hir-gelinta Tacwiid",
      memorization: "Xifdinta",
      arabicGrammar: "Xisaabta Carabiga",
      topTeacherName: "Sheekh Axmed",
      topTeacherTitle: "Macallimka Sarreea",
    },
    stats: {
      items: [
        { label: "Arday Dhaqdhaqaaqa", value: "2,000+", suffix: "Dhammaan Dunida" },
        { label: "Macalimiin Khubaro ah", value: "50+", suffix: "Aqoonyahannada Shiineysan" },
        { label: "Saacado Dabacsan", value: "24/7", suffix: "Waqti kasta oo aad rabto" },
        { label: "Shahaado Caalami ah", value: "Ijazah", suffix: "Xaqiijinta Qur'aanka" },
      ],
    },
    courses: {
      badge: "Barnaamijyadayada aad u haysan",
      title1: "Koorsooyinkayaga ",
      title2: "Asaaska",
      description:
        "Laga bilaabo Carabiga aasaasiga ah illaa xifdinta Qur'aanka sare, barnaamijkeenna waxaa loogu talagalay ardayda dhammaan da'mada iyo heerarka — iyada oo ay hagayaan aqoon yahan shiineysan oo jawi diimeed ku habboon.",
    },
    whyChooseUs: {
      badge: "Tayo ee Tacliinta Diinta",
      title1: "<span className=\"text-primary\">Maxaad</span> ",
      title2: "noo dooranaysaa?",
      description:
        "Miftaxulquran Online wuxuu isku daraa barnaamij Qur'aan diimeed iyo tignoolajiyada tacliinta casri ah si loo bixiyo khibrad aan la iskaashi karin.",
      reasons: [
        {
          title: "Macalimiin Khubaro ah",
          description:
            "Dhammaan macalimiinayadu waxay haystaa Ijaazaha dhaqameed iyo shahaadoyo tacliin ah casri ah, taas oo xaqiijinaysa tacliin diimeed sax ah oo tayo sare leh.",
        },
        {
          title: "Saacado Dabacsan",
          description:
            "Baro heerkaaga iyada oo leedahay shir qof kasta ama koox oo diyaar ah saacad kasta oo waqtigaaga ku habboon dhammaan aagagga dunida.",
        },
        {
          title: "Barnaamij shakhsi ah",
          description:
            "Waddooyinka barashada ee loo habboontay heer, yool, qaab barashada arday kasta si ugu fiican u loo ilaaliyo horumarka.",
        },
        {
          title: "Jawi Nabdoon oo Diimeed",
          description:
            "Jawi kor u qaada diimeed oo jinsiga kala saaray, iyada oo horumarinta waalidka iyo la socodka hormarka ardayda yar yarba la mid ah.",
        },
        {
          title: "Helitaanka Dunida oo Dhan",
          description:
            "Ku biir arday ka imanaya 40+ wadan. Kutooyinka isdhexgalka sare ah oo laga heli karo aalad kasta, meel kasta oo aad dunida ka joogto.",
        },
        {
          title: "Horumar Dhamaystiran",
          description:
            "Kabadan cilmi-baris — dhismeed dabeecad, adaab diimeed, iyo nafaqo ruuxeed oo lagu daray casharkeenna kasta.",
        },
      ],
      stickCardBadge: "Ballan-quulka Ardayga",
      stickCardTitle1: "Guulkaagu Waa ",
      stickCardTitle2: "Horeyntayada",
      stickCardList: [
        "30 maalmood oo dammaanad qaadasho ku haboon",
        "Cashar tijaabada ah oo macallim kasta oo aad rabto",
        "Warbixinta toddobaadleed ee emailka",
        "Safarka waalidka ee casharada caruurta",
        "Helitaanka waqtiga dhammaan casharada duubey",
        "Shahaadada Ijaazah marka la dhammeeyo",
      ],
      stickCardCta: "Qayb-gelinta Tijaabada",
      addAllPrograms: "Ku dar dhammaan barnaamijyada",
    },
    about: {
      badge: "Nagu Saabsan",
      title1: "Magac la Aqoontay oo ",
      title2: "Qur'aanka Onlaynka",
      title3: "& Daraasadaha Diinta",
      description1:
        "<strong>Dugsiga Miftaxulquran Online</strong> wuxuu u taaganyahay fidinta iyo barashada cilmiga diinta. Waxaa la aasasay hadafka loo dhigo in tacliinta diinta sax ah ay hel karaan qoyska Muslim ah kasta oo dunida ku jira — 15 sano ka badnayd ayay noqotay iftiinka barashada Qur'aanka. Magacayaguna &ldquo;Miftaxulquran&rdquo; wuxuu ula macno yahay <em>&ldquo;Furaha Qur'aanka,&rdquo;</em> kuwaas oo sidoo kale ah waxa aan bixinaa: furrayaasha furista Buugta Ilaahow.",
      description2:
        "Waxaan isku xirnaa arday dadaal badan iyo aqoon khubaro ah oo haysta Ijaazaha dhab ah (silsiladda sheekooyinka) oo lagu raacin doonaa Nabi Maxamed ﷺ. Barnaamijkeenna wuxuu isku daraa hab-dhismeed dhaqameed iyo tignoolajiyada tacliinta casri ah, taas oo xaqiijinaysa arday kasta inuu helo tacliin buuxa, isdhexgaleed, iyo ruuxeed oo kor u qaada.",
      yearsServing: "Sano oo la adeecay Umadda",
      countries: "Waddooyinka",
      certifiedTeachers: "Macalimiin Shiineysan",
      happyStudents: "Arday Ku Faraxay",
      missionTitle: "Hawwadeennu",
      missionBody:
        "In lagu fidsii iftiinka Qur'aanka iyo Sunnada sax ah dhammaan geesahooda Umadda.",
      visionTitle: "Arabtaannu",
      visionBody:
        "Dunida uu Muslimku akhristo, fahmo, iyo ku noolaado Qur'aanka Kariimka.",
      contactTitle: "Nagala Soo Xiriir",
      contactBody:
        "Haddii aad qabto su'aalo ama aad rabto inaad tashadaa, nala soo xiriir emailka: info@miftaxulquran.online",
    },
    cta: {
      badge: "Ku bilow Safarkaga Diimeed Hadda",
      title1: "Diyaar u tahay inaad furto ",
      title2: "Buugta Ilaahow?",
      description:
        "Ku biir arday kumanaan oo noloshooda ku beddelay Qur'aanka. Casharkii ugu horreeyay waa gebi ahaan oo bilaash ah — ballan-quul la'aani, kaarka amaahuma.",
      btnFreeTrial: "Hel Casharkii Tijaabada ee Bilaashka ah",
      btnTeacherLogin: "Soo-gelinta Macallimka",
    },
    footer: {
      tagline: "Dugsiga Diinta ee Onlaynka",
      description:
        "In la kor u qaado Umadda iyada oo loo sii deyniyo tacliin Qur'aan diimeed oo sax ah. Baro akhriso, xifdi, oo faham Qur'aanka Kariimka iyada oo ay macallimiin shiineysan — waqtigana, meel kasta.",
      quickLinks: "Xiriirka Dhakhirah",
      linkCourses: "Koorsooyinka",
      linkWhyUs: "Maxaad Noo Dooranaysaa?",
      linkAbout: "Nagu Saabsan",
      linkContact: "Nagala Soo Xiriir",
      linkAdmin: "Albaabka Maareeyaha",
      programs: "Barnaamijyada",
      progHifz: "Xifdinta Qur'aanka (Hifz)",
      progTajweed: "Tacwiid & Qira'ad",
      progArabic: "Luqadda Carabiga",
      progIslamic: "Daraasadaha Diinta",
      copyright: `© ${new Date().getFullYear()} Miftaxulquran Online. Dhammaan xuquuqda way ilaawin. Ilaahow hay nolosheena aqbal.`,
      taglineArabic: "Furaha Qur'aanka — مفتاح القرآن",
    },
  },
  dashboard: {
    dashboard: "Dashboard",
    signOut: "Ka Bax",
    adminPanel: "Albaabka Maareeyaha",
    toastSuccessTitle: "Waad guulaysatay",
    toastErrorTitle: "Cillad baa dhacday",
    addNewLesson: "Ku dar Cashar Cusub",
    addNewLessonSub:
      "Daahir Qur'aan, Tacwiid, ama Carabi — waxay ku muuqataa bogga website isla markiiba.",
    lessonTitle: "Cinwaanka Casharka",
    lessonTitlePlaceholder: "Tusaale: Surah Al-Faatiha — Sharaxaad Tacwiid",
    description: "Faahfaahinta",
    descriptionPlaceholder: "Soo koobis waxa ardaygu ka baran doono casharkan...",
    category: "Nooca Casharka",
    documentLink: "Link-ga Dokumentiga",
    documentLinkPlaceholder: "https://drive.google.com/... ama link-ka PDF / Google Docs",
    resetForm: "Nadiif foomka",
    save: "Keydi",
    saving: "Waa la kaydinaa...",
    saveSuccess: "Casharkii waa la kaydiyay! Diyaar u ah kan dambe.",
    saveError:
      "Lama kaydin casharka. Hubi Firestore la furo iyo xeeradu ogolaadaan qorista.",
    allLessons: "Dhammaan Casharada",
    allLessonsSubLoading: "Casharada laga soo baxayaa Firestore...",
    allLessonsSubCount: (count) =>
      `${count} cashar${count === 1 ? "" : "o"} ayaa la daahiray`,
    searchPlaceholder: "Raadi casharada...",
    loadingLessons: "Waa la soo baxayaa casharada...",
    lessonsFetchError:
      "Lama helin casharada. Hubi in Firestore la furo iyo xeeradu sax yihiin.",
    emptyNoLessonsTitle: "Weli cashar kuma jiran",
    emptyNoLessonsBody:
      "Isticmaal foomka kor ku xiran si aad daahiso casharkii ugu horreeyay. Wuxuu halkan muuqmi doonaa isla markiiba iyo sidoo kale bogga landing-ka.",
    emptyNoMatchTitle: "Ma jiro cashar raadiyahaaga isu dhaba",
    emptyNoMatchBody:
      "Isku day eray raadin ah oo ka duwan, ama saxiix jaddida raadinta.",
    noDescription: "Ma jiro faahfaahin",
    openDocument: "Fur dukumintiga",
    deleteAria: (title) => `Tirtir ${title}`,
    deleteBtn: "Tirtir",
    confirmDeletePrompt: "Si joogto ah ayaad u tirtirayaa?",
    confirmCancel: "Jooji",
    confirmDelete: "Tirtir",
    deleting: "Waa la tirtiraa...",
    deleteSuccess: "Casharkii waa la tirtiray.",
    deleteError: "Lama tirtirin casharka. Hubi xeerada Firestore.",
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { en, so };

export function getTranslations(lang: Language): Translations {
  return TRANSLATIONS[lang];
}

export const DEFAULT_LANGUAGE: Language = "so";
