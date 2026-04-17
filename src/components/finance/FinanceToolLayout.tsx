"use client";

import { ReactNode, useMemo, useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import InsightEngine from "@/components/shared/InsightEngine";
import FinanceMetricCard from "@/components/finance/FinanceMetricCard";
import FinanceScenarioManager from "@/components/finance/FinanceScenarioManager";
import FinanceNextSteps from "@/components/finance/FinanceNextSteps";
import type { InsightEngineData, SummaryCardDef, SavedScenario } from "@/types/finance-tools";
import { CheckCircle2, Copy, Link as LinkIcon, RotateCcw, Sparkles } from "lucide-react";

interface FAQ { q: string; a: string; }
interface RelatedTool { name: string; path: string; description: string; }

interface ScenarioControls<T extends object> {
  savedScenarios: SavedScenario<T>[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: () => string;
  onReset: () => void;
}

interface FinanceToolLayoutProps<T extends object> {
  // ── ToolLayout pass-through ──
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  howToUse: string[];
  whatIs: { title: string; content: string };
  faqs: FAQ[];
  relatedTools: RelatedTool[];
  jsonLd?: object;

  // ── Inner layout ──
  summaryCards: SummaryCardDef[];
  inputs: ReactNode;
  outputs: ReactNode;          // Charts, milestones, supplementary panels
  insightData: InsightEngineData;
  onLoadExample?: () => void;
  scenarioControls?: ScenarioControls<T>;
}

const FINANCE_PRIVACY_BANNER = {
  title: "100% Client-Side: Your Financial Data Never Leaves Your Browser.",
  description:
    "All projections and calculations run locally on your device. Zero data transmission — complete privacy for your startup metrics.",
};

export default function FinanceToolLayout<T extends object>({
  title,
  slug,
  description,
  keywords,
  howToUse,
  whatIs,
  faqs,
  relatedTools,
  jsonLd,
  summaryCards,
  inputs,
  outputs,
  insightData,
  onLoadExample,
  scenarioControls,
}: FinanceToolLayoutProps<T>) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const copyResults = async () => {
    const lines = summaryCards.map((card) => `${card.label}: ${card.value}${card.sub ? ` (${card.sub})` : ""}`);
    const payload = `${title}\n${lines.join("\n")}`;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareLink = async () => {
    if (!scenarioControls) return;
    const url = scenarioControls.onShare();
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  const nextTools = useMemo(() => relatedTools.slice(0, 4), [relatedTools]);

  return (
    <ToolLayout
      title={title}
      slug={slug}
      description={description}
      keywords={keywords}
      howToUse={howToUse}
      whatIs={whatIs}
      faqs={faqs}
      relatedTools={relatedTools}
      jsonLd={jsonLd}
      privacyBanner={FINANCE_PRIVACY_BANNER}
      hideRelatedToolsSection
    >
      <div className="p-4 sm:p-6 space-y-6 pb-24">

        {/* 1 ── Summary metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map((card) => (
            <FinanceMetricCard key={card.label} {...card} />
          ))}
        </div>

        {/* 2 ── Two-column: inputs + outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Inputs column */}
          <div className="space-y-4">
            {onLoadExample && (
              <button
                onClick={onLoadExample}
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-primary/25 bg-primary/10 hover:bg-primary/15 text-primary text-[12px] font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Example inputs
              </button>
            )}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5 space-y-5">
              <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">
                Your Numbers
              </p>
              {inputs}
            </div>

            {scenarioControls && (
              <FinanceScenarioManager {...scenarioControls} />
            )}
          </div>

          {/* Outputs column */}
          <div className="space-y-4">
            {outputs}
          </div>
        </div>

        {/* 3 ── Insight Engine (full-width) */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
          <InsightEngine data={insightData} />
        </div>

        {/* 4 ── Guided next tools */}
        <FinanceNextSteps tools={nextTools} />

      </div>

      {/* Sticky action bar */}
      {scenarioControls && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(960px,calc(100%-1.5rem))] rounded-xl border border-white/10 bg-background/90 backdrop-blur-md shadow-lg px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="hidden sm:block text-[11px] font-mono text-muted-foreground/65 uppercase tracking-widest">
              Quick Actions
            </p>
            <div className="w-full sm:w-auto grid grid-cols-3 gap-2">
              <button
                onClick={() => copyResults().catch(() => {})}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Results"}
              </button>
              <button
                onClick={() => shareLink().catch(() => {})}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
              >
                {shared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
                {shared ? "Copied" : "Share Link"}
              </button>
              <button
                onClick={scenarioControls.onReset}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-surface/70 hover:bg-surface text-[12px] font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
