"use client";

import { BookOpen, ExternalLink, Languages, ScrollText } from "lucide-react";
import { useStore, type CMSState } from "@/lib/store";
import { type Lesson, type LessonCategory } from "@/lib/lessons";

const categoryIcons: Record<LessonCategory, typeof BookOpen> = {
  Quran: BookOpen,
  Tajweed: ScrollText,
  Arabic: Languages,
};

// Map attendance logs / courses from local store to a "lessons" format
export function LessonsList() {
  const courses = useStore((s: CMSState) => s.courses);

  if (courses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-emerald-200 bg-white px-4 py-8 text-center text-emerald-800/80">
        No lessons yet. Sign in to the admin dashboard to add courses.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => {
        const cat = (course.category.charAt(0).toUpperCase() + course.category.slice(1)) as LessonCategory;
        const Icon = categoryIcons[cat] ?? BookOpen;

        return (
          <li
            key={course.id}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {course.badgeEn}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-950">{course.titleEn}</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900/75">{course.descEn}</p>
          </li>
        );
      })}
    </ul>
  );
}
