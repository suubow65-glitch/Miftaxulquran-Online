"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { BookOpen, ExternalLink, Languages, ScrollText } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase";
import { type Lesson, type LessonCategory } from "@/lib/lessons";

const categoryIcons: Record<LessonCategory, typeof BookOpen> = {
  Quran: BookOpen,
  Tajweed: ScrollText,
  Arabic: Languages,
};

export function LessonsList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const lessonsQuery = query(
      collection(getFirebaseDb(), "lessons"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      lessonsQuery,
      (snapshot) => {
        const nextLessons = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "",
            description: data.description ?? "",
            category: (data.category ?? "Quran") as LessonCategory,
            documentLink: data.documentLink ?? "",
          };
        });
        setLessons(nextLessons);
        setLoading(false);
      },
      () => {
        setError("Could not load lessons. Enable Firestore in the Firebase Console.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return <p className="text-emerald-800/70">Loading lessons...</p>;
  }

  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  }

  if (lessons.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-emerald-200 bg-white px-4 py-8 text-center text-emerald-800/80">
        No lessons yet. Sign in to the admin dashboard to add the first one.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {lessons.map((lesson) => {
        const Icon = categoryIcons[lesson.category] ?? BookOpen;

        return (
          <li
            key={lesson.id}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {lesson.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-950">{lesson.title}</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900/75">{lesson.description}</p>
            {lesson.documentLink ? (
              <a
                href={lesson.documentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Open document
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
