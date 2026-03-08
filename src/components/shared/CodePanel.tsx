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
    <div className="rounded-xl border border-border bg-surface/80 backdrop-blur-sm overflow-hidden shadow-[var(--shadow-xs)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-sm)] focus-within:border-muted-foreground/20">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface2/50">
        <span className="font-mono text-[11px] text-muted-foreground tracking-wide uppercase">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
            {charCount} chars · {lineCount} lines
          </span>
          {!readOnly && value && (
            <button
              onClick={() => onChange?.("")}
              className={cn(
                "p-1 rounded-md transition-all duration-200 ease-out-expo",
                "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10",
                "active:scale-90"
              )}
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {value && (
            <button
              onClick={handleCopy}
              className={cn(
                "p-1 rounded-md transition-all duration-200 ease-out-expo",
                "text-muted-foreground/50 hover:text-foreground hover:bg-muted",
                "active:scale-90",
                copied && "text-accent hover:text-accent"
              )}
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full bg-transparent font-mono text-sm p-4 resize-y focus:outline-none placeholder:text-muted-foreground/30 leading-relaxed selection:bg-primary/20"
        style={{ minHeight }}
        spellCheck={false}
      />
    </div>
  );
}
