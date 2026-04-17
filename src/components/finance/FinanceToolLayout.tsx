"use client";

import { ReactNode } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import InsightEngine from "@/components/shared/InsightEngine";
import FinanceMetricCard from "@/components/finance/FinanceMetricCard";
import FinanceScenarioManager from "@/components/finance/FinanceScenarioManager";
import type { InsightEngineData, SummaryCardDef, SavedScenario } from "@/types/finance-tools";

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
  scenarioControls,
}: FinanceToolLayoutProps<T>) {
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
    >
      <div className="p-4 sm:p-6 space-y-6">

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

      </div>
    </ToolLayout>
  );
}
