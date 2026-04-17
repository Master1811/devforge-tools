"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Share2, RotateCcw, Save, X, Bookmark, CheckCircle2 } from "lucide-react";
import type { SavedScenario } from "@/types/finance-tools";

interface FinanceScenarioManagerProps<T extends object> {
  savedScenarios: SavedScenario<T>[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: () => string;
  onReset: () => void;
  className?: string;
}

export default function FinanceScenarioManager<T extends object>({
  savedScenarios,
  onSave,
  onLoad,
  onDelete,
  onShare,
  onReset,
  className,
}: FinanceScenarioManagerProps<T>) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  const handleShare = () => {
    const url = onShare();
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          Scenarios
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            title="Copy shareable link"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium",
              "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
              copied ? "text-emerald-400 border-emerald-500/30" : "text-muted-foreground"
            )}
          >
            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={onReset}
            title="Reset to defaults"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Name this scenario…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-1 text-[12px] font-mono bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 disabled:opacity-40 transition-colors"
        >
          <Save className="w-3 h-3" />
          Save
        </button>
      </div>

      {savedScenarios.length > 0 && (
        <div className="space-y-1.5">
          {savedScenarios.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 group"
            >
              <Bookmark className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
              <button
                onClick={() => onLoad(s.id)}
                className="flex-1 text-left text-[12px] text-foreground/80 hover:text-foreground transition-colors truncate"
              >
                {s.name}
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-rose-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
