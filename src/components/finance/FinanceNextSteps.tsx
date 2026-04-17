"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NextStepTool {
  name: string;
  path: string;
  description: string;
}

interface FinanceNextStepsProps {
  tools: NextStepTool[];
}

export default function FinanceNextSteps({ tools }: FinanceNextStepsProps) {
  if (!tools.length) return null;

  return (
    <section className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5">
      <h2 className="text-[18px] font-semibold tracking-tight">What should you do next?</h2>
      <p className="text-[13px] text-muted-foreground mt-1 mb-4">
        Based on this calculation, these are the best follow-up tools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.slice(0, 4).map((tool, index) => (
          <Link
            key={tool.path}
            href={tool.path}
            className="group rounded-lg border border-border/70 bg-surface/60 p-4
                       hover:border-primary/30 hover:shadow-[var(--shadow-glow)]
                       [transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]
                       hover:-translate-y-px"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/55 mb-1">
              {index === 0 ? "Recommended next step" : "Next step"}
            </div>
            <h3 className="text-[14px] font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
            <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{tool.description}</p>
            <div className="mt-3 text-[12px] inline-flex items-center gap-1 text-primary font-medium">
              Open tool
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
