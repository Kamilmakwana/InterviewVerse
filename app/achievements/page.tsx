"use client";

import { PageShell } from "@/components/layout/shell";
import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/lib/use-hydrated";
import { liteGet as getLesson } from "@/lib/lite";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Counter } from "@/components/shared/counter";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const hydrated = useHydrated();
  const store = useAppStore();

  const completedLessons = Object.entries(store.records)
    .filter(([, r]) => r.completed)
    .map(([slug]) => slug);
  const completedByCategory: Record<string, number> = {};
  for (const slug of completedLessons) {
    const l = getLesson(slug);
    if (l) completedByCategory[l.category] = (completedByCategory[l.category] ?? 0) + 1;
  }
  const stats = {
    completedLessons,
    completedByCategory,
    quizzesTaken: store.quizzesTaken,
    perfectQuizzes: store.perfectQuizzes,
    bossWins: store.bossWins,
    interviewsDone: store.interviewsDone,
    xp: store.xp,
    streak: store.streak,
  };

  const unlockedCount = hydrated
    ? ACHIEVEMENTS.filter((a) => a.progress(stats) >= 1).length
    : 0;

  return (
    <PageShell>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Achievements</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Milestones you unlock as you learn. Everything is tracked locally in this browser.
        </p>
      </div>

      <div className="mx-auto mb-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="XP earned" value={hydrated ? store.xp : 0} />
        <Stat label="Lessons done" value={hydrated ? completedLessons.length : 0} />
        <Stat label="Day streak" value={hydrated ? store.streak : 0} />
        <Stat label="Unlocked" value={unlockedCount} suffix={`/${ACHIEVEMENTS.length}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const p = hydrated ? a.progress(stats) : 0;
          const done = p >= 1;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-5 transition-colors",
                done ? "border-primary/40 bg-primary/[0.06]" : "border-border bg-card"
              )}
            >
              <div className={cn("relative", !done && "opacity-70")}>
                <ProgressRing value={p} size={56} stroke={5}>
                  <span className={cn("text-2xl", !done && "grayscale")}>{a.emoji}</span>
                </ProgressRing>
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{a.title}</p>
                <p className="text-xs text-muted">{a.description}</p>
                {!done && (
                  <p className="mt-1 text-[0.7rem] font-medium text-primary">
                    {Math.round(p * 100)}%
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="card-surface p-5 text-center">
      <p className="text-3xl font-extrabold gradient-text">
        <Counter to={value} />
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
