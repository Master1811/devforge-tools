"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  once = true,
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ delay, duration: 0.48, ease: motionEase }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
