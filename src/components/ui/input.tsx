import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout & sizing
          "flex h-10 w-full rounded-lg px-4 py-2 text-base md:text-sm",
          // Stable dark surface background - no animations, no grid patterns
          "bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)]",
          // High contrast foreground text for readability
          "text-foreground",
          // Placeholder styling with good visibility
          "placeholder:text-muted-foreground/50",
          // Focus states - subtle ring, no background change
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)]",
          // Hover state - subtle border enhancement only
          "hover:border-[hsl(var(--foreground)/0.15)]",
          // Caret color using accent for visibility
          "caret-primary",
          // Smooth transitions for border only
          "transition-[border-color,box-shadow] duration-200 ease-out",
          // File input styling
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Selection styling
          "selection:bg-primary/20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
