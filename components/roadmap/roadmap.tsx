"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Check, Play } from "lucide-react";
import { CHAPTERS, liteLessonsIn as lessonsIn } from "@/lib/lite";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/lib/use-hydrated";
import { ProgressRing } from "@/components/ui/progress-ring";
import { MasteryDot } from "@/components/shared/mastery-dot";
import { cn } from "@/lib/utils";

export function Roadmap() {
  const hydrated = useHydrated();
  const chapterProgress = useAppStore((s) => s.chapterProgress);
  const records = useAppStore((s) => s.records);

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* central line */}
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent md:block" />

      <div className="space-y-6">
        {CHAPTERS.map((c, i) => {
          const lessons = lessonsIn(c.slug);
          const { done, total } = hydrated ? chapterProgress(c.slug) : { done: 0, total: lessons.length };
          const pct = total ? done / total : 0;
          const prev = i > 0 ? chapterProgress(CHAPTERS[i - 1].slug) : { done: 1, total: 1 };
          const unlocked = i === 0 || !hydrated || prev.done > 0;
          const side = i % 2 === 0;

          return (
            <motion.section
              key={c.slug}
              id={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className={cn("relative scroll-mt-24 md:w-1/2", side ? "md:pr-10" : "md:ml-auto md:pl-10")}
            >
              {/* node dot on the line */}
              <div
                className={cn(
                  "absolute top-8 hidden h-4 w-4 rounded-full border-2 md:block",
                  side ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
                  pct >= 1 ? "border-success bg-success" : unlocked ? "border-primary bg-bg" : "border-border bg-bg"
                )}
              >
                {pct >= 1 && (
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/40" />
                )}
              </div>

              <div
                className={cn(
                  "card-surface overflow-hidden p-5 transition-shadow hover:shadow-soft",
                  pct >= 1 && "ring-1 ring-success/30"
                )}
                style={{ boxShadow: pct >= 1 ? `0 0 40px ${c.color}22` : undefined }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
                    style={{ background: `${c.color}1f`, color: c.color }}
                  >
                    {c.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
                        Chapter {c.order}
                      </span>
                      {!unlocked && <Lock className="h-3 w-3 text-muted" />}
                    </div>
                    <h3 className="truncate text-lg font-bold">{c.world}</h3>
                    <p className="truncate text-sm text-muted">{c.tagline}</p>
                  </div>
                  <ProgressRing value={pct} size={52} stroke={5}>
                    <span className="text-[0.7rem] font-bold">{Math.round(pct * 100)}%</span>
                  </ProgressRing>
                </div>

                <div className="mt-4 grid gap-1.5">
                  {lessons.map((l) => {
                    const doneL = !!records[l.slug]?.completed;
                    const seen = !!records[l.slug]?.views;
                    return (
                      <Link
                        key={l.slug}
                        href={`/learn/${l.slug}`}
                        className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-fg/5"
                      >
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs",
                            doneL ? "bg-success/20 text-success" : "bg-fg/[0.06] text-muted"
                          )}
                        >
                          {doneL ? <Check className="h-3.5 w-3.5" /> : <Play className="h-3 w-3" />}
                        </span>
                        <span className="flex-1 truncate group-hover:text-fg">{l.title}</span>
                        {hydrated && seen && (
                          <MasteryDot level={doneL ? (records[l.slug].quizBest >= 0.8 ? "mastered" : "practicing") : "learning"} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
