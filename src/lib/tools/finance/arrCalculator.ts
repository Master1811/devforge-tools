import type { ArrInputs, ArrResult, BenchmarkItem, ActionItem, InsightLevel } from "@/types/finance-tools";
import { GROWTH_BENCHMARKS, CHURN_BENCHMARKS, getGrowthLevel } from "./benchmarks";

export function calculateArr(inputs: ArrInputs): ArrResult {
  const { currentMRR, newMRR, churnedMRR, expansionMRR } = inputs;

  const netNewMRR = newMRR + expansionMRR - churnedMRR;
  const nextMonthMRR = Math.max(0, currentMRR + netNewMRR);
  const currentARR = +(currentMRR / 100 * 12).toFixed(2); // ₹L → ₹Cr × 12
  const impliedARR = +(nextMonthMRR / 100 * 12).toFixed(2);
  const momGrowthPct = currentMRR > 0 ? +((netNewMRR / currentMRR) * 100).toFixed(2) : 0;
  const quickRatio = churnedMRR > 0 ? +((newMRR + expansionMRR) / churnedMRR).toFixed(2) : 99;

  // Churn rate from churned MRR
  const churnRatePct = currentMRR > 0 ? +((churnedMRR / currentMRR) * 100).toFixed(2) : 0;
  // Expansion rate
  const expansionRatePct = currentMRR > 0 ? +((expansionMRR / currentMRR) * 100).toFixed(2) : 0;

  const growthLevel = getGrowthLevel(momGrowthPct);
  const churnLevel: InsightLevel =
    churnRatePct <= CHURN_BENCHMARKS.excellent ? "excellent" :
    churnRatePct <= CHURN_BENCHMARKS.good ? "good" :
    churnRatePct <= CHURN_BENCHMARKS.average ? "average" :
    churnRatePct <= CHURN_BENCHMARKS.poor ? "below_average" : "critical";

  const qrLevel: InsightLevel =
    quickRatio >= 4 ? "excellent" :
    quickRatio >= 2 ? "good" :
    quickRatio >= 1.5 ? "average" :
    quickRatio >= 1 ? "below_average" : "critical";

  const expLevel: InsightLevel =
    expansionRatePct >= 10 ? "excellent" :
    expansionRatePct >= 5 ? "good" :
    expansionRatePct >= 2 ? "average" :
    expansionRatePct >= 0.5 ? "below_average" : "critical";

  const benchmarks: BenchmarkItem[] = [
    {
      metric: "MoM Growth",
      yourValue: momGrowthPct,
      unit: "%",
      topQuartile: GROWTH_BENCHMARKS.topQuartile,
      median: GROWTH_BENCHMARKS.median,
      bottomQuartile: GROWTH_BENCHMARKS.bottomQuartile,
      level: growthLevel,
      context: `T2D3 triple phase requires ${GROWTH_BENCHMARKS.t2d3Triple.toFixed(1)}% MoM`,
    },
    {
      metric: "Monthly Churn",
      yourValue: churnRatePct,
      unit: "%",
      topQuartile: CHURN_BENCHMARKS.excellent,
      median: CHURN_BENCHMARKS.average,
      bottomQuartile: CHURN_BENCHMARKS.poor,
      level: churnLevel,
      context: "Top SaaS companies keep churn below 0.5%/mo",
    },
    {
      metric: "Quick Ratio",
      yourValue: quickRatio >= 99 ? 99 : quickRatio,
      unit: "x",
      topQuartile: 4,
      median: 2,
      bottomQuartile: 1,
      level: qrLevel,
      context: "(New + Expansion) ÷ Churned MRR — >4x = world class",
    },
    {
      metric: "Expansion Revenue",
      yourValue: expansionRatePct,
      unit: "%",
      topQuartile: 10,
      median: 4,
      bottomQuartile: 1,
      level: expLevel,
      context: "% of current MRR coming from upsell/expansion",
    },
  ];

  const actions = generateArrActions(inputs, { momGrowthPct, churnRatePct, quickRatio, expansionRatePct, growthLevel, churnLevel, qrLevel });
  const overallScore = computeScore(growthLevel, churnLevel, qrLevel, expLevel);
  const overallLevel = scoreToLevel(overallScore);

  const subline = `Your ARR is ₹${currentARR}Cr. Net new MRR this month: ${netNewMRR >= 0 ? "+" : ""}₹${netNewMRR.toFixed(0)}L → implied ARR of ₹${impliedARR}Cr.`;

  return {
    currentARR,
    nextMonthMRR,
    netNewMRR,
    momGrowthPct,
    quickRatio: quickRatio >= 99 ? 99 : quickRatio,
    impliedARR,
    benchmarks,
    actions,
    overallScore,
    overallLevel,
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

function generateArrActions(
  inputs: ArrInputs,
  ctx: { momGrowthPct: number; churnRatePct: number; quickRatio: number; expansionRatePct: number; growthLevel: InsightLevel; churnLevel: InsightLevel; qrLevel: InsightLevel }
): ActionItem[] {
  const out: ActionItem[] = [];

  if (ctx.churnLevel === "critical" || ctx.churnLevel === "below_average") {
    out.push({
      priority: "high",
      title: "Fix Churn — It's Killing Compounding",
      description: `${ctx.churnRatePct}% monthly churn (~${(ctx.churnRatePct * 12).toFixed(0)}% annually) offsets your new logo momentum. For every ₹${inputs.newMRR.toFixed(0)}L you add, you lose ₹${inputs.churnedMRR.toFixed(0)}L. Implement quarterly business reviews and a proactive CS playbook.`,
    });
  }

  if (ctx.growthLevel === "critical" || ctx.growthLevel === "below_average") {
    out.push({
      priority: "high",
      title: "Grow New Logo Pipeline",
      description: `${ctx.momGrowthPct.toFixed(1)}% net MoM growth is below benchmarks. Your quick ratio of ${ctx.quickRatio.toFixed(1)}x suggests the issue is low new logo addition, not high churn. Add an outbound SDR motion or double down on PLG.`,
    });
  }

  if (ctx.expansionRatePct < 2 && inputs.currentMRR > 10) {
    out.push({
      priority: "medium",
      title: "Build an Expansion Revenue Engine",
      description: `Only ${ctx.expansionRatePct.toFixed(1)}% of MRR comes from expansion. Top-quartile SaaS companies achieve 10%+ monthly expansion. Introduce seat-based pricing, usage tiers, or an annual upsell motion.`,
    });
  }

  if (ctx.qrLevel === "excellent") {
    out.push({
      priority: "low",
      title: "Protect Your Quick Ratio at Scale",
      description: `Quick ratio of ${ctx.quickRatio.toFixed(1)}x is excellent. As you scale, new logo CAC rises and churn tends to increase. Invest in customer success infrastructure now to maintain this ratio through the ₹10Cr ARR inflection.`,
    });
  }

  return out.slice(0, 4);
}
