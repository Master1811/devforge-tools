"use client";

import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface FinanceInputRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  prefix?: string;
  description: string;
  onChange: (v: number) => void;
  className?: string;
}

export default function FinanceInputRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  prefix = "",
  description,
  onChange,
  className,
}: FinanceInputRowProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-foreground/90">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && (
            <span className="text-[13px] text-muted-foreground font-mono">{prefix}</span>
          )}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className={cn(
              "w-20 text-right text-[13px] font-mono tabular-nums",
              "bg-white/5 border border-white/10 rounded-md px-2 py-1",
              "text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40",
              "transition-colors duration-200"
            )}
          />
          <span className="text-[13px] text-muted-foreground font-mono">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <p className="text-[11px] text-muted-foreground/50">{description}</p>
    </div>
  );
}
