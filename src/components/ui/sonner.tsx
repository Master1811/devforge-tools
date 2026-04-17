/**
 * Sonner toast — monochrome dark.
 * #0A0A0A bg, white text, 1px white/16 border.
 * No colored success/error states — leading icon only. 2500ms duration.
 */
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    className="toaster group"
    duration={2500}
    toastOptions={{
      classNames: {
        toast: [
          "group toast",
          "!bg-[#0A0A0A] !text-[#FAFAFA]",
          "!border !border-[rgba(255,255,255,0.16)]",
          "!rounded-lg !shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
          "!font-sans !text-[13px]",
        ].join(" "),
        description: "!text-[rgba(250,250,250,0.55)] !text-[12px] !font-mono",
        actionButton: "!bg-[#FAFAFA] !text-[#0A0A0A] !text-[12px] !font-medium",
        cancelButton:  "!bg-[rgba(255,255,255,0.08)] !text-[rgba(250,250,250,0.65)] !text-[12px]",
        closeButton:   "!bg-[rgba(255,255,255,0.06)] !border-[rgba(255,255,255,0.12)] !text-[rgba(250,250,250,0.5)]",
        icon:          "!text-[rgba(250,250,250,0.65)]",
      },
    }}
    {...props}
  />
);

export { Toaster, toast };
