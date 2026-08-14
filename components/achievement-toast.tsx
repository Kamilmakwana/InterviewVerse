"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { celebrate } from "@/components/shared/confetti";

export function AchievementToast() {
  const lastUnlocked = useAppStore((s) => s.lastUnlocked);
  const clear = useAppStore((s) => s.clearLastUnlocked);
  const ach = ACHIEVEMENTS.find((a) => a.id === lastUnlocked);

  useEffect(() => {
    if (!ach) return;
    celebrate();
    const t = setTimeout(clear, 4200);
    return () => clearTimeout(t);
  }, [ach, clear]);

  return (
    <AnimatePresence>
      {ach && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-glow-lg">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-2xl">
              {ach.emoji}
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-primary">
                Achievement unlocked
              </p>
              <p className="font-semibold text-fg">{ach.title}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
