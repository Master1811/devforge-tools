"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import InsightEngine from "@/components/shared/InsightEngine";
import FinanceNextSteps from "@/components/finance/FinanceNextSteps";
import { useClientScenarioSync } from "@/hooks/useClientScenarioSync";
import { calculateHundredCrJourney } from "@/lib/tools/finance/hundredCrCalculator";
import type { HundredCrInputs } from "@/types/finance-tools";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Flame,
  Clock,
  Share2,
  RotateCcw,
  Save,
  CheckCircle2,
  Copy,
  Link as LinkIcon,
  X,
  Bookmark,
  Sparkles,
} from "lucide-react";

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_INPUTS: HundredCrInputs = {
  currentARR: 2,
  monthlyGrowthRate: 10,
  burnRate: 30,
  cashOnHand: 5,
  teamSize: 15,
  arpu: 5000,
  churnRate: 2,
};

const EXAMPLE_INPUTS: HundredCrInputs = {
  currentARR: 3.5,
  monthlyGrowthRate: 11,
  burnRate: 40,
  cashOnHand: 8,
  teamSize: 22,
  arpu: 6500,
  churnRate: 1.8,
};

const NEXT_STEPS = [
  {
    name: "Runway Calculator",
    path: "/tools/finance/runway-calculator",
    description: "Check if you have enough cash to sustain this growth curve.",
  },
  {
    name: "Growth Rate Calculator",
    path: "/tools/finance/growth-rate-calculator",
    description: "See the exact monthly growth needed to hit this timeline.",
  },
  {
    name: "Burn Rate Calculator",
    path: "/tools/finance/burn-rate-calculator",
    description: "Understand if your spending profile is efficient enough to scale.",
  },
];

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmtCr(v: number) {
  return v >= 100
    ? `₹${v.toFixed(0)}Cr`
    : v >= 1
    ? `₹${v.toFixed(1)}Cr`
    : `₹${(v * 100).toFixed(0)}L`;
}

function fmtMonths(m: number | null) {
  if (m === null) return "10+ yrs";
  if (m === 0) return "Now";
  const yrs = Math.floor(m / 12);
  const mo = m % 12;
  if (yrs === 0) return `${mo}mo`;
  return mo === 0 ? `${yrs}yr` : `${yrs}yr ${mo}mo`;
}

// ── Input row component ───────────────────────────────────────────────────────

interface InputRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  prefix?: string;
  description: string;
  onChange: (v: number) => void;
}

function InputRow({ label, value, min, max, step, unit, prefix = "", description, onChange }: InputRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-foreground/90">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-[13px] text-muted-foreground font-mono">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className={cn(
              "w-20 text-right text-[13px] font-mono tabular-nums",
              "bg-white/5 border border-white/10 rounded-md px-2 py-1",
              "text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40",
              "transition-colors duration-200"
            )}
          />
          <span className="text-[13px] text-muted-foreground font-mono">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <p className="text-[11px] text-muted-foreground/50">{description}</p>
    </div>
  );
}

// ── Metric summary card ───────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: "green" | "red" | "blue" | "yellow";
}) {
  const colorMap = {
    green: "text-emerald-400",
    red: "text-rose-400",
    blue: "text-sky-400",
    yellow: "text-yellow-400",
  };
  const color = accent ? colorMap[accent] : "text-primary";

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={cn("text-2xl font-bold tabular-nums leading-none", color)}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground/60 mt-1.5">{sub}</div>}
    </div>
  );
}

// ── Milestone timeline ────────────────────────────────────────────────────────

