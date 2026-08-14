import { CHAPTERS } from "./chapters";
import { countIn } from "./lite";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Returns 0..1 progress given the current stats. */
  progress: (s: AchievementStats) => number;
}

export interface AchievementStats {
  completedLessons: string[]; // slugs
  completedByCategory: Record<string, number>;
  quizzesTaken: number;
  perfectQuizzes: number;
  bossWins: number;
  interviewsDone: number;
  xp: number;
  streak: number;
}

const chapterAch = (slug: string, title: string, emoji: string): Achievement => ({
  id: `master-${slug}`,
  title,
  description: `Complete every lesson in ${slug}.`,
  emoji,
  progress: (s) => {
    const total = countIn(slug) || 1;
    return Math.min(1, (s.completedByCategory[slug] ?? 0) / total);
  },
});

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your very first lesson.",
    emoji: "🌱",
    progress: (s) => (s.completedLessons.length >= 1 ? 1 : 0),
  },
  chapterAch("csharp", "C# Master", "⚔️"),
  chapterAch("oop", "Design Sage", "🏛️"),
  chapterAch("sqlserver", "SQL Ninja", "🥷"),
  chapterAch("advanced", "Async Hero", "⚡"),
  chapterAch("azure", "Azure Explorer", "☁️"),
  chapterAch("systemdesign", "Architecture Wizard", "🧙"),
  chapterAch("coding", "Algorithm Ace", "🧩"),
  {
    id: "quiz-25",
    title: "Quiz Machine",
    description: "Answer 25 quiz questions.",
    emoji: "🎯",
    progress: (s) => Math.min(1, s.quizzesTaken / 25),
  },
  {
    id: "perfect-quiz",
    title: "Flawless",
    description: "Score 100% on a lesson quiz.",
    emoji: "💎",
    progress: (s) => (s.perfectQuizzes >= 1 ? 1 : 0),
  },
  {
    id: "interview-survivor",
    title: "Interview Survivor",
    description: "Finish a full interview simulation.",
    emoji: "🎤",
    progress: (s) => (s.interviewsDone >= 1 ? 1 : 0),
  },
  {
    id: "boss-slayer",
    title: "Boss Slayer",
    description: "Win a chapter Boss Interview.",
    emoji: "👑",
    progress: (s) => (s.bossWins >= 1 ? 1 : 0),
  },
  {
    id: "hundred",
    title: "Centurion",
    description: "Complete 100 lessons.",
    emoji: "🏆",
    progress: (s) => Math.min(1, s.completedLessons.length / 100),
  },
  {
    id: "streak-7",
    title: "On Fire",
    description: "Keep a 7-day study streak.",
    emoji: "🔥",
    progress: (s) => Math.min(1, s.streak / 7),
  },
  {
    id: "completionist",
    title: "The Completionist",
    description: "Complete every lesson in every chapter.",
    emoji: "🌟",
    progress: (s) => {
      const total = CHAPTERS.reduce((n, c) => n + countIn(c.slug), 0);
      return Math.min(1, s.completedLessons.length / (total || 1));
    },
  },
];

export function isUnlocked(a: Achievement, s: AchievementStats): boolean {
  return a.progress(s) >= 1;
}
