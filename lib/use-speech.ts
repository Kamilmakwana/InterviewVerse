"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeakOpts {
  lang?: string; // BCP-47, e.g. "en-US", "hi-IN"
}

const VOICE_KEY = "dnq-voice";
const RATE_KEY = "dnq-rate";

/** Higher score = more natural-sounding voice. */
function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  let s = 0;
  if (n.includes("natural") || n.includes("neural")) s += 120;
  if (n.includes("google")) s += 70;
  // Named modern voices that tend to sound human across platforms.
  for (const k of [
    "aria", "jenny", "guy", "sonia", "libby", "ana", "emma", "michelle",
    "ryan", "clara", "nanami", "siri", "samantha", "premium", "enhanced",
  ]) {
    if (n.includes(k)) s += 45;
  }
  if (!v.localService) s += 25; // online voices are usually higher quality
  if (n.includes("compact") || n.includes("espeak") || n.includes("robot")) s -= 80;
  return s;
}

/** Split text into speakable sentences so the engine phrases naturally
 *  instead of reading in one long run-on breath. Handles Latin, Indic (।)
 *  and CJK (。！？) punctuation. */
function toSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const parts = normalized
    .split(/(?<=[.!?;:।。！？])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);
  // Merge very short fragments into the previous sentence for smoother flow.
  const out: string[] = [];
  for (const p of parts) {
    if (out.length && p.length < 18) out[out.length - 1] += " " + p;
    else out.push(p);
  }
  return out.length ? out : [normalized];
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceNameState] = useState<string | null>(null);
  const [rate, setRateState] = useState(0.92);
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    setVoiceNameState(localStorage.getItem(VOICE_KEY));
    const r = Number(localStorage.getItem(RATE_KEY));
    if (r >= 0.5 && r <= 1.5) setRateState(r);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
      if (keepAlive.current) clearInterval(keepAlive.current);
    };
  }, []);

  const voicesFor = useCallback(
    (lang: string) => {
      const base = lang.split("-")[0].toLowerCase();
      return voices
        .filter((v) => v.lang.toLowerCase().startsWith(base))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
    },
    [voices]
  );

  const bestVoice = useCallback(
    (lang: string): SpeechSynthesisVoice | undefined => {
      const list = voicesFor(lang);
      if (voiceName) {
        const chosen = list.find((v) => v.name === voiceName);
        if (chosen) return chosen;
      }
      return list[0] ?? voices.find((v) => v.default);
    },
    [voicesFor, voiceName, voices]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    if (keepAlive.current) clearInterval(keepAlive.current);
  }, [supported]);

  const speak = useCallback(
    (text: string, opts: SpeakOpts = {}) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const lang = opts.lang ?? "en-US";
      const voice = bestVoice(lang);
      const sentences = toSentences(text);

      setSpeaking(true);
      setPaused(false);

      sentences.forEach((sentence, i) => {
        const u = new SpeechSynthesisUtterance(sentence);
        u.lang = lang;
        u.rate = rate;
        u.pitch = 1;
        if (voice) u.voice = voice;
        if (i === sentences.length - 1) {
          u.onend = () => {
            setSpeaking(false);
            setPaused(false);
            if (keepAlive.current) clearInterval(keepAlive.current);
          };
        }
        u.onerror = () => {
          setSpeaking(false);
          setPaused(false);
          if (keepAlive.current) clearInterval(keepAlive.current);
        };
        window.speechSynthesis.speak(u);
      });

      // Chrome pauses long queues after ~15s; nudge it to keep going.
      if (keepAlive.current) clearInterval(keepAlive.current);
      keepAlive.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 9000);
    },
    [supported, bestVoice, rate]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported]);

  const setVoice = useCallback((name: string) => {
    setVoiceNameState(name);
    localStorage.setItem(VOICE_KEY, name);
  }, []);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    localStorage.setItem(RATE_KEY, String(r));
  }, []);

  return {
    supported, speaking, paused, speak, pause, resume, stop,
    voicesFor, voiceName, setVoice, rate, setRate,
  };
}
