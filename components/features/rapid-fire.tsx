"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Zap, RotateCcw, ArrowRight } from "lucide-react";
import { allQuizzes } from "@/lib/data";
import { shuffle } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { bigCelebrate } from "@/components/shared/confetti";
import { cn } from "@/lib/utils";

export function RapidFire({
  category,
  count = 20,
  boss = false,
}: {
  category?: string;
  count?: number;
  boss?: boolean;
}) {
  const [seed, setSeed] = useState(1);
  const questions = useMemo(
    () => shuffle(allQuizzes(category), seed).slice(0, count),
    [category, count, seed]
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const recordQuiz = useAppStore((s) => s.recordQuiz);
  const recordBossWin = useAppStore((s) => s.recordBossWin);

  const q = questions[i];

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const correct = idx === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i < questions.length - 1) {
        setI(i + 1);
        setPicked(null);
      } else {
        const final = correct ? score + 1 : score;
        finish(final);
      }
    }, boss ? 650 : 850);
  };

  const finish = (final: number) => {
    setDone(true);
    recordQuiz(category ?? "mixed", final, questions.length);
    if (boss && final / questions.length >= 0.7) {
      recordBossWin();
      bigCelebrate();
    } else if (final === questions.length) {
      bigCelebrate();
    }
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = score / questions.length;
    const won = pct >= 0.7;
    const stars = pct >= 0.95 ? 3 : pct >= 0.8 ? 2 : pct >= 0.6 ? 1 : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center"
      >
        <ProgressRing value={pct} size={130} stroke={10}>
          <span className="text-3xl font-extrabold">{Math.round(pct * 100)}%</span>
        </ProgressRing>
        {boss && (
          <div className="mt-4 flex justify-center gap-1 text-2xl">
            {[0, 1, 2].map((s) => (
              <span key={s} className={s < stars ? "" : "opacity-20"}>⭐</span>
            ))}
          </div>
        )}
        <h2 className="mt-4 text-2xl font-bold">
          {boss ? (won ? "Boss defeated! 👑" : "So close — regroup!") : `${score}/${questions.length} correct`}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {won
            ? "That's an interview-ready score. Keep the momentum going."
            : "Review the weak spots and run it back — you've got this."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="soft" onClick={restart}>
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
          <Link
            href="/roadmap"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-glow hover:brightness-110"
          >
            Roadmap <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <Zap className="h-4 w-4" /> {boss ? "Boss Interview" : "Rapid Fire"}
        </span>
        <span className="text-sm text-muted">
          {i + 1} / {questions.length} · Score {score}
        </span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          animate={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <p className="mb-1 text-xs text-muted">{q.lesson.title}</p>
          <h3 className="mb-5 text-lg font-semibold leading-snug">{q.question}</h3>
          <div className="grid gap-2.5">
            {q.options.map((opt, idx) => {
              const reveal = picked !== null;
              const isCorrect = idx === q.answer;
              const isPicked = idx === picked;
              return (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    !reveal && "border-border hover:border-primary/50 hover:bg-primary/5",
                    reveal && isCorrect && "border-success bg-success/10 text-success",
                    reveal && isPicked && !isCorrect && "border-warning bg-warning/10 text-warning",
                    reveal && !isPicked && !isCorrect && "opacity-50"
                  )}
                >
                  {opt}
                  {reveal && isCorrect && <Check className="h-4 w-4" />}
                  {reveal && isPicked && !isCorrect && <X className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
