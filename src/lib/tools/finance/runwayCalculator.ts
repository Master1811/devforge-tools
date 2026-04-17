import type { RunwayInputs, RunwayResult, MonthlyProjection, BenchmarkItem, ActionItem, InsightLevel } from "@/types/finance-tools";
import { RUNWAY_BENCHMARKS, BURN_MULTIPLE_BENCHMARKS, getRunwayLevel } from "./benchmarks";

const MAX_MONTHS = 60;

export function calculateRunway(inputs: RunwayInputs): RunwayResult {
  const { cashOnHand, grossBurnRate, currentMRR, mrrGrowthRate } = inputs;

  const netBurn = Math.max(0, grossBurnRate - currentMRR); // ₹L/mo
  const netBurnCr = netBurn / 100;                         // ₹Cr/mo
  const runway = netBurnCr > 0 ? Math.min(Math.floor((cashOnHand * 100) / netBurn), 999) : 999;

  // Monthly projections
  const projections: MonthlyProjection[] = [];
  let mrr = currentMRR;   // ₹L
  let cash = cashOnHand;  // ₹Cr
  let breakEvenMonth: number | null = null;

  for (let m = 0; m <= MAX_MONTHS; m++) {
    const nb = Math.max(0, grossBurnRate - mrr) / 100; // net burn ₹Cr this month
    projections.push({
      month: m,
      mrr: +(mrr / 100).toFixed(3),   // store in ₹Cr for chart
      cash: +Math.max(0, cash).toFixed(3),
      netBurn: +nb.toFixed(3),
    });
    if (mrr >= grossBurnRate && breakEvenMonth === null) breakEvenMonth = m;
    mrr *= 1 + mrrGrowthRate / 100;
    cash -= nb;
  }

  const isDefaultAlive = mrrGrowthRate > 0 && (breakEvenMonth !== null && breakEvenMonth <= 60);
  const burnMultiple = currentMRR > 0 ? grossBurnRate / currentMRR : 99;

  const runwayLevel = getRunwayLevel(runway);
  const burnLevel: InsightLevel =
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.excellent ? "excellent" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.good ? "good" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.average ? "average" :
    burnMultiple <= BURN_MULTIPLE_BENCHMARKS.poor ? "below_average" : "critical";

  const netRevenueRatio = grossBurnRate > 0 ? currentMRR / grossBurnRate : 0;
  const nrrLevel: InsightLevel =
    netRevenueRatio >= 1 ? "excellent" :
    netRevenueRatio >= 0.7 ? "good" :
    netRevenueRatio >= 0.4 ? "average" :
    netRevenueRatio >= 0.2 ? "below_average" : "critical";

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
      metric: "Revenue Coverage",
      yourValue: +(netRevenueRatio * 100).toFixed(0),
      unit: "%",
      topQuartile: 100,
      median: 50,
      bottomQuartile: 20,
      level: nrrLevel,
      context: "MRR as % of gross burn — 100% = break-even",
    },
    {
      metric: "Gross Burn",
      yourValue: grossBurnRate,
      unit: "L",
      topQuartile: 20,
      median: 50,
      bottomQuartile: 100,
      level: burnLevel,
      context: "Total monthly spend (₹ Lakhs)",
    },
    {
      metric: "Net Burn",
      yourValue: netBurn,
      unit: "L",
      topQuartile: 0,
      median: 30,
      bottomQuartile: 80,
      level: netBurn === 0 ? "excellent" : netBurn < 20 ? "good" : netBurn < 50 ? "average" : netBurn < 100 ? "below_average" : "critical",
      context: "Gross burn minus MRR — path to zero = default alive",
    },
  ];

  const actions = generateRunwayActions(inputs, { runway, netBurn, breakEvenMonth, isDefaultAlive, burnMultiple, runwayLevel });
  const overallScore = computeScore(runwayLevel, burnLevel, nrrLevel);
  const overallLevel = scoreToLevel(overallScore);

  const subline = breakEvenMonth !== null
    ? `You'll reach break-even in month ${breakEvenMonth}${runway < 999 ? `, with runway of ${runway} months` : ""}.`
    : runway < 999
    ? `Runway: ${runway} months. Revenue does not reach break-even within the 5-year window at current growth.`
    : "Unlimited runway — revenue covers all costs.";

  return {
    runway,
    netBurn,
    grossBurn: grossBurnRate,
    breakEvenMonth,
    isDefaultAlive,
    projections,
    benchmarks,
    actions,
    overallScore,
    overallLevel,
    subline,
  };
}

function computeScore(...levels: InsightLevel[]): number {
  const pts = { excellent: 25, good: 20, average: 13, below_average: 7, critical: 2 };
  const total = levels.reduce((s, l) => s + pts[l], 0);
  return Math.round((total / (levels.length * 25)) * 100);
}

function scoreToLevel(s: number): InsightLevel {
  if (s >= 85) return "excellent";
  if (s >= 65) return "good";
  if (s >= 45) return "average";
  if (s >= 25) return "below_average";
  return "critical";
}

function generateRunwayActions(
  inputs: RunwayInputs,
  ctx: { runway: number; netBurn: number; breakEvenMonth: number | null; isDefaultAlive: boolean; burnMultiple: number; runwayLevel: InsightLevel }
): ActionItem[] {
  const out: ActionItem[] = [];

  if (ctx.runwayLevel === "critical") {
    out.push({
      priority: "high",
      title: "Raise Capital or Cut Burn Immediately",
      description: `Your ${ctx.runway}-month runway is critical. Cut monthly burn by ₹${Math.max(0, inputs.grossBurnRate - (inputs.cashOnHand * 100) / 18).toFixed(0)}L to reach 18 months, or initiate a bridge round within 30 days.`,
    });
  }

  if (ctx.runwayLevel === "below_average") {
    out.push({
      priority: "high",
      title: "Plan Your Next Round Now",
      description: `${ctx.runway} months of runway is below the 18-month VC benchmark. Begin fundraising conversations immediately — rounds take 3–6 months to close.`,
    });
  }

  if (!ctx.isDefaultAlive) {
    const gapL = (inputs.grossBurnRate - inputs.currentMRR).toFixed(0);
    out.push({
      priority: "medium",
      title: "Path to Default Alive",
      description: `You need ₹${gapL}L more MRR to cover gross burn. At ${inputs.mrrGrowthRate}% MoM growth, this gap closes in ${Math.ceil(Math.log(inputs.grossBurnRate / Math.max(inputs.currentMRR, 1)) / Math.log(1 + inputs.mrrGrowthRate / 100))} months.`,
    });
  }

  if (ctx.burnMultiple > BURN_MULTIPLE_BENCHMARKS.poor) {
    out.push({
      priority: "medium",
      title: "Reduce Burn Multiple",
      description: `Gross-to-revenue ratio of ${ctx.burnMultiple.toFixed(1)}x is unsustainable. Focus on unit economics: increase pricing by 15–20% or cut non-essential headcount to improve the ratio below 2.5x.`,
    });
  }

  if (ctx.isDefaultAlive && ctx.breakEvenMonth !== null) {
    out.push({
      priority: "low",
      title: "Protect Default-Alive Status",
      description: `You reach break-even in month ${ctx.breakEvenMonth}. Guard your MRR growth rate — any churn spike or growth slowdown can push break-even out significantly.`,
    });
  }

  return out.slice(0, 4);
}