function MilestoneTimeline({ milestones }: { milestones: ReturnType<typeof calculateHundredCrJourney>["milestones"] }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
      <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-4">
        ARR Milestones
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {milestones.map((m) => (
          <div
            key={m.label}
            className={cn(
              "rounded-lg border p-3 transition-all",
              m.month === 0
                ? "border-emerald-500/30 bg-emerald-500/10"
                : m.month === null
                ? "border-white/[0.05] bg-white/[0.02] opacity-50"
                : m.withinRunway
                ? "border-sky-500/20 bg-sky-500/[0.07]"
                : "border-orange-500/20 bg-orange-500/[0.07]"
            )}
          >
            <div
              className={cn(
                "text-base font-bold tabular-nums mb-1",
                m.month === 0
                  ? "text-emerald-400"
                  : m.month === null
                  ? "text-muted-foreground/40"
                  : m.withinRunway
                  ? "text-sky-400"
                  : "text-orange-400"
              )}
            >
              {m.label}
            </div>
            <div className="text-[12px] font-mono text-muted-foreground/70">
              {m.dateLabel}
            </div>
            {m.month !== null && m.month > 0 && (
              <div className="text-[11px] text-muted-foreground/40 mt-0.5">
                {fmtMonths(m.month)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recharts custom tooltip ───────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-background/90 backdrop-blur-sm px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-semibold text-foreground">
          {p.dataKey === "arr" ? fmtCr(p.value) : `₹${(p.value * 100).toFixed(0)}L`}
        </p>
      ))}
    </div>
  );
}

// ── Scenario manager (save/load/share) ────────────────────────────────────────

function ScenarioManager({
  savedScenarios,
  onSave,
  onLoad,
  onDelete,
  onShare,
  onReset,
}: {
  savedScenarios: ReturnType<typeof useClientScenarioSync>["savedScenarios"];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  const handleShare = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          Scenarios
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            title="Copy shareable link"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium",
              "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
              copied ? "text-emerald-400 border-emerald-500/30" : "text-muted-foreground"
            )}
          >
            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={onReset}
            title="Reset to defaults"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Save input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Name this scenario…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-1 text-[12px] font-mono bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 disabled:opacity-40 transition-colors"
        >
          <Save className="w-3 h-3" />
          Save
        </button>
      </div>

      {/* Saved list */}
      {savedScenarios.length > 0 && (
        <div className="space-y-1.5">
          {savedScenarios.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 group"
            >
              <Bookmark className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
              <button
                onClick={() => onLoad(s.id)}
                className="flex-1 text-left text-[12px] text-foreground/80 hover:text-foreground transition-colors truncate"
              >
                {s.name}
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-rose-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main calculator page ──────────────────────────────────────────────────────

export default function HundredCrCalculatorPage() {
  const { inputs, setInputs, patchInput, savedScenarios, saveScenario, loadScenario, deleteScenario, getShareableUrl, reset } =
    useClientScenarioSync(DEFAULT_INPUTS);
  const [copiedSticky, setCopiedSticky] = useState(false);
  const [sharedSticky, setSharedSticky] = useState(false);

  const result = useMemo(() => calculateHundredCrJourney(inputs), [inputs]);

  // Downsample projections to every 6 months for chart performance
  const chartData = useMemo(
    () =>
      result.projections
        .filter((p) => p.month % 6 === 0)
        .map((p) => ({
          label: p.month === 0 ? "Now" : `${Math.floor(p.month / 12)}Y${p.month % 12 ? p.month % 12 + "M" : ""}`,
          arr: p.arr,
          cash: p.cash,
          month: p.month,
        })),
    [result.projections]
  );

  const runwayLabel = useMemo(() => {
    if (result.runway >= 120) return null;
    const snap = result.projections.find((p) => p.month >= result.runway);
    if (!snap) return null;
    const rounded = Math.round(snap.month / 6) * 6;
    const d = chartData.find((c) => c.month === rounded);
    return d?.label ?? null;
  }, [result.runway, result.projections, chartData]);

  const handleShare = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const handleCopyResults = () => {
    const payload = [
      "₹100Cr ARR Journey Calculator",
      `Time to ₹100Cr: ${fmtMonths(result.monthsToTarget)}`,
      `Runway: ${result.runway >= 999 ? "∞" : `${result.runway}mo`}`,
      `Burn Multiple: ${result.burnMultiple >= 99 ? "∞" : `${result.burnMultiple}x`}`,
      `Default Alive: ${result.isDefaultAlive ? "Yes" : "No"}`,
    ].join("\n");
    navigator.clipboard.writeText(payload).catch(() => {});
    setCopiedSticky(true);
    setTimeout(() => setCopiedSticky(false), 1800);
  };

  const handleShareSticky = () => {
    handleShare();
    setSharedSticky(true);
    setTimeout(() => setSharedSticky(false), 1800);
  };

  const runwayAccent: "green" | "yellow" | "red" =
    result.runway >= 18 ? "green" : result.runway >= 9 ? "yellow" : "red";

  return (
    <ToolLayout
      title="₹100Cr ARR Journey Calculator"
      slug="tools/finance/100cr-calculator"
      description="Map your startup's path to ₹100 Crore ARR. Get real-time projections, T2D3 benchmark comparisons, and actionable insights — fully client-side, no signup required."
      keywords={[
        "100 crore ARR calculator",
        "startup runway calculator India",
        "SaaS growth rate calculator",
        "burn rate calculator India",
        "startup metrics calculator",
        "ARR projection tool",
        "T2D3 growth model calculator",
        "default alive calculator",
        "Indian startup finance tools",
      ]}
      howToUse={[
        "Enter your current ARR in ₹ Crores — even ₹0.1Cr (₹10L) works.",
        "Set your monthly growth rate. T2D3 requires 9.6% MoM for the triple phase.",
        "Input monthly burn rate (₹ Lakhs) and cash on hand (₹ Crores).",
        "Adjust team size, ARPU, and monthly churn to sharpen the model.",
        "Read the Insight Engine — it benchmarks your metrics against top-quartile SaaS standards and tells you exactly what to fix.",
        "Save up to 5 named scenarios (e.g. Base Case / Aggressive) and compare them side-by-side.",
        "Share your scenario instantly via the Share button — the full state is encoded in the URL.",
      ]}
      whatIs={{
        title: "What is the ₹100Cr ARR Journey?",
        content:
          "₹100 Crore ARR (~$12M) is the canonical milestone that separates early-stage Indian SaaS companies from those entering Series B/C scale. It roughly equates to the T2D3 model's exit from the 'double' phase. This calculator models your timeline to that milestone using compound ARR growth, factoring in real constraints like burn rate and cash runway. The Insight Engine then benchmarks your metrics against global top-quartile SaaS standards and the T2D3 growth model, generating actionable recommendations — not just numbers.",
      }}
      faqs={[
        {
          q: "What is a realistic monthly growth rate for an Indian SaaS startup?",
          a: "The median SaaS company grows ~7% MoM. Top-quartile companies hit 12%+ MoM. The T2D3 model's triple phase requires ~9.6% MoM. Most successful Indian SaaS companies (Freshworks, Chargebee) averaged 8–15% MoM in their early years.",
        },
        {
          q: "What does 'default alive' mean?",
          a: "A startup is 'default alive' when its net new monthly revenue growth exceeds its monthly burn. If you stopped fundraising today, revenue growth would cover expenses before cash runs out. Paul Graham of YC considers this the most important metric for early-stage startups.",
        },
        {
          q: "What is the T2D3 growth model?",
          a: "T2D3 (Triple Triple Double Double Double) is a growth framework popularised by battery Ventures. Starting from ~$1M ARR, a company triples twice (to $9M) then doubles three times (to $72M ARR) over 5 years. This maps to ~9.6% MoM for years 1–2 and ~6% MoM for years 3–5.",
        },
        {
          q: "What is Burn Multiple and why does it matter?",
          a: "Burn Multiple = Net Monthly Burn ÷ Net New ARR. It measures capital efficiency. A burn multiple of 1x means you spend ₹1 of cash to generate ₹1 of new ARR. Best-in-class is <1x. High burn multiples (>3x) signal that growth is expensive and unsustainable without continued funding.",
        },
        {
          q: "Is my data saved anywhere?",
          a: "No. All calculations run in your browser. Your scenario data is saved only in your browser's localStorage — it never leaves your device. The shareable URL encodes your inputs as Base64 in the URL hash, with no server involved.",
        },
        {
          q: "How accurate is this projection?",
          a: "This model assumes constant monthly growth rate and burn, which is a simplification. Real companies experience growth deceleration at scale, variable burn, and revenue seasonality. Use this as a directional compass and planning tool, not a financial forecast.",
        },
      ]}
      relatedTools={[
        {
          name: "ARR Calculator",
          path: "/tools/finance/arr-calculator",
          description: "Convert MRR to ARR and project forward with seasonality adjustments.",
        },
        {
          name: "Runway Calculator",
          path: "/tools/finance/runway-calculator",
          description: "Calculate exact runway across multiple burn scenarios.",
        },
        {
          name: "SaaS Metrics Simulator",
          path: "/tools/finance/saas-metrics",
          description: "Model LTV, CAC, payback period, and magic number.",
        },
      ]}
      hideRelatedToolsSection
    >
      <div className="p-4 sm:p-6 space-y-6 pb-24">
        {/* ── Summary metrics row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            label="Time to ₹100Cr"
            value={fmtMonths(result.monthsToTarget)}
            sub={result.projectedReachDate ?? "Not in 10 yrs"}
            icon={TrendingUp}
            accent="blue"
          />
          <MetricCard
            label="Runway"
            value={result.runway >= 999 ? "∞" : `${result.runway}mo`}
            sub={result.runway < 12 ? "Critical — raise now" : result.runway < 18 ? "Plan next round" : "Healthy"}
            icon={Clock}
            accent={runwayAccent}
          />
          <MetricCard
            label="Burn Multiple"
            value={result.burnMultiple >= 99 ? "∞" : `${result.burnMultiple}x`}
            sub={result.burnMultiple <= 1 ? "Best-in-class" : result.burnMultiple <= 2.5 ? "Acceptable" : "Improve efficiency"}
            icon={Flame}
            accent={result.burnMultiple <= 1.5 ? "green" : result.burnMultiple <= 2.5 ? "yellow" : "red"}
          />
          <MetricCard
            label="Default Alive"
            value={result.isDefaultAlive ? "Yes" : "No"}
            sub={result.isDefaultAlive ? "Revenue covers burn" : "Fundraising required"}
            icon={CheckCircle2}
            accent={result.isDefaultAlive ? "green" : "red"}
          />
        </div>

        {/* ── Two-column: inputs + chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <button
              onClick={() => setInputs(EXAMPLE_INPUTS)}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-primary/25 bg-primary/10 hover:bg-primary/15 text-primary text-[12px] font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Example inputs
            </button>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5 space-y-5">
              <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">
                Your Numbers
              </p>

              <InputRow
                label="Current ARR (your annual recurring revenue today)"
                value={inputs.currentARR}
                min={0.1}
                max={50}
                step={0.1}
                prefix="₹"
                unit="Cr"
                description="Annual Recurring Revenue right now"
                onChange={(v) => patchInput("currentARR", v)}
              />

              <InputRow
                label="Monthly Growth Rate (how fast your ARR grows each month)"
                value={inputs.monthlyGrowthRate}
                min={1}
                max={30}
                step={0.5}
                unit="%"
                description="Net new ARR growth % per month"
                onChange={(v) => patchInput("monthlyGrowthRate", v)}
              />

              <InputRow
                label="Monthly Burn (cash spent every month)"
                value={inputs.burnRate}
                min={1}
                max={500}
                step={1}
                prefix="₹"
                unit="L/mo"
                description="Total cash spend per month (₹ Lakhs)"
                onChange={(v) => patchInput("burnRate", v)}
              />

              <InputRow
                label="Cash on Hand (money currently in the bank)"
                value={inputs.cashOnHand}
                min={0.5}
                max={200}
                step={0.5}
                prefix="₹"
                unit="Cr"
                description="Total cash in bank today"
                onChange={(v) => patchInput("cashOnHand", v)}
              />

              <InputRow
                label="Monthly Churn (revenue lost from customer churn)"
                value={inputs.churnRate}
                min={0.1}
                max={10}
                step={0.1}
                unit="%"
                description="% of ARR lost per month"
                onChange={(v) => patchInput("churnRate", v)}
              />

              <InputRow
                label="ARPU (average revenue per customer)"
                value={inputs.arpu}
                min={500}
                max={100000}
                step={500}
                prefix="₹"
                unit="/mo"
                description="Average revenue per user per month"
                onChange={(v) => patchInput("arpu", v)}
              />
            </div>

            {/* Scenario manager */}
            <ScenarioManager
              savedScenarios={savedScenarios}
              onSave={saveScenario}
              onLoad={loadScenario}
              onDelete={deleteScenario}
              onShare={handleShare}
              onReset={reset}
            />
          </div>

          {/* Chart + Milestones */}
          <div className="space-y-4">
            {/* ARR Projection chart */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
              <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-4">
                ARR Projection (10-year)
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(214 95% 52%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(214 95% 52%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160 84% 43%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(160 84% 43%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 12%)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "hsl(240 10% 50%)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(240 10% 50%)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}Cr`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {/* ₹100Cr target */}
                  <ReferenceLine
                    y={100}
                    stroke="hsl(160 84% 43%)"
                    strokeDasharray="5 3"
                    label={{ value: "₹100Cr", position: "right", fontSize: 10, fill: "hsl(160 84% 43%)" }}
                  />
                  {/* Runway end */}
                  {runwayLabel && (
                    <ReferenceLine
                      x={runwayLabel}
                      stroke="hsl(330 81% 56%)"
                      strokeDasharray="5 3"
                      label={{ value: "Runway", position: "top", fontSize: 10, fill: "hsl(330 81% 56%)" }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="arr"
                    stroke="hsl(214 95% 52%)"
                    fill="url(#arrGrad)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cash"
                    stroke="hsl(160 84% 43%)"
                    fill="url(#cashGrad)"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded bg-primary" />
                  <span className="text-[11px] text-muted-foreground/60 font-mono">ARR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded border-t border-dashed border-accent" style={{ borderTopStyle: "dashed" }} />
                  <span className="text-[11px] text-muted-foreground/60 font-mono">Cash</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded bg-accent opacity-60" />
                  <span className="text-[11px] text-muted-foreground/60 font-mono">₹100Cr target</span>
                </div>
              </div>
            </div>

            {/* Milestone timeline */}
            <MilestoneTimeline milestones={result.milestones} />
          </div>
        </div>

        {/* ── Insight Engine (full width) ── */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
          <InsightEngine data={result} />
        </div>

        <FinanceNextSteps tools={NEXT_STEPS} />
      </div>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(960px,calc(100%-1.5rem))] rounded-xl border border-white/10 bg-background/90 backdrop-blur-md shadow-lg px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="hidden sm:block text-[11px] font-mono text-muted-foreground/65 uppercase tracking-widest">
            Quick Actions
          </p>
          <div className="w-full sm:w-auto grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyResults}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
            >
              {copiedSticky ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSticky ? "Copied" : "Copy Results"}
            </button>
            <button
              onClick={handleShareSticky}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
            >
              {sharedSticky ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
              {sharedSticky ? "Copied" : "Share Link"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
