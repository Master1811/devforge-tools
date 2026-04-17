"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpotlight } from "@/hooks/useSpotlight";

interface ToolCardProps {
  name:        string;
  description: string;
  path:        string;
  icon:        LucideIcon;
  tag:         string;
  index:       number;
}

export default function ToolCard({
  name, description, path, icon: Icon, tag, index,
}: ToolCardProps) {
  const { cardRef, isHovered, spotlightBg, handlers } = useSpotlight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        ref={cardRef as React.RefObject<HTMLAnchorElement>}
        href={path}
        {...handlers}
        className={cn(
          "group relative block overflow-hidden rounded-xl",
          "bg-white border border-[rgba(0,0,0,0.10)]",
          "p-5",
          // Unified hover transition signature (Item 14)
          "[transition:transform_220ms_cubic-bezier(0.22,1,0.36,1),border-color_220ms_cubic-bezier(0.22,1,0.36,1),box-shadow_280ms_cubic-bezier(0.22,1,0.36,1),background-color_180ms_cubic-bezier(0.22,1,0.36,1)]",
          "hover:border-[rgba(0,0,0,0.20)]",
          "hover:shadow-[0_4px_20px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.05)]",
          "hover:-translate-y-px",
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,0,0,0.6)]",
          "active:scale-[0.99]",
        )}
      >
        {/* Cursor-following spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-[220ms]"
          style={{
            background: spotlightBg,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Top hairline on hover */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]" />

        <div className="relative">
          {/* Icon */}
          <div className="w-9 h-9 rounded-lg bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.08)] flex items-center justify-center mb-4 transition-all duration-[200ms] group-hover:bg-[rgba(0,0,0,0.07)] group-hover:border-[rgba(0,0,0,0.12)]">
            <Icon className="w-[18px] h-[18px] text-[rgba(10,10,10,0.50)] group-hover:text-[rgba(10,10,10,0.80)] transition-colors duration-[200ms]" />
          </div>

          {/* Name + description */}
          <h3 className="font-display font-semibold text-[15px] text-[#0A0A0A] tracking-[-0.01em] mb-1.5 leading-snug">
            {name}
          </h3>
          <p className="text-[13px] text-[rgba(10,10,10,0.50)] leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[rgba(0,0,0,0.06)]">
            <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-[rgba(10,10,10,0.28)]">
              {tag}
            </span>
            <ArrowRight
              className={cn(
                "w-3.5 h-3.5 text-[rgba(10,10,10,0.40)] transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isHovered ? "translate-x-0.5 text-[rgba(10,10,10,0.80)]" : "-translate-x-1 opacity-0",
              )}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
