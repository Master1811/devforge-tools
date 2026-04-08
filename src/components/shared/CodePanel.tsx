"use client";

import { useCallback, useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  label: string;
  placeholder?: string;
  language?: string;
  minHeight?: string;
}

export default function CodePanel({ value, onChange, readOnly = false, label, placeholder, minHeight = "200px" }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const charCount = value.length;
  const lineCount = value ? value.split("\n").length : 0;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden",
      // Stable dark surface background - no grid patterns, no backdrop-blur that might cause artifacts
      "bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)]",
      // Subtle shadow for elevation
      "shadow-[var(--shadow-xs)]",
      // Focus-within state for the container
      "transition-[border-color,box-shadow] duration-200 ease-out",
      "focus-within:shadow-[var(--shadow-sm)] focus-within:border-[hsl(var(--foreground)/0.15)]",
      "interactive-card"
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)]">
        <span className="font-mono text-[11px] text-muted-foreground tracking-wide uppercase">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
            {charCount} chars · {lineCount} lines
          </span>
          {!readOnly && value && (
            <button
              onClick={() => onChange?.("")}
              aria-label={`Clear ${label}`}
              className={cn(
                "p-1.5 rounded-md transition-colors duration-150",
                "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10",
                "active:scale-95"
              )}
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {value && (
            <button
              onClick={handleCopy}
              aria-label={`Copy ${label}`}
              className={cn(
                "p-1.5 rounded-md transition-colors duration-150",
                "text-muted-foreground/50 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.08)]",
                "active:scale-95",
                copied && "text-accent hover:text-accent"
              )}
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor textarea - clean, distraction-free typing area */}
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          "w-full font-mono text-sm p-4 resize-y",
          // Transparent background to show container's bg
          "bg-transparent",
          // High contrast text
          "text-foreground",
          // Clean focus state - no outline, container handles visual feedback
          "focus:outline-none",
          // Placeholder styling
          "placeholder:text-muted-foreground/40",
          // Good line height for code
          "leading-relaxed",
          // Selection and caret
          "selection:bg-primary/20 caret-primary",
          "focus-visible:focus-ring"
        )}
        style={{ minHeight }}
        spellCheck={false}
      />
    </div>
  );
}
