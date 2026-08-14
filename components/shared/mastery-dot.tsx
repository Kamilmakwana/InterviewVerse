import { cn } from "@/lib/utils";
import type { MasteryLevel } from "@/lib/types";

const config: Record<MasteryLevel, { color: string; label: string }> = {
  new: { color: "bg-muted/40", label: "New" },
  learning: { color: "bg-warning", label: "Learning" },
  practicing: { color: "bg-primary", label: "Practicing" },
  mastered: { color: "bg-success", label: "Mastered" },
};

export function MasteryDot({
  level,
  showLabel = false,
  className,
}: {
  level: MasteryLevel;
  showLabel?: boolean;
  className?: string;
}) {
  const c = config[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-2 w-2 rounded-full", c.color)} />
      {showLabel && <span className="text-xs text-muted">{c.label}</span>}
    </span>
  );
}

export { config as masteryConfig };
