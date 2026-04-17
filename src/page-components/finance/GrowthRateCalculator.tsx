"use client";

import { useMemo } from "react";
import FinanceToolLayout from "@/components/finance/FinanceToolLayout";
import FinanceInputRow from "@/components/finance/FinanceInputRow";
import FinanceChart from "@/components/finance/FinanceChart";
import { useClientScenarioSync } from "@/hooks/useClientScenarioSync";
import { calculateGrowthRate } from "@/lib/tools/finance/growthRateCalculator";
import type { GrowthRateInputs, SummaryCardDef } from "@/types/finance-tools";
import { TrendingUp, Clock, BarChart3, Zap } from "lucide-react";

const DEFAULTS: GrowthRateInputs = {
  startARR: 1,
  endARR: 3,
  periodMonths: 12,
};

const EXAMPLE_INPUTS: GrowthRateInputs = {
  startARR: 2,
  endARR: 6,
  periodMonths: 12,
};

export default function GrowthRateCalculatorPage() {
  const sync = useClientScenarioSync<GrowthRateInputs>(DEFAULTS, "growth-rate");
  const { inputs, patchInput } = sync;
  const result = useMemo(() => calculateGrowthRate(inputs), [inputs]);

  const summaryCards: SummaryCardDef[] = [
    {
      label: "MoM Growth",
      value: `${result.momGrowthPct}%`,
      rawValue: result.momGrowthPct,
      sub: "Monthly growth rate",
      icon: TrendingUp,
      accent: result.momGrowthPct >= 10 ? "green" : result.momGrowthPct >= 7 ? "blue" : result.momGrowthPct >= 3 ? "yellow" : "red",
    },
    {
      label: "YoY / CAGR",
      value: `${result.yoyGrowthPct.toFixed(0)}%`,
      rawValue: result.yoyGrowthPct,
      sub: result.yoyGrowthPct >= 100 ? "T2D3 territory" : "Annual growth rate",
      icon: BarChart3,
      accent: result.yoyGrowthPct >= 200 ? "green" : result.yoyGrowthPct >= 100 ? "blue" : "yellow",
    },
    {
      label: "Doubling Time",
      value: result.doublingTimeMonths ? `${result.doublingTimeMonths}mo` : "∞",
      rawValue: result.doublingTimeMonths ?? undefined,
      sub: "Months to 2× ARR",
      icon: Zap,
      accent: result.doublingTimeMonths && result.doublingTimeMonths <= 8 ? "green" : result.doublingTimeMonths && result.doublingTimeMonths <= 14 ? "blue" : "yellow",
    },
    {
      label: "To ₹100Cr",
      value: result.monthsTo100Cr ? `${result.monthsTo100Cr}mo` : ">10yr",
      rawValue: result.monthsTo100Cr ?? undefined,
      sub: result.projectedDate100Cr ?? "Not in 10 years",
      icon: Clock,
      accent: result.monthsTo100Cr && result.monthsTo100Cr <= 36 ? "green" : result.monthsTo100Cr && result.monthsTo100Cr <= 60 ? "blue" : "yellow",
    },
  ];

  // Projection chart — forward-extrapolate from endARR
  const chartData = useMemo(
    () =>
      result.projections
        .filter((p) => p.month % 6 === 0)
        .map((p) => ({
          label: p.month === 0 ? "Now" : `Y${Math.floor(p.month / 12)}${p.month % 12 ? "M" + (p.month % 12) : ""}`,
          arr: p.arr ?? 0,
        })),
    [result.projections]
  );

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
      title="Growth Rate Calculator"
      slug="tools/finance/growth-rate-calculator"
      description="Calculate MoM growth, YoY, CAGR, and doubling time from any two ARR data points. Compare against T2D3 benchmarks and project your path to ₹100Cr ARR."
      keywords={["growth rate calculator India", "SaaS MoM growth", "CAGR calculator startup", "T2D3 calculator", "ARR growth rate", "doubling time calculator"]}
      howToUse={[
        "Enter your starting ARR (₹ Crores) — this can be any past reference point.",
        "Enter your ending ARR — your current ARR or a future target.",
        "Set the period in months between the two data points.",
        "The calculator derives your implied MoM growth, YoY, CAGR, and doubling time.",
        "The Insight Engine benchmarks you against T2D3 phases and top-quartile SaaS standards.",
      ]}
      whatIs={{
        title: "How to Calculate SaaS Growth Rate",
        content: "Monthly Growth Rate (MoM) = (End ARR / Start ARR)^(1/months) − 1. Annual growth (YoY) = (1 + MoM)^12 − 1. CAGR is the same as YoY for monthly compound growth. Doubling time = log(2) / log(1 + MoM). The T2D3 model — Triple Triple Double Double Double — maps MoM rates: Triple phase requires ~9.6% MoM, Double phase requires ~5.9% MoM. Knowing your MoM rate tells you exactly where you sit on the T2D3 curve.",
      }}
      faqs={[
        { q: "What is T2D3 and how does it apply to Indian SaaS?", a: "T2D3 (Triple Triple Double Double Double) is a growth model for B2B SaaS companies going from ~$1M to $100M ARR. It applies globally. Indian SaaS companies like Freshworks and Chargebee broadly followed this model. It requires ~9.6% MoM for the triple phases and ~5.9% MoM for the double phases." },
        { q: "What's the difference between MoM and CAGR?", a: "MoM (month-over-month) is the monthly compounding growth rate. CAGR (Compound Annual Growth Rate) is the equivalent annualised rate. They describe the same growth curve at different timescales. For SaaS, MoM is more useful operationally; CAGR is used in investor narratives." },
        { q: "How do I use this to plan my fundraise?", a: "Your growth rate determines your valuation multiple. VCs typically apply 8–15× ARR for companies growing >100% YoY, 4–8× for 50–100% YoY, and <4× for slower growth. Input your current and projected ARR to understand what narrative you can credibly present." },
        { q: "What MoM growth rate do I need to reach ₹100Cr?", a: "It depends on your starting ARR. From ₹1Cr, you need 9.6% MoM to reach ₹100Cr in ~5 years (T2D3 triple phase). From ₹5Cr, you need 7.4% MoM. From ₹10Cr, 5.9% MoM (T2D3 double phase). Use the ₹100Cr Journey Calculator for the full model." },
      ]}
      relatedTools={[
        { name: "Runway Calculator", path: "/tools/finance/runway-calculator", description: "Check if your cash can support this growth pace long enough." },
        { name: "₹100Cr Journey", path: "/tools/finance/100cr-calculator", description: "Use this growth rate to map your path to ₹100Cr ARR." },
        { name: "Burn Rate Calculator", path: "/tools/finance/burn-rate-calculator", description: "Compare growth with spending efficiency before scaling harder." },
      ]}
      summaryCards={summaryCards}
      insightData={result}
      onLoadExample={() => sync.setInputs(EXAMPLE_INPUTS)}
      scenarioControls={scenarioControls}
      inputs={
        <>
          <FinanceInputRow label="Starting ARR (where your revenue began)" value={inputs.startARR} min={0.1} max={100} step={0.1} prefix="₹" unit="Cr" description="ARR at the start of the period" onChange={(v) => patchInput("startARR", v)} />
          <FinanceInputRow label="Ending ARR (where your revenue is now)" value={inputs.endARR} min={0.2} max={500} step={0.1} prefix="₹" unit="Cr" description="ARR at the end of the period (current)" onChange={(v) => patchInput("endARR", v)} />
          <FinanceInputRow label="Period (number of months between both ARR points)" value={inputs.periodMonths} min={1} max={60} step={1} unit=" months" description="Duration between the two data points" onChange={(v) => patchInput("periodMonths", v)} />

          {/* T2D3 phase badge */}
          {result.t2d3Phase !== "N/A" && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
              <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                T2D3 Classification
              </p>
              <p className="text-[13px] font-semibold text-primary">{result.t2d3Phase}</p>
            </div>
          )}
        </>
      }
      outputs={
        <FinanceChart
          title="ARR Projection (10-year extrapolation)"
          data={chartData}
          xDataKey="label"
          series={[
            { dataKey: "arr", name: "ARR (₹Cr)", colorVar: "primary", filled: true },
          ]}
          yTickFormatter={(v) => `₹${v}Cr`}
          referenceLines={[
            { axis: "y", value: 100, label: "₹100Cr", colorVar: "accent" },
          ]}
        />
      }
    />
  );
}
