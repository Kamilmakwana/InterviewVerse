"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  HelpCircle, BookOpen, Lightbulb, GraduationCap, Workflow, Brain,
  Building2, Code2, AlertTriangle, MessagesSquare, ListChecks, ScrollText,
  Layers, ArrowRight, ChevronLeft, ChevronRight, Bookmark, Check,
} from "lucide-react";
import type { Lesson } from "@/lib/types";
import { chapterOf, nextLesson } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/lesson/code-block";
import { InteractiveDiagram } from "@/components/lesson/interactive-diagram";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { Flashcard } from "@/components/flashcards/flashcard";
import { ReadAloud } from "@/components/lesson/read-aloud";
import { celebrate } from "@/components/shared/confetti";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

/** Plain-text version of a step, used for read-aloud. Content is English today. */
function stepText(lesson: Lesson, key: string): string {
  switch (key) {
    case "question": return lesson.interviewQuestion;
    case "story": return [lesson.story.setup, ...lesson.story.scenes, lesson.story.moral].join(". ");
    case "analogy": return lesson.analogy;
    case "explanation": return lesson.explanation;
    case "diagram": return lesson.summary;
    case "memory": return [lesson.memoryHack.oneLiner, lesson.memoryHack.mnemonic, lesson.memoryHack.memoryPalace].join(". ");
    case "company": return lesson.bestPractices.join(". ");
    case "code": return lesson.codeExample.explanation;
    case "mistakes": return lesson.mistakes.join(". ");
    case "followups": return lesson.followUps.map((f) => `${f.question}. ${f.answer}`).join(". ");
    case "quiz": return lesson.interviewAnswerShort;
    case "summary": return `${lesson.summary}. ${lesson.revision30}`;
    case "flashcard": return `${lesson.flashcards[0].front}. ${lesson.flashcards[0].back}`;
    default: return lesson.summary;
  }
}

interface Step {
  key: string;
  title: string;
  icon: React.ElementType;
  render: () => React.ReactNode;
}

