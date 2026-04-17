"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToolCard from "@/components/shared/ToolCard";
import Reveal from "@/components/shared/Reveal";
import { HeroBackground } from "@/components/ui/hero-background";
import { TOOLS } from "@/lib/tools/registry";
import {
  ArrowRight, Terminal, Code2, TrendingUp, Zap, Shield, Globe, Sliders,
} from "lucide-react";
import FeatureCards from "@/components/sections/FeatureCards";
import ComparisonTable from "@/components/sections/ComparisonTable";

/* ─────────────────────────────────────────────────────────────────────────
   HERO CAROUSEL
   3-card center-focused carousel with spring physics drag
────────────────────────────────────────────────────────────────────────── */

const CARD_W = 276;
const STEP_X = 260; // distance between card centers

/* — Visual: terminal code block for Dev Tools — */
function DevVisual() {
  return (
    <div className="rounded-xl overflow-hidden select-none">
      {/* Terminal chrome */}
      <div className="bg-[#1A1A1A] px-3.5 py-2 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 font-mono text-[10px] text-[rgba(255,255,255,0.25)]">jwt-decoder</span>
      </div>
      {/* Code body */}
      <div className="bg-[#111] px-4 pt-3 pb-4 font-mono text-[11px] leading-[1.85]">
        <span className="text-[rgba(255,255,255,0.30)]">{"// payload"}</span>
        <br />
        <span className="text-[rgba(255,255,255,0.70)]">{"{"}</span>
        <br />
        <span className="text-cyan-400">&nbsp;&nbsp;&quot;sub&quot;</span>
        <span className="text-[rgba(255,255,255,0.40)]">: </span>
        <span className="text-emerald-400">&quot;usr_42&quot;</span>
        <span className="text-[rgba(255,255,255,0.40)]">,</span>
        <br />
        <span className="text-cyan-400">&nbsp;&nbsp;&quot;role&quot;</span>
        <span className="text-[rgba(255,255,255,0.40)]">: </span>
        <span className="text-emerald-400">&quot;admin&quot;</span>
        <span className="text-[rgba(255,255,255,0.40)]">,</span>
        <br />
        <span className="text-cyan-400">&nbsp;&nbsp;&quot;exp&quot;</span>
        <span className="text-[rgba(255,255,255,0.40)]">: </span>
        <span className="text-amber-400">1749200000</span>
        <br />
        <span className="text-[rgba(255,255,255,0.70)]">{"}"}</span>
        <br />
        <div className="mt-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-emerald-400 text-[10px]">Valid · expires in 23h</span>
        </div>
      </div>
    </div>
  );
}

