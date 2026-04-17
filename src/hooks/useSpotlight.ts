"use client";

import { useRef, useState } from "react";
import { useMotionValue, useTransform, useSpring } from "framer-motion";

interface SpotlightOptions {
  tint?: string;
  radius?: number;
  opacity?: number;
}

export function useSpotlight({
  tint = "rgba(0,0,0,0.04)",
  radius = 200,
  opacity = 0.04,
}: SpotlightOptions = {}) {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // 120ms-lag spring matches the spec
  const mouseX = useSpring(rawX, { stiffness: 500, damping: 50, mass: 0.1 });
  const mouseY = useSpring(rawY, { stiffness: 500, damping: 50, mass: 0.1 });

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(${radius}px circle at ${x}px ${y}px, ${tint}, transparent 70%)`,
  );

  const handlers = {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return { cardRef, mouseX, mouseY, isHovered, spotlightBg, handlers };
}
