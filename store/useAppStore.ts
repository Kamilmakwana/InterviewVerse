"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MasteryLevel } from "@/lib/types";
import {
  ACHIEVEMENTS,
  isUnlocked,
  type AchievementStats,
} from "@/lib/achievements";
import { liteLessonsIn as lessonsIn, liteGet as getLesson } from "@/lib/lite";

export type ThemeMode = "light" | "dark" | "system";

export interface LessonRecord {
  views: number;
  completed: boolean;
  quizBest: number; // 0..1
  quizAttempts: number;
  lastSeen: number; // epoch ms
}

interface AppState {
  hydrated: boolean;
  theme: ThemeMode;
  locale: string;

  records: Record<string, LessonRecord>;
  bookmarks: string[];
  recent: string[];

  xp: number;
  streak: number;
  lastActiveDay: string | null;

  quizzesTaken: number;
  perfectQuizzes: number;
  bossWins: number;
  interviewsDone: number;

  unlocked: string[]; // achievement ids
  lastUnlocked: string | null; // for celebration toast

  companyFilter: string | null;

  // actions
  setTheme: (t: ThemeMode) => void;
  setLocale: (code: string) => void;
  visit: (slug: string) => void;
  completeLesson: (slug: string) => void;
  recordQuiz: (slug: string, score: number, total: number) => void;
  toggleBookmark: (slug: string) => void;
  recordBossWin: () => void;
  recordInterview: () => void;
  addXp: (n: number) => void;
  setCompanyFilter: (name: string | null) => void;
  clearLastUnlocked: () => void;
  resetProgress: () => void;

