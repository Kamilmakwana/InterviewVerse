import confetti from "canvas-confetti";

export function celebrate() {
  const colors = ["#4F8EF7", "#7C5CFC", "#22C55E", "#F59E0B"];
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors });
  setTimeout(
    () => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }),
    150
  );
  setTimeout(
    () => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }),
    300
  );
}

export function bigCelebrate() {
  const end = Date.now() + 1200;
  const colors = ["#4F8EF7", "#7C5CFC", "#22C55E", "#F59E0B", "#EC4899"];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
