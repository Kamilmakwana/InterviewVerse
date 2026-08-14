"use client";

import { motion } from "framer-motion";

/** Soft aurora blobs + grid. Calm, premium, never distracting. */
export function AnimatedBackground({ dense = false }: { dense?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.5]" />
      <motion.div
        className="absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgb(var(--primary)/0.28), transparent 60%)" }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgb(var(--secondary)/0.26), transparent 60%)" }}
        animate={{ x: [0, -30, 20, 0], y: [0, 25, -20, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      {dense && (
        <motion.div
          className="absolute bottom-0 left-1/3 h-[34rem] w-[34rem] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgb(var(--accent)/0.2), transparent 60%)" }}
          animate={{ x: [0, 20, -25, 0], y: [0, -15, 15, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
