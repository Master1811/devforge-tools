"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden",
          "h-11 px-7 rounded-lg",
          "bg-[#0A0A0A] text-[#FAFAFA]",
          "text-[14px] font-semibold font-sans tracking-[-0.01em]",
          "border border-transparent",
          "transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:bg-black hover:shadow-[0_0_24px_rgba(0,0,0,0.20)]",
          "active:scale-[0.97] active:bg-[#1A1A1A]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0A0A]",
          "disabled:opacity-50 disabled:pointer-events-none",
          className,
        )}
        {...props}
      >
        {/* Shine sweep — white-on-black */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-[-80%] w-[55%] h-full skew-x-[-20deg]
                     bg-gradient-to-r from-transparent via-white/15 to-transparent
                     opacity-0 group-hover:opacity-100 group-hover:animate-[shiny-sweep_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        />
        <span className="relative">{children}</span>
      </button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";
export { ShinyButton };
