import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium font-sans tracking-[-0.01em]",
    "transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#0A0A0A]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Black button — primary CTA on white bg */
        default:
          "bg-[#0A0A0A] text-[#FAFAFA] hover:bg-black hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded-lg",
        /* Transparent with dark border */
        outline:
          "border border-[rgba(0,0,0,0.18)] bg-transparent text-[rgba(10,10,10,0.80)] hover:border-[rgba(0,0,0,0.32)] hover:bg-[rgba(0,0,0,0.04)] rounded-lg",
        /* No border, subtle hover bg */
        ghost:
          "bg-transparent text-[rgba(10,10,10,0.55)] hover:bg-[rgba(0,0,0,0.06)] hover:text-[#0A0A0A] rounded-lg",
        /* Destructive */
        destructive:
          "bg-red-600/90 text-white hover:bg-red-500 rounded-lg",
        /* Text-only */
        link:
          "bg-transparent text-[rgba(10,10,10,0.55)] hover:text-[#0A0A0A] underline-offset-4 hover:underline p-0 h-auto",
        /* Subtle elevated */
        secondary:
          "bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.10)] text-[rgba(10,10,10,0.80)] hover:bg-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.18)] rounded-lg",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-3.5 text-[13px]",
        lg:      "h-12 px-7 text-[15px]",
        icon:    "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
