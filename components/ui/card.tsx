"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, glass, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={
        interactive ? { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } } : undefined
      }
      className={cn(
        glass ? "glass" : "card-surface",
        interactive && "cursor-pointer hover:shadow-soft transition-shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
