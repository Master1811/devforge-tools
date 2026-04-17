"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/shared/Reveal";

interface CategoryCardProps {
  accent: string;
  accentRgb: string;
  label: string;
  heading: string;
  tools: { name: string; path: string }[];
  delay?: number;
}

function CategoryCard({ accent, accentRgb, label, heading, tools, delay = 0 }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <Reveal delay={delay}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSpotlight(s => ({ ...s, visible: false }))}
        className="relative rounded-[16px] border border-[rgba(0,0,0,0.10)] bg-white overflow-hidden group transition-[transform,border-color,box-shadow] duration-[220ms] ease-sharp hover:-translate-y-[1px] hover:border-[rgba(0,0,0,0.18)]"
        style={{
          "--accent": accent,
          "--accent-rgb": accentRgb,
        } as React.CSSProperties}
      >
        {/* 2px gradient top edge */}
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${accent} 60%, transparent 100%)`, opacity: 0.35 }}
        />

        {/* Cursor spotlight */}
        {spotlight.visible && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-[220ms]"
            style={{
              background: `radial-gradient(200px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${accentRgb}, 0.04), transparent 70%)`,
            }}
          />
        )}

        {/* Category shadow on hover */}
        <div
          className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms] pointer-events-none"
          style={{ boxShadow: `0 1px 2px rgba(0,0,0,0.10), 0 8px 24px -6px rgba(${accentRgb}, 0.06)` }}
        />

        <div className="p-6 relative">
          {/* Mono label */}
          <p
            className="font-mono text-[11px] tracking-[0.06em] uppercase mb-3 font-medium"
            style={{ color: accent }}
          >
            {label}
          </p>

          {/* Heading */}
          <h3
            className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[#0A0A0A] mb-4"
          >
            {heading}
          </h3>

          {/* Tool links */}
          <ul className="space-y-1.5">
            {tools.map(t => (
              <li key={t.path}>
                <Link
                  href={t.path}
                  className="text-[13px] text-[rgba(10,10,10,0.55)] hover:text-[#0A0A0A] transition-colors duration-[160ms] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
                  style={{ "--tw-ring-color": accent } as React.CSSProperties}
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

const categories: CategoryCardProps[] = [
  {
    accent: "#06B6D4",
    accentRgb: "6,182,212",
    label: "Dev Tools",
    heading: "Tools that belong in every dev's toolkit",
    tools: [
      { name: "JWT Decoder",           path: "/jwt-decoder" },
      { name: "JSON → TypeScript",      path: "/json-to-typescript" },
      { name: "SQL Formatter",          path: "/sql-formatter" },
      { name: "RegEx Tester",           path: "/regex-tester" },
    ],
    delay: 0,
  },
  {
    accent: "#10B981",
    accentRgb: "16,185,129",
    label: "Finance Tools",
    heading: "Model your runway before you run out of it",
    tools: [
      { name: "Runway Calculator",        path: "/tools/finance/runway-calculator" },
      { name: "ARR / MRR Calculator",      path: "/tools/finance/arr-calculator" },
      { name: "Burn Rate Calculator",      path: "/tools/finance/burn-rate-calculator" },
      { name: "₹100Cr Journey Calculator", path: "/tools/finance/100cr-calculator" },
    ],
    delay: 0.06,
  },
  {
    accent: "#8B5CF6",
    accentRgb: "139,92,246",
    label: "Interactive",
    heading: "Think with tools that think back",
    tools: [
      { name: "All Interactive Tools", path: "/tools/interactive" },
    ],
    delay: 0.12,
  },
];

export default function CategoryCards() {
  return (
    <section className="page-section">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map(cat => (
            <CategoryCard key={cat.label} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
