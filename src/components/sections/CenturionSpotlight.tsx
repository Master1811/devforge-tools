"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/shared/Reveal";

function CenturionPreview() {
  return (
    <div className="rounded-[12px] border-2 border-[#10B981]/30 bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_48px_-12px_rgba(16,185,129,0.15)]">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#10B981]">₹100Cr Journey Calculator</span>
        <div className="flex gap-1.5">
          {["Real-time", "URL-shareable", "No data stored"].map(tag => (
            <span key={tag} className="font-mono text-[9px] tracking-[0.04em] text-[rgba(10,10,10,0.40)] border border-[rgba(0,0,0,0.08)] rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 font-mono text-[12px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Current MRR", value: "₹12L", pct: 40 },
            { label: "ARR", value: "₹1.44Cr", pct: 55 },
            { label: "Target ARR", value: "₹100Cr", pct: 100 },
            { label: "Years to target", value: "5.2 yr", pct: 70 },
          ].map(m => (
            <div key={m.label} className="rounded-[8px] bg-[#F2F2F2] p-3">
              <div className="text-[rgba(10,10,10,0.40)] text-[10px] tracking-[0.06em] uppercase mb-1">{m.label}</div>
              <div className="text-[#10B981] font-semibold tabular-nums text-[14px]">{m.value}</div>
              <div className="mt-2 h-1 rounded-full bg-[rgba(0,0,0,0.08)] overflow-hidden">
                <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-1 h-20">
          {[8, 15, 25, 42, 70, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${h}%`,
                background: i === 5 ? "#10B981" : `rgba(16,185,129,${0.12 + i * 0.12})`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {["Y1", "Y2", "Y3", "Y4", "Y5", "₹100Cr"].map(l => (
            <span key={l} className="text-[10px] text-[rgba(10,10,10,0.35)]">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CenturionSpotlight() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      if (!sectionRef.current || !previewRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = Math.max(0, -rect.top);
      const clamped = Math.min(scrollY, 600);
      // Parallax at 0.85× scroll velocity
      previewRef.current.style.transform = `translateY(${clamped * 0.15}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="page-section bg-[#F2F2F2] relative overflow-hidden"
      aria-label="₹100Cr Journey spotlight"
    >
      {/* Emerald top accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-40" />

      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <Reveal>
            <div>
              <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#10B981] mb-4">
                ₹100Cr Journey Calculator
              </p>
              <h2
                className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-4"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Map the path from MRR to ₹100Cr.
              </h2>
              <p className="text-[15px] leading-[1.625] text-[rgba(10,10,10,0.55)] mb-8 max-w-[480px]">
                Runway, ARR growth, burn multiples, equity dilution — modeled on your actual numbers,
                updated in real time, shareable in a URL.
              </p>

              <div className="flex gap-5 mb-8">
                {["Real-time", "URL-shareable", "No data stored"].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                    <span className="font-mono text-[11px] tracking-[0.04em] text-[rgba(10,10,10,0.50)]">{tag}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/tools/finance/100cr-calculator"
                className="inline-flex items-center justify-center h-10 px-5 rounded-[6px] bg-[#10B981] text-white text-[14px] font-medium tracking-[-0.01em] hover:shadow-[0_1px_2px_rgba(0,0,0,0.10),0_8px_24px_-6px_rgba(16,185,129,0.30)] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-[#10B981] focus-visible:outline-offset-2"
              style={{ transition: "box-shadow 220ms cubic-bezier(0.4,0,0.2,1), transform 80ms cubic-bezier(0.4,0,0.2,1)" }}
              >
                Open the ₹100Cr Journey →
              </Link>
            </div>
          </Reveal>

          {/* Right: preview with parallax */}
          <div ref={previewRef} className="will-change-transform">
            <Reveal>
              <CenturionPreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
