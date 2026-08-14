"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import type { Flashcard as FlashcardType } from "@/lib/types";
import { Flashcard } from "./flashcard";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";

export function FlashcardDeck({ cards }: { cards: FlashcardType[] }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [i, setI] = useState(0);
  const [seed, setSeed] = useState(0);

  const deck = useMemo(() => order.map((idx) => cards[idx]), [order, cards]);
  const card = deck[i];

  const doShuffle = () => {
    setOrder(shuffle(cards.map((_, idx) => idx)));
    setI(0);
    setSeed((s) => s + 1);
  };

  const move = (d: number) => {
    setI((prev) => (prev + d + deck.length) % deck.length);
  };

  if (!card) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Card {i + 1} / {deck.length}
        </span>
        <button
          onClick={doShuffle}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:text-fg"
        >
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${seed}-${i}`}
          initial={{ opacity: 0, y: 20, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          <Flashcard card={card} height={260} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-3">
        <Button variant="soft" size="sm" onClick={() => move(-1)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <div className="flex gap-1">
          {deck.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-primary" : "bg-fg/15"}`}
            />
          ))}
        </div>
        <Button variant="soft" size="sm" onClick={() => move(1)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
