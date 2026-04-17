"use client";

import { useRef, useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";

function formatInr(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function LiveDemoStrip() {
  const reducedMotion = useReducedMotion();

  const [cash, setCash] = useState(40_00_000);
  const [burn, setBurn] = useState(5_00_000);

  const pendingCash = useRef(cash);
  const pendingBurn = useRef(burn);
  const rafQueued   = useRef(false);

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

  const months = burn > 0 ? Math.round((cash / burn) * 10) / 10 : 0;

  return (
    <div className="bg-[#FAFAFA] border-t border-b border-[rgba(0,0,0,0.08)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,3vw,2rem)] py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">

          {/* Label */}
          <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.45)] shrink-0 whitespace-nowrap">
            This is not a video.<br className="sm:hidden" /> Drag it.
          </p>

          {/* Sliders */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-3 flex-1">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.38)] shrink-0 w-10">Cash</span>
              <input
                type="range"
                min={0}
                max={10_000_000}
                step={100_000}
                value={cash}
                onChange={handleCash}
                className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${(cash / 10_000_000) * 100}%, rgba(0,0,0,0.12) ${(cash / 10_000_000) * 100}%, rgba(0,0,0,0.12) 100%)`,
                }}
                aria-label="Cash balance"
              />
              <span className="font-mono text-[12px] tabular-nums text-[#0A0A0A] w-14 text-right shrink-0">{formatInr(cash)}</span>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.38)] shrink-0 w-10">Burn</span>
              <input
                type="range"
                min={100_000}
                max={2_000_000}
                step={50_000}
                value={burn}
                onChange={handleBurn}
                className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((burn - 100_000) / 1_900_000) * 100}%, rgba(0,0,0,0.12) ${((burn - 100_000) / 1_900_000) * 100}%, rgba(0,0,0,0.12) 100%)`,
                }}
                aria-label="Monthly burn"
              />
              <span className="font-mono text-[12px] tabular-nums text-[#0A0A0A] w-14 text-right shrink-0">{formatInr(burn)}</span>
            </div>
          </div>

          {/* Output */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span
              className="font-display font-bold tabular-nums leading-none text-[#0A0A0A]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              aria-live="polite"
              aria-label={`${months} months runway`}
            >
              {months}
            </span>
            <span className="font-mono text-[11px] tracking-[0.04em] text-[rgba(10,10,10,0.45)]">mo runway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
