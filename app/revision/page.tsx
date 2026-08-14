"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { PageShell } from "@/components/layout/shell";
import { CHAPTERS, LESSONS, lessonsIn } from "@/lib/data";
import { FlashcardDeck } from "@/components/flashcards/flashcard-deck";
import { cn } from "@/lib/utils";

type Mode = "flashcards" | "30s" | "2m" | "cheat";

const MODES: { key: Mode; label: string; hint: string }[] = [
  { key: "flashcards", label: "Flashcards", hint: "Flip & recall" },
  { key: "30s", label: "30-sec Recap", hint: "One line each" },
  { key: "2m", label: "2-min Recap", hint: "Fuller notes" },
  { key: "cheat", label: "Before Interview", hint: "Rapid cheat sheet" },
];

export default function RevisionPage() {
  const [mode, setMode] = useState<Mode>("flashcards");
  const [cat, setCat] = useState<string>("all");

  const lessons = cat === "all" ? LESSONS : lessonsIn(cat);
  const cards = useMemo(() => lessons.flatMap((l) => l.flashcards), [lessons]);

  return (
    <PageShell>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Revision Mode</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Lock it in fast. Flip flashcards, skim recaps, or run the pre-interview cheat sheet.
        </p>
      </div>

      {/* mode tabs */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm transition-colors",
              mode === m.key ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-fg/5"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* chapter filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-1.5">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>All</FilterChip>
        {CHAPTERS.map((c) => (
          <FilterChip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
            {c.emoji} {c.title}
          </FilterChip>
        ))}
      </div>

      <motion.div key={mode + cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {mode === "flashcards" && <FlashcardDeck cards={cards} />}

        {mode === "30s" && (
          <div className="mx-auto grid max-w-4xl gap-2 sm:grid-cols-2">
            {lessons.map((l) => (
              <div key={l.slug} className="rounded-xl border border-border bg-card p-4">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                  <span>{l.emoji}</span> {l.title}
                </p>
                <p className="text-sm text-muted">{l.revision30}</p>
              </div>
            ))}
          </div>
        )}

        {mode === "2m" && (
          <div className="mx-auto max-w-3xl space-y-3">
            {lessons.map((l) => (
              <details key={l.slug} className="group rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold">
                  {l.emoji} {l.title}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l.revision2min}</p>
              </details>
            ))}
          </div>
        )}

        {mode === "cheat" && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex justify-center">
              <Link
                href="/rapid-fire"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:brightness-110"
              >
                <Zap className="h-4 w-4" /> Run Rapid Fire
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {lessons.map((l) => (
                <div key={l.slug} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold">{l.interviewQuestion}</p>
                  <p className="mt-1 text-sm text-muted">{l.interviewAnswerShort}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </PageShell>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs transition-colors",
        active ? "bg-fg text-bg" : "bg-fg/[0.06] text-muted hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}
