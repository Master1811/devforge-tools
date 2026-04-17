// ── Shared primitives ─────────────────────────────────────────────────────────

export type InsightLevel =
  | "excellent"
  | "good"
  | "average"
  | "below_average"
  | "critical";

export interface MonthlyProjection {
  month: number;
  arr?: number;   // ₹ Crores
  mrr?: number;   // ₹ Crores
  cash?: number;  // ₹ Crores remaining
  netBurn?: number;
  [key: string]: number | undefined;
}

export interface BenchmarkItem {
  metric: string;
  yourValue: number;
  unit: string;
  topQuartile: number;
  median: number;
  bottomQuartile: number;
  level: InsightLevel;
  context: string;
}

export interface ActionItem {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

// ── Generic InsightEngine contract (all tools satisfy this) ──────────────────

export interface InsightEngineData {
  overallScore: number;
  overallLevel: InsightLevel;
  benchmarks: BenchmarkItem[];
  actions: ActionItem[];
  // Tool-specific optional context used by InterpretationBanner
  runway?: number;
  monthsToTarget?: number | null;
  projectedReachDate?: string | null;
  isDefaultAlive?: boolean;
  breakEvenMonth?: number | null;
  headline?: string;        // Override the auto-generated headline
  subline?: string;         // Override the auto-generated subline
}

// ── Generic scenario types ────────────────────────────────────────────────────

export interface SavedScenario<T = Record<string, number>> {
  id: string;
  name: string;
  inputs: T;
  savedAt: string;
}

export interface SerializedState<T = Record<string, number>> {
  inputs: T;
  v: 1;
}

// ── Summary card definition (used by FinanceToolLayout) ──────────────────────

export interface SummaryCardDef {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: "green" | "red" | "blue" | "yellow" | "default";
}

// ── FinanceChart series definition ────────────────────────────────────────────

export interface ChartSeries {
  dataKey: string;
  name: string;
  colorVar: "primary" | "accent" | "destructive" | "yellow";
  filled?: boolean;
  dashed?: boolean;
}

export interface ChartReferenceLine {
  axis: "x" | "y";
  value: string | number;
  label: string;
  colorVar: "primary" | "accent" | "destructive" | "yellow";
}

// ════════════════════════════════════════════════════════════════════════════
// TOOL-SPECIFIC TYPES
// ════════════════════════════════════════════════════════════════════════════

// ── ₹100Cr Journey Calculator ────────────────────────────────────────────────

export interface HundredCrInputs {
  currentARR: number;
  monthlyGrowthRate: number;
  burnRate: number;       // ₹ Lakhs / month
  cashOnHand: number;     // ₹ Crores
  teamSize: number;
  arpu: number;           // ₹ / month
  churnRate: number;      // % monthly
}

export interface Milestone {
  label: string;
  targetARR: number;
  month: number | null;
  dateLabel: string;
  withinRunway: boolean;
}

export interface HundredCrResult extends InsightEngineData {
  monthsToTarget: number | null;
  projectedReachDate: string | null;
  runway: number;
  isDefaultAlive: boolean;
  burnMultiple: number;
  projections: MonthlyProjection[];
  milestones: Milestone[];
}

// ── Runway Calculator ─────────────────────────────────────────────────────────

export interface RunwayInputs {
  cashOnHand: number;       // ₹ Crores
  grossBurnRate: number;    // ₹ Lakhs / month
  currentMRR: number;       // ₹ Lakhs / month
  mrrGrowthRate: number;    // % monthly
}

export interface RunwayResult extends InsightEngineData {
  runway: number;           // months (capped 999)
  netBurn: number;          // ₹ Lakhs / month
  grossBurn: number;        // ₹ Lakhs / month
  breakEvenMonth: number | null;
  isDefaultAlive: boolean;
  projections: MonthlyProjection[];
}

// ── ARR / MRR Calculator ──────────────────────────────────────────────────────

export interface ArrInputs {
  currentMRR: number;     // ₹ Lakhs / month
  newMRR: number;         // ₹ Lakhs / month (new logos)
  churnedMRR: number;     // ₹ Lakhs / month lost
  expansionMRR: number;   // ₹ Lakhs / month (upsell/expansion)
}

export interface ArrResult extends InsightEngineData {
  currentARR: number;     // ₹ Crores
  nextMonthMRR: number;   // ₹ Lakhs
  netNewMRR: number;      // ₹ Lakhs
  momGrowthPct: number;   // %
  quickRatio: number;     // (new + expansion) / churn
  impliedARR: number;     // next month MRR × 12
}

// ── Burn Rate Calculator ──────────────────────────────────────────────────────

export interface BurnRateInputs {
  salaries: number;       // ₹ Lakhs / month
  infrastructure: number;
  marketing: number;
  operations: number;
  other: number;
  currentMRR: number;     // ₹ Lakhs / month
  cashOnHand: number;     // ₹ Crores
}

export interface BurnRateResult extends InsightEngineData {
  grossBurn: number;      // ₹ Lakhs / month
  netBurn: number;
  runway: number;         // months
  burnMultiple: number;
  monthsToBreakEven: number | null;
  categoryBreakdown: { label: string; value: number; pct: number }[];
}

// ── Growth Rate Calculator ────────────────────────────────────────────────────

export interface GrowthRateInputs {
  startARR: number;       // ₹ Crores
  endARR: number;         // ₹ Crores
  periodMonths: number;   // duration
}

export interface GrowthRateResult extends InsightEngineData {
  momGrowthPct: number;
  yoyGrowthPct: number;
  cagr: number;
  doublingTimeMonths: number | null;
  monthsTo100Cr: number | null;
  projectedDate100Cr: string | null;
  t2d3Phase: string;
  projections: MonthlyProjection[];
}
