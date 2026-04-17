/**
 * Command palette — monochrome dark.
 * #0A0A0A bg, 1px white/10 border. JetBrains Mono slugs. No color states.
 */
import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("flex h-full w-full flex-col overflow-hidden bg-[#0A0A0A] text-[#FAFAFA]", className)}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogContent className="overflow-hidden p-0 bg-[#0A0A0A] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.8)] [&>button]:text-[rgba(250,250,250,0.5)] [&>button]:hover:text-[#FAFAFA]">
      <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-[rgba(250,250,250,0.35)] [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-4 [&_[cmdk-input-wrapper]_svg]:w-4 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
        {children}
      </Command>
    </DialogContent>
  </Dialog>
);

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-4" cmdk-input-wrapper="">
    <Search className="h-4 w-4 shrink-0 text-[rgba(250,250,250,0.40)]" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-transparent py-3 font-mono text-[13px] text-[#FAFAFA]",
        "placeholder:text-[rgba(250,250,250,0.30)] outline-none caret-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[360px] overflow-y-auto overflow-x-hidden py-2", className)}
    {...props}
  >
    <motion.div layout transition={{ duration: 0.18, ease: "easeOut" }}>
      {children}
    </motion.div>
  </CommandPrimitive.List>
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-8 text-center font-mono text-[12px] text-[rgba(250,250,250,0.35)]"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono",
      "[&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:uppercase",
      "[&_[cmdk-group-heading]]:text-[rgba(250,250,250,0.35)]",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-[rgba(255,255,255,0.08)] my-1", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md",
      "px-2.5 py-2.5 text-[13px] text-[rgba(250,250,250,0.80)] outline-none",
      "transition-colors duration-[120ms]",
      "data-[selected=true]:bg-[rgba(255,255,255,0.08)] data-[selected=true]:text-[#FAFAFA]",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto font-mono text-[11px] tracking-[0.06em] text-[rgba(250,250,250,0.35)]", className)}
    {...props}
  />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command, CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut, CommandSeparator,
};
