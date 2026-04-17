import type { InsightLevel } from "@/types/finance-tools";

// T2D3 growth model — Triple, Triple, Double, Double, Double
// (1+r)^12 = multiplier → r = multiplier^(1/12) – 1
export const T2D3_MONTHLY_RATES = {
  triple: +(Math.pow(3, 1 / 12) - 1) * 100, // ~9.59% MoM
  double: +(Math.pow(2, 1 / 12) - 1) * 100, // ~5.95% MoM
};

// SaaS growth benchmarks — monthly growth rate %
export const GROWTH_BENCHMARKS = {
  topDecile: 20,
  topQuartile: 12,
  median: 7,
  bottomQuartile: 3,
  t2d3Triple: +T2D3_MONTHLY_RATES.triple.toFixed(2),
  t2d3Double: +T2D3_MONTHLY_RATES.double.toFixed(2),
};

// Runway benchmarks — months
export const RUNWAY_BENCHMARKS = {
  excellent: 24,
  good: 18,
  average: 12,
  warning: 6,
};

// Burn Multiple — net burn ÷ net new ARR (lower is better)
export const BURN_MULTIPLE_BENCHMARKS = {
  excellent: 1.0,
  good: 1.5,
  average: 2.5,
  poor: 4.0,
};

// Monthly churn % benchmarks
export const CHURN_BENCHMARKS = {
  excellent: 0.5,
  good: 1.0,
  average: 2.0,
  poor: 3.5,
};

// India SaaS context (illustrative ranges)
export const INDIA_SAAS_CONTEXT = {
  seriesA: { minARR: 3, maxARR: 10 },   // ₹ Crores
  seriesB: { minARR: 15, maxARR: 50 },
  seriesC: { minARR: 50, maxARR: 150 },
};

// ── Level helpers ────────────────────────────────────────────────────────────

export function getGrowthLevel(rate: number): InsightLevel {
  if (rate >= GROWTH_BENCHMARKS.topDecile) return "excellent";
  if (rate >= GROWTH_BENCHMARKS.topQuartile) return "good";
  if (rate >= GROWTH_BENCHMARKS.median) return "average";
  if (rate >= GROWTH_BENCHMARKS.bottomQuartile) return "below_average";
  return "critical";
}

export function getRunwayLevel(months: number): InsightLevel {
  if (months >= RUNWAY_BENCHMARKS.excellent) return "excellent";
  if (months >= RUNWAY_BENCHMARKS.good) return "good";
  if (months >= RUNWAY_BENCHMARKS.average) return "average";
  if (months >= RUNWAY_BENCHMARKS.warning) return "below_average";
  return "critical";
}

export function getBurnMultipleLevel(bm: number): InsightLevel {
  if (bm <= BURN_MULTIPLE_BENCHMARKS.excellent) return "excellent";
  if (bm <= BURN_MULTIPLE_BENCHMARKS.good) return "good";
  if (bm <= BURN_MULTIPLE_BENCHMARKS.average) return "average";
  if (bm <= BURN_MULTIPLE_BENCHMARKS.poor) return "below_average";
  return "critical";
}

export function getChurnLevel(churn: number): InsightLevel {
  if (churn <= CHURN_BENCHMARKS.excellent) return "excellent";
  if (churn <= CHURN_BENCHMARKS.good) return "good";
  if (churn <= CHURN_BENCHMARKS.average) return "average";
  if (churn <= CHURN_BENCHMARKS.poor) return "below_average";
  return "critical";
}
