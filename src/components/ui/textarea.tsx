import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg px-3 py-3",
          "font-mono text-sm text-[#0A0A0A] leading-relaxed",
          "bg-white border border-[rgba(0,0,0,0.14)]",
          "placeholder:text-[rgba(10,10,10,0.32)]",
          "hover:border-[rgba(0,0,0,0.24)]",
          "focus:outline focus:outline-1 focus:outline-offset-0 focus:outline-[rgba(0,0,0,0.60)] focus:border-transparent",
          "transition-[border-color,outline-color] duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "caret-[#0A0A0A] selection:bg-black/10",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "resize-y",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
