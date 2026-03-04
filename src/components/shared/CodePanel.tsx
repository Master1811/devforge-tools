import { useCallback, useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

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
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface2">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">{charCount} chars • {lineCount} lines</span>
          {!readOnly && value && (
            <button onClick={() => onChange?.("")} className="p-1 rounded hover:bg-muted transition-colors" title="Clear">
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          {value && (
            <button onClick={handleCopy} className="p-1 rounded hover:bg-muted transition-colors" title="Copy">
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full bg-transparent font-mono text-sm p-4 resize-y focus:outline-none placeholder:text-muted-foreground/40"
        style={{ minHeight }}
        spellCheck={false}
      />
    </div>
  );
}
