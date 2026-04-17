"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/shared/Reveal";

interface GalleryTool {
  name: string;
  desc: string;
  path: string;
  accent: string;
  accentRgb: string;
  size: "sm" | "md" | "lg" | "tall" | "wide";
  preview: React.ReactNode;
}

function TerminalPreview({ title, lines }: { title: string; lines: { color: string; text: string }[] }) {
  return (
    <div className="rounded-lg overflow-hidden select-none text-[11px] font-mono">
      <div className="bg-[#1A1A1A] px-3 py-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
        <span className="w-2 h-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[rgba(255,255,255,0.25)] text-[10px]">{title}</span>
      </div>
      <div className="bg-[#111] px-3 py-3 space-y-0.5 leading-[1.7]">
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.color }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

function PanelPreview({ label, rows }: { label: string; rows: { k: string; v: string; vc?: string }[] }) {
  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] p-3 text-[11px] font-mono">
      <div className="text-[10px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.35)] mb-2">{label}</div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="text-[rgba(10,10,10,0.45)]">{r.k}</span>
            <span style={{ color: r.vc ?? "#0A0A0A" }} className="font-medium tabular-nums">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOOLS: GalleryTool[] = [
  // Dev Tools
  {
    name: "JWT Decoder",
    desc: "Decode tokens without sending data anywhere",
    path: "/jwt-decoder",
    accent: "#06B6D4",
    accentRgb: "6,182,212",
    size: "md",
    preview: (
      <TerminalPreview
        title="jwt-decoder"
        lines={[
          { color: "rgba(255,255,255,0.30)", text: '// payload' },
          { color: "rgba(255,255,255,0.70)", text: '{' },
          { color: "#67E8F9", text: '  "sub": "usr_42",' },
          { color: "#67E8F9", text: '  "exp": 1720000000,' },
          { color: "#6EE7B7", text: '  "role": "admin"' },
          { color: "rgba(255,255,255,0.70)", text: '}' },
        ]}
      />
    ),
  },
  {
    name: "RegEx Tester",
    desc: "Test patterns with live match highlighting",
    path: "/regex-tester",
    accent: "#06B6D4",
    accentRgb: "6,182,212",
    size: "sm",
    preview: (
      <div className="rounded-lg bg-[#111] p-3 font-mono text-[11px]">
        <span className="text-[rgba(255,255,255,0.35)]">/</span>
        <span className="text-[#67E8F9]">(\w+)@(\w+)</span>
        <span className="text-[rgba(255,255,255,0.35)]">/g</span>
        <div className="mt-2 text-[rgba(255,255,255,0.50)]">
          <span className="bg-cyan-500/20 text-cyan-300 px-0.5 rounded">user@example</span>
          <span className="text-[rgba(255,255,255,0.30)]">.com</span>
        </div>
      </div>
    ),
  },
  {
    name: "SQL Formatter",
    desc: "Beautify and format SQL queries instantly",
    path: "/sql-formatter",
    accent: "#06B6D4",
    accentRgb: "6,182,212",
    size: "sm",
    preview: (
      <TerminalPreview
        title="sql-formatter"
        lines={[
          { color: "#93C5FD", text: "SELECT" },
          { color: "rgba(255,255,255,0.70)", text: "  id, name, email" },
          { color: "#93C5FD", text: "FROM users" },
          { color: "#93C5FD", text: "WHERE" },
          { color: "rgba(255,255,255,0.70)", text: "  active = true" },
        ]}
      />
    ),
  },
  {
    name: "JSON → TypeScript",
    desc: "Infer types from any JSON shape",
    path: "/json-to-typescript",
    accent: "#06B6D4",
    accentRgb: "6,182,212",
    size: "md",
    preview: (
      <TerminalPreview
        title="json-to-ts"
        lines={[
          { color: "#A5B4FC", text: "interface User {" },
          { color: "#67E8F9", text: "  id: number;" },
          { color: "#67E8F9", text: "  name: string;" },
          { color: "#67E8F9", text: "  email: string;" },
          { color: "#A5B4FC", text: "}" },
        ]}
      />
    ),
  },
  // Finance Tools
  {
    name: "Runway Calculator",
    desc: "Know exactly how long your cash lasts",
    path: "/tools/finance/runway-calculator",
    accent: "#10B981",
    accentRgb: "16,185,129",
    size: "lg",
    preview: (
      <PanelPreview
        label="Runway Analysis"
        rows={[
          { k: "Cash balance", v: "₹50L", vc: "#10B981" },
          { k: "Monthly burn", v: "₹4L" },
          { k: "Runway", v: "12.5 months", vc: "#10B981" },
          { k: "Break-even", v: "Month 15" },
          { k: "Default alive?", v: "No", vc: "#EF4444" },
        ]}
      />
    ),
  },
  {
    name: "ARR / MRR Calculator",
    desc: "Model recurring revenue growth scenarios",
    path: "/tools/finance/arr-calculator",
    accent: "#10B981",
    accentRgb: "16,185,129",
    size: "sm",
    preview: (
      <PanelPreview
        label="ARR Model"
        rows={[
          { k: "MRR", v: "₹8.2L", vc: "#10B981" },
          { k: "ARR", v: "₹98.4L", vc: "#10B981" },
          { k: "Growth MoM", v: "12%" },
        ]}
      />
    ),
  },
  {
    name: "Burn Rate Calculator",
    desc: "Gross vs net burn, visualised",
    path: "/tools/finance/burn-rate-calculator",
    accent: "#10B981",
    accentRgb: "16,185,129",
    size: "sm",
    preview: (
      <PanelPreview
        label="Burn Analysis"
        rows={[
          { k: "Gross burn", v: "₹6L" },
          { k: "Revenue", v: "₹2L", vc: "#10B981" },
          { k: "Net burn", v: "₹4L", vc: "#EF4444" },
        ]}
      />
    ),
  },
  // Interactive
  {
    name: "₹100Cr Journey",
    desc: "Map MRR → ARR → ₹100Cr in real time",
    path: "/tools/finance/100cr-calculator",
    accent: "#8B5CF6",
    accentRgb: "139,92,246",
    size: "wide",
    preview: (
      <div className="flex items-center gap-3 font-mono text-[11px]">
        {[10, 25, 50, 100].map((v, i) => (
          <div key={v} className="flex flex-col items-center gap-1">
            <div
              className="rounded-md flex items-end justify-center overflow-hidden"
              style={{
                width: 36, height: 48,
                background: `rgba(139,92,246,${0.1 + i * 0.2})`,
              }}
            >
              <div
                className="w-full rounded-t-sm"
                style={{ height: `${20 + i * 18}%`, background: "#8B5CF6", opacity: 0.4 + i * 0.15 }}
              />
            </div>
            <span className="text-[rgba(10,10,10,0.45)]">₹{v}Cr</span>
          </div>
        ))}
      </div>
    ),
  },
];

const sizeClasses: Record<string, string> = {
  sm:   "col-span-1 row-span-1",
  md:   "col-span-2 row-span-1",
  lg:   "col-span-2 row-span-2",
  tall: "col-span-1 row-span-2",
  wide: "col-span-3 row-span-1",
};

function GalleryCard({ tool }: { tool: GalleryTool }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  return (
    <Link
      href={tool.path}
      className={`block ${sizeClasses[tool.size]}`}
      tabIndex={0}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSpot(s => ({ ...s, on: false }))}
        className="h-full rounded-[16px] border border-[rgba(0,0,0,0.10)] bg-white p-5 flex flex-col gap-4 group transition-[transform,border-color,box-shadow] duration-[220ms] ease-sharp hover:-translate-y-[1px] hover:border-[rgba(0,0,0,0.18)] cursor-pointer relative overflow-hidden"
        style={{ minHeight: tool.size === "lg" || tool.size === "tall" ? 260 : 160 }}
      >
        {/* Spotlight */}
        {spot.on && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(180px circle at ${spot.x}px ${spot.y}px, rgba(${tool.accentRgb}, 0.04), transparent 70%)`,
            }}
          />
        )}

        {/* Hover shadow */}
        <div
          className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms] pointer-events-none"
          style={{ boxShadow: `0 1px 2px rgba(0,0,0,0.10), 0 8px 24px -6px rgba(${tool.accentRgb}, 0.08)` }}
        />

        {/* Header */}
        <div className="flex items-center gap-2 relative">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: tool.accent }}
            aria-hidden
          />
          <span className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[#0A0A0A]">
            {tool.name}
          </span>
        </div>

        <p className="text-[13px] text-[rgba(10,10,10,0.50)] leading-relaxed relative">
          {tool.desc}
        </p>

        {/* Preview */}
        <div className="mt-auto relative">
          {tool.preview}
        </div>
      </div>
    </Link>
  );
}

export default function ToolGallery() {
  const devTools      = TOOLS.filter(t => t.accent === "#06B6D4");
  const financeTools  = TOOLS.filter(t => t.accent === "#10B981");
  const interactive   = TOOLS.filter(t => t.accent === "#8B5CF6");

  return (
    <section className="page-section">
      <div className="page-container">
        <Reveal>
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-2">Tool Gallery</p>
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Every tool, ready to use.
            </h2>
          </div>
        </Reveal>

        {/* Dev Tools grid */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#06B6D4] mb-4">Dev Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px]">
            {devTools.map((tool, i) => (
              <Reveal key={tool.path} delay={i * 0.04}>
                <GalleryCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(0,0,0,0.06)] mb-8" />

        {/* Finance Tools */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#10B981] mb-4">Finance Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[160px]">
            {financeTools.map((tool, i) => (
              <Reveal key={tool.path} delay={i * 0.04}>
                <GalleryCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(0,0,0,0.06)] mb-8" />

        {/* Interactive */}
        <div>
          <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#8B5CF6] mb-4">Interactive</p>
          <div className="grid grid-cols-1 gap-4 auto-rows-[160px]">
            {interactive.map((tool, i) => (
              <Reveal key={tool.path} delay={i * 0.04}>
                <GalleryCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
