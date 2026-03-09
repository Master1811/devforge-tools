"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={path}
        className={cn(
          "group relative block p-5 rounded-xl border border-border bg-surface/80 backdrop-blur-sm",
          "transition-all duration-300 ease-out-expo",
          "hover:border-primary/30 hover:shadow-[var(--shadow-glow)]",
          "hover:-translate-y-0.5",
          "active:translate-y-0 active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
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
    </motion.div>
  );
}