  // selectors
  mastery: (slug: string) => MasteryLevel;
  isCompleted: (slug: string) => boolean;
  chapterProgress: (category: string) => { done: number; total: number };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function daysBetween(a: string, b: string): number {
  const pa = a.split("-").map(Number);
  const pb = b.split("-").map(Number);
  const da = new Date(pa[0], pa[1] - 1, pa[2]).getTime();
  const db = new Date(pb[0], pb[1] - 1, pb[2]).getTime();
  return Math.round((db - da) / 86400000);
}

const emptyRecord = (): LessonRecord => ({
  views: 0,
  completed: false,
  quizBest: 0,
  quizAttempts: 0,
  lastSeen: 0,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const bumpStreak = (): Partial<AppState> => {
        const today = todayKey();
        const last = get().lastActiveDay;
        if (last === today) return {};
        if (!last) return { streak: 1, lastActiveDay: today };
        const gap = daysBetween(last, today);
        if (gap === 1) return { streak: get().streak + 1, lastActiveDay: today };
        return { streak: 1, lastActiveDay: today };
      };

      const recomputeAchievements = () => {
        const s = get();
        const completedLessons = Object.entries(s.records)
          .filter(([, r]) => r.completed)
          .map(([slug]) => slug);
        const completedByCategory: Record<string, number> = {};
        for (const slug of completedLessons) {
          const l = getLesson(slug);
          if (l) completedByCategory[l.category] = (completedByCategory[l.category] ?? 0) + 1;
        }
        const stats: AchievementStats = {
          completedLessons,
          completedByCategory,
          quizzesTaken: s.quizzesTaken,
          perfectQuizzes: s.perfectQuizzes,
          bossWins: s.bossWins,
          interviewsDone: s.interviewsDone,
          xp: s.xp,
          streak: s.streak,
        };
        const nowUnlocked = ACHIEVEMENTS.filter((a) => isUnlocked(a, stats)).map(
          (a) => a.id
        );
        const fresh = nowUnlocked.find((id) => !s.unlocked.includes(id));
        set({
          unlocked: nowUnlocked,
          lastUnlocked: fresh ?? s.lastUnlocked,
        });
      };

      return {
        hydrated: false,
        theme: "system",
        locale: "en",
        records: {},
        bookmarks: [],
        recent: [],
        xp: 0,
        streak: 0,
        lastActiveDay: null,
        quizzesTaken: 0,
        perfectQuizzes: 0,
        bossWins: 0,
        interviewsDone: 0,
        unlocked: [],
        lastUnlocked: null,
        companyFilter: null,

        setTheme: (t) => set({ theme: t }),

        setLocale: (code) => set({ locale: code }),

        visit: (slug) =>
          set((state) => {
            const rec = { ...(state.records[slug] ?? emptyRecord()) };
            rec.views += 1;
            rec.lastSeen = Date.now();
            const recent = [slug, ...state.recent.filter((s) => s !== slug)].slice(0, 12);
            return {
              records: { ...state.records, [slug]: rec },
              recent,
              ...bumpStreak(),
            };
          }),

        completeLesson: (slug) => {
          set((state) => {
            const rec = { ...(state.records[slug] ?? emptyRecord()) };
            const already = rec.completed;
            rec.completed = true;
            rec.lastSeen = Date.now();
            return {
              records: { ...state.records, [slug]: rec },
              xp: state.xp + (already ? 0 : 40),
              ...bumpStreak(),
            };
          });
          recomputeAchievements();
        },

        recordQuiz: (slug, score, total) => {
          const ratio = total > 0 ? score / total : 0;
          set((state) => {
            const rec = { ...(state.records[slug] ?? emptyRecord()) };
            rec.quizAttempts += 1;
            rec.quizBest = Math.max(rec.quizBest, ratio);
            return {
              records: { ...state.records, [slug]: rec },
              quizzesTaken: state.quizzesTaken + total,
              perfectQuizzes:
                ratio >= 1 ? state.perfectQuizzes + 1 : state.perfectQuizzes,
              xp: state.xp + score * 10,
              ...bumpStreak(),
            };
          });
          recomputeAchievements();
        },

        toggleBookmark: (slug) =>
          set((state) => ({
            bookmarks: state.bookmarks.includes(slug)
              ? state.bookmarks.filter((s) => s !== slug)
              : [slug, ...state.bookmarks],
          })),

        recordBossWin: () => {
          set((state) => ({ bossWins: state.bossWins + 1, xp: state.xp + 150 }));
          recomputeAchievements();
        },

        recordInterview: () => {
          set((state) => ({
            interviewsDone: state.interviewsDone + 1,
            xp: state.xp + 60,
          }));
          recomputeAchievements();
        },

        addXp: (n) => set((state) => ({ xp: state.xp + n })),

        setCompanyFilter: (name) => set({ companyFilter: name }),

        clearLastUnlocked: () => set({ lastUnlocked: null }),

        resetProgress: () =>
          set({
            records: {},
            bookmarks: [],
            recent: [],
            xp: 0,
            streak: 0,
            lastActiveDay: null,
            quizzesTaken: 0,
            perfectQuizzes: 0,
            bossWins: 0,
            interviewsDone: 0,
            unlocked: [],
            lastUnlocked: null,
          }),

        mastery: (slug) => {
          const rec = get().records[slug];
          if (!rec || rec.views === 0) return "new";
          if (!rec.completed) return "learning";
          if (rec.quizBest >= 0.8) return "mastered";
          return "practicing";
        },

        isCompleted: (slug) => !!get().records[slug]?.completed,

        chapterProgress: (category) => {
          const total = lessonsIn(category).length;
          const recs = get().records;
          const done = lessonsIn(category).filter(
            (l) => recs[l.slug]?.completed
          ).length;
          return { done, total };
        },
      };
    },
    {
      name: "dotnet-quest-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        locale: s.locale,
        records: s.records,
        bookmarks: s.bookmarks,
        recent: s.recent,
        xp: s.xp,
        streak: s.streak,
        lastActiveDay: s.lastActiveDay,
        quizzesTaken: s.quizzesTaken,
        perfectQuizzes: s.perfectQuizzes,
        bossWins: s.bossWins,
        interviewsDone: s.interviewsDone,
        unlocked: s.unlocked,
        companyFilter: s.companyFilter,
      }),
      onRehydrateStorage: () => () => {
        // Mark hydrated on next tick so subscribers re-render with stored data.
        setTimeout(() => useAppStore.setState({ hydrated: true }), 0);
      },
    }
  )
);
