"use client";

import { cn } from "@/lib/utils";

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
  sub?: string;
  icon: React.ElementType;
  accent?: keyof typeof ACCENT_COLORS;
  className?: string;
}

export default function FinanceMetricCard({
  label,
  value,
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
      <div className={cn("text-2xl font-bold tabular-nums leading-none", color)}>{value}</div>
      {sub && (
        <div className="text-[11px] text-muted-foreground/60 mt-1.5 leading-snug">{sub}</div>
      )}
    </div>
  );
}
