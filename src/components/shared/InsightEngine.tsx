"use client";

import { cn } from "@/lib/utils";
import type { InsightEngineData, InsightLevel, BenchmarkItem, ActionItem } from "@/types/finance-tools";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
} from "lucide-react";

// ── Level config ──────────────────────────────────────────────────────────────

export const LEVEL_CONFIG: Record<
  InsightLevel,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  excellent: {
    label: "Excellent",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  good: {
    label: "Good",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    dot: "bg-sky-400",
  },
  average: {
    label: "Average",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
    dot: "bg-yellow-400",
  },
  below_average: {
    label: "Below Avg",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    dot: "bg-orange-400",
  },
  critical: {
    label: "Critical",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    dot: "bg-rose-400",
  },
};

const PRIORITY_CONFIG = {
  high: { label: "High", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  medium: { label: "Med", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low: { label: "Low", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
};

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, level }: { score: number; level: InsightLevel }) {
  const cfg = LEVEL_CONFIG[level];
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            className={cn("transition-all duration-700 ease-out", cfg.color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold leading-none", cfg.color)}>{score}</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={cn("text-xs font-semibold uppercase tracking-widest", cfg.color)}>
        {cfg.label}
      </span>
    </div>
  );
}

// ── Benchmark bar ─────────────────────────────────────────────────────────────

function BenchmarkBar({ item }: { item: BenchmarkItem }) {
  const cfg = LEVEL_CONFIG[item.level];
  const isLowerBetter = item.metric === "Burn Multiple" || item.metric === "Monthly Churn" || item.metric === "Gross Burn" || item.metric === "Net Burn";
  const lo = isLowerBetter ? item.topQuartile : item.bottomQuartile;
  const hi = isLowerBetter ? item.bottomQuartile : item.topQuartile;
  const range = hi - lo || 1;
  const clampedPct = Math.min(100, Math.max(0, ((item.yourValue - lo) / range) * 80 + 10));

  const TrendIcon =
    item.level === "excellent" || item.level === "good"
      ? TrendingUp
      : item.level === "critical" || item.level === "below_average"
      ? TrendingDown
      : Minus;

  return (
    <div className={cn("rounded-xl border p-4 backdrop-blur-sm", cfg.bg, cfg.border)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-foreground/90">{item.metric}</span>
        <div className="flex items-center gap-1.5">
          <TrendIcon className={cn("w-3.5 h-3.5", cfg.color)} />
          <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
        </div>
      </div>

      <div className="relative h-1.5 rounded-full bg-white/5 mb-3">
        <div className="absolute top-0 h-full w-px bg-white/10" style={{ left: "33%" }} />
        <div className="absolute top-0 h-full w-px bg-white/10" style={{ left: "66%" }} />
        <div
          className={cn("absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-lg transition-all duration-500", cfg.dot)}
          style={{ left: `calc(${clampedPct}% - 6px)` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground/60 font-mono mb-1">
        <span>Bottom Q</span>
        <span>Median</span>
        <span>Top Q</span>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <span className={cn("text-xl font-bold tabular-nums", cfg.color)}>
          {item.yourValue}{item.unit}
        </span>
        <span className="text-[11px] text-muted-foreground/60 leading-snug max-w-[55%] text-right">
          {item.context}
        </span>
      </div>
    </div>
  );
}

// ── Action card ───────────────────────────────────────────────────────────────

function ActionCard({ item }: { item: ActionItem }) {
  const pCfg = PRIORITY_CONFIG[item.priority];
  const Icon = item.priority === "high" ? AlertTriangle : item.priority === "medium" ? Zap : CheckCircle;

  return (
    <div className="flex gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm">
      <div className="flex-shrink-0 mt-0.5">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border", pCfg.bg, pCfg.border)}>
          <Icon className={cn("w-3.5 h-3.5", pCfg.color)} />
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-semibold text-foreground/95">{item.title}</span>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border", pCfg.bg, pCfg.border, pCfg.color)}>
            {pCfg.label}
          </span>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}

// ── Interpretation banner ─────────────────────────────────────────────────────

function InterpretationBanner({ data }: { data: InsightEngineData }) {
  const cfg = LEVEL_CONFIG[data.overallLevel];

  const summary = data.headline ?? (() => {
    if (data.overallLevel === "excellent") return "Your fundamentals are exceptional. You're on track to build an elite company.";
    if (data.overallLevel === "good") return "Solid foundation. A few targeted improvements will significantly accelerate your trajectory.";
    if (data.overallLevel === "average") return "You're in the game but not yet compounding. Address the high-priority items to unlock the next gear.";
    if (data.overallLevel === "below_average") return "Several metrics are flashing yellow. Without corrections, growth will stall.";
    return "Multiple critical signals require immediate action. Focus on survival metrics before growth.";
  })();

  const subline = data.subline ?? (() => {
    if (data.monthsToTarget !== undefined) {
      return data.monthsToTarget
        ? `At this pace, you'll reach ₹100Cr ARR in ${data.monthsToTarget} months (${(data.monthsToTarget / 12).toFixed(1)} years)${data.projectedReachDate ? " — " + data.projectedReachDate : ""}.`
        : "₹100Cr ARR is not reachable within 10 years at the current growth rate.";
    }
    if (data.runway !== undefined) {
      return `You have ${data.runway >= 999 ? "unlimited" : data.runway + " months of"} runway${data.breakEvenMonth ? `, reaching break-even in month ${data.breakEvenMonth}` : ""}.`;
    }
    return null;
  })();

  return (
    <div className={cn("rounded-xl border p-5 backdrop-blur-sm", cfg.bg, cfg.border)}>
      <div className="flex items-start gap-3">
        <Info className={cn("w-4 h-4 mt-0.5 flex-shrink-0", cfg.color)} />
        <div>
          <p className={cn("text-sm font-semibold mb-1", cfg.color)}>{summary}</p>
          {subline && <p className="text-[13px] text-muted-foreground leading-relaxed">{subline}</p>}
          {data.isDefaultAlive === false && (
            <p className="text-[13px] text-orange-400 mt-1.5 font-medium">
              ⚠ Not default alive — revenue growth does not yet cover monthly burn.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main InsightEngine component ──────────────────────────────────────────────

interface InsightEngineProps {
  data: InsightEngineData;
  className?: string;
}

export default function InsightEngine({ data, className }: InsightEngineProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="heading-display text-lg text-foreground">Insight Engine</h3>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <ScoreRing score={data.overallScore} level={data.overallLevel} />
        </div>
        <div className="flex-1">
          <InterpretationBanner data={data} />
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">
          Benchmarks vs. Top-Tier SaaS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.benchmarks.map((item) => (
            <BenchmarkBar key={item.metric} item={item} />
          ))}
        </div>
      </div>

      {data.actions.length > 0 && (
        <div>
          <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">
            Actionable Recommendations
          </p>
          <div className="space-y-3">
            {data.actions.map((action, i) => (
              <ActionCard key={i} item={action} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
