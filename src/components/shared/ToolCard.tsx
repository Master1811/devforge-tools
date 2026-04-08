"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/shared/Reveal";

interface ToolCardProps {
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  tag: string;
  index: number;
}

export default function ToolCard({ name, description, path, icon: Icon, tag, index }: ToolCardProps) {
  return (
    <Reveal delay={index * 0.035}>
      <Link
        href={path}
        className={cn(
          "group relative block rounded-2xl p-5 surface-panel interactive-card",
          "active:translate-y-0 active:scale-[0.99] active:bg-surface-2",
          "focus-visible:focus-ring"
        )}
      >
        {/* Icon with subtle bg */}
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-primary/15">
          <Icon className="w-4.5 h-4.5 text-primary transition-transform duration-300 ease-out-expo group-hover:scale-110" style={{ width: 18, height: 18 }} />
        </div>

        <h3 className="font-display font-bold text-[15px] mb-1 tracking-tight transition-colors duration-200 group-hover:text-foreground">
          {name}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
          {description}
        </p>

        <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-md border border-border text-muted-foreground/70 transition-colors duration-200 group-hover:border-primary/20 group-hover:text-muted-foreground">
          {tag}
        </span>
      </Link>
    </Reveal>
  );
}
