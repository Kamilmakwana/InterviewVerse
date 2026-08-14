"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand logo mark. Renders /logo.png when present; until you add that file it
 * gracefully falls back to the gradient "IV" tile, so the UI never looks broken.
 * Drop your logo at  public/logo.png  and it appears everywhere automatically.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const [ok, setOk] = useState(true);

  if (ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="InterviewVerse logo"
        width={size}
        height={size}
        onError={() => setOk(false)}
        className={cn("rounded-xl object-cover shadow-glow", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary font-extrabold text-white shadow-glow",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      IV
    </span>
  );
}
