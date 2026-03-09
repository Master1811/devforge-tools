"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdPlacement = "leaderboard" | "sidebar" | "in-flow" | "mobile-sticky" | "success-banner";

interface AdContainerProps {
  placement: AdPlacement;
  className?: string;
  show?: boolean;
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
  "success-banner": {
    desktopW: "300px", desktopH: "250px",
    label: "Success 300×250",
  },
};

export default function AdContainer({ placement, className, show = true }: AdContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const c = config[placement];

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
  if (placement === "success-banner" && !show) return null;

  // CLS guard: skeleton shimmer while loading
  const shimmerClass = !visible ? "animate-pulse" : "";

  // Hover glow — ads get their own glow, independent of the grid
  const hoverGlowClass = "transition-shadow duration-300 hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] hover:border-primary/40";

  if (placement === "mobile-sticky") {
    return (
      <div className={cn("fixed bottom-0 inset-x-0 z-50 flex lg:hidden justify-center p-2 bg-background/80 backdrop-blur-sm border-t border-border", className)}>
        <div
          className={cn("relative flex items-center justify-center rounded-md border border-border bg-surface", hoverGlowClass)}
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

  // Success banner: fade-in animation
  if (placement === "success-banner") {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto items-center justify-center rounded-lg border border-border bg-surface/80 backdrop-blur overflow-hidden",
          hoverGlowClass,
          "flex animate-in fade-in duration-500",
          className
        )}
        style={{
          minHeight: c.desktopH,
          maxWidth: c.desktopW,
          width: "100%",
          aspectRatio: "300/250",
        }}
        data-ad-slot={`devforge-${placement}`}
        data-ad-format="auto"
      >
        <DevAdPlaceholder label={c.label} />
      </div>
    );
  }

  const visibilityClass = c.hideOn ?? "flex";

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto items-center justify-center rounded-lg border border-border bg-surface/80 backdrop-blur overflow-hidden",
        hoverGlowClass,
        shimmerClass,
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
        <AdSkeleton height={c.desktopH} />
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

function AdSkeleton({ height }: { height: string }) {
  return (
    <div
      className="w-full bg-surface2/50 rounded-lg relative overflow-hidden"
      style={{ minHeight: height }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-surface/30 to-transparent" />
    </div>
  );
}
