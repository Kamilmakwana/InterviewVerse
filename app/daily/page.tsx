"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageShell } from "@/components/layout/shell";
import { LESSONS } from "@/lib/data";
import { daySeed } from "@/lib/utils";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { useAppStore } from "@/store/useAppStore";

export default function DailyPage() {
  const seed = daySeed();
  const lesson = LESSONS[seed % LESSONS.length];
  const recordQuiz = useAppStore((s) => s.recordQuiz);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <PageShell footer={false}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted">
          <CalendarDays className="h-4 w-4" /> {today}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/12 to-secondary/8 p-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Daily Challenge
          </p>
          <div className="my-3 text-5xl">{lesson.emoji}</div>
          <h1 className="text-2xl font-bold">{lesson.interviewQuestion}</h1>
          <p className="mt-2 text-sm text-muted">{lesson.title}</p>
          <Link
            href={`/learn/${lesson.slug}`}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-glow hover:brightness-110"
          >
            Study the full lesson <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <h2 className="mb-4 text-center text-lg font-semibold">Today&apos;s quick quiz</h2>
        <QuizEngine
          questions={lesson.quiz}
          onComplete={(s, t) => recordQuiz(lesson.slug, s, t)}
        />
      </div>
    </PageShell>
  );
}
