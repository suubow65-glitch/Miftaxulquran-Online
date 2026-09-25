export const LESSON_CATEGORIES = ["Quran", "Tajweed", "Arabic"] as const;

export type LessonCategory = (typeof LESSON_CATEGORIES)[number];

export type Lesson = {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  documentLink: string;
  createdAt?: Date | null;
};
