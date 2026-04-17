"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const variants = {
  default: {
    initial: { opacity: 0, y: 16, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, ease },
  },
  prominent: {
    initial: { opacity: 0, y: 24, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease },
  },
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  variant?: keyof typeof variants;
}

export default function Reveal({
  children,
  delay = 0,
  className,
  once = true,
  variant = "default",
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const v = variants[variant];

  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once, margin: "-40px" }}
      transition={{ ...v.transition, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
