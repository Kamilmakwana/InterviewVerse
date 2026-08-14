import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-fg/[0.06] text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

const diffStyles: Record<Difficulty, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-secondary/15 text-secondary",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        diffStyles[level]
      )}
    >
      {level}
    </span>
  );
}
