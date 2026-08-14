import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic shuffle when a seed is provided, random otherwise. */
export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let random = Math.random;
  if (seed !== undefined) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    random = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Integer for a given day — used to pick a deterministic "daily" item. */
export function daySeed(date = new Date()): number {
  return Number(
    `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
  );
}

export function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function formatMinutes(m: number): string {
  return `${m} min`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
