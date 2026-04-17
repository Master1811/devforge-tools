"use client";

import Link from "next/link";
import { ArrowRight, Lock, Sparkles, PieChart, Sliders, Palette, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSpotlight } from "@/hooks/useSpotlight";
import type { InteractiveToolDefinition } from "@/lib/tools/interactive/journey";

// Icon lookup — avoids passing React components across the server→client boundary
const ICON_MAP: Record<string, React.ElementType> = {
  "cap-table": PieChart,
  "growth-simulator": Sliders,
  glassmorphism: Palette,
  "og-preview": Globe2,
};

type SerializableTool = Omit<InteractiveToolDefinition, "icon">;

export function InteractiveHubCard({ tool }: { tool: SerializableTool }) {
  const isLive = tool.status === "live";
  const Icon = ICON_MAP[tool.id] ?? Sliders;

  const { cardRef, isHovered, spotlightBg, handlers } = useSpotlight({
    tint: "rgba(139,92,246,0.04)",
    radius: 220,
  });

  const card = (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      {...(isLive ? handlers : {})}
      className={`group relative flex flex-col h-full rounded-2xl border p-5 overflow-hidden ${
        isLive
          ? [
              "border-[rgba(139,92,246,0.18)] bg-white",
              "hover:-translate-y-0.5 hover:border-[rgba(139,92,246,0.32)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.10)]",
              "[transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]",
            ].join(" ")
          : "border-[rgba(0,0,0,0.07)] bg-[rgba(0,0,0,0.01)] opacity-65"
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

      {/* Top gradient hairline — live only */}
      {isLive && (
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.45) 50%, transparent 95%)" }}
        />
      )}

      <div className="relative flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={
            isLive
              ? { background: "rgba(139,92,246,0.09)", borderColor: "rgba(139,92,246,0.16)" }
              : { background: "rgba(0,0,0,0.03)", borderColor: "rgba(0,0,0,0.07)" }
          }
        >
          <Icon className="w-4 h-4" style={{ color: isLive ? "#8B5CF6" : "rgba(10,10,10,0.30)" }} />
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${
            isLive
              ? "text-violet-500 bg-violet-500/10 border-violet-500/20"
              : "text-[rgba(10,10,10,0.30)] bg-[rgba(0,0,0,0.03)] border-[rgba(0,0,0,0.07)]"
          }`}
        >
          {isLive ? "Live" : "Soon"}
        </span>
      </div>

      <h3 className="relative font-semibold text-[15px] mb-1.5 text-[#0A0A0A] leading-snug group-hover:text-violet-700 transition-colors duration-200">
        {tool.name}
      </h3>
      <p className="relative text-[13px] text-[rgba(10,10,10,0.48)] leading-relaxed flex-1 mb-3">
        {isLive ? tool.description : tool.previewDescription}
      </p>

      <div className="relative flex items-start gap-1.5 mb-4 text-[10.5px] font-mono text-[rgba(139,92,246,0.65)] leading-snug">
        <Sparkles className="w-3 h-3 flex-shrink-0 mt-px" />
        {tool.aiDefenseReason}
      </div>

      {isLive ? (
        <div className="relative flex items-center gap-1 text-[12px] font-medium mt-auto" style={{ color: "#8B5CF6" }}>
          Open tool
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      ) : (
        <button
          disabled
          className="relative mt-auto inline-flex items-center justify-center gap-2 text-[12px] px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.07)] text-[rgba(10,10,10,0.30)] bg-[rgba(0,0,0,0.02)] cursor-not-allowed"
        >
          <Lock className="w-3.5 h-3.5" />
          Coming soon
        </button>
      )}
    </div>
  );

  return isLive ? <Link href={tool.path}>{card}</Link> : <div>{card}</div>;
}
