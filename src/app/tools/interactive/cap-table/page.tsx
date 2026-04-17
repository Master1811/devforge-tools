"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ArrowLeft, ArrowRight, PieChart, TrendingUp } from "lucide-react";

interface Round {
  name: string;
  preMoneyValuation: number;
  investment: number;
  esopDilution: number;
}

const DEFAULT_ROUNDS: Round[] = [
  { name: "Seed", preMoneyValuation: 5, investment: 1, esopDilution: 5 },
  { name: "Series A", preMoneyValuation: 30, investment: 6, esopDilution: 10 },
];

const COLORS = ["#8B5CF6", "#10B981", "#06B6D4", "#F59E0B", "#EF4444"];

function calcOwnership(rounds: Round[]) {
  let founderPct = 100;
  const snapshots: { name: string; founder: number; investors: number[]; esop: number }[] = [];
  const investorStacks: number[] = [];

  rounds.forEach((round) => {
    const postMoney = round.preMoneyValuation + round.investment;
    const investorPct = (round.investment / postMoney) * 100;
    const totalDilution = investorPct + round.esopDilution;

    const scale = (100 - totalDilution) / 100;
    founderPct *= scale;
    investorStacks.forEach((_, i) => { investorStacks[i] *= scale; });
    investorStacks.push(investorPct);

    snapshots.push({
      name: round.name,
      founder: founderPct,
      investors: [...investorStacks],
      esop: 100 - founderPct - investorStacks.reduce((a, b) => a + b, 0),
    });
  });

  return snapshots;
}

function PieSlice({ pct, offset, color, r = 60 }: { pct: number; offset: number; color: string; r?: number }) {
  const cx = 80, cy = 80;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  const gap = circumference - dash;
  const rotation = (offset / 100) * 360 - 90;
  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none"
      stroke={color}
      strokeWidth={28}
      strokeDasharray={`${dash} ${gap}`}
      strokeDashoffset={0}
      transform={`rotate(${rotation} ${cx} ${cy})`}
      style={{ transition: "stroke-dasharray 0.4s ease" }}
    />
  );
}

