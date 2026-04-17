"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { ChartSeries, ChartReferenceLine } from "@/types/finance-tools";

// HSL values mapped from CSS design tokens
const COLOR_MAP: Record<string, string> = {
  primary: "hsl(214 95% 52%)",
  accent: "hsl(160 84% 43%)",
  destructive: "hsl(330 81% 56%)",
  yellow: "hsl(38 92% 50%)",
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
  yFormatter?: (v: number) => string;
}

function ChartTooltip({ active, payload, label, yFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const fmt = yFormatter ?? ((v: number) => v.toFixed(1));
  return (
    <div className="rounded-lg border border-white/10 bg-background/90 backdrop-blur-sm px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <p className="font-semibold text-foreground">{p.name}: {fmt(p.value)}</p>
        </div>
      ))}
    </div>
  );
}

interface FinanceChartProps {
  data: Record<string, string | number>[];
  series: ChartSeries[];
  xDataKey: string;
  yTickFormatter?: (v: number) => string;
  referenceLines?: ChartReferenceLine[];
  height?: number;
  title?: string;
  className?: string;
}

export default function FinanceChart({
  data,
  series,
  xDataKey,
  yTickFormatter,
  referenceLines,
  height = 220,
  title,
  className,
}: FinanceChartProps) {
  return (
    <div className={cn("rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-5", className)}>
      {title && (
        <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-4">
          {title}
        </p>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {series.map((s) => {
              const color = COLOR_MAP[s.colorVar] ?? COLOR_MAP.primary;
              return (
                <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={s.filled !== false ? 0.3 : 0} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 12%)" />

          <XAxis
            dataKey={xDataKey}
            tick={{ fontSize: 10, fill: "hsl(240 10% 50%)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(240 10% 50%)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={yTickFormatter}
          />

          <Tooltip content={<ChartTooltip yFormatter={yTickFormatter} />} />

          {referenceLines?.map((rl, i) => {
            const color = COLOR_MAP[rl.colorVar] ?? COLOR_MAP.primary;
            return (
              <ReferenceLine
                key={i}
                {...(rl.axis === "x" ? { x: rl.value } : { y: rl.value })}
                stroke={color}
                strokeDasharray="5 3"
                label={{ value: rl.label, position: rl.axis === "y" ? "right" : "top", fontSize: 10, fill: color }}
              />
            );
          })}

          {series.map((s) => {
            const color = COLOR_MAP[s.colorVar] ?? COLOR_MAP.primary;
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={color}
                fill={`url(#grad-${s.dataKey})`}
                strokeWidth={s.dashed ? 1.5 : 2}
                strokeDasharray={s.dashed ? "4 2" : undefined}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-2 justify-center">
        {series.map((s) => {
          const color = COLOR_MAP[s.colorVar];
          return (
            <div key={s.dataKey} className="flex items-center gap-1.5">
              <div
                className="w-3 h-0.5 rounded"
                style={{
                  background: color,
                  borderTop: s.dashed ? `1px dashed ${color}` : undefined,
                  opacity: s.dashed ? 0.8 : 1,
                }}
              />
              <span className="text-[11px] text-muted-foreground/60 font-mono">{s.name}</span>
            </div>
          );
        })}
        {referenceLines?.map((rl, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded opacity-60" style={{ background: COLOR_MAP[rl.colorVar] }} />
            <span className="text-[11px] text-muted-foreground/60 font-mono">{rl.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
