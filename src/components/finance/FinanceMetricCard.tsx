"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrevious } from "@/hooks/usePrevious";

const ACCENT_COLORS = {
  green: "text-emerald-400",
  red: "text-rose-400",
  blue: "text-sky-400",
  yellow: "text-yellow-400",
  default: "text-primary",
} as const;

interface FinanceMetricCardProps {
  label: string;
  value: string;
  rawValue?: number;
  sub?: string;
  icon: React.ElementType;
  accent?: keyof typeof ACCENT_COLORS;
  className?: string;
}

function AnimatedNumber({ rawValue, displayValue, className }: {
  rawValue: number;
  displayValue: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const prev = usePrevious(rawValue) ?? rawValue;
  const mv = useMotionValue(prev);

  // Derive the integer prefix length from displayValue to preserve prefix/suffix
  const prefix = displayValue.match(/^[^0-9\-]*/)?.[0] ?? "";
  const suffix = displayValue.match(/[^0-9\.]+$/)?.[0] ?? "";
  const numStr = displayValue.slice(prefix.length, suffix ? -suffix.length : undefined);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  const formatted = useTransform(mv, (latest) => {
    const rounded = parseFloat(latest.toFixed(decimals));
    return `${prefix}${rounded.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (reducedMotion || rawValue === prev) {
      mv.set(rawValue);
      return;
    }
    const controls = animate(mv, rawValue, {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [rawValue]);

  return <motion.span className={className}>{formatted}</motion.span>;
}

export default function FinanceMetricCard({
  label,
  value,
  rawValue,
  sub,
  icon: Icon,
  accent = "default",
  className,
}: FinanceMetricCardProps) {
  const color = ACCENT_COLORS[accent];

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider truncate">
          {label}
        </span>
      </div>
      <div className={cn("text-2xl font-bold tabular-nums leading-none", color)}>
        {rawValue !== undefined ? (
          <AnimatedNumber rawValue={rawValue} displayValue={value} className={cn("text-2xl font-bold tabular-nums leading-none", color)} />
        ) : (
          value
        )}
      </div>
      {sub && (
        <div className="text-[11px] text-muted-foreground/60 mt-1.5 leading-snug">{sub}</div>
      )}
    </div>
  );
}
