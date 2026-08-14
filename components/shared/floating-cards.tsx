"use client";

import { motion } from "framer-motion";

// Kept to the outer margins and upper band so they never collide with the
// centered headline + stats. Purely decorative, behind the content, no clicks.
const CARDS = [
  { emoji: "🍽️", title: "Dependency Injection", sub: "The Restaurant", x: "1%", y: "6%", d: 0 },
  { emoji: "🎫", title: "JWT Tokens", sub: "The Boarding Pass", x: "80%", y: "2%", d: 0.6 },
  { emoji: "🛂", title: "Middleware", sub: "Airport Security", x: "83%", y: "40%", d: 1.2 },
  { emoji: "🧹", title: "Garbage Collection", sub: "Hotel Housekeeping", x: "0%", y: "44%", d: 0.9 },
];

export function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
      {CARDS.map((c) => (
        <motion.div
          key={c.title}
          className="absolute"
          style={{ left: c.x, top: c.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.9, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: c.d, duration: 0.8 },
            scale: { delay: c.d, duration: 0.8 },
            y: { duration: 5 + c.d, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
            <span className="text-2xl">{c.emoji}</span>
            <div>
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="text-xs text-muted">{c.sub}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
