"use client";

import { motion, useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN RULES (do not violate when reusing this component)
//
//   • Pure light system only — no dark mode classes
//   • Decorative background ONLY — pointer-events-none, aria-hidden
//   • Placed behind content via absolute + z-0
//   • Only on browse/discovery pages — never on tool/form pages
//   • prefers-reduced-motion: no animation, paths still render statically
//
// PERFORMANCE NOTES
//
//   Original component: 36 paths × 2 instances = 72 animated SVG paths
//   This version:       18 paths × 1 instance  = 18 animated SVG paths
//   Removed:            pathOffset animation (most expensive; forces continuous
//                       path-length recalculation per frame)
//   Kept:               pathLength (draw effect) + opacity (pulse)
//   Durations:          deterministic from index — avoids SSR hydration mismatch
//                       that Math.random() would cause in Next.js
// ─────────────────────────────────────────────────────────────────────────────

// Pre-computed durations — deterministic, avoids hydration mismatch.
// Range 22–36s: slow enough that the animation rarely draws full attention.
const DURATIONS = [
  22, 28, 25, 32, 24, 30, 27, 34, 23, 29,
  26, 33, 24.5, 31, 22.5, 35, 28.5, 36,
];

function FloatingPaths({ position }: { position: number }) {
  const prefersReduced = useReducedMotion();

  // 18 paths (down from original 36).
  // The path formula creates a long S-curve. Varying `i` fans the curves
  // across the viewport; `position` mirrors them for the two-group effect.
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Opacity tiers: earlier paths are lighter, later ones slightly more present.
    // Max stroke opacity stays at ~0.22 (original reached 0.1 + 35*0.03 = 1.15 — a bug).
    strokeOpacity: 0.06 + i * 0.008,
    strokeWidth: 0.5 + i * 0.025,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        // slice: always covers container regardless of aspect ratio
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgb(15,23,42)"
            strokeWidth={path.strokeWidth}
            strokeOpacity={path.strokeOpacity}
            // Static initial state — avoids flash before animation starts
            initial={{ pathLength: 0.35, opacity: path.strokeOpacity }}
            animate={
              prefersReduced
                ? undefined
                : {
                    // Gently breathes between 35% and 85% drawn — never fully erases,
                    // never fully draws. Keeps the line always visible, just pulsing.
                    pathLength: [0.35, 0.85, 0.35],
                    opacity: [
                      path.strokeOpacity * 0.55,
                      path.strokeOpacity,
                      path.strokeOpacity * 0.55,
                    ],
                  }
            }
            transition={
              prefersReduced
                ? undefined
                : {
                    duration: DURATIONS[path.id % DURATIONS.length],
                    repeat: Infinity,
                    ease: "easeInOut",
                    // Stagger start so paths don't all pulse together
                    delay: (path.id * 1.3) % 8,
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC COMPONENT
//
// Pure background effect — no heading, no button, no dark mode.
// Designed to be placed inside a `relative overflow-hidden` container.
//
// Usage:
//   <div className="relative overflow-hidden">
//     <BackgroundPaths />
//     <div className="relative z-[1]">…content…</div>
//   </div>
//
// Props:
//   fadeBottom  — renders a gradient that fades paths into the bg color below
//   className   — applied to the root wrapper div
// ─────────────────────────────────────────────────────────────────────────────

interface BackgroundPathsProps {
  fadeBottom?: boolean;
  /** bg color for the bottom fade — matches the page background */
  fadeColor?: string;
  className?: string;
}

export function BackgroundPaths({
  fadeBottom = true,
  fadeColor = "#FAFAFA",
  className = "",
}: BackgroundPathsProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Two mirrored path groups — position=1 fans right, position=-1 fans left */}
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      {/* Bottom gradient — blends paths cleanly into whatever section follows */}
      {fadeBottom && (
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 100%)`,
          }}
        />
      )}
    </div>
  );
}
