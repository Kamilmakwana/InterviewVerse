"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard as FlashcardType } from "@/lib/types";

export function Flashcard({
  card,
  height = 220,
}: {
  card: FlashcardType;
  height?: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer [perspective:1600px]"
      style={{ height }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 text-center [backface-visibility:hidden]">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
            Question
          </span>
          <p className="text-lg font-medium leading-snug">{card.front}</p>
          <span className="absolute bottom-4 text-xs text-muted">Tap to flip</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/40 bg-primary/[0.07] p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-secondary">
            Answer
          </span>
          <p className="text-base leading-relaxed">{card.back}</p>
        </div>
      </motion.div>
    </div>
  );
}
