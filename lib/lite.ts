import type { Difficulty } from "./types";
import { CHAPTERS } from "./chapters";
import index from "@/data/search-index.json";

/** Lightweight lesson shape — enough for search, roadmaps, dashboards, and
 *  graphs, WITHOUT bundling the heavy lesson bodies (story, code, quiz…). */
export interface LiteLesson {
  id: string;
  title: string;
  slug: string;
  category: string;
  emoji: string;
  difficulty: Difficulty;
  estimatedTime: number;
  interviewQuestion: string;
  summary: string;
  tags: string[];
  keywords: string[];
  companies: string[];
  related: string[];
  animation: string;
}

export const INDEX = index as LiteLesson[];

export const INDEX_BY_SLUG: Record<string, LiteLesson> = Object.fromEntries(
  INDEX.map((l) => [l.slug, l])
);

export const TOTAL_LESSONS = INDEX.length;

export function liteLessonsIn(category: string): LiteLesson[] {
  return INDEX.filter((l) => l.category === category);
}

export function liteGet(slug: string): LiteLesson | undefined {
  return INDEX_BY_SLUG[slug];
}

export function countIn(category: string): number {
  return INDEX.reduce((n, l) => (l.category === category ? n + 1 : n), 0);
}

export interface SearchHit {
  lesson: LiteLesson;
  score: number;
}

export function searchLessons(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const l of INDEX) {
    const haystack = [
      l.title, l.interviewQuestion, l.summary,
      l.tags.join(" "), l.keywords.join(" "), l.category,
    ].join(" ").toLowerCase();
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

export { CHAPTERS };
