"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

function formatInr(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

function useCountUp(target: number, duration = 180) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) { setDisplay(target); return; }
    fromRef.current = display;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = fromRef.current;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // ease-sharp: cubic-bezier(0.22,1,0.36,1) — approximate with ease-out
      const t = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * t));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

function RunwayPreview() {
  const reducedMotion = useReducedMotion();
  // Cash: 0 to 1Cr (10_000_000), default 30L
  const [cash, setCash]   = useState(30_00_000);
  // Burn: 1L to 20L (100_000 to 2_000_000), default 3L
  const [burn, setBurn]   = useState(3_00_000);

  const rawMonths = burn > 0 ? cash / burn : 0;
  const months = Math.round(rawMonths * 10) / 10;
  const displayMonths = useCountUp(Math.round(months), reducedMotion ? 0 : 180);

  const pendingCash = useRef(cash);
  const pendingBurn = useRef(burn);
  const rafQueued = useRef(false);

  const flush = useCallback(() => {
    setCash(pendingCash.current);
    setBurn(pendingBurn.current);
    rafQueued.current = false;
  }, []);

  const handleCash = (e: React.ChangeEvent<HTMLInputElement>) => {
    pendingCash.current = Number(e.target.value);
    if (!rafQueued.current) { rafQueued.current = true; requestAnimationFrame(flush); }
  };

  const handleBurn = (e: React.ChangeEvent<HTMLInputElement>) => {
    pendingBurn.current = Number(e.target.value);
    if (!rafQueued.current) { rafQueued.current = true; requestAnimationFrame(flush); }
  };

  const runway = displayMonths;
  const urgency = runway <= 3 ? "text-red-500" : runway <= 6 ? "text-amber-500" : "text-[#10B981]";

  return (
    <div className="w-full max-w-[440px]" aria-label="Live runway calculator preview">
      {/* Label */}
      <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.40)] mb-5">
        This is live. Drag it.
      </p>

      {/* Output */}
      <div className="mb-7">
        <div className={cn("font-display font-bold tabular-nums leading-none", urgency)}
             style={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}>
          {runway}
        </div>
        <div className="font-mono text-[13px] text-[rgba(10,10,10,0.50)] mt-1 tracking-wide">
          months of runway
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-mono text-[11px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.45)]">
              Cash balance
            </label>
            <span className="font-mono text-[13px] font-medium tabular-nums text-[#0A0A0A]">
              {formatInr(cash)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10_000_000}
            step={100_000}
            value={cash}
            onChange={handleCash}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${(cash / 10_000_000) * 100}%, rgba(0,0,0,0.12) ${(cash / 10_000_000) * 100}%, rgba(0,0,0,0.12) 100%)`,
            }}
            aria-label="Cash balance"
          />
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-mono text-[11px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.45)]">
              Monthly burn
            </label>
            <span className="font-mono text-[13px] font-medium tabular-nums text-[#0A0A0A]">
              {formatInr(burn)}
            </span>
          </div>
          <input
            type="range"
            min={100_000}
            max={2_000_000}
            step={50_000}
            value={burn}
            onChange={handleBurn}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #10B981 ${((burn - 100_000) / 1_900_000) * 100}%, rgba(0,0,0,0.12) ${((burn - 100_000) / 1_900_000) * 100}%, rgba(0,0,0,0.12) 100%)`,
            }}
            aria-label="Monthly burn"
          />
        </div>
      </div>
    </div>
  );
}

interface HeroProps {
  announcement?: string;
}

export default function Hero({ announcement }: HeroProps) {
  return (
    <section
      className="relative pt-[calc(var(--nav-height,64px)+clamp(3.5rem,7vw,5rem))] pb-[clamp(3.5rem,7vw,6.5rem)]"
      aria-label="Hero"
    >
      <div className="page-container max-w-[1280px] mx-auto px-[clamp(1rem,3vw,2rem)]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div className="order-1">
            {/* Announcement pill */}
            {announcement && (
              <div
                role="banner"
                aria-label="Announcement"
                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.04)] text-[12px] font-mono tracking-[0.03em] text-[rgba(10,10,10,0.65)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                {announcement}
              </div>
            )}

            {/* H1 */}
            <h1
              className="font-display font-bold tracking-[-0.03em] text-[#0A0A0A] mb-5"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", lineHeight: 1.05 }}
            >
              Developer tools.<br />
              Finance tools.<br />
              Zero friction.
            </h1>

            {/* Sub */}
            <p className="text-[15px] leading-[1.625] text-[rgba(10,10,10,0.55)] mb-8 max-w-[480px]">
              100% free, 100% client-side. No accounts, no backend, no tracking, no paywalls.
              Move a slider, watch your runway re-render in milliseconds.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center h-10 px-5 rounded-[6px] bg-[#0A0A0A] text-[#FAFAFA] text-[14px] font-medium tracking-[-0.01em] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_8px_24px_-6px_rgba(0,0,0,0.18)] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-[#0A0A0A] focus-visible:outline-offset-2"
                style={{ transition: "box-shadow 220ms cubic-bezier(0.4,0,0.2,1), transform 80ms cubic-bezier(0.4,0,0.2,1)" }}
              >
                Open tools →
              </Link>
              <a
                href="#url-section"
                className="text-[14px] text-[rgba(10,10,10,0.55)] hover:text-[#0A0A0A] hover:underline transition-colors duration-[180ms] focus-visible:outline-2 focus-visible:outline-[#0A0A0A] focus-visible:outline-offset-2 rounded-[6px]"
              >
                See how URL sharing works
              </a>
            </div>

            {/* Credibility strip */}
            <p className="font-mono text-[11px] tracking-[0.06em] text-[rgba(10,10,10,0.40)]">
              100% free · open source · no account · works offline
            </p>
          </div>

          {/* ── Right: Live preview ── */}
          <div className="order-2 lg:order-2 flex justify-center lg:justify-end">
            <RunwayPreview />
          </div>

        </div>
      </div>

      {/* Slider thumb styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #0A0A0A;
          border: 2px solid #FAFAFA;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 120ms;
        }
        input[type=range]::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #0A0A0A;
          border: 2px solid #FAFAFA;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 120ms;
        }
        input[type=range]::-moz-range-thumb:active { cursor: grabbing; transform: scale(1.15); }
      `}</style>
    </section>
  );
}
