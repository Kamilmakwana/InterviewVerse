"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CHAPTERS, liteLessonsIn as lessonsIn, type LiteLesson } from "@/lib/lite";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";

const N = CHAPTERS.length;
const SEG = 360 / N;

export function QuestionWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<LiteLesson | null>(null);

  const spin = () => {
    setSpinning(true);
    setResult(null);
    const target = Math.floor(Math.random() * N);
    const turns = 5 + Math.floor(Math.random() * 3);
    // land the target segment at the top pointer (0deg)
    const final = turns * 360 + (360 - target * SEG - SEG / 2);
    setRotation((r) => r - (r % 360) + final);
    setTimeout(() => {
      const chapter = CHAPTERS[target];
      const l = shuffle(lessonsIn(chapter.slug))[0];
      setResult(l);
      setSpinning(false);
    }, 3600);
  };

  const radius = 150;
  const cx = 160;
  const cy = 160;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* pointer */}
        <div className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-primary" />
        <motion.svg
          width={320}
          height={320}
          viewBox="0 0 320 320"
          animate={{ rotate: rotation }}
          transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-xl"
        >
          {CHAPTERS.map((c, i) => {
            const start = (i * SEG - 90) * (Math.PI / 180);
            const end = ((i + 1) * SEG - 90) * (Math.PI / 180);
            const x1 = cx + radius * Math.cos(start);
            const y1 = cy + radius * Math.sin(start);
            const x2 = cx + radius * Math.cos(end);
            const y2 = cy + radius * Math.sin(end);
            const mid = (start + end) / 2;
            const tx = cx + radius * 0.62 * Math.cos(mid);
            const ty = cy + radius * 0.62 * Math.sin(mid);
            return (
              <g key={c.slug}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                  fill={c.color}
                  fillOpacity={0.85}
                  stroke="rgb(var(--bg))"
                  strokeWidth={2}
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                  transform={`rotate(${i * SEG + SEG / 2} ${tx} ${ty})`}
                >
                  {c.emoji}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={26} fill="rgb(var(--card))" stroke="rgb(var(--border))" strokeWidth={2} />
        </motion.svg>
      </div>

      <Button onClick={spin} disabled={spinning} size="lg">
        {spinning ? "Spinning…" : "Spin the wheel"}
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Your random question
          </p>
          <p className="mb-1 mt-2 text-3xl">{result.emoji}</p>
          <h3 className="text-lg font-bold">{result.interviewQuestion}</h3>
          <p className="mt-1 text-sm text-muted">{result.title}</p>
          <Link
            href={`/learn/${result.slug}`}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-glow hover:brightness-110"
          >
            Learn it <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
