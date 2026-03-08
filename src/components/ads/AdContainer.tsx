import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdPlacement = "leaderboard" | "sidebar" | "in-flow" | "mobile-sticky";

interface AdContainerProps {
  placement: AdPlacement;
  className?: string;
}

const config: Record<AdPlacement, {
  desktopW: string; desktopH: string;
  mobileW?: string; mobileH?: string;
  label: string;
  hideOn?: string;
}> = {
  leaderboard: {
    desktopW: "728px", desktopH: "90px",
    mobileW: "320px", mobileH: "50px",
    label: "Leaderboard 728×90 / 320×50",
  },
  sidebar: {
    desktopW: "300px", desktopH: "600px",
    label: "Sidebar 300×600",
    hideOn: "lg:flex hidden",
  },
  "in-flow": {
    desktopW: "300px", desktopH: "250px",
    label: "In-Flow Rectangle 300×250",
  },
  "mobile-sticky": {
    desktopW: "320px", desktopH: "50px",
    label: "Mobile Sticky 320×50",
    hideOn: "flex lg:hidden",
  },
};

// Replace data-ad-slot values with actual AdSense IDs before deploy
export default function AdContainer({ placement, className }: AdContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const c = config[placement];

  // Lazy load via IntersectionObserver
  useEffect(() => {
    if (placement === "mobile-sticky") { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  if (placement === "mobile-sticky" && dismissed) return null;

  if (placement === "mobile-sticky") {
    return (
      <div className={cn("fixed bottom-0 inset-x-0 z-50 flex lg:hidden justify-center p-2 bg-background/80 backdrop-blur-sm border-t border-border", className)}>
        <div
          className="relative flex items-center justify-center rounded-md border border-border bg-surface"
          style={{ width: c.desktopW, height: c.desktopH }}
          data-ad-slot={`devforge-${placement}`}
          data-ad-format="auto"
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-surface2 border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close ad"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
          <DevAdPlaceholder label={c.label} />
        </div>
      </div>
    );
  }

  const visibilityClass = c.hideOn ?? "flex";

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto items-center justify-center rounded-lg border border-border bg-surface/50",
        visibilityClass,
        className
      )}
      style={{
        minHeight: c.desktopH,
        maxWidth: c.desktopW,
        width: "100%",
      }}
      data-ad-slot={`devforge-${placement}`}
      data-ad-format="auto"
    >
      {visible ? (
        <DevAdPlaceholder label={c.label} />
      ) : (
        <div style={{ minHeight: c.desktopH }} />
      )}
    </div>
  );
}

function DevAdPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 py-3">
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/40">
        Sponsorship
      </span>
      <span className="font-mono text-[10px] text-muted-foreground/30">
        DEV AD — {label}
      </span>
    </div>
  );
}
