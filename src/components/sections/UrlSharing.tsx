"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/shared/Reveal";

const STEPS = [
  {
    num: "01",
    title: "Build your scenario",
    desc: "Set your cash balance, monthly burn, and growth assumptions in the Runway Calculator.",
    visual: (
      <div className="rounded-[8px] border border-[rgba(0,0,0,0.08)] bg-[#F2F2F2] p-4 font-mono text-[12px] leading-relaxed">
        <div className="text-[rgba(10,10,10,0.40)] mb-2 text-[10px] tracking-[0.06em] uppercase">Runway Calculator</div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[rgba(10,10,10,0.50)]">Cash balance</span>
            <span className="text-[#10B981] font-medium tabular-nums">₹40L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgba(10,10,10,0.50)]">Monthly burn</span>
            <span className="text-[#10B981] font-medium tabular-nums">₹4L</span>
          </div>
          <div className="h-px bg-[rgba(0,0,0,0.08)] my-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-[#0A0A0A]">Runway</span>
            <span className="text-[#10B981] tabular-nums">10 months</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Copy the URL",
    desc: "The entire app state is compressed into the URL — no server, no account, no database.",
    visual: (
      <div className="rounded-[8px] border border-[rgba(0,0,0,0.08)] bg-[#F2F2F2] p-4 font-mono text-[11px] leading-relaxed break-all">
        <div className="text-[rgba(10,10,10,0.40)] mb-2 text-[10px] tracking-[0.06em] uppercase">URL</div>
        <span className="text-[rgba(10,10,10,0.50)]">devforge.tools/tools/finance/runway-calculator</span>
        <span className="text-[rgba(10,10,10,0.30)]">?s=</span>
        <span className="text-[#8B5CF6] font-medium">eJyrVkrOS0zKTQUA</span>
        <span className="text-[rgba(10,10,10,0.30)] select-none">…</span>
      </div>
    ),
  },
  {
    num: "03",
    title: "Share — state intact",
    desc: "Your co-founder, investor, or teammate opens the link and sees exactly what you saw.",
    visual: (
      <div className="rounded-[8px] border border-[rgba(0,0,0,0.08)] bg-[#F2F2F2] p-4 font-mono text-[12px] leading-relaxed">
        <div className="text-[rgba(10,10,10,0.40)] mb-2 text-[10px] tracking-[0.06em] uppercase">Reconstructed state</div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[rgba(10,10,10,0.50)]">Cash balance</span>
            <span className="text-[#10B981] font-medium tabular-nums">₹40L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgba(10,10,10,0.50)]">Monthly burn</span>
            <span className="text-[#10B981] font-medium tabular-nums">₹4L</span>
          </div>
          <div className="h-px bg-[rgba(0,0,0,0.08)] my-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-[#0A0A0A]">Runway</span>
            <span className="text-[#10B981] tabular-nums">10 months</span>
          </div>
        </div>
      </div>
    ),
  },
];

const STEP_DURATION = 4000;

export default function UrlSharing() {
  const reducedMotion = useReducedMotion();
  const [active, setActive]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]   = useState(false);

  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (reducedMotion) return;

    const tick = (ts: number) => {
      if (pausedRef.current) {
        startRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / STEP_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setActive(prev => (prev + 1) % STEPS.length);
        startRef.current = null;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [reducedMotion]);

  return (
    <section
      id="url-section"
      className="page-section bg-[#F2F2F2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="URL sharing feature"
    >
      <div className="page-container">
        <Reveal>
          <div className="text-center mb-14">
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-3"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Your projection lives in the URL.
            </h2>
            <p className="text-[15px] text-[rgba(10,10,10,0.55)] max-w-[480px] mx-auto">
              Build a scenario. Copy the link. Your co-founder sees exactly what you saw.
            </p>
          </div>
        </Reveal>

        {/* Three-step row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.07}>
              <div
                className={`rounded-[16px] border bg-white p-6 transition-[border-color,box-shadow] duration-[220ms] ${
                  i === active
                    ? "border-[rgba(139,92,246,0.40)] shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_8px_24px_-6px_rgba(139,92,246,0.08)]"
                    : "border-[rgba(0,0,0,0.08)]"
                }`}
              >
                {/* Progress line */}
                <div className="h-[1px] bg-[rgba(0,0,0,0.08)] mb-5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B5CF6] transition-none"
                    style={{ width: i === active ? `${progress * 100}%` : i < active ? "100%" : "0%" }}
                  />
                </div>

                <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-3">
                  Step {step.num}
                </p>
                <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[#0A0A0A] mb-2">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[rgba(10,10,10,0.55)] mb-4">
                  {step.desc}
                </p>
                {step.visual}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Caption */}
        <Reveal>
          <p className="text-center font-mono text-[11px] tracking-[0.06em] text-[rgba(10,10,10,0.45)]">
            No account. No backend. No link shortener. Just base64.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
