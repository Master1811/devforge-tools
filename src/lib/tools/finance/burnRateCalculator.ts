import type { BurnRateInputs, BurnRateResult, BenchmarkItem, ActionItem, InsightLevel } from "@/types/finance-tools";
import { RUNWAY_BENCHMARKS, BURN_MULTIPLE_BENCHMARKS, getRunwayLevel } from "./benchmarks";

export function calculateBurnRate(inputs: BurnRateInputs): BurnRateResult {
  const { salaries, infrastructure, marketing, operations, other, currentMRR, cashOnHand } = inputs;

  const grossBurn = salaries + infrastructure + marketing + operations + other; // ₹L/mo
  const netBurn = Math.max(0, grossBurn - currentMRR);
  const netBurnCr = netBurn / 100;
  const runway = netBurnCr > 0 ? Math.min(Math.floor((cashOnHand * 100) / netBurn), 999) : 999;

  // Burn multiple: gross burn / net new ARR assumption (use 10% MoM as proxy if no growth data)
  // Keep it simple: gross burn / MRR (coverage ratio)
  const coverageRatio = grossBurn > 0 ? currentMRR / grossBurn : 0;
  const burnMultiple = currentMRR > 0 ? +(grossBurn / currentMRR).toFixed(2) : 99;

  // Months to break-even (assumes MRR grows at 8% MoM by default — show the calculation at current state)
  // We show how many months at 8% MoM it would take to cover gross burn
  const defaultGrowthRate = 0.08;
  let mrrNow = currentMRR;
  let monthsToBreakEven: number | null = null;
  for (let m = 1; m <= 60; m++) {
    mrrNow *= 1 + defaultGrowthRate;
    if (mrrNow >= grossBurn) { monthsToBreakEven = m; break; }
  }

  // Category breakdown
  const total = grossBurn || 1;
  const categoryBreakdown = [
    { label: "Salaries", value: salaries, pct: +((salaries / total) * 100).toFixed(1) },
    { label: "Infrastructure", value: infrastructure, pct: +((infrastructure / total) * 100).toFixed(1) },
    { label: "Marketing", value: marketing, pct: +((marketing / total) * 100).toFixed(1) },
    { label: "Operations", value: operations, pct: +((operations / total) * 100).toFixed(1) },
    { label: "Other", value: other, pct: +((other / total) * 100).toFixed(1) },
  ].filter((c) => c.value > 0);

  // Levels
  const runwayLevel = getRunwayLevel(runway);
  const burnMultipleLevel: InsightLevel =
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.excellent ? "excellent" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.good ? "good" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.average ? "average" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.poor ? "below_average" : "critical";

  const coverageLevel: InsightLevel =
    coverageRatio >= 1 ? "excellent" :
    coverageRatio >= 0.7 ? "good" :
    coverageRatio >= 0.4 ? "average" :
    coverageRatio >= 0.2 ? "below_average" : "critical";

  const salaryPct = salaries / total;
  const salaryLevel: InsightLevel =
    salaryPct <= 0.5 ? "excellent" :
    salaryPct <= 0.65 ? "good" :
    salaryPct <= 0.75 ? "average" :
    salaryPct <= 0.85 ? "below_average" : "critical";

  const benchmarks: BenchmarkItem[] = [
    {
      metric: "Runway",
      yourValue: Math.min(runway, 99),
      unit: " mo",
      topQuartile: RUNWAY_BENCHMARKS.excellent,
      median: RUNWAY_BENCHMARKS.good,
      bottomQuartile: RUNWAY_BENCHMARKS.average,
      level: runwayLevel,
      context: "VCs expect 18–24 months post-close",
    },
    {
      metric: "Burn Multiple",
      yourValue: burnMultiple >= 99 ? 99 : burnMultiple,
      unit: "x",
      topQuartile: BURN_MULTIPLE_BENCHMARKS.excellent,
      median: BURN_MULTIPLE_BENCHMARKS.average,
      bottomQuartile: BURN_MULTIPLE_BENCHMARKS.poor,
      level: burnMultipleLevel,
      context: "Gross burn ÷ MRR — lower is more efficient",
    },
    {
      metric: "Revenue Coverage",
      yourValue: +(coverageRatio * 100).toFixed(0),
      unit: "%",
      topQuartile: 100,
      median: 50,
      bottomQuartile: 20,
      level: coverageLevel,
      context: "MRR as % of gross burn — 100% = break-even",
    },
    {
      metric: "Salary % of Burn",
      yourValue: +(salaryPct * 100).toFixed(0),
      unit: "%",
      topQuartile: 50,
      median: 65,
      bottomQuartile: 80,
      level: salaryLevel,
      context: "Top SaaS keep salaries <65% of total burn",
    },
  ];

  const actions = generateBurnActions(inputs, { grossBurn, netBurn, runway, burnMultiple, coverageRatio, runwayLevel, burnMultipleLevel, monthsToBreakEven, salaryPct });
  const overallScore = computeScore(runwayLevel, burnMultipleLevel, coverageLevel, salaryLevel);
  const overallLevel = scoreToLevel(overallScore);

  const subline = `Gross burn: ₹${grossBurn}L/mo | Net burn: ₹${netBurn}L/mo | Revenue covers ${+(coverageRatio * 100).toFixed(0)}% of costs.`;

  return {
    grossBurn,
    netBurn,
    runway,
    burnMultiple: burnMultiple >= 99 ? 99 : burnMultiple,
    monthsToBreakEven,
    categoryBreakdown,
    benchmarks,
    actions,
    overallScore,
    overallLevel,
    isDefaultAlive: netBurn === 0,
    subline,
  };
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

function generateBurnActions(
  inputs: BurnRateInputs,
  ctx: { grossBurn: number; netBurn: number; runway: number; burnMultiple: number; coverageRatio: number; runwayLevel: InsightLevel; burnMultipleLevel: InsightLevel; monthsToBreakEven: number | null; salaryPct: number }
): ActionItem[] {
  const out: ActionItem[] = [];

  if (ctx.runwayLevel === "critical") {
    out.push({
      priority: "high",
      title: "Emergency Burn Reduction",
      description: `${ctx.runway}-month runway is critical. To reach 18 months, reduce monthly burn from ₹${ctx.grossBurn}L to ₹${Math.max(0, (inputs.cashOnHand * 100 / 18)).toFixed(0)}L. Review non-essential contractor spend and pause marketing experiments immediately.`,
    });
  }

  if (ctx.salaryPct > 0.85) {
    out.push({
      priority: "high",
      title: "Salary Concentration Risk",
      description: `${(ctx.salaryPct * 100).toFixed(0)}% of burn is salaries — above the 75th percentile. This creates inflexibility. Consider contractor-to-employee ratio, role redundancy, or hiring freezes until revenue improves.`,
    });
  }

  if (ctx.burnMultipleLevel === "below_average" || ctx.burnMultipleLevel === "critical") {
    out.push({
      priority: "medium",
      title: "Improve Revenue-per-Cost",
      description: `Burning ${ctx.burnMultiple.toFixed(1)}x more than MRR. To reach 2x burn multiple, either reduce costs by ₹${(ctx.grossBurn - 2 * inputs.currentMRR).toFixed(0)}L or grow MRR to ₹${(ctx.grossBurn / 2).toFixed(0)}L.`,
    });
  }

  if (ctx.monthsToBreakEven !== null && ctx.monthsToBreakEven <= 18) {
    out.push({
      priority: "low",
      title: "Break-even Within Sight",
      description: `At 8% MoM MRR growth, you reach break-even in ${ctx.monthsToBreakEven} months. Focus on protecting your growth rate — any slowdown pushes this out. Consider deferring discretionary hires until after break-even.`,
    });
  } else if (ctx.monthsToBreakEven === null || ctx.monthsToBreakEven > 24) {
    out.push({
      priority: "medium",
      title: "Path to Profitability is Long",
      description: `Break-even is more than 24 months away at 8% MoM growth. Consider a 10–15% price increase or a cost reduction targeting your top 2 expense categories to compress this timeline.`,
    });
  }

  return out.slice(0, 4);
}
