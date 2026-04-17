"use client";

import { useMemo } from "react";
import FinanceToolLayout from "@/components/finance/FinanceToolLayout";
import FinanceInputRow from "@/components/finance/FinanceInputRow";
import FinanceChart from "@/components/finance/FinanceChart";
import { useClientScenarioSync } from "@/hooks/useClientScenarioSync";
import { calculateRunway } from "@/lib/tools/finance/runwayCalculator";
import type { RunwayInputs, SummaryCardDef } from "@/types/finance-tools";
import { Clock, Flame, TrendingDown, CheckCircle2 } from "lucide-react";

const DEFAULTS: RunwayInputs = {
  cashOnHand: 5,
  grossBurnRate: 30,
  currentMRR: 10,
  mrrGrowthRate: 8,
};

export default function RunwayCalculatorPage() {
  const sync = useClientScenarioSync<RunwayInputs>(DEFAULTS, "runway");
  const { inputs, patchInput } = sync;
  const result = useMemo(() => calculateRunway(inputs), [inputs]);

  const runwayAccent: SummaryCardDef["accent"] =
    result.runway >= 18 ? "green" : result.runway >= 9 ? "yellow" : "red";

  const summaryCards: SummaryCardDef[] = [
    {
      label: "Runway",
      value: result.runway >= 999 ? "∞" : `${result.runway}mo`,
      sub: result.runway < 9 ? "Raise immediately" : result.runway < 18 ? "Plan round now" : "Healthy",
      icon: Clock,
      accent: runwayAccent,
    },
    {
      label: "Net Burn",
      value: `₹${result.netBurn}L/mo`,
      sub: result.netBurn === 0 ? "Break-even!" : "Cash out per month",
      icon: Flame,
      accent: result.netBurn === 0 ? "green" : result.netBurn < 30 ? "yellow" : "red",
    },
    {
      label: "Break-even",
      value: result.breakEvenMonth !== null ? `Mo ${result.breakEvenMonth}` : "No",
      sub: result.breakEvenMonth !== null ? `At ${inputs.mrrGrowthRate}% MoM growth` : "Not within 5 years",
      icon: TrendingDown,
      accent: result.breakEvenMonth !== null && result.breakEvenMonth <= 18 ? "green" : "yellow",
    },
    {
      label: "Default Alive",
      value: result.isDefaultAlive ? "Yes" : "No",
      sub: result.isDefaultAlive ? "Revenue > burn trajectory" : "Needs fundraising",
      icon: CheckCircle2,
      accent: result.isDefaultAlive ? "green" : "red",
    },
  ];

  // Chart: downsample to every 3 months
  const chartData = useMemo(
    () =>
      result.projections
        .filter((p) => p.month % 3 === 0)
        .map((p) => ({
          label: p.month === 0 ? "Now" : `M${p.month}`,
          mrr: p.mrr ?? 0,
          cash: p.cash ?? 0,
        })),
    [result.projections]
  );

  const runwayRefLine = useMemo(() => {
    if (result.runway >= 60) return undefined;
    const snap = result.projections.find((p) => p.month >= result.runway);
    if (!snap) return undefined;
    const rounded = Math.round(snap.month / 3) * 3;
    return chartData.find((c) => c.label === `M${rounded}`)?.label;
  }, [result.runway, result.projections, chartData]);

  const scenarioControls = {
    savedScenarios: sync.savedScenarios,
    onSave: sync.saveScenario,
    onLoad: sync.loadScenario,
    onDelete: sync.deleteScenario,
    onShare: sync.getShareableUrl,
    onReset: sync.reset,
  };

  return (
    <FinanceToolLayout
      title="Startup Runway Calculator"
      slug="tools/finance/runway-calculator"
      description="Calculate your exact cash runway. See break-even month, net burn analysis, and benchmark your runway against top-quartile SaaS standards — fully client-side."
      keywords={["startup runway calculator", "cash runway calculator India", "net burn rate", "break-even calculator", "default alive calculator", "startup finance tool"]}
      howToUse={[
        "Enter total cash on hand in ₹ Crores.",
        "Set your gross monthly burn (all expenses) in ₹ Lakhs.",
        "Enter your current Monthly Recurring Revenue in ₹ Lakhs.",
        "Set your expected MRR growth rate to see break-even projections.",
        "Read the Insight Engine for benchmark comparisons and actionable recommendations.",
      ]}
      whatIs={{
        title: "What is Startup Runway?",
        content: "Runway is the number of months your startup can operate before running out of cash, given your current net burn rate. Net burn = gross expenses minus MRR. A healthy runway (18–24 months) gives you time to grow, hire, and fundraise without pressure. 'Default alive' means your MRR growth trajectory will cover burn before cash runs out — the gold standard for early-stage startups.",
      }}
      faqs={[
        { q: "What is a safe runway for a startup?", a: "VCs typically want to see 18–24 months of runway post-funding. Anything below 9 months is critical — fundraising takes 3–6 months on average." },
        { q: "What does 'default alive' mean?", a: "A startup is default alive when its revenue growth will cover burn before cash runs out, even without raising more capital. Paul Graham (YC) considers this the most important early-stage metric." },
        { q: "What is net burn vs gross burn?", a: "Gross burn is total monthly expenses. Net burn is gross burn minus MRR. A startup with ₹50L gross burn and ₹30L MRR has ₹20L net burn. This is what actually depletes your cash." },
        { q: "How do I extend my runway?", a: "Three levers: cut costs (fastest), grow revenue (best), or raise capital (most dilutive). Most efficient path is cutting non-revenue-generating expenses first, then accelerating sales motions." },
      ]}
      relatedTools={[
        { name: "₹100Cr Journey", path: "/tools/finance/100cr-calculator", description: "Project your path to ₹100Cr ARR with T2D3 benchmarks." },
        { name: "Burn Rate Calculator", path: "/tools/finance/burn-rate-calculator", description: "Break down where your money is going by category." },
        { name: "ARR / MRR Calculator", path: "/tools/finance/arr-calculator", description: "Decompose MRR into new, expansion, and churned revenue." },
      ]}
      summaryCards={summaryCards}
      insightData={result}
      scenarioControls={scenarioControls}
      inputs={
        <>
          <FinanceInputRow label="Cash on Hand" value={inputs.cashOnHand} min={0.5} max={200} step={0.5} prefix="₹" unit="Cr" description="Total cash in bank today" onChange={(v) => patchInput("cashOnHand", v)} />
          <FinanceInputRow label="Gross Burn Rate" value={inputs.grossBurnRate} min={1} max={500} step={1} prefix="₹" unit="L/mo" description="Total monthly expenses (all-in)" onChange={(v) => patchInput("grossBurnRate", v)} />
          <FinanceInputRow label="Current MRR" value={inputs.currentMRR} min={0} max={500} step={1} prefix="₹" unit="L/mo" description="Monthly Recurring Revenue today" onChange={(v) => patchInput("currentMRR", v)} />
          <FinanceInputRow label="MRR Growth Rate" value={inputs.mrrGrowthRate} min={0} max={30} step={0.5} unit="% MoM" description="Expected MoM MRR growth (for break-even projection)" onChange={(v) => patchInput("mrrGrowthRate", v)} />
        </>
      }
      outputs={
        <FinanceChart
          title="Cash & MRR Projection (5-year)"
          data={chartData}
          xDataKey="label"
          series={[
            { dataKey: "cash", name: "Cash (₹Cr)", colorVar: "primary", filled: true },
            { dataKey: "mrr", name: "MRR (₹Cr)", colorVar: "accent", filled: false, dashed: true },
          ]}
          yTickFormatter={(v) => `₹${v}Cr`}
          referenceLines={[
            ...(runwayRefLine ? [{ axis: "x" as const, value: runwayRefLine, label: "Runway ends", colorVar: "destructive" as const }] : []),
          ]}
        />
      }
    />
  );
}
