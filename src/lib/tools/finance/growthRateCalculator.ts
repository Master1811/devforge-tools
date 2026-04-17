import type { GrowthRateInputs, GrowthRateResult, MonthlyProjection, BenchmarkItem, ActionItem, InsightLevel } from "@/types/finance-tools";
import { GROWTH_BENCHMARKS, T2D3_MONTHLY_RATES, getGrowthLevel } from "./benchmarks";

const MAX_MONTHS = 120;

export function calculateGrowthRate(inputs: GrowthRateInputs): GrowthRateResult {
  const { startARR, endARR, periodMonths } = inputs;

  if (periodMonths <= 0 || startARR <= 0 || endARR <= startARR) {
    return emptyResult(inputs);
  }

  // MoM growth: (end/start)^(1/months) - 1
  const momRaw = Math.pow(endARR / startARR, 1 / periodMonths) - 1;
  const momGrowthPct = +(momRaw * 100).toFixed(2);

  // YoY (annualised): (1 + MoM)^12 - 1
  const yoyGrowthPct = +(( Math.pow(1 + momRaw, 12) - 1) * 100).toFixed(1);

  // CAGR (same as YoY for this model)
  const cagr = yoyGrowthPct;

  // Doubling time (months): log(2) / log(1 + MoM)
  const doublingTimeMonths = momRaw > 0 ? +(Math.log(2) / Math.log(1 + momRaw)).toFixed(1) : null;

  // Months to ₹100Cr from current endARR
  let monthsTo100Cr: number | null = null;
  if (endARR < 100 && momRaw > 0) {
    const m = Math.ceil(Math.log(100 / endARR) / Math.log(1 + momRaw));
    monthsTo100Cr = m <= MAX_MONTHS ? m : null;
  }

  let projectedDate100Cr: string | null = null;
  if (monthsTo100Cr !== null) {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsTo100Cr);
    projectedDate100Cr = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }

  // T2D3 phase classification
  const t2d3Phase = classifyT2D3(momGrowthPct);

  // Projections (forward from endARR at derived MoM rate)
  const projections: MonthlyProjection[] = [];
  let arr = endARR;
  for (let m = 0; m <= MAX_MONTHS; m++) {
    projections.push({ month: m, arr: +arr.toFixed(3) });
    arr *= 1 + momRaw;
  }

  const growthLevel = getGrowthLevel(momGrowthPct);

  const yoyLevel: InsightLevel =
    yoyGrowthPct >= 200 ? "excellent" :
    yoyGrowthPct >= 100 ? "good" :
    yoyGrowthPct >= 50 ? "average" :
    yoyGrowthPct >= 20 ? "below_average" : "critical";

  const doublingLevel: InsightLevel =
    doublingTimeMonths !== null && doublingTimeMonths <= 8 ? "excellent" :
    doublingTimeMonths !== null && doublingTimeMonths <= 12 ? "good" :
    doublingTimeMonths !== null && doublingTimeMonths <= 18 ? "average" :
    doublingTimeMonths !== null && doublingTimeMonths <= 30 ? "below_average" : "critical";

  const benchmarks: BenchmarkItem[] = [
    {
      metric: "Monthly Growth Rate",
      yourValue: momGrowthPct,
      unit: "%",
      topQuartile: GROWTH_BENCHMARKS.topQuartile,
      median: GROWTH_BENCHMARKS.median,
      bottomQuartile: GROWTH_BENCHMARKS.bottomQuartile,
      level: growthLevel,
      context: `T2D3 triple phase = ${GROWTH_BENCHMARKS.t2d3Triple.toFixed(1)}% | double = ${GROWTH_BENCHMARKS.t2d3Double.toFixed(1)}%`,
    },
    {
      metric: "Annual Growth (YoY)",
      yourValue: yoyGrowthPct,
      unit: "%",
      topQuartile: 200,
      median: 100,
      bottomQuartile: 50,
      level: yoyLevel,
      context: "T2D3 triple = 200% YoY | double = 100% YoY",
    },
    {
      metric: "Doubling Time",
      yourValue: doublingTimeMonths ?? 999,
      unit: " mo",
      topQuartile: 8,
      median: 12,
      bottomQuartile: 18,
      level: doublingLevel,
      context: "Months to double current ARR at this growth rate",
    },
    {
      metric: "Months to ₹100Cr",
      yourValue: monthsTo100Cr ?? 999,
      unit: " mo",
      topQuartile: 36,
      median: 60,
      bottomQuartile: 84,
      level: monthsTo100Cr !== null && monthsTo100Cr <= 36 ? "excellent" : monthsTo100Cr !== null && monthsTo100Cr <= 60 ? "good" : monthsTo100Cr !== null && monthsTo100Cr <= 84 ? "average" : "critical",
      context: "Extrapolated from current ARR at this MoM rate",
    },
  ];

  const actions = generateGrowthActions(inputs, { momGrowthPct, yoyGrowthPct, monthsTo100Cr, growthLevel, t2d3Phase });
  const overallScore = computeScore(growthLevel, yoyLevel, doublingLevel);
  const overallLevel = scoreToLevel(overallScore);

  const subline = `${momGrowthPct}% MoM → ${yoyGrowthPct.toFixed(0)}% YoY → ${t2d3Phase}`;

  return {
    momGrowthPct,
    yoyGrowthPct,
    cagr,
    doublingTimeMonths,
    monthsTo100Cr,
    projectedDate100Cr,
    t2d3Phase,
    projections,
    benchmarks,
    actions,
    overallScore,
    overallLevel,
    monthsToTarget: monthsTo100Cr,
    projectedReachDate: projectedDate100Cr,
    subline,
  };
}

