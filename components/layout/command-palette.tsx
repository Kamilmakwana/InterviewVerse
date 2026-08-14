"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  Compass,
  Trophy,
  Zap,
  Dices,
  Map as MapIcon,
  BookOpen,
  Mic,
} from "lucide-react";
import { searchLessons, CHAPTERS } from "@/lib/lite";
import { Kbd } from "@/components/ui/kbd";
import { usePalette } from "@/components/layout/palette-store";
import { cn } from "@/lib/utils";

type Action = { label: string; href: string; icon: React.ReactNode; hint?: string };

const QUICK: Action[] = [
  { label: "Roadmap", href: "/roadmap", icon: <MapIcon className="h-4 w-4" />, hint: "World map" },
  { label: "Home Dashboard", href: "/home", icon: <Compass className="h-4 w-4" /> },
  { label: "Interview Simulator", href: "/interview", icon: <Mic className="h-4 w-4" /> },
  { label: "Rapid Fire", href: "/rapid-fire", icon: <Zap className="h-4 w-4" /> },
  { label: "Question Wheel", href: "/wheel", icon: <Dices className="h-4 w-4" /> },
  { label: "Flashcards", href: "/revision", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Achievements", href: "/achievements", icon: <Trophy className="h-4 w-4" /> },
];

export function CommandPalette() {
  const { open, setOpen } = usePalette();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!usePalette.getState().open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) {
      return {
        actions: QUICK,
        lessons: [] as ReturnType<typeof searchLessons>,
        chapters: CHAPTERS.slice(0, 4),
      };
    }
    const lower = q.toLowerCase();
    return {
      actions: QUICK.filter((a) => a.label.toLowerCase().includes(lower)),
      lessons: searchLessons(q, 8),
      chapters: CHAPTERS.filter((c) =>
        (c.title + c.world).toLowerCase().includes(lower)
      ),
    };
  }, [q]);

  const flat: Action[] = [
    ...results.actions,
    ...results.chapters.map((c) => ({
      label: `${c.world} — ${c.title}`,
      href: `/roadmap#${c.slug}`,
      icon: <span className="text-base leading-none">{c.emoji}</span>,
    })),
    ...results.lessons.map((h) => ({
      label: h.lesson.title,
      href: `/learn/${h.lesson.slug}`,
      icon: <span className="text-base leading-none">{h.lesson.emoji}</span>,
      hint: h.lesson.category,
    })),
  ];

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-glow-lg"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder="Search lessons, chapters, actions…"
                className="h-14 flex-1 bg-transparent text-fg placeholder:text-muted focus:outline-none"
              />
              <Kbd>Esc</Kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {flat.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No results for “{q}”.
                </p>
              )}
              {flat.map((item, i) => (
                <button
                  key={item.href + i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    active === i ? "bg-primary/12 text-fg" : "text-fg/80 hover:bg-fg/5"
                  )}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-fg/[0.05]">
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="text-xs capitalize text-muted">{item.hint}</span>
                  )}
                  {active === i && <CornerDownLeft className="h-3.5 w-3.5 text-muted" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