/* — Visual: metric grid for Finance Tools — */
function FinanceVisual() {
  const bars = [32, 45, 40, 58, 52, 74, 68, 92, 85, 100];
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "ARR", value: "₹2.4Cr", delta: "↑ 32%", color: "text-emerald-600" },
          { label: "Runway", value: "18 mo", delta: "✓ Safe", color: "text-emerald-600" },
        ].map(m => (
          <div key={m.label} className="bg-white/75 rounded-xl border border-[rgba(0,0,0,0.07)] p-2.5">
            <div className="text-[10px] font-mono text-[rgba(10,10,10,0.38)] mb-1">{m.label}</div>
            <div className="font-display font-bold text-[17px] text-[#0A0A0A] tracking-[-0.03em] leading-none mb-1">
              {m.value}
            </div>
            <div className={`text-[10px] font-mono font-medium ${m.color}`}>{m.delta}</div>
          </div>
        ))}
      </div>
      {/* Mini bar chart */}
      <div className="bg-white/60 rounded-xl border border-[rgba(0,0,0,0.06)] px-3 pt-2.5 pb-3">
        <div className="text-[10px] font-mono text-[rgba(10,10,10,0.32)] mb-2">MRR Growth</div>
        <div className="flex items-end gap-[3px] h-[34px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[2px]"
              style={{
                height: `${h}%`,
                background: `rgba(16,185,129,${0.35 + (i / bars.length) * 0.65})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* — Visual: slider + live chart for Interactive Tools — */
function InteractiveVisual() {
  const bars = [18, 28, 42, 55, 62, 74, 68, 88, 95, 100];
  return (
    <div className="space-y-2.5">
      {/* Slider rows */}
      <div className="bg-white/70 rounded-xl border border-[rgba(0,0,0,0.06)] px-3 py-2.5 space-y-2">
        {[
          { label: "Growth", pct: 74, color: "#8B5CF6" },
          { label: "Runway", pct: 55, color: "#7C3AED" },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-mono text-[rgba(10,10,10,0.40)]">{s.label}</span>
              <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
      {/* Live area chart */}
      <div className="bg-white/60 rounded-xl border border-[rgba(0,0,0,0.06)] px-3 pt-2.5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-[rgba(10,10,10,0.32)]">Live Projection</span>
          <span className="text-[9px] font-mono text-violet-500 font-semibold">↑ REAL-TIME</span>
        </div>
        <div className="flex items-end gap-[3px] h-[34px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[2px]"
              style={{
                height: `${h}%`,
                background: `rgba(139,92,246,${0.28 + (i / bars.length) * 0.72})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* — Visual: growth chart for ₹100Cr Calculator — */
function HundredCrVisual() {
  const W = 228;
  const H = 88;
  const pts = [2, 4, 7, 13, 22, 38, 60, 82, 100];
  const toXY = (v: number, i: number) => ({
    x: (i / (pts.length - 1)) * W,
    y: H - (v / 100) * H,
  });
  const linePath = pts
    .map((v, i) => { const { x, y } = toXY(v, i); return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`; })
    .join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  return (
    <div className="space-y-2.5">
      <div className="bg-white/70 rounded-xl border border-[rgba(0,0,0,0.06)] p-3 overflow-hidden">
        <div className="text-[10px] font-mono text-[rgba(10,10,10,0.35)] mb-2">ARR Trajectory</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H + 2}`} preserveAspectRatio="none" style={{ display: "block", height: 72 }}>
          <defs>
            <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Target dashed line */}
          <line x1={0} y1={2} x2={W} y2={2} stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 3" opacity={0.45} />
          <text x={W - 2} y={2} fill="#06B6D4" fontSize="8.5" textAnchor="end" dominantBaseline="hanging" opacity={0.7}>₹100Cr</text>
          {/* Area + line */}
          <path d={areaPath} fill="url(#cgGrad)" />
          <path d={linePath} fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Target", value: "₹100 Cr" },
          { label: "Timeline", value: "~5 yrs" },
        ].map(m => (
          <div key={m.label} className="bg-white/75 rounded-xl border border-[rgba(0,0,0,0.07)] p-2.5">
            <div className="text-[10px] font-mono text-[rgba(10,10,10,0.38)] mb-1">{m.label}</div>
            <div className="font-display font-bold text-[17px] text-[#0A0A0A] tracking-[-0.03em]">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* — Carousel card data — */
const CAROUSEL_CARDS = [
  {
    id: "dev",
    href: "/tools",
    gradient: "from-cyan-50 via-sky-50/70 to-white/80",
    accentHex: "#06B6D4",
    label: "Dev Tools",
    title: "Developer Tools",
    subtitle: "Build, debug, and work with code",
    Visual: DevVisual,
  },
  {
    id: "interactive",
    href: "/tools/interactive",
    gradient: "from-violet-50 via-purple-50/60 to-white/80",
    accentHex: "#8B5CF6",
    label: "Interactive",
    title: "Interactive Tools",
    subtitle: "Visual tools AI can't replace",
    Visual: InteractiveVisual,
  },
  {
    id: "finance",
    href: "/tools/finance",
    gradient: "from-emerald-50 via-teal-50/60 to-white/80",
    accentHex: "#10B981",
    label: "Finance",
    title: "Finance Tools",
    subtitle: "Understand revenue and growth",
    Visual: FinanceVisual,
  },
  {
    id: "100cr",
    href: "/tools/finance/100cr-calculator",
    gradient: "from-sky-50 via-cyan-50/50 to-white/80",
    accentHex: "#0EA5E9",
    label: "Featured",
    title: "₹100Cr Calculator",
    subtitle: "Map your path to ₹100 Crore ARR",
    Visual: HundredCrVisual,
  },
] as const;

function HeroCarousel() {
  const [active, setActive] = useState(1); // start with Finance in center

  const advance = (dir: 1 | -1) =>
    setActive(a => Math.max(0, Math.min(CAROUSEL_CARDS.length - 1, a + dir)));

  return (
    <div className="relative select-none" style={{ height: 400 }}>
      {/* Cards track — overflow hidden clips peeking cards */}
      <div className="absolute inset-0 overflow-hidden">
        {CAROUSEL_CARDS.map((card, i) => {
          const offset = i - active;
          const isActive = offset === 0;
          const { Visual } = card;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-y-0 flex items-center"
              style={{
                width: CARD_W,
                left: "50%",
                marginLeft: -CARD_W / 2,
                zIndex: isActive ? 10 : 4,
                cursor: isActive ? "grab" : "pointer",
                touchAction: "none",
              }}
              animate={{
                x: offset * STEP_X,
                scale: isActive ? 1 : 0.84,
                opacity: isActive ? 1 : 0.55,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, { offset: { x } }) => {
                if (x < -52) advance(1);
                else if (x > 52) advance(-1);
              }}
              onClick={() => !isActive && setActive(i)}
              whileDrag={{ cursor: "grabbing", scale: 0.97 }}
            >
              {/* Card shell */}
              <div
                className="w-full rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.09)]"
                style={{
                  background: "white",
                  boxShadow: isActive
                    ? "0 8px 40px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                {/* Gradient top zone */}
                <div className={`bg-gradient-to-br ${card.gradient} p-4`}>
                  {/* Category badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full font-mono text-[10px] mb-3"
                    style={{
                      background: `${card.accentHex}14`,
                      border: `1px solid ${card.accentHex}28`,
                      color: card.accentHex,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: card.accentHex }} />
                    {card.label}
                  </div>
                  {/* Tool visual */}
                  <Visual />
                </div>

                {/* Bottom: title + subtitle + arrow */}
                <div className="bg-white px-4.5 py-3.5 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between gap-3"
                  style={{ padding: "14px 18px" }}>
                  <div>
                    <h3 className="font-display font-bold text-[14px] text-[#0A0A0A] tracking-[-0.02em] leading-tight mb-0.5">
                      {card.title}
                    </h3>
                    <p className="text-[11.5px] text-[rgba(10,10,10,0.48)] leading-snug">
                      {card.subtitle}
                    </p>
                  </div>
                  {isActive && (
                    <Link
                      href={card.href}
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                                 hover:scale-110"
                      style={{
                        background: `${card.accentHex}14`,
                        border: `1px solid ${card.accentHex}28`,
                        color: card.accentHex,
                      }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {CAROUSEL_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 22 : 7,
              height: 7,
              borderRadius: 4,
              background: active === i ? "#0A0A0A" : "rgba(0,0,0,0.18)",
              transition: "all 220ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ))}
      </div>

      {/* Edge nav arrows (visible on hover) */}
      {active > 0 && (
        <button
          onClick={() => advance(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[rgba(0,0,0,0.10)]
                     flex items-center justify-center text-[rgba(10,10,10,0.50)] shadow-sm
                     hover:text-[#0A0A0A] hover:border-[rgba(0,0,0,0.20)] transition-all duration-150 z-20"
          style={{ marginTop: -14 }}
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      )}
      {active < CAROUSEL_CARDS.length - 1 && (
        <button
          onClick={() => advance(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[rgba(0,0,0,0.10)]
                     flex items-center justify-center text-[rgba(10,10,10,0.50)] shadow-sm
                     hover:text-[#0A0A0A] hover:border-[rgba(0,0,0,0.20)] transition-all duration-150 z-20"
          style={{ marginTop: -14 }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DECISION CARD (below hero)
────────────────────────────────────────────────────────────────────────── */
function DecisionCard({
  href, accent, icon: Icon, title, description, count, tools,
}: {
  href: string; accent: string; icon: typeof Terminal;
  title: string; description: string; count: number; tools: string[];
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-[rgba(0,0,0,0.10)] bg-white overflow-hidden
                 hover:border-[rgba(0,0,0,0.18)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-px
                 [transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="h-[3px] w-full" style={{ background: accent }} />
      <div className="flex flex-col flex-1 p-7 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}15` }}>
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <span className="font-mono text-[11px] text-[rgba(10,10,10,0.40)] tracking-[0.06em] uppercase">
            {count} tools
          </span>
        </div>
        <h3 className="font-display font-bold text-[22px] text-[#0A0A0A] tracking-[-0.02em] mb-2">{title}</h3>
        <p className="text-[14px] text-[rgba(10,10,10,0.55)] leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-8">
          {tools.map(t => (
            <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[rgba(0,0,0,0.08)] text-[rgba(10,10,10,0.50)]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 text-[13px] font-semibold" style={{ color: accent }}>
          Explore tools
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Stat item ── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-display font-bold text-[28px] text-[#0A0A0A] tracking-[-0.03em]">{value}</span>
      <span className="font-mono text-[12px] text-[rgba(10,10,10,0.45)] tracking-[0.04em]">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const devTools         = TOOLS.filter(t => t.tag !== "finance" && t.tag !== "interactive");
  const financeTools     = TOOLS.filter(t => t.tag === "finance");
  const interactiveTools = TOOLS.filter(t => t.tag === "interactive");

  // Parallax for hero right column (Item 21)
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, -90]);

  return (
    <>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center"
        style={{ paddingTop: "var(--nav-height, 64px)" }}
      >
        <HeroBackground />

        <div className="relative z-[1] w-full max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.03)] text-[11px] font-mono text-[rgba(10,10,10,0.50)] mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              {TOOLS.length} tools · 100% free · no signup
            </motion.div>

            <motion.h1
              className="font-display font-bold tracking-[-0.035em] leading-[1.06] text-[#0A0A0A] mb-5"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)" }}
              initial={prefersReduced ? {} : { opacity: 0, y: 24, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Build faster.
              <br />
              <span className="text-[rgba(10,10,10,0.40)]">See your business clearly.</span>
            </motion.h1>

            <motion.p
              className="text-[16px] text-[rgba(10,10,10,0.55)] leading-[1.70] max-w-[460px] mb-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Developer tools for building and debugging.
              Finance tools for understanding growth and money.
              Interactive tools that no AI can replace.
              All free, all instant, all in-browser.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[#0A0A0A] text-[#FAFAFA] text-[14px] font-semibold
                           transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                           hover:bg-black hover:shadow-[0_4px_16px_rgba(0,0,0,0.20)] active:scale-[0.97]"
              >
                Explore Dev Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/finance"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-[rgba(0,0,0,0.14)] text-[14px] font-semibold text-[rgba(10,10,10,0.70)]
                           transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                           hover:border-[rgba(0,0,0,0.28)] hover:text-[#0A0A0A] hover:bg-[rgba(0,0,0,0.03)]"
              >
                Finance Tools
              </Link>
              <Link
                href="/tools/interactive"
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-lg text-[13px] font-medium
                           transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ color: "#7C3AED" }}
              >
                <Sliders className="w-3.5 h-3.5" />
                Interactive
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {[
                { icon: Shield, label: "No login" },
                { icon: Zap,    label: "Sub-ms results" },
                { icon: Globe,  label: "Runs in browser" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)]">
                  <Icon className="w-3 h-3 text-[rgba(10,10,10,0.40)]" />
                  <span className="text-[11px] font-mono text-[rgba(10,10,10,0.45)]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: interactive carousel — parallax on scroll (desktop only) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={prefersReduced ? undefined : { y: heroParallaxY }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroCarousel />
          </motion.div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none" />
      </section>

      {/* ══ DECISION BLOCK ═══════════════════════════════════════════════ */}
      <section className="bg-[#FAFAFA] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[rgba(10,10,10,0.35)] mb-3">
              Choose your path
            </p>
            <h2
              className="font-display font-bold text-[#0A0A0A] tracking-[-0.025em]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              What do you want to do?
            </h2>
          </motion.div>

          {/* ── Primary: Dev + Finance ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <Reveal variant="prominent" delay={0}>
              <DecisionCard
                href="/tools"
                accent="#06B6D4"
                icon={Code2}
                title="Developer Tools"
                description="Build, debug, and work with code. JWT, JSON, SQL, RegEx, Base64, cURL — all the utilities developers reach for daily."
                count={devTools.length}
                tools={["JWT Decoder", "JSON → TS", "SQL Formatter", "RegEx Tester", "Base64"]}
              />
            </Reveal>
            <Reveal variant="prominent" delay={0.06}>
              <DecisionCard
                href="/tools/finance"
                accent="#10B981"
                icon={TrendingUp}
                title="Finance Tools"
                description="Understand revenue, runway, and growth. ARR, burn rate, growth rate — metrics every founder and operator needs."
                count={financeTools.length}
                tools={["ARR Calculator", "Runway", "Burn Rate", "Growth Rate", "₹100Cr"]}
              />
            </Reveal>
          </div>

          {/* ── Secondary: Interactive discovery strip ── */}
          <Reveal variant="prominent" delay={0.12}>
            <Link
              href="/tools/interactive"
              className="group flex items-center justify-between gap-4 rounded-2xl border px-6 py-4
                         transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(139,92,246,0.10)]"
              style={{
                borderColor: "rgba(139,92,246,0.20)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.02) 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border"
                  style={{ background: "rgba(139,92,246,0.10)", borderColor: "rgba(139,92,246,0.20)" }}
                >
                  <Sliders className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-semibold text-[15px] text-[#0A0A0A] tracking-[-0.01em]">
                      Interactive Tools
                    </span>
                    <span
                      className="text-[9px] font-mono font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(139,92,246,0.12)", color: "#7C3AED" }}
                    >
                      AI-defensible
                    </span>
                  </div>
                  <p className="text-[13px] text-[rgba(10,10,10,0.50)]">
                    Visual tools you can&apos;t replace with AI — sliders, live charts, real-time simulators
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-violet-600 whitespace-nowrap flex-shrink-0">
                Try them
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ STATS STRIP ══════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-[rgba(0,0,0,0.08)] py-2 px-6">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center divide-x divide-[rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Stat value={`${TOOLS.length}+`} label="Free tools" />
          <Stat value="<1ms" label="Processing time" />
          <Stat value="0" label="Accounts needed" />
          <Stat value="100%" label="Client-side" />
        </motion.div>
      </section>

      {/* ══ ALL TOOLS GRID ═══════════════════════════════════════════════ */}
      <section id="tools" className="bg-[#FAFAFA] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-[rgba(10,10,10,0.35)]">Developer Tools</p>
            </div>
            <h2 className="font-display font-bold text-[22px] text-[#0A0A0A] tracking-[-0.02em]">
              Build, debug, and ship faster
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {devTools.map((tool, i) => (
              <ToolCard key={tool.path} {...tool} index={i} />
            ))}
          </div>

          <div className="h-px bg-[rgba(0,0,0,0.08)] mb-20" />

          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-[rgba(10,10,10,0.35)]">Finance Tools</p>
            </div>
            <h2 className="font-display font-bold text-[22px] text-[#0A0A0A] tracking-[-0.02em]">
              Metrics, runway & growth
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financeTools.map((tool, i) => (
              <ToolCard key={tool.path} {...tool} index={i} />
            ))}
          </div>

          {/* ── Interactive discovery teaser ── */}
          <div className="h-px bg-[rgba(0,0,0,0.08)] mb-12 mt-20" />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/tools/interactive"
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                         rounded-2xl border px-7 py-6
                         transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:shadow-[0_8px_32px_rgba(139,92,246,0.10)] hover:-translate-y-px"
              style={{
                borderColor: "rgba(139,92,246,0.18)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(255,255,255,0) 60%)",
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-[rgba(10,10,10,0.35)]">
                    Interactive Playground
                  </p>
                </div>
                <h3 className="font-display font-bold text-[18px] text-[#0A0A0A] tracking-[-0.02em] mb-1">
                  Visual tools AI can&apos;t replace
                </h3>
                <p className="text-[13.5px] text-[rgba(10,10,10,0.50)] max-w-md">
                  Cap table simulator, growth scenario modeler, and design playgrounds —
                  all driven by sliders with real-time output.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-violet-600 whitespace-nowrap">
                Explore {interactiveTools.length} tools
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURE CARDS — "Built like a tool should be" ════════════════ */}
      <FeatureCards />

      {/* ══ COMPARISON TABLE ═════════════════════════════════════════════ */}
      <ComparisonTable />

      {/* ══ CLOSING CTA ══════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[rgba(0,0,0,0.08)] py-24 px-6">
        <motion.div
          className="max-w-[560px] mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[rgba(10,10,10,0.35)] mb-4">
            No friction
          </p>
          <h2
            className="font-display font-bold text-[#0A0A0A] tracking-[-0.025em] mb-4"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            Start using tools instantly
          </h2>
          <p className="text-[15px] text-[rgba(10,10,10,0.50)] leading-relaxed mb-8">
            No account. No install. Click and go.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-lg bg-[#0A0A0A] text-[#FAFAFA] text-[15px] font-semibold
                       transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                       hover:bg-black hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)] active:scale-[0.97]"
          >
            Explore Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
