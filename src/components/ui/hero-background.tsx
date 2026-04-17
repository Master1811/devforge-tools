"use client";

import { motion, useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// PATH DATA
//
// 16 smooth cubic-bezier curves designed for a 1440×640 viewport.
// Each path extends 200px beyond both edges (x: -200 → 1640) so no gap
// ever appears during the subtle drift animation.
//
// Group A drifts right (+x) then back; Group B drifts left (-x) then back.
// Counter-movement between groups creates an organic, breathing quality.
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_A: string[] = [
  "M-200,40   C200,0    600,80   1000,40   S1400,0   1640,40",
  "M-200,120  C240,80   640,160  1040,120  S1440,80  1640,120",
  "M-200,200  C180,160  580,240  980,200   S1380,160 1640,200",
  "M-200,280  C220,240  620,320  1020,280  S1420,240 1640,280",
  "M-200,360  C200,320  600,400  1000,360  S1400,320 1640,360",
  "M-200,440  C240,400  640,480  1040,440  S1440,400 1640,440",
  "M-200,520  C180,480  580,560  980,520   S1380,480 1640,520",
  "M-200,600  C220,560  620,640  1020,600  S1420,560 1640,600",
];

const GROUP_B: string[] = [
  "M-200,80   C280,120  680,40   1080,80   S1480,120 1640,80",
  "M-200,160  C260,200  660,120  1060,160  S1460,200 1640,160",
  "M-200,240  C300,280  700,200  1100,240  S1500,280 1640,240",
  "M-200,320  C280,360  680,280  1080,320  S1480,360 1640,320",
  "M-200,400  C260,440  660,360  1060,400  S1460,440 1640,400",
  "M-200,480  C300,520  700,440  1100,480  S1500,520 1640,480",
  "M-200,560  C280,600  680,520  1080,560  S1480,600 1640,560",
  "M-200,640  C260,680  660,600  1060,640  S1460,680 1640,640",
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION KEYFRAMES
//
// Both groups oscillate very gently — ±5px horizontal, ±3px vertical.
// The opposing directions between groups creates the "breathing" effect.
// Total displacement at any point: imperceptible to the eye.
// ─────────────────────────────────────────────────────────────────────────────

const ANIM_A = { x: [0, 5, 0, -5, 0], y: [0, 3, 0, -3, 0] };
const ANIM_B = { x: [0, -5, 0, 5, 0], y: [0, -3, 0, 3, 0] };

const TRANSITION_A = {
  duration: 34,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

const TRANSITION_B = {
  duration: 42,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full-coverage animated SVG background for the hero section.
 *
 * Usage:
 *   <section className="relative">
 *     <HeroBackground />
 *     <div className="relative z-[1]">…content…</div>
 *   </section>
 *
 * Design rules (enforced here, do not deviate):
 *   • Absolute inset-0 — never affects layout
 *   • pointer-events-none — never blocks clicks
 *   • aria-hidden — invisible to screen readers
 *   • Respects prefers-reduced-motion — static fallback
 *   • Stroke opacity ≤ 0.07 — watermark level, never distracting
 *   • No dark-mode styles — this system is light-only
 */
export function HeroBackground() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      // Soft vignette mask: paths fade near all four edges so the
      // background blends seamlessly with page sections above and below.
      style={{
        WebkitMaskImage: [
          "linear-gradient(to right,  transparent 0%, black  6%, black 94%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)",
        ].join(", "),
        maskImage: [
          "linear-gradient(to right,  transparent 0%, black  6%, black 94%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)",
        ].join(", "),
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 640"
        // slice: paths always fill the section regardless of aspect ratio
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Group A — drifts right ── */}
        <motion.g
          animate={prefersReduced ? undefined : ANIM_A}
          transition={TRANSITION_A}
        >
          {GROUP_A.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="rgba(0,0,0,0.060)"
              strokeWidth={0.65}
              fill="none"
              // Even rows slightly more opaque for depth layering
              opacity={i % 2 === 0 ? 1 : 0.75}
            />
          ))}
        </motion.g>

        {/* ── Group B — drifts left ── */}
        <motion.g
          animate={prefersReduced ? undefined : ANIM_B}
          transition={TRANSITION_B}
        >
          {GROUP_B.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="rgba(0,0,0,0.048)"
              strokeWidth={0.60}
              fill="none"
              opacity={i % 2 === 0 ? 0.85 : 1}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
