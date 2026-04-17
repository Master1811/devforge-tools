"use client";

import { useMemo } from "react";
import FinanceToolLayout from "@/components/finance/FinanceToolLayout";
import FinanceInputRow from "@/components/finance/FinanceInputRow";
import FinanceChart from "@/components/finance/FinanceChart";
import { useClientScenarioSync } from "@/hooks/useClientScenarioSync";
import { calculateArr } from "@/lib/tools/finance/arrCalculator";
import type { ArrInputs, SummaryCardDef } from "@/types/finance-tools";
import { TrendingUp, Zap, BarChart3, ArrowUpRight } from "lucide-react";

const DEFAULTS: ArrInputs = {
  currentMRR: 20,
  newMRR: 4,
  churnedMRR: 1,
  expansionMRR: 1,
};

const EXAMPLE_INPUTS: ArrInputs = {
  currentMRR: 35,
  newMRR: 6,
  churnedMRR: 1.8,
  expansionMRR: 2.4,
};

export default function ArrCalculatorPage() {
  const sync = useClientScenarioSync<ArrInputs>(DEFAULTS, "arr");
  const { inputs, patchInput } = sync;
  const result = useMemo(() => calculateArr(inputs), [inputs]);

  const summaryCards: SummaryCardDef[] = [
    {
      label: "Current ARR",
      value: `₹${result.currentARR}Cr`,
      rawValue: result.currentARR,
      sub: `₹${inputs.currentMRR}L MRR`,
      icon: TrendingUp,
      accent: "blue",
    },
    {
      label: "Net New MRR",
      value: `${result.netNewMRR >= 0 ? "+" : ""}₹${result.netNewMRR.toFixed(0)}L`,
      rawValue: result.netNewMRR,
      sub: `${result.momGrowthPct >= 0 ? "+" : ""}${result.momGrowthPct}% MoM`,
      icon: Zap,
      accent: result.momGrowthPct >= 7 ? "green" : result.momGrowthPct >= 3 ? "yellow" : "red",
    },
    {
      label: "Quick Ratio",
      value: result.quickRatio >= 99 ? "∞" : `${result.quickRatio}x`,
      rawValue: result.quickRatio >= 99 ? undefined : result.quickRatio,
      sub: "(New + Exp) ÷ Churn",
      icon: BarChart3,
      accent: result.quickRatio >= 4 ? "green" : result.quickRatio >= 2 ? "yellow" : "red",
    },
    {
      label: "Implied ARR",
      value: `₹${result.impliedARR}Cr`,
      rawValue: result.impliedARR,
      sub: "Next month × 12",
      icon: ArrowUpRight,
      accent: result.impliedARR > result.currentARR ? "green" : "red",
    },
  ];

  // Waterfall bar data: new, expansion, churn visualisation
  const waterfallData = [
    { label: "Starting MRR", mrr: inputs.currentMRR / 100 },
    { label: "+ New Logos", mrr: (inputs.currentMRR + inputs.newMRR) / 100 },
    { label: "+ Expansion", mrr: (inputs.currentMRR + inputs.newMRR + inputs.expansionMRR) / 100 },
    { label: "− Churn", mrr: (inputs.currentMRR + inputs.newMRR + inputs.expansionMRR - inputs.churnedMRR) / 100 },
  ];

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
      title="ARR / MRR Calculator"
      slug="tools/finance/arr-calculator"
      description="Decompose your MRR into new logos, expansion, and churn. Calculate ARR, Quick Ratio, and benchmark against top SaaS — instant, no signup."
      keywords={["ARR calculator India", "MRR calculator", "SaaS quick ratio", "net new MRR", "annual recurring revenue calculator", "churn MRR"]}
      howToUse={[
        "Enter your current MRR in ₹ Lakhs.",
        "Add new logo MRR — revenue from new customers this month.",
        "Enter churned MRR — revenue lost from cancelled customers.",
        "Add expansion MRR — upsells and seat expansions from existing customers.",
        "The Insight Engine benchmarks your Quick Ratio and growth against top SaaS standards.",
      ]}
      whatIs={{
        title: "What is ARR and How is it Calculated?",
        content: "Annual Recurring Revenue (ARR) = MRR × 12. Net New MRR = New Logos + Expansion − Churn. Quick Ratio = (New + Expansion) ÷ Churn — a ratio above 4x is world-class. The MRR waterfall decomposition is the gold standard for understanding revenue quality: a startup with high new logo MRR but high churn is on a treadmill; one with strong expansion and low churn is compounding.",
      }}
      faqs={[
        { q: "What is a good Quick Ratio for SaaS?", a: "4x or above is world-class (Slack, Notion). 2x is good. Below 1x means you're losing more than you're adding — a growth emergency." },
        { q: "What is expansion MRR?", a: "Revenue from existing customers upgrading, buying more seats, or using more of your product. The best SaaS companies generate 20%+ of growth from expansion alone, with near-zero CAC." },
        { q: "How is ARR different from revenue?", a: "ARR represents the annualised value of recurring contracts. It excludes one-time fees. GAAP revenue recognizes it over time. ARR is the startup's forward-looking health signal; revenue is the accounting reality." },
        { q: "What does Net Revenue Retention (NRR) tell me?", a: "NRR = (starting MRR + expansion − churn) / starting MRR. Above 100% means existing customers are growing their spend — the most capital-efficient growth possible. Top companies achieve 120–140% NRR." },
      ]}
      relatedTools={[
        { name: "Growth Rate Calculator", path: "/tools/finance/growth-rate-calculator", description: "See how fast this revenue base needs to grow month over month." },
        { name: "Runway Calculator", path: "/tools/finance/runway-calculator", description: "Check if your current cash can sustain this growth pace." },
        { name: "Burn Rate Calculator", path: "/tools/finance/burn-rate-calculator", description: "Understand whether spending is efficient for your ARR trajectory." },
      ]}
      summaryCards={summaryCards}
      insightData={result}
      onLoadExample={() => sync.setInputs(EXAMPLE_INPUTS)}
      scenarioControls={scenarioControls}
      inputs={
        <>
          <FinanceInputRow label="Current MRR (your recurring monthly revenue now)" value={inputs.currentMRR} min={0.1} max={500} step={0.5} prefix="₹" unit="L/mo" description="Total MRR today" onChange={(v) => patchInput("currentMRR", v)} />
          <FinanceInputRow label="New Logo MRR (revenue from new customers)" value={inputs.newMRR} min={0} max={200} step={0.5} prefix="₹" unit="L/mo" description="MRR from brand-new customers this month" onChange={(v) => patchInput("newMRR", v)} />
          <FinanceInputRow label="Churned MRR (revenue lost from cancellations)" value={inputs.churnedMRR} min={0} max={100} step={0.1} prefix="₹" unit="L/mo" description="MRR lost from cancellations" onChange={(v) => patchInput("churnedMRR", v)} />
          <FinanceInputRow label="Expansion MRR (upsell from existing customers)" value={inputs.expansionMRR} min={0} max={100} step={0.1} prefix="₹" unit="L/mo" description="Upsell + seat expansion from existing customers" onChange={(v) => patchInput("expansionMRR", v)} />
        </>
      }
      outputs={
        <FinanceChart
          title="MRR Waterfall"
          data={waterfallData}
          xDataKey="label"
          series={[{ dataKey: "mrr", name: "MRR (₹Cr)", colorVar: "primary", filled: true }]}
          yTickFormatter={(v) => `₹${(v * 100).toFixed(0)}L`}
          height={200}
        />
      }
    />
  );
}