export function LessonViewer({ lesson }: { lesson: Lesson }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const visit = useAppStore((s) => s.visit);
  const complete = useAppStore((s) => s.completeLesson);
  const recordQuiz = useAppStore((s) => s.recordQuiz);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const bookmarked = useAppStore((s) => s.bookmarks.includes(lesson.slug));
  const chapter = chapterOf(lesson);
  const next = nextLesson(lesson.slug);
  const { t } = useT();

  useEffect(() => {
    visit(lesson.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.slug]);

  const steps: Step[] = useMemo(
    () => [
      {
        key: "question", title: "The Question", icon: HelpCircle,
        render: () => (
          <StepShell kicker="Interview asks" title={lesson.interviewQuestion}>
            <p className="text-muted">
              A classic {chapter?.title} question. Don&apos;t memorise — let&apos;s
              build the intuition so you can answer <em>any</em> phrasing of it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {lesson.tags.map((t) => (
                <Badge key={t}>#{t}</Badge>
              ))}
            </div>
          </StepShell>
        ),
      },
      {
        key: "story", title: "Story", icon: BookOpen,
        render: () => (
          <StepShell kicker="Story mode" title={`${lesson.emoji} ${lesson.title}`}>
            <p className="text-lg text-fg/90">{lesson.story.setup}</p>
            <div className="mt-6 space-y-3">
              {lesson.story.scenes.map((sc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm text-fg/85">{sc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-secondary/[0.08] p-4 text-sm">
              <span className="font-semibold text-secondary">The moral: </span>
              {lesson.story.moral}
            </div>
          </StepShell>
        ),
      },
      {
        key: "analogy", title: "Analogy", icon: Lightbulb,
        render: () => (
          <StepShell kicker="Real-world analogy" title="Think of it like this">
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-gradient-to-br from-warning/[0.08] to-transparent p-6">
              <span className="text-4xl">{lesson.memoryHack.emoji}</span>
              <p className="text-lg leading-relaxed text-fg/90">{lesson.analogy}</p>
            </div>
          </StepShell>
        ),
      },
      {
        key: "explanation", title: "Explanation", icon: GraduationCap,
        render: () => (
          <StepShell kicker="Technical explanation" title="How it actually works">
            <div className="space-y-3 text-fg/85">
              {lesson.explanation.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="leading-relaxed">{p}</p>
              ))}
            </div>
          </StepShell>
        ),
      },
      {
        key: "diagram", title: "Visual", icon: Workflow,
        render: () => (
          <StepShell kicker="Interactive diagram" title="See it in motion">
            <InteractiveDiagram type={lesson.animation} emoji={lesson.emoji} />
            <p className="mt-4 text-center text-sm text-muted">
              Animation: <span className="capitalize text-fg/70">{lesson.animation}</span>
            </p>
          </StepShell>
        ),
      },
      {
        key: "memory", title: "Memory", icon: Brain,
        render: () => (
          <StepShell kicker="Memory trick" title="Lock it into memory">
            <div className="grid gap-3 sm:grid-cols-2">
              <MemoTile label="One-liner" value={lesson.memoryHack.oneLiner} accent="primary" />
              <MemoTile label="Mnemonic" value={lesson.memoryHack.mnemonic} accent="secondary" />
              <MemoTile label="Memory palace" value={lesson.memoryHack.memoryPalace} accent="accent" full />
            </div>
          </StepShell>
        ),
      },
      {
        key: "company", title: "In the wild", icon: Building2,
        render: () => (
          <StepShell kicker="Real company example" title="Where this shows up">
            <div className="mb-5 flex flex-wrap gap-2">
              {lesson.companies.map((c) => (
                <span key={c} className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                  {c}
                </span>
              ))}
            </div>
            <SectionList title="Best practices" items={lesson.bestPractices} icon={Check} tone="success" />
            {lesson.performanceTips.length > 0 && (
              <div className="mt-4">
                <SectionList title="Performance tips" items={lesson.performanceTips} icon={ArrowRight} tone="primary" />
              </div>
            )}
          </StepShell>
        ),
      },
      {
        key: "code", title: "Code", icon: Code2,
        render: () => (
          <StepShell kicker="Code example" title="Show me the code">
            <CodeBlock code={lesson.codeExample.code} language={lesson.codeExample.language} />
            <p className="mt-4 text-sm text-muted">{lesson.codeExample.explanation}</p>
          </StepShell>
        ),
      },
      {
        key: "mistakes", title: "Pitfalls", icon: AlertTriangle,
        render: () => (
          <StepShell kicker="Common mistakes" title="What trips people up">
            <div className="space-y-3">
              {lesson.mistakes.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 rounded-xl border border-warning/30 bg-warning/[0.06] p-4"
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
                  <p className="text-sm text-fg/85">{m}</p>
                </motion.div>
              ))}
            </div>
          </StepShell>
        ),
      },
      {
        key: "followups", title: "Follow-ups", icon: MessagesSquare,
        render: () => (
          <StepShell kicker="Interviewer follow-ups" title="Be ready for the next question">
            <div className="space-y-3">
              {lesson.followUps.map((f, i) => (
                <FollowUpItem key={i} q={f.question} a={f.answer} />
              ))}
            </div>
          </StepShell>
        ),
      },
      {
        key: "quiz", title: "Quiz", icon: ListChecks,
        render: () => (
          <StepShell kicker="Mini quiz" title="Test yourself">
            <QuizEngine
              questions={lesson.quiz}
              onComplete={(score, total) => recordQuiz(lesson.slug, score, total)}
            />
          </StepShell>
        ),
      },
      {
        key: "summary", title: "Summary", icon: ScrollText,
        render: () => (
          <StepShell kicker="Quick summary" title="The 30-second recap">
            <p className="rounded-xl bg-primary/[0.07] p-5 text-lg font-medium leading-relaxed">
              {lesson.summary}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MemoTile label="30-second revision" value={lesson.revision30} accent="primary" />
              <MemoTile label="Model answer (short)" value={lesson.interviewAnswerShort} accent="secondary" />
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                🎯 Challenge
              </p>
              <p className="text-sm text-fg/85">{lesson.challenge}</p>
            </div>
          </StepShell>
        ),
      },
      {
        key: "flashcard", title: "Flashcard", icon: Layers,
        render: () => (
          <StepShell kicker="Flash card" title="Flip to remember">
            <Flashcard card={lesson.flashcards[0]} height={240} />
            {lesson.flashcards.length > 1 && (
              <p className="mt-4 text-center text-sm text-muted">
                +{lesson.flashcards.length - 1} more cards in{" "}
                <Link href="/revision" className="text-primary underline-offset-2 hover:underline">
                  Revision mode
                </Link>
              </p>
            )}
          </StepShell>
        ),
      },
    ],
    [lesson, chapter, recordQuiz]
  );

  const isLast = step === steps.length - 1;
  const progress = (step + 1) / steps.length;

  const goNext = () => {
    if (isLast) {
      complete(lesson.slug);
      celebrate();
      return;
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const goPrev = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isLast]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Step rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <Link
            href={chapter ? `/roadmap#${chapter.slug}` : "/roadmap"}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
          >
            <ChevronLeft className="h-4 w-4" /> {chapter?.world}
          </Link>
          <ol className="space-y-1">
            {steps.map((s, i) => (
              <li key={s.key}>
                <button
                  onClick={() => {
                    setDir(i > step ? 1 : -1);
                    setStep(i);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    i === step ? "bg-primary/12 text-fg" : "text-muted hover:text-fg",
                    i < step && "text-fg/70"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-md text-[0.7rem]",
                      i < step ? "bg-success/20 text-success" : i === step ? "bg-primary text-white" : "bg-fg/[0.06]"
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Content */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DifficultyBadge level={lesson.difficulty} />
            <Badge>⏱ {lesson.estimatedTime} {t("common.min")}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <ReadAloud
              text={stepText(lesson, steps[step].key)}
              lang="en-US"
              label={t("common.readAloud")}
            />
            <button
              onClick={() => toggleBookmark(lesson.slug)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors",
                bookmarked ? "border-primary/40 bg-primary/10 text-primary" : "text-muted hover:text-fg"
              )}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
              {bookmarked ? t("common.saved") : t("common.save")}
            </button>
          </div>
        </div>

        {/* progress bar (mobile-friendly) */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>

        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={steps[step].key}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {steps[step].render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> {t("common.back")}
          </Button>
          <span className="text-xs text-muted">
            {step + 1} / {steps.length}
          </span>
          {isLast ? (
            <CompletionButton lesson={lesson} onComplete={goNext} nextSlug={next?.slug} nextTitle={next?.title} />
          ) : (
            <Button onClick={goNext}>
              {t("common.continue")} <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        {kicker}
      </p>
      <h2 className="mb-5 text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}

function MemoTile({
  label,
  value,
  accent,
  full,
}: {
  label: string;
  value: string;
  accent: "primary" | "secondary" | "accent";
  full?: boolean;
}) {
  const map = { primary: "text-primary", secondary: "text-secondary", accent: "text-accent" };
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", full && "sm:col-span-2")}>
      <p className={cn("mb-1 text-xs font-semibold uppercase tracking-wider", map[accent])}>
        {label}
      </p>
      <p className="text-sm text-fg/85">{value}</p>
    </div>
  );
}

function SectionList({
  title,
  items,
  icon: I,
  tone,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  tone: "success" | "primary";
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-fg/85">
            <I className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "success" ? "text-success" : "text-primary")} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FollowUpItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="text-sm font-medium">{q}</span>
        <ChevronRight className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompletionButton({
  lesson,
  onComplete,
  nextSlug,
  nextTitle,
}: {
  lesson: Lesson;
  onComplete: () => void;
  nextSlug?: string;
  nextTitle?: string;
}) {
  const done = useAppStore((s) => s.isCompleted(lesson.slug));
  const { t } = useT();
  const linkCls =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-glow transition hover:brightness-110";
  return (
    <div className="flex items-center gap-2">
      {!done ? (
        <Button onClick={onComplete}>
          <Check className="h-4 w-4" /> {t("common.complete")}
        </Button>
      ) : nextSlug ? (
        <Link href={`/learn/${nextSlug}`} className={linkCls}>
          Next: {nextTitle && nextTitle.length > 22 ? `${nextTitle.slice(0, 22)}…` : nextTitle}{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link href="/roadmap" className={linkCls}>
          Back to roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