export default function CapTableSimulatorPage() {
  const [rounds, setRounds] = useState<Round[]>(DEFAULT_ROUNDS);

  const updateRound = useCallback((idx: number, field: keyof Round, value: number | string) => {
    setRounds(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }, []);

  const snapshots = calcOwnership(rounds);
  const latest = snapshots[snapshots.length - 1] ?? { founder: 100, investors: [], esop: 0 };

  const slices = [
    { label: "Founders", pct: latest.founder, color: COLORS[0] },
    ...latest.investors.map((pct, i) => ({ label: rounds[i]?.name ?? `Round ${i + 1}`, pct, color: COLORS[i + 1] ?? "#94A3B8" })),
    { label: "ESOP", pct: Math.max(0, latest.esop), color: "#E2E8F0" },
  ];

  let offset = 0;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-[11px] font-mono text-[rgba(10,10,10,0.40)] mb-6 flex items-center gap-2">
            <Link href="/tools/interactive" className="hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Interactive
            </Link>
            <span className="text-[rgba(10,10,10,0.20)]">/</span>
            <span className="text-[rgba(10,10,10,0.65)]">Cap Table Simulator</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: "rgba(139,92,246,0.10)", borderColor: "rgba(139,92,246,0.18)" }}>
              <PieChart className="w-4.5 h-4.5 text-violet-600" />
            </div>
            <h1 className="font-display font-bold text-[26px] text-[#0A0A0A] tracking-[-0.03em]">
              Cap Table Simulator
            </h1>
          </div>
          <p className="text-[14px] text-[rgba(10,10,10,0.50)] mb-10 ml-12">
            Drag sliders to model equity dilution across funding rounds.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Left: sliders */}
            <div className="space-y-6">
              {rounds.map((round, idx) => (
                <div key={idx} className="rounded-2xl border border-[rgba(0,0,0,0.10)] bg-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[idx + 1] ?? "#94A3B8" }} />
                    <span className="font-semibold text-[14px] text-[#0A0A0A]">{round.name}</span>
                  </div>

                  {(["preMoneyValuation", "investment", "esopDilution"] as const).map(field => {
                    const config = {
                      preMoneyValuation: { label: "Pre-money valuation (₹ Cr)", min: 1, max: 500, step: 1 },
                      investment:        { label: "Investment raised (₹ Cr)",   min: 0.5, max: 100, step: 0.5 },
                      esopDilution:      { label: "ESOP pool dilution (%)",       min: 0, max: 25, step: 0.5 },
                    }[field];
                    return (
                      <div key={field} className="mb-4">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[12px] text-[rgba(10,10,10,0.50)]">{config.label}</span>
                          <span className="text-[12px] font-semibold text-[#0A0A0A] font-mono">
                            {field === "esopDilution" ? `${round[field]}%` : `₹${round[field]}Cr`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={config.min} max={config.max} step={config.step}
                          value={round[field]}
                          onChange={e => updateRound(idx, field, parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${COLORS[idx + 1] ?? "#94A3B8"} 0%, ${COLORS[idx + 1] ?? "#94A3B8"} ${((round[field] - config.min) / (config.max - config.min)) * 100}%, rgba(0,0,0,0.10) ${((round[field] - config.min) / (config.max - config.min)) * 100}%, rgba(0,0,0,0.10) 100%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Right: pie chart */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[rgba(139,92,246,0.15)] bg-white p-5">
                <p className="text-[11px] font-mono text-[rgba(10,10,10,0.35)] uppercase tracking-widest mb-4">
                  Ownership after all rounds
                </p>
                <svg viewBox="0 0 160 160" className="w-full max-w-[180px] mx-auto block">
                  {slices.map(s => {
                    const el = <PieSlice key={s.label} pct={s.pct} offset={offset} color={s.color} />;
                    offset += s.pct;
                    return el;
                  })}
                  <text x="80" y="76" textAnchor="middle" className="text-[10px]" fill="#0A0A0A" fontSize="11" fontWeight="700">
                    {latest.founder.toFixed(1)}%
                  </text>
                  <text x="80" y="90" textAnchor="middle" fill="rgba(10,10,10,0.40)" fontSize="9">
                    Founder
                  </text>
                </svg>

                <div className="mt-4 space-y-2">
                  {slices.filter(s => s.pct > 0.1).map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-[12px] text-[rgba(10,10,10,0.60)]">{s.label}</span>
                      </div>
                      <span className="text-[12px] font-semibold font-mono text-[#0A0A0A]">
                        {s.pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waterfall */}
              <div className="rounded-2xl border border-[rgba(0,0,0,0.10)] bg-white p-5">
                <p className="text-[11px] font-mono text-[rgba(10,10,10,0.35)] uppercase tracking-widest mb-3">
                  Founder dilution path
                </p>
                <div className="space-y-1.5">
                  {[{ name: "Before raise", founder: 100 }, ...snapshots].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] text-[rgba(10,10,10,0.40)] w-20 flex-shrink-0 font-mono">
                        {s.name}
                      </span>
                      <div className="flex-1 h-4 rounded bg-[rgba(0,0,0,0.04)] overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${s.founder}%`,
                            background: `rgba(139,92,246,${0.3 + (s.founder / 100) * 0.7})`,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-[#0A0A0A] w-10 text-right flex-shrink-0">
                        {s.founder.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Use this with ──────────────────────────────────────────────
               Cap Table Simulator → Runway + ₹100Cr: simulation → analysis
          ─────────────────────────────────────────────────────────────────── */}
          <div className="mt-14 pt-10 border-t border-[rgba(0,0,0,0.07)]">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-[11px] font-mono text-[rgba(10,10,10,0.38)] uppercase tracking-widest">
                Use this with
              </p>
            </div>
            <h2 className="font-display font-bold text-[18px] text-[#0A0A0A] tracking-[-0.02em] mb-1">
              Turn your cap table into a financial plan
            </h2>
            <p className="text-[13.5px] text-[rgba(10,10,10,0.50)] mb-6 max-w-lg">
              You know how the equity is split. Now answer what the money actually buys you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  href: "/tools/finance/runway-calculator",
                  title: "Runway Calculator",
                  cta: "Now calculate how long your cash lasts after this round.",
                  accent: "#10B981",
                },
                {
                  href: "/tools/finance/100cr-calculator",
                  title: "₹100Cr Journey Calculator",
                  cta: "Map the growth path that makes this equity worth something.",
                  accent: "#0EA5E9",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-[rgba(0,0,0,0.09)] bg-white p-5
                             transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                             hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)]"
                  style={{
                    borderColor: `${item.accent}22`,
                  }}
                >
                  <h3 className="font-semibold text-[14px] text-[#0A0A0A] mb-1.5 group-hover:text-[var(--accent)] transition-colors"
                    style={{ "--accent": item.accent } as React.CSSProperties}>
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
