import type { Lesson, Chapter } from "./types";
import { CHAPTERS, chapterBySlug } from "./chapters";

import csharp from "@/data/csharp.json";
import oop from "@/data/oop.json";
import advanced from "@/data/advanced.json";
import aspnet from "@/data/aspnet.json";
import entityframework from "@/data/entityframework.json";
import sqlserver from "@/data/sqlserver.json";
import azure from "@/data/azure.json";
import systemdesign from "@/data/systemdesign.json";
import coding from "@/data/coding.json";
import production from "@/data/production.json";
import behavioral from "@/data/behavioral.json";
import ai from "@/data/ai.json";

export { CHAPTERS, chapterBySlug };

const RAW: Record<string, unknown[]> = {
  csharp, oop, advanced, aspnet, entityframework, sqlserver,
  azure, systemdesign, coding, production, behavioral, ai,
};

/** Flat, ordered list of every lesson across all chapters. */
export const LESSONS: Lesson[] = CHAPTERS.flatMap(
  (c) => (RAW[c.slug] as Lesson[]) ?? []
);

export const LESSONS_BY_SLUG: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.slug, l])
);

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS_BY_SLUG[slug];
}

export function lessonsIn(category: string): Lesson[] {
  return (RAW[category] as Lesson[]) ?? [];
}

export function chapterOf(lesson: Lesson): Chapter | undefined {
  return chapterBySlug(lesson.category);
}

/** Global ordered index of a lesson (for prev/next across chapters). */
export function lessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function nextLesson(slug: string): Lesson | undefined {
  const i = lessonIndex(slug);
  return i >= 0 && i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined;
}

export function prevLesson(slug: string): Lesson | undefined {
  const i = lessonIndex(slug);
  return i > 0 ? LESSONS[i - 1] : undefined;
}

export const TOTAL_LESSONS = LESSONS.length;

/** Lightweight full-text search across the most useful fields. */
export interface SearchHit {
  lesson: Lesson;
  score: number;
}

export function searchLessons(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const l of LESSONS) {
    const haystack = [
      l.title,
      l.interviewQuestion,
      l.summary,
      l.tags.join(" "),
      l.keywords.join(" "),
      l.category,
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (l.title.toLowerCase().includes(t)) score += 6;
      if (l.keywords.some((k) => k.toLowerCase().includes(t))) score += 3;
      if (l.tags.some((k) => k.toLowerCase().includes(t))) score += 3;
      if (haystack.includes(t)) score += 1;
    }
    if (score > 0) hits.push({ lesson: l, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Every unique quiz question in the app (used by Rapid Fire / Boss). */
export interface FlatQuiz {
  lesson: Lesson;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export function allQuizzes(category?: string): FlatQuiz[] {
  const source = category ? lessonsIn(category) : LESSONS;
  const out: FlatQuiz[] = [];
  for (const l of source) {
    for (const q of l.quiz) {
      out.push({ lesson: l, ...q });
    }
  }
  return out;
}
