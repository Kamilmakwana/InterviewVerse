"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, Pause, Play, Square, Settings2 } from "lucide-react";
import { useSpeech } from "@/lib/use-speech";
import { cn } from "@/lib/utils";

/**
 * Read-aloud control. `lang` is the language of `text` (BCP-47).
 * Picks the most natural installed voice automatically, reads
 * sentence-by-sentence for natural phrasing, and lets the user choose a
 * voice + speed (saved to their browser).
 */
export function ReadAloud({
  text,
  lang = "en-US",
  label = "Read aloud",
  className,
}: {
  text: string;
  lang?: string;
  label?: string;
  className?: string;
}) {
  const {
    supported, speaking, paused, speak, pause, resume, stop,
    voicesFor, voiceName, setVoice, rate, setRate,
  } = useSpeech();
  const [openSettings, setOpenSettings] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenSettings(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!supported) return null;
  const langVoices = voicesFor(lang);

  return (
    <div ref={ref} className={cn("relative inline-flex items-center gap-1", className)}>
      {!speaking ? (
        <button
          onClick={() => speak(text, { lang })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <Volume2 className="h-3.5 w-3.5" /> {label}
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 p-0.5">
          <button
            onClick={() => (paused ? resume() : pause())}
            aria-label={paused ? "Resume" : "Pause"}
            className="grid h-7 w-7 place-items-center rounded-md text-primary hover:bg-primary/15"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={stop}
            aria-label="Stop"
            className="grid h-7 w-7 place-items-center rounded-md text-primary hover:bg-primary/15"
          >
            <Square className="h-3.5 w-3.5" />
          </button>
          <span className="px-1.5 text-xs font-medium text-primary">
            {paused ? "Paused" : "Reading…"}
          </span>
        </div>
      )}

      <button
        onClick={() => setOpenSettings((o) => !o)}
        aria-label="Voice settings"
        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-fg"
      >
        <Settings2 className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {openSettings && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-72 rounded-2xl border border-border bg-card p-3 shadow-glow-lg"
          >
            <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
              Voice
            </p>
            {langVoices.length > 0 ? (
              <select
                value={voiceName ?? langVoices[0]?.name}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm focus-ring"
              >
                {langVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                    {!v.localService ? " · online" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg bg-warning/10 p-2.5 text-xs text-warning">
                No voice installed for this language. Add a “Natural” voice in your OS
                speech settings for the most human sound.
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                Speed
              </p>
              <span className="text-xs text-muted">{rate.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.2}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full accent-[rgb(var(--primary))]"
            />
            <p className="mt-2 text-[0.7rem] leading-snug text-muted">
              Slower speeds sound clearer. Tip: “Natural / Neural” or Google voices are
              the most human — pick one above if your device has it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
