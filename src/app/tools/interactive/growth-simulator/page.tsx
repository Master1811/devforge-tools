"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ArrowLeft, ArrowRight, Sliders, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Scenario {
  label: string;
  color: string;
  momGrowth: number;
  churnPct: number;
  expansionPct: number;
}

const DEFAULT_SCENARIOS: Scenario[] = [
  { label: "Best Case",  color: "#8B5CF6", momGrowth: 15, churnPct: 1.5,  expansionPct: 5 },
  { label: "Base Case",  color: "#06B6D4", momGrowth: 8,  churnPct: 3,    expansionPct: 2 },
  { label: "Worst Case", color: "#F59E0B", momGrowth: 3,  churnPct: 6,    expansionPct: 0.5 },
];

const MONTHS = 24;
const INITIAL_ARR_CR = 1;

function projectARR(scenario: Scenario): { month: string; arr: number }[] {
  let arr = INITIAL_ARR_CR;
  return Array.from({ length: MONTHS + 1 }, (_, i) => {
    const val = arr;
    if (i < MONTHS) {
      const net = arr * (scenario.momGrowth / 100)
        - arr * (scenario.churnPct / 100)
        + arr * (scenario.expansionPct / 100);
      arr += net;
    }
    return { month: i === 0 ? "Now" : `M${i}`, arr: parseFloat(val.toFixed(2)) };
  });
}

function SliderRow({
  label, value, min, max, step, color, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; color: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-[11.5px] text-[rgba(10,10,10,0.50)]">{label}</span>
        <span className="text-[11.5px] font-semibold font-mono text-[#0A0A0A]">{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(0,0,0,0.10) ${pct}%, rgba(0,0,0,0.10) 100%)`,
        }}
      />
    </div>
  );
}

export default function GrowthSimulatorPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);

  const update = (idx: number, field: keyof Scenario, value: number) =>
    setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));

  const chartData = useMemo(() => {
    const projections = scenarios.map(projectARR);
    return projections[0].map((_, i) => {
      const row: Record<string, string | number> = { month: projections[0][i].month };
      scenarios.forEach((s, j) => { row[s.label] = projections[j][i].arr; });
      return row;
    });
  }, [scenarios]);

  const finalValues = scenarios.map(s => {
    const proj = projectARR(s);
    return proj[proj.length - 1].arr;
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="text-[11px] font-mono text-[rgba(10,10,10,0.40)] mb-6 flex items-center gap-2">
            <Link href="/tools/interactive" className="hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Interactive
            </Link>
            <span className="text-[rgba(10,10,10,0.20)]">/</span>
            <span className="text-[rgba(10,10,10,0.65)]">Growth Simulator</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: "rgba(139,92,246,0.10)", borderColor: "rgba(139,92,246,0.18)" }}>
              <Sliders className="w-4 h-4 text-violet-600" />
            </div>
            <h1 className="font-display font-bold text-[26px] text-[#0A0A0A] tracking-[-0.03em]">
              Growth Scenario Simulator
            </h1>
          </div>
          <p className="text-[14px] text-[rgba(10,10,10,0.50)] mb-8 ml-12">
            Drag sliders for each scenario — watch your 24-month ARR trajectory update live.
          </p>

          {/* Chart */}
          <div className="rounded-2xl border border-[rgba(139,92,246,0.15)] bg-white p-5 mb-8">
            <p className="text-[11px] font-mono text-[rgba(10,10,10,0.35)] uppercase tracking-widest mb-4">
              ARR Trajectory — 24 months (₹ Cr, starting from ₹{INITIAL_ARR_CR}Cr)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  {scenarios.map(s => (
                    <linearGradient key={s.label} id={`grad-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(10,10,10,0.35)" }}
                  tickLine={false} axisLine={false}
                  ticks={["Now", "M6", "M12", "M18", "M24"]} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(10,10,10,0.35)" }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v}Cr`} width={56} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toFixed(2)} Cr`, ""]}
                  contentStyle={{ fontSize: 12, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 8, padding: "6px 10px" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {scenarios.map(s => (
                  <Area
                    key={s.label} type="monotone" dataKey={s.label}
                    stroke={s.color} strokeWidth={2}
                    fill={`url(#grad-${s.label})`}
                    dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {scenarios.map((s, i) => (
              <div key={s.label} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[11px] font-mono text-[rgba(10,10,10,0.40)] uppercase tracking-wide">{s.label}</span>
                </div>
                <div className="font-display font-bold text-[20px] text-[#0A0A0A] tracking-[-0.03em]">
                  ₹{finalValues[i].toFixed(1)}Cr
                </div>
                <div className="text-[10px] text-[rgba(10,10,10,0.40)] font-mono mt-0.5">ARR at 24 months</div>
              </div>
            ))}
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {scenarios.map((s, idx) => (
              <div key={s.label} className="rounded-2xl border border-[rgba(0,0,0,0.10)] bg-white p-5">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-[14px] text-[#0A0A0A]">{s.label}</span>
                </div>
                <SliderRow label="MoM Growth" value={s.momGrowth} min={0} max={40} step={0.5}
                  color={s.color} onChange={v => update(idx, "momGrowth", v)} />
                <SliderRow label="Monthly Churn" value={s.churnPct} min={0} max={20} step={0.5}
                  color={s.color} onChange={v => update(idx, "churnPct", v)} />
                <SliderRow label="Expansion MRR" value={s.expansionPct} min={0} max={15} step={0.5}
                  color={s.color} onChange={v => update(idx, "expansionPct", v)} />
              </div>
            ))}
          </div>

          {/* ── Use this with ──────────────────────────────────────────────
               Growth Simulator → ARR Calculator + Growth Rate + ₹100Cr
          ─────────────────────────────────────────────────────────────────── */}
          <div className="mt-14 pt-10 border-t border-[rgba(0,0,0,0.07)]">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-[11px] font-mono text-[rgba(10,10,10,0.38)] uppercase tracking-widest">
                Use this with
              </p>
            </div>
            <h2 className="font-display font-bold text-[18px] text-[#0A0A0A] tracking-[-0.02em] mb-1">
              Validate your scenarios with real analysis
            </h2>
            <p className="text-[13.5px] text-[rgba(10,10,10,0.50)] mb-6 max-w-lg">
              You&apos;ve modeled the scenarios. Now use structured tools to pressure-test the numbers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/tools/finance/arr-calculator",
                  title: "ARR / MRR Calculator",
                  cta: "Decompose your MRR into new, expansion, and churned revenue.",
                  accent: "#10B981",
                },
                {
                  href: "/tools/finance/growth-rate-calculator",
                  title: "Growth Rate Calculator",
                  cta: "Validate your MoM assumptions against T2D3 benchmarks.",
                  accent: "#059669",
                },
                {
                  href: "/tools/finance/100cr-calculator",
                  title: "₹100Cr Journey",
                  cta: "See which scenario actually gets you to ₹100 Crore ARR.",
                  accent: "#0EA5E9",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border bg-white p-5
                             transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                             hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)]"
                  style={{ borderColor: `${item.accent}22` }}
                >
                  <h3
                    className="font-semibold text-[14px] text-[#0A0A0A] mb-1.5 transition-colors duration-200"
                    style={{ ["--accent" as string]: item.accent }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] text-[rgba(10,10,10,0.50)] leading-relaxed flex-1 mb-3">
                    {item.cta}
                  </p>
                  <div className="flex items-center gap-1 text-[12px] font-medium" style={{ color: item.accent }}>
                    Open tool
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
