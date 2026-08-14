"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Eye, ArrowRight, Clock, Flag, Sparkles } from "lucide-react";
import { shuffle } from "@/lib/utils";

export interface InterviewItem {
  title: string;
  interviewQuestion: string;
  interviewAnswerDetailed: string;
  followUps: { question: string; answer: string }[];
}

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { bigCelebrate } from "@/components/shared/confetti";

type Phase = "intro" | "asked" | "thinking" | "revealed" | "followup" | "done";

interface Bubble {
  who: "interviewer" | "system" | "answer";
  text: string;
  label?: string;
}

export function InterviewRoom({
  lessons,
  title = "Interview Simulator",
  subtitle = "A calm, realistic mock interview. Think out loud, then reveal the model answer.",
}: {
  lessons: InterviewItem[];
  title?: string;
  subtitle?: string;
}) {
  const pool = useMemo(() => shuffle(lessons).slice(0, 12), [lessons]);
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [followIdx, setFollowIdx] = useState(-1);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [answered, setAnswered] = useState(0);
  const recordInterview = useAppStore((s) => s.recordInterview);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lesson = pool[qIndex];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const start = () => {
    setPhase("asked");
    setBubbles([
      { who: "system", text: "Interview started. Take your time — quality over speed." },
      { who: "interviewer", label: "Interviewer", text: lesson.interviewQuestion },
    ]);
  };

  const think = () => {
    setSeconds(0);
    setPhase("thinking");
  };

  const reveal = () => {
    setPhase("revealed");
    setBubbles((b) => [
      ...b,
      { who: "answer", label: "Model answer", text: lesson.interviewAnswerDetailed },
    ]);
  };

  const askFollowUp = () => {
    const nextF = followIdx + 1;
    if (nextF < lesson.followUps.length) {
      setFollowIdx(nextF);
      setPhase("followup");
      setBubbles((b) => [
        ...b,
        { who: "interviewer", label: "Follow-up", text: lesson.followUps[nextF].question },
      ]);
    }
  };

  const revealFollow = () => {
    setBubbles((b) => [
      ...b,
      { who: "answer", label: "Model answer", text: lesson.followUps[followIdx].answer },
    ]);
    setPhase("revealed");
  };

  const nextQuestion = () => {
    setAnswered((a) => a + 1);
    if (qIndex < pool.length - 1) {
      const ni = qIndex + 1;
      setQIndex(ni);
      setFollowIdx(-1);
      setPhase("asked");
      setBubbles((b) => [
        ...b,
        { who: "system", text: `Next question (${answered + 2}).` },
        { who: "interviewer", label: "Interviewer", text: pool[ni].interviewQuestion },
      ]);
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    setPhase("done");
    recordInterview();
    bigCelebrate();
  };

  const hasMoreFollow = followIdx + 1 < lesson.followUps.length;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Office scene */}
      <div className="relative overflow-hidden rounded-t-3xl border border-b-0 border-border bg-gradient-to-b from-primary/10 to-transparent p-6">
        <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Live
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl shadow-glow"
          >
            🧑‍💼
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="max-w-md text-sm text-muted">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="h-[46vh] space-y-4 overflow-y-auto border-x border-border bg-card p-6"
      >
        {bubbles.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Sparkles className="h-8 w-8 text-primary" />
            <p className="max-w-sm text-muted">
              You&apos;ll be asked {pool.length} questions with follow-ups. Answer in your
              head (or out loud), then compare with the model answer.
            </p>
            <Button onClick={start}>
              <Play className="h-4 w-4" /> Begin interview
            </Button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {bubbles.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={
                b.who === "system"
                  ? "text-center"
                  : b.who === "answer"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              {b.who === "system" ? (
                <span className="inline-block rounded-full bg-fg/[0.05] px-3 py-1 text-xs text-muted">
                  {b.text}
                </span>
              ) : (
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    b.who === "answer"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm border border-border bg-bg"
                  }`}
                >
                  {b.label && (
                    <p
                      className={`mb-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
                        b.who === "answer" ? "text-white/70" : "text-primary"
                      }`}
                    >
                      {b.label}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{b.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-3xl border border-t-0 border-border bg-card p-4">
        {phase === "done" ? (
          <div className="flex w-full flex-col items-center gap-2 py-2 text-center">
            <p className="text-lg font-semibold">Interview complete 🎉</p>
            <p className="text-sm text-muted">
              You worked through {answered + 1} questions. That&apos;s real reps.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted">
              {phase === "thinking" ? (
                <span className="flex items-center gap-1.5 font-mono text-primary">
                  <Clock className="h-4 w-4" /> {Math.floor(seconds / 60)}:
                  {String(seconds % 60).padStart(2, "0")}
                </span>
              ) : (
                <span>
                  Question {qIndex + 1} / {pool.length}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(phase === "asked" || phase === "followup") && (
                <>
                  <Button variant="soft" size="sm" onClick={think}>
                    <Clock className="h-4 w-4" /> I&apos;ll think
                  </Button>
                  <Button size="sm" onClick={phase === "followup" ? revealFollow : reveal}>
                    <Eye className="h-4 w-4" /> Reveal answer
                  </Button>
                </>
              )}
              {phase === "thinking" && (
                <Button size="sm" onClick={followIdx >= 0 ? revealFollow : reveal}>
                  <Eye className="h-4 w-4" /> Reveal answer
                </Button>
              )}
              {phase === "revealed" && (
                <>
                  {hasMoreFollow && (
                    <Button variant="soft" size="sm" onClick={askFollowUp}>
                      Follow-up <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" onClick={nextQuestion}>
                    {qIndex < pool.length - 1 ? "Next question" : "Finish"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={endInterview}>
                    <Flag className="h-4 w-4" /> End
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
