// Replace data-ad-slot values with actual AdSense IDs before deploy

interface AdSlotProps {
  size: "leaderboard" | "rectangle" | "banner";
  position: string;
}

const dimensions: Record<string, { w: string; h: string; mobileHidden?: boolean }> = {
  leaderboard: { w: "728px", h: "90px", mobileHidden: true },
  rectangle: { w: "300px", h: "250px" },
  banner: { w: "728px", h: "90px", mobileHidden: true },
};

export default function AdSlot({ size, position }: AdSlotProps) {
  const d = dimensions[size];
  return (
    <div
      className={`mx-auto flex items-center justify-center border border-border rounded-lg ${d.mobileHidden ? "hidden md:flex" : "flex"}`}
      style={{ minHeight: d.h, maxWidth: d.w, width: "100%" }}
    >
      <div
        data-ad-slot={`devforge-${position}-${size}`}
        data-ad-format="auto"
        className="w-full h-full flex items-center justify-center"
      >
        <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">Sponsored</span>
      </div>
    </div>
  );
}
