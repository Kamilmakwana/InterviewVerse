"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useAppStore, type ThemeMode } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const options: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: "light", icon: Sun, label: "Light" },
  { mode: "system", icon: Monitor, label: "System" },
  { mode: "dark", icon: Moon, label: "Dark" },
];

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5">
      {options.map(({ mode, icon: I, label }) => (
        <button
          key={mode}
          aria-label={`${label} theme`}
          onClick={() => setTheme(mode)}
          className={cn(
            "grid h-7 w-7 place-items-center rounded-full transition-colors focus-ring",
            theme === mode ? "bg-primary text-white" : "text-muted hover:text-fg"
          )}
        >
          <I className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
