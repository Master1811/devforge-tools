import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Layout & sizing
        "flex min-h-[80px] w-full rounded-lg px-4 py-3 text-sm",
        // Stable dark surface background - no animations, no grid patterns
        "bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)]",
        // High contrast foreground text for readability
        "text-foreground leading-relaxed",
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
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Selection styling
        "selection:bg-primary/20",
        // Resizing
        "resize-y",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
