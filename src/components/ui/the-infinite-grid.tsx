"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
  MotionValue,
} from "framer-motion";

interface InfiniteGridProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  backgroundOnly?: boolean;
}

export const InfiniteGrid = ({
  title,
  subtitle,
  className,
  children,
  backgroundOnly = false,
}: InfiniteGridProps) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const patternId = useId();
  const idleTime = useMotionValue(0);
  const pulseOpacity = useMotionValue(0.04);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
    idleTime.set(0);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame((_, delta) => {
    gridOffsetX.set((gridOffsetX.get() + speedX) % 40);
    gridOffsetY.set((gridOffsetY.get() + speedY) % 40);

    // Idle breathing: ramp up after ~1s of no movement
    const idle = idleTime.get() + delta;
    idleTime.set(idle);
    if (idle > 1000) {
      const breath = 0.04 + 0.03 * Math.sin((idle - 1000) / 800);
      pulseOpacity.set(breath);
    } else {
      pulseOpacity.set(0.04);
    }
  });

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const gridLayers = (fromColor: string) => (
    <>
      {/* Base grid with breathing */}
      <motion.div className="absolute inset-0" style={{ opacity: pulseOpacity }}>
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`base-${patternId}`} />
      </motion.div>

      {/* Mouse-reveal grid with glow lines */}
      <motion.div className="absolute inset-0 opacity-30" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`reveal-${patternId}`} glow />
      </motion.div>

      {/* Edge fades */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${fromColor} to-transparent`} />
        <div className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${fromColor} to-transparent`} />
        <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r ${fromColor} to-transparent`} />
        <div className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l ${fromColor} to-transparent`} />
      </div>
    </>
  );

  if (backgroundOnly) {
    return (
      <div onMouseMove={handleMouseMove} className={cn("relative overflow-hidden", className)}>
        {gridLayers("from-background")}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("relative w-full rounded-2xl border border-border bg-surface overflow-hidden", className)}
    >
      {gridLayers("from-surface")}
      <div className="relative z-10 flex flex-col items-center justify-center p-10 sm:p-16 text-center">
        {title && <h2 className="heading-display text-2xl sm:text-3xl mb-3">{title}</h2>}
        {subtitle && <p className="text-sm text-muted-foreground font-mono max-w-md mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

const GridPattern = ({
  offsetX,
  offsetY,
  patternId,
  glow = false,
}: {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  patternId: string;
  glow?: boolean;
}) => {
  const x = useTransform(offsetX, (v) => v);
  const y = useTransform(offsetY, (v) => v);

  return (
    <motion.svg className="w-full h-full" style={{ x, y }}>
      <defs>
        <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth={glow ? "1.5" : "1"}
            className="text-primary"
            style={glow ? { filter: "drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor)" } : undefined}
          />
        </pattern>
      </defs>
      <rect x="-40" y="-40" width="calc(100% + 80px)" height="calc(100% + 80px)" fill={`url(#${patternId})`} />
    </motion.svg>
  );
};

export default InfiniteGrid;
