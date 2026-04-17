import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg px-3 py-2",
          "font-mono text-sm text-[#0A0A0A]",
          "bg-white border border-[rgba(0,0,0,0.14)]",
          "placeholder:text-[rgba(10,10,10,0.32)]",
          "hover:border-[rgba(0,0,0,0.24)]",
          "focus:outline focus:outline-1 focus:outline-offset-0 focus:outline-[rgba(0,0,0,0.60)] focus:border-transparent",
          "transition-[border-color,outline-color] duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "caret-[#0A0A0A] selection:bg-black/10",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#0A0A0A]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
