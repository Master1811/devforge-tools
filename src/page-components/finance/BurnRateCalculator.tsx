"use client";

import { useMemo } from "react";
import FinanceToolLayout from "@/components/finance/FinanceToolLayout";
import FinanceInputRow from "@/components/finance/FinanceInputRow";
import FinanceChart from "@/components/finance/FinanceChart";
import { useClientScenarioSync } from "@/hooks/useClientScenarioSync";
import { calculateBurnRate } from "@/lib/tools/finance/burnRateCalculator";
import type { BurnRateInputs, SummaryCardDef } from "@/types/finance-tools";
import { Flame, Clock, BarChart3, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULTS: BurnRateInputs = {
  salaries: 20,
  infrastructure: 3,
  marketing: 4,
  operations: 2,
  other: 1,
  currentMRR: 10,
  cashOnHand: 5,
};

const EXAMPLE_INPUTS: BurnRateInputs = {
  salaries: 28,
  infrastructure: 4,
  marketing: 6,
  operations: 3,
  other: 1.5,
  currentMRR: 14,
  cashOnHand: 7,
};

export default function BurnRateCalculatorPage() {
  const sync = useClientScenarioSync<BurnRateInputs>(DEFAULTS, "burn-rate");
  const { inputs, patchInput } = sync;
  const result = useMemo(() => calculateBurnRate(inputs), [inputs]);

  const summaryCards: SummaryCardDef[] = [
    {
      label: "Gross Burn",
      value: `₹${result.grossBurn}L/mo`,
      rawValue: result.grossBurn,
      sub: "All-in monthly spend",
      icon: Flame,
      accent: result.grossBurn < 30 ? "green" : result.grossBurn < 80 ? "yellow" : "red",
    },
    {
      label: "Net Burn",
      value: result.netBurn === 0 ? "₹0" : `₹${result.netBurn}L/mo`,
      rawValue: result.netBurn,
      sub: result.netBurn === 0 ? "Break-even!" : "Cash depleted per month",
      icon: TrendingDown,
      accent: result.netBurn === 0 ? "green" : result.netBurn < 30 ? "yellow" : "red",
    },
    {
      label: "Runway",
      value: result.runway >= 999 ? "∞" : `${result.runway}mo`,
      rawValue: result.runway >= 999 ? undefined : result.runway,
      sub: result.runway < 12 ? "Critical" : result.runway < 18 ? "Plan round" : "Healthy",
      icon: Clock,
      accent: result.runway >= 18 ? "green" : result.runway >= 9 ? "yellow" : "red",
    },
    {
      label: "Burn Multiple",
      value: result.burnMultiple >= 99 ? "∞" : `${result.burnMultiple}x`,
      rawValue: result.burnMultiple >= 99 ? undefined : result.burnMultiple,
      sub: result.burnMultiple <= 1 ? "Best-in-class" : result.burnMultiple <= 2.5 ? "Acceptable" : "Inefficient",
      icon: BarChart3,
      accent: result.burnMultiple <= 1.5 ? "green" : result.burnMultiple <= 2.5 ? "yellow" : "red",
    },
  ];

  // Bar chart data — burn breakdown
  const breakdownData = result.categoryBreakdown.map((c) => ({
    label: c.label,
    value: c.value / 100, // ₹Cr for consistency
  }));

  // Bar chart using Area chart in disguise (BarChart not in FinanceChart, use simple bars below)

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
      title="Burn Rate Calculator"
      slug="tools/finance/burn-rate-calculator"
      description="Break down your monthly burn by category. Get net burn, runway, burn multiple, and actionable insights on capital efficiency — fully client-side, instant."
      keywords={["burn rate calculator India", "startup burn rate", "net burn vs gross burn", "burn multiple calculator", "startup cost breakdown", "runway calculator"]}
      howToUse={[
        "Enter each expense category in ₹ Lakhs per month.",
        "Set your current MRR to calculate net burn and break-even.",
        "Enter cash on hand to get runway projection.",
        "Review the breakdown chart to identify your largest cost drivers.",
        "Use Insight Engine recommendations to prioritise cost optimisation.",
      ]}
      whatIs={{
        title: "What is Burn Rate and Why Does It Matter?",
        content: "Gross burn is your total monthly spend. Net burn is gross burn minus MRR — the actual cash depleted each month. Burn multiple (gross burn ÷ MRR) measures capital efficiency: how much you spend per rupee of revenue. Top-quartile SaaS companies achieve burn multiples below 1x. The burn breakdown reveals where capital is concentrated — salary-heavy burns (>75%) signal hiring-ahead-of-revenue risk, while marketing-heavy burns signal CAC inefficiency.",
      }}
      faqs={[
        { q: "What is a good burn multiple?", a: "Below 1x is exceptional — you're spending less than you're earning in new ARR. 1–1.5x is good. Above 2.5x signals that growth is expensive and unsustainable. Above 4x is a red flag for investors." },
        { q: "Should I focus on gross or net burn?", a: "Net burn is what actually depletes your cash. Gross burn matters for profitability modeling. Both are important — gross burn tells you your cost structure efficiency, net burn tells you your cash timeline." },
        { q: "What percentage of burn should be salaries?", a: "Top SaaS companies keep salaries below 65% of gross burn. Above 75% creates inflexibility — you can't cut costs without cutting people. Aim for a healthy mix with infrastructure and marketing." },
        { q: "What is months to break-even?", a: "The number of months until your MRR covers your gross burn. This calculator uses an 8% MoM growth assumption. Your actual break-even depends on your real growth rate from the ARR calculator." },
      ]}
      relatedTools={[
        { name: "Runway Calculator", path: "/tools/finance/runway-calculator", description: "Check how this burn profile impacts your survival timeline." },
        { name: "Growth Rate Calculator", path: "/tools/finance/growth-rate-calculator", description: "See the growth pace needed to offset this spending." },
        { name: "₹100Cr Journey", path: "/tools/finance/100cr-calculator", description: "Test if this burn can realistically support your long-term target." },
      ]}
      summaryCards={summaryCards}
      insightData={result}
      onLoadExample={() => sync.setInputs(EXAMPLE_INPUTS)}
      scenarioControls={scenarioControls}
      inputs={
        <>
          <p className="text-[11px] font-mono text-muted-foreground/40 uppercase tracking-widest -mb-1">
            Monthly Expenses (₹ Lakhs)
          </p>
          <FinanceInputRow label="Salaries & Benefits (team compensation)" value={inputs.salaries} min={0} max={300} step={1} prefix="₹" unit="L" description="Team salaries + contractor fees" onChange={(v) => patchInput("salaries", v)} />
          <FinanceInputRow label="Infrastructure (cloud and tools spend)" value={inputs.infrastructure} min={0} max={50} step={0.5} prefix="₹" unit="L" description="Cloud, servers, tools" onChange={(v) => patchInput("infrastructure", v)} />
          <FinanceInputRow label="Marketing & Sales (customer acquisition spend)" value={inputs.marketing} min={0} max={100} step={1} prefix="₹" unit="L" description="Ads, events, sales tools" onChange={(v) => patchInput("marketing", v)} />
          <FinanceInputRow label="Operations (non-product business costs)" value={inputs.operations} min={0} max={50} step={0.5} prefix="₹" unit="L" description="Office, travel, legal, admin" onChange={(v) => patchInput("operations", v)} />
          <FinanceInputRow label="Other (remaining monthly spend)" value={inputs.other} min={0} max={50} step={0.5} prefix="₹" unit="L" description="Miscellaneous expenses" onChange={(v) => patchInput("other", v)} />
          <div className="border-t border-white/[0.06] pt-4 space-y-4">
            <p className="text-[11px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Revenue & Cash
            </p>
            <FinanceInputRow label="Current MRR (monthly recurring revenue)" value={inputs.currentMRR} min={0} max={500} step={1} prefix="₹" unit="L/mo" description="Monthly Recurring Revenue" onChange={(v) => patchInput("currentMRR", v)} />
            <FinanceInputRow label="Cash on Hand (total cash available now)" value={inputs.cashOnHand} min={0.5} max={200} step={0.5} prefix="₹" unit="Cr" description="Total cash in bank" onChange={(v) => patchInput("cashOnHand", v)} />
          </div>
        </>
      }
      outputs={
        <div className="space-y-4">
          {/* Burn breakdown bars */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
            <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-4">
              Burn Breakdown
            </p>
            <div className="space-y-2.5">
              {result.categoryBreakdown.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-foreground/80">{c.label}</span>
                    <span className="text-[12px] font-mono font-semibold text-foreground/90">
                      ₹{c.value}L <span className="text-muted-foreground/50">({c.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", c.label === "Salaries & Benefits" ? "bg-primary" : "bg-accent")}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
              <span className="text-[13px] font-semibold">Total Gross Burn</span>
              <span className="text-[16px] font-bold tabular-nums text-rose-400">₹{result.grossBurn}L/mo</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[13px] text-muted-foreground">MRR Revenue</span>
              <span className="text-[14px] font-semibold tabular-nums text-emerald-400">−₹{inputs.currentMRR}L/mo</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[13px] font-semibold">Net Burn</span>
              <span className={cn("text-[16px] font-bold tabular-nums", result.netBurn === 0 ? "text-emerald-400" : "text-orange-400")}>
                {result.netBurn === 0 ? "Break-even ✓" : `₹${result.netBurn}L/mo`}
              </span>
            </div>
          </div>

          <FinanceChart
            title="Burn Rate Trend (Annualised)"
            data={breakdownData}
            xDataKey="label"
            series={[{ dataKey: "value", name: "Monthly Cost (₹Cr)", colorVar: "destructive", filled: true }]}
            yTickFormatter={(v) => `₹${(v * 100).toFixed(0)}L`}
            height={160}
          />
        </div>
      }
    />
  );
}