function emptyResult(inputs: GrowthRateInputs): GrowthRateResult {
  return {
    momGrowthPct: 0, yoyGrowthPct: 0, cagr: 0, doublingTimeMonths: null, monthsTo100Cr: null,
    projectedDate100Cr: null, t2d3Phase: "N/A", projections: [],
    benchmarks: [], actions: [], overallScore: 0, overallLevel: "critical",
    headline: "Enter valid start/end ARR and period to see growth analysis.",
    subline: "End ARR must be greater than Start ARR.",
  };
}

function classifyT2D3(momPct: number): string {
  if (momPct >= T2D3_MONTHLY_RATES.triple) return "T2D3 Triple Phase (3× annually)";
  if (momPct >= T2D3_MONTHLY_RATES.double) return "T2D3 Double Phase (2× annually)";
  if (momPct >= GROWTH_BENCHMARKS.topQuartile) return "Top Quartile SaaS";
  if (momPct >= GROWTH_BENCHMARKS.median) return "Median SaaS";
  if (momPct >= GROWTH_BENCHMARKS.bottomQuartile) return "Bottom Quartile SaaS";
  return "Below Benchmark";
}

function computeScore(...levels: InsightLevel[]): number {
  const pts = { excellent: 25, good: 20, average: 13, below_average: 7, critical: 2 };
  return Math.round(levels.reduce((s, l) => s + pts[l], 0) / (levels.length * 25) * 100);
}

function scoreToLevel(s: number): InsightLevel {
  if (s >= 85) return "excellent";
  if (s >= 65) return "good";
  if (s >= 45) return "average";
  if (s >= 25) return "below_average";
  return "critical";
}

function generateGrowthActions(
  inputs: GrowthRateInputs,
  ctx: { momGrowthPct: number; yoyGrowthPct: number; monthsTo100Cr: number | null; growthLevel: InsightLevel; t2d3Phase: string }
): ActionItem[] {
  const out: ActionItem[] = [];

  if (ctx.growthLevel === "critical" || ctx.growthLevel === "below_average") {
    const gap = (GROWTH_BENCHMARKS.median - ctx.momGrowthPct).toFixed(1);
    out.push({
      priority: "high",
      title: "Diagnose Growth Drag",
      description: `${ctx.momGrowthPct}% MoM is below the ${GROWTH_BENCHMARKS.median}% median. You need +${gap}% more MoM. Identify your single largest growth lever: pricing (easiest), outbound pipeline (fastest), or new ICP expansion (highest ceiling).`,
    });
  }

  if (ctx.monthsTo100Cr !== null && ctx.monthsTo100Cr > 60) {
    out.push({
      priority: "medium",
      title: "Compress Your Timeline",
      description: `At ${ctx.momGrowthPct}% MoM, ₹100Cr takes ${ctx.monthsTo100Cr} months. To get below 5 years (60 months), you need >${GROWTH_BENCHMARKS.topQuartile}% MoM. Explore premium pricing tiers or a channel partner GTM.`,
    });
  } else if (ctx.monthsTo100Cr === null) {
    const need = (Math.pow(100 / Math.max(inputs.endARR, 0.1), 1 / 120) - 1) * 100;
    out.push({
      priority: "high",
      title: "₹100Cr Unreachable at Current Rate",
      description: `${ctx.momGrowthPct}% MoM won't reach ₹100Cr from ₹${inputs.endARR}Cr within 10 years. Minimum required: ${need.toFixed(1)}% MoM. Focus on sustainable growth enablers, not just top-line bookings.`,
    });
  }

  if (ctx.t2d3Phase.includes("Triple") || ctx.t2d3Phase.includes("Top")) {
    out.push({
      priority: "low",
      title: "Lock In Growth Infrastructure",
      description: `You're tracking ${ctx.t2d3Phase}. At this rate, growth will naturally decelerate — from triple to double to below-double — as ARR scales. Build your sales team, CS org, and partner channel NOW before the deceleration hits.`,
    });
  }

  if (ctx.growthLevel === "excellent" || ctx.growthLevel === "good") {
    out.push({
      priority: "low",
      title: "Defend Unit Economics at This Pace",
      description: `${ctx.momGrowthPct}% MoM is compelling. Make sure CAC payback stays <18 months and net revenue retention stays >100%. High growth with deteriorating unit economics is a ticking clock.`,
    });
  }

  return out.slice(0, 4);
}
