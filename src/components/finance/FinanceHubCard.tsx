"use client";

import Link from "next/link";
import { ArrowRight, Lock, TrendingUp, BarChart3, Flame, Target, Calculator, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
import type { FinanceToolDefinition } from "@/lib/tools/finance/journey";

// Icon lookup — avoids passing React components across the server→client boundary
const ICON_MAP: Record<string, React.ElementType> = {
  arr: TrendingUp,
  "growth-rate": BarChart3,
  runway: Flame,
  "100cr": Target,
  "burn-rate": Calculator,
  "fundraising-readiness": Target,
  "scenario-simulation": Zap,
};

type SerializableTool = Omit<FinanceToolDefinition, "icon">;

export function FinanceHubCard({ tool }: { tool: SerializableTool }) {
  const isLive = tool.status === "live";
  const Icon = ICON_MAP[tool.id] ?? TrendingUp;

  const { cardRef, isHovered, spotlightBg, handlers } = useSpotlight({
    tint: "rgba(16,185,129,0.04)",
    radius: 220,
  });

  const card = (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      {...(isLive ? handlers : {})}
      className={`group relative flex flex-col h-full rounded-2xl border bg-surface/60 backdrop-blur-sm p-5 overflow-hidden ${
        isLive
          ? [
              "border-border",
              "hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]",
              "[transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]",
            ].join(" ")
          : "border-border/40 opacity-70"
      }`}
    >
      {/* Cursor-following spotlight — live only */}
      {isLive && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: spotlightBg,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 220ms",
          }}
        />
      )}

      <div className="relative flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${
            isLive
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-muted-foreground/65 bg-white/5 border-white/10"
          }`}
        >
          {isLive ? "Live" : "Coming soon"}
        </span>
      </div>

      <h3 className="relative font-semibold text-[15px] mb-2 group-hover:text-primary transition-colors duration-200">
        {tool.name}
      </h3>
      <p className="relative text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">
        {isLive ? tool.description : tool.previewDescription}
      </p>

      {isLive ? (
        <div className="relative flex items-center gap-1 text-[12px] text-primary font-medium mt-auto">
          Open tool
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      ) : (
        <button
          disabled
          className="relative mt-auto inline-flex items-center justify-center gap-2 text-[12px] px-3 py-2 rounded-lg border border-white/10 text-muted-foreground/65 bg-white/5 cursor-not-allowed"
        >
          <Lock className="w-3.5 h-3.5" />
          Preview only
        </button>
      )}
    </div>
  );

  return isLive ? <Link href={tool.path}>{card}</Link> : <div>{card}</div>;
}
