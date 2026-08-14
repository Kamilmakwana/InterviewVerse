"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/components/shared/confetti";
import { cn } from "@/lib/utils";

export function QuizEngine({
  questions,
  onComplete,
  compact = false,
}: {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  compact?: boolean;
}) {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[i];

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i < questions.length - 1) {
      setI(i + 1);
      setSelected(null);
    } else {
      const finalScore = score;
      setDone(true);
      if (finalScore === questions.length) celebrate();
      onComplete?.(finalScore, questions.length);
    }
  };

  const restart = () => {
    setI(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = score / questions.length;
    const perfect = score === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
      >
        <ProgressRing value={pct} size={110} stroke={9}>
          <span className="text-2xl font-bold">
            {score}/{questions.length}
          </span>
        </ProgressRing>
        <h3 className="text-xl font-semibold">
          {perfect ? "Flawless! 💎" : pct >= 0.6 ? "Nicely done 👏" : "Keep going 💪"}
        </h3>
        <p className="max-w-sm text-sm text-muted">
          {perfect
            ? "You nailed every question. This concept is interview-ready."
            : "Review the explanations and try again to lock it in."}
        </p>
        <Button variant="soft" size="sm" onClick={restart}>
          <RotateCcw className="h-4 w-4" /> Retry quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card", compact ? "p-4" : "p-6")}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">
          Question {i + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                idx < i ? "bg-primary" : idx === i ? "bg-primary/50" : "bg-fg/10"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="mb-4 text-lg font-semibold leading-snug">{q.question}</h3>
          <div className="grid gap-2.5">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.answer;
              const isChosen = idx === selected;
              const reveal = selected !== null;
              return (
                <motion.button
                  key={idx}
                  onClick={() => choose(idx)}
                  whileHover={selected === null ? { x: 3 } : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    !reveal && "border-border hover:border-primary/50 hover:bg-primary/5",
                    reveal && isCorrect && "border-success bg-success/10 text-success",
                    reveal && isChosen && !isCorrect && "border-warning bg-warning/10 text-warning",
                    reveal && !isChosen && !isCorrect && "border-border opacity-60"
                  )}
                >
                  <span>{opt}</span>
                  {reveal && isCorrect && <Check className="h-4 w-4" />}
                  {reveal && isChosen && !isCorrect && <X className="h-4 w-4" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-xl bg-fg/[0.04] p-4 text-sm text-muted">
                  <span className="font-medium text-fg">Why: </span>
                  {q.explanation}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={next}>
                    {i < questions.length - 1 ? "Next question" : "See results"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
