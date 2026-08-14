import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-md border border-border bg-fg/[0.04] px-1.5 font-mono text-[0.65rem] font-medium text-muted",
        className
      )}
    >
      {children}
    </kbd>
  );
}
