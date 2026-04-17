import type {
  HundredCrInputs,
  HundredCrResult,
  MonthlyProjection,
  Milestone,
  BenchmarkItem,
  ActionItem,
  InsightLevel,
} from "@/types/finance-tools";
import {
  GROWTH_BENCHMARKS,
  RUNWAY_BENCHMARKS,
  BURN_MULTIPLE_BENCHMARKS,
  CHURN_BENCHMARKS,
  getGrowthLevel,
  getRunwayLevel,
  getBurnMultipleLevel,
  getChurnLevel,
} from "./benchmarks";

const TARGET_ARR = 100; // ₹ Crores
const MAX_MONTHS = 120; // 10-year horizon

export function calculateHundredCrJourney(inputs: HundredCrInputs): HundredCrResult {
  const { currentARR, monthlyGrowthRate, burnRate, cashOnHand, churnRate } = inputs;

  const burnRateCr = burnRate / 100; // ₹L → ₹Cr
  const runway =
    burnRateCr > 0 ? Math.min(Math.floor(cashOnHand / burnRateCr), 999) : 999;

  // ── Monthly projections ──────────────────────────────────────────────────
  const projections: MonthlyProjection[] = [];
  let arr = currentARR;
  let cash = cashOnHand;
  let monthsToTarget: number | null = null;

  for (let m = 0; m <= MAX_MONTHS; m++) {
    projections.push({
      month: m,
      arr: +arr.toFixed(3),
      mrr: +(arr / 12).toFixed(3),
      cash: +Math.max(0, cash).toFixed(3),
    });
    if (arr >= TARGET_ARR && monthsToTarget === null) monthsToTarget = m;
    arr *= 1 + monthlyGrowthRate / 100;
    cash -= burnRateCr;
  }

  // ── Projected reach date ─────────────────────────────────────────────────
  let projectedReachDate: string | null = null;
  if (monthsToTarget !== null) {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToTarget);
    projectedReachDate = d.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }

  // ── Milestones ───────────────────────────────────────────────────────────
  const milestoneTargets = [1, 5, 10, 25, 50, 100];
  const milestones: Milestone[] = milestoneTargets
    .filter((t) => t >= Math.floor(currentARR))
    .map((target) => {
      const hit = projections.find((p) => p.arr >= target);
      if (!hit) {
        return {
          label: `₹${target}Cr`,
          targetARR: target,
          month: null,
          dateLabel: "Beyond 10 years",
          withinRunway: false,
        };
      }
      if (hit.month === 0) {
        return {
          label: `₹${target}Cr`,
          targetARR: target,
          month: 0,
          dateLabel: "Already reached",
          withinRunway: true,
        };
      }
      const d = new Date();
      d.setMonth(d.getMonth() + hit.month);
      return {
        label: `₹${target}Cr`,
        targetARR: target,
        month: hit.month,
        dateLabel: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        withinRunway: hit.month <= runway,
      };
    });

  // ── Derived metrics ──────────────────────────────────────────────────────
  // Net new ARR added per month at current ARR (₹Cr)
  const netNewARRPerMonth = currentARR * (monthlyGrowthRate / 100);
  const burnMultipleRaw =
    netNewARRPerMonth > 0 ? burnRateCr / netNewARRPerMonth : 99;
  const burnMultiple = +Math.min(burnMultipleRaw, 99).toFixed(2);

  // Default alive: net new MRR (ARR/12 added per month) > monthly burn
  const netNewMRRPerMonth = netNewARRPerMonth / 12;
  const isDefaultAlive = netNewMRRPerMonth >= burnRateCr;

  // ── Benchmark comparisons ────────────────────────────────────────────────
  const growthLevel = getGrowthLevel(monthlyGrowthRate);
  const runwayLevel = getRunwayLevel(runway);
  const burnLevel = getBurnMultipleLevel(burnMultiple);
  const churnLevel = getChurnLevel(churnRate);

  const benchmarks: BenchmarkItem[] = [
    {
      metric: "Monthly Growth Rate",
      yourValue: monthlyGrowthRate,
      unit: "%",
      topQuartile: GROWTH_BENCHMARKS.topQuartile,
      median: GROWTH_BENCHMARKS.median,
      bottomQuartile: GROWTH_BENCHMARKS.bottomQuartile,
      level: growthLevel,
      context: `T2D3 triple-phase requires ${GROWTH_BENCHMARKS.t2d3Triple.toFixed(1)}% MoM`,
    },
    {
      metric: "Runway",
      yourValue: runway,
      unit: " mo",
      topQuartile: RUNWAY_BENCHMARKS.excellent,
      median: RUNWAY_BENCHMARKS.good,
      bottomQuartile: RUNWAY_BENCHMARKS.average,
      level: runwayLevel,
      context: "VCs expect 18–24 months post-close",
    },
    {
      metric: "Burn Multiple",
      yourValue: burnMultiple,
      unit: "x",
      topQuartile: BURN_MULTIPLE_BENCHMARKS.excellent,
      median: BURN_MULTIPLE_BENCHMARKS.average,
      bottomQuartile: BURN_MULTIPLE_BENCHMARKS.poor,
      level: burnLevel,
      context: "Burn per ₹1 of Net New ARR (lower = better)",
    },
    {
      metric: "Monthly Churn",
      yourValue: churnRate,
      unit: "%",
      topQuartile: CHURN_BENCHMARKS.excellent,
      median: CHURN_BENCHMARKS.average,
      bottomQuartile: CHURN_BENCHMARKS.poor,
      level: churnLevel,
      context: "Best-in-class SaaS keeps churn below 0.5%/mo",
    },
  ];

  // ── Actionable insights ──────────────────────────────────────────────────
  const actions = generateActions(inputs, {
    runway,
    burnMultiple,
    isDefaultAlive,
    growthLevel,
    runwayLevel,
    burnLevel,
    churnLevel,
    monthsToTarget,
  });

  // ── Overall score (each metric contributes 25 pts) ───────────────────────
  const overallScore = computeScore(growthLevel, runwayLevel, burnLevel, churnLevel);
  const overallLevel = scoreToLevel(overallScore);

  return {
    monthsToTarget,
    projectedReachDate,
    runway,
    isDefaultAlive,
    burnMultiple,
    projections,
    milestones,
    benchmarks,
    actions,
    overallScore,
    overallLevel,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function levelPoints(l: InsightLevel): number {
  return { excellent: 25, good: 20, average: 13, below_average: 7, critical: 2 }[l];
}

function computeScore(...levels: InsightLevel[]): number {
  return levels.reduce((s, l) => s + levelPoints(l), 0);
}

function scoreToLevel(score: number): InsightLevel {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "average";
  if (score >= 25) return "below_average";
  return "critical";
}

function minGrowthRateFor100Cr(currentARR: number): string {
  // currentARR * (1+r)^120 >= 100  →  r = (100/currentARR)^(1/120) - 1
  const r = Math.pow(100 / Math.max(currentARR, 0.01), 1 / 120) - 1;
  return (r * 100).toFixed(1);
}

function generateActions(
  inputs: HundredCrInputs,
  ctx: {
    runway: number;
    burnMultiple: number;
    isDefaultAlive: boolean;
    growthLevel: InsightLevel;
    runwayLevel: InsightLevel;
    burnLevel: InsightLevel;
    churnLevel: InsightLevel;
    monthsToTarget: number | null;
  }
): ActionItem[] {
  const out: ActionItem[] = [];

  if (ctx.runwayLevel === "critical" || ctx.runwayLevel === "below_average") {
    const needed = Math.max(
      0,
      inputs.burnRate - (inputs.cashOnHand * 100) / 18
    ).toFixed(0);
    out.push({
      priority: "high",
      title: "Extend Runway Immediately",
      description: `Your ${ctx.runway}-month runway is dangerously short. Cut monthly burn by ₹${needed}L or bridge-raise within 30 days to reach 18 months of capital.`,
    });
  }

  if (ctx.churnLevel === "below_average" || ctx.churnLevel === "critical") {
    const annualLoss = (inputs.churnRate * 12).toFixed(0);
    out.push({
      priority: "high",
      title: "Fix Churn Before Scaling Acquisition",
      description: `${inputs.churnRate}% monthly churn erodes ~${annualLoss}% of ARR annually. Plug the leaky bucket first — invest in customer success and quarterly business reviews before adding sales headcount.`,
    });
  }

  if (ctx.growthLevel === "critical" || ctx.growthLevel === "below_average") {
    const gap = (GROWTH_BENCHMARKS.median - inputs.monthlyGrowthRate).toFixed(1);
    out.push({
      priority: "high",
      title: "Accelerate Growth Rate",
      description: `Your ${inputs.monthlyGrowthRate}% MoM growth is below the SaaS median of ${GROWTH_BENCHMARKS.median}%. Close the ${gap}% gap via a 10–15% price increase, outbound SDR motion, or a new ICP expansion.`,
    });
  }

  if (ctx.burnLevel === "below_average" || ctx.burnLevel === "critical") {
    out.push({
      priority: "medium",
      title: "Improve Capital Efficiency",
      description: `Burn multiple of ${ctx.burnMultiple}x means you spend ₹${ctx.burnMultiple} per ₹1 of Net New ARR. Top-quartile companies hit <1x. Reduce CAC or increase ARPU by 20–30% through expansion revenue and upsell tracks.`,
    });
  }

  if (!ctx.isDefaultAlive && out.length < 3) {
    out.push({
      priority: "medium",
      title: "Path to Default Alive",
      description: `Revenue growth doesn't yet cover burn. Becoming default alive requires either reducing monthly burn below ₹${(inputs.currentARR * (inputs.monthlyGrowthRate / 100) / 12 * 100).toFixed(0)}L or boosting net new MRR to match it.`,
    });
  }

  if (ctx.growthLevel === "excellent" || ctx.growthLevel === "good") {
    out.push({
      priority: "low",
      title: "Protect Growth Rate at Scale",
      description: `Your ${inputs.monthlyGrowthRate}% MoM growth is top-quartile. Growth decelerates naturally as ARR scales. Invest now in channel partnerships, a PLG motion, and a dedicated expansion revenue track to sustain momentum.`,
    });
  }

  if (ctx.monthsToTarget === null) {
    out.push({
      priority: "high",
      title: "₹100Cr is Out of Reach at Current Trajectory",
      description: `At ${inputs.monthlyGrowthRate}% MoM from ₹${inputs.currentARR}Cr, the target won't be reached in 10 years. You need at least ${minGrowthRateFor100Cr(inputs.currentARR)}% MoM to get there within that window.`,
    });
  } else if (ctx.monthsToTarget > 60 && out.length < 4) {
    const yrs = (ctx.monthsToTarget / 12).toFixed(1);
    out.push({
      priority: "medium",
      title: "Compress the Timeline",
      description: `Current path reaches ₹100Cr in ${yrs} years. To compress to <5 years you need >${GROWTH_BENCHMARKS.topQuartile}% MoM. Try pricing power, expansion ARR from existing customers, or a PLG-assisted sales motion.`,
    });
  }

  return out.slice(0, 4);
}
