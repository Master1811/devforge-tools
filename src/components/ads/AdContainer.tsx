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

/* ── Adblock detection ─────────────────────────────────────────────────── */
function useAdBlockDetected(): boolean {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const bait = document.createElement("div");
    // Class names that most adblockers target via EasyList filters
    bait.className = "adsbox pub_300x250 ad-unit google-ad textAd";
    bait.innerHTML = "&nbsp;";
    Object.assign(bait.style, {
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      width: "1px",
      height: "1px",
      pointerEvents: "none",
    });
    document.body.appendChild(bait);

    const timer = setTimeout(() => {
      const { display, visibility } = window.getComputedStyle(bait);
      if (display === "none" || visibility === "hidden" || bait.offsetHeight === 0) {
        setBlocked(true);
      }
      if (document.body.contains(bait)) document.body.removeChild(bait);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(bait)) document.body.removeChild(bait);
    };
  }, []);

  return blocked;
}

/* ── Polite adblock message ────────────────────────────────────────────── */
function AdBlockMessage({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="w-full flex items-center justify-center px-4 py-2">
        <p className="text-[11px] font-mono text-center text-[rgba(10,10,10,0.45)] leading-relaxed">
          Enjoying this free tool?{" "}
          <a
            href="https://support.google.com/chrome/answer/2765944"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-[rgba(10,10,10,0.65)] hover:text-[#0A0A0A] transition-colors"
          >
            Consider disabling your adblocker
          </a>{" "}
          to keep DevForge serverless and free.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 px-5 py-4 text-center">
      <p className="text-[13px] font-display text-[rgba(10,10,10,0.60)] leading-relaxed max-w-[280px]">
        Enjoying this free tool? Consider{" "}
        <a
          href="https://support.google.com/chrome/answer/2765944"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-[rgba(10,10,10,0.80)] hover:text-[#0A0A0A] transition-colors"
        >
          disabling your adblocker
        </a>{" "}
        to keep DevForge serverless and free.
      </p>
      <p className="text-[11px] font-mono text-[rgba(10,10,10,0.35)]">
        No pop-ups. No tracking. Just a small ad.
      </p>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */
export default function AdContainer({ placement, className, show = true }: AdContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const adBlocked = useAdBlockDetected();
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

  const shimmerClass = !visible ? "animate-[ad-skeleton-pulse_2.4s_ease-in-out_infinite]" : "";
  const hoverGlowClass = "transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.18)]";

  if (placement === "mobile-sticky") {
    return (
      <div className={cn(
        "fixed bottom-0 inset-x-0 z-50 flex lg:hidden justify-center p-2",
        "bg-white/90 backdrop-blur-[12px] border-t border-[rgba(0,0,0,0.08)]",
        className
      )}>
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl",
            "border border-[rgba(0,0,0,0.08)] bg-[#F4F4F4]",
            hoverGlowClass,
          )}
          style={{ width: c.desktopW, height: c.desktopH }}
          data-ad-slot={`devforge-${placement}`}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-[rgba(0,0,0,0.10)] flex items-center justify-center hover:bg-[#F4F4F4] transition-colors"
            aria-label="Close ad"
          >
            <X className="w-3 h-3 text-[rgba(10,10,10,0.50)]" />
          </button>
          {adBlocked
            ? <AdBlockMessage compact />
            : <DevAdPlaceholder label={c.label} />
          }
        </div>
      </div>
    );
  }

  if (placement === "success-banner") {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto items-center justify-center rounded-xl overflow-hidden",
          "border border-[rgba(0,0,0,0.08)] bg-[#F4F4F4]",
          hoverGlowClass,
          "flex animate-in fade-in duration-500",
          className
        )}
        style={{ minHeight: c.desktopH, maxWidth: c.desktopW, width: "100%", aspectRatio: "300/250" }}
        data-ad-slot={`devforge-${placement}`}
      >
        {adBlocked ? <AdBlockMessage /> : <DevAdPlaceholder label={c.label} />}
      </div>
    );
  }

  const visibilityClass = c.hideOn ?? "flex";

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto items-center justify-center rounded-xl overflow-hidden",
        "border border-[rgba(0,0,0,0.08)] bg-[#F4F4F4]",
        hoverGlowClass,
        shimmerClass,
        visibilityClass,
        className
      )}
      style={{ minHeight: c.desktopH, maxWidth: c.desktopW, width: "100%" }}
      data-ad-slot={`devforge-${placement}`}
    >
      {visible
        ? adBlocked
          ? <AdBlockMessage />
          : <DevAdPlaceholder label={c.label} />
        : <AdSkeleton height={c.desktopH} />
      }
    </div>
  );
}

function DevAdPlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 py-3">
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[rgba(10,10,10,0.30)]">
        Sponsorship
      </span>
      <span className="font-mono text-[10px] text-[rgba(10,10,10,0.22)]">
        AD — {label}
      </span>
    </div>
  );
}

function AdSkeleton({ height }: { height: string }) {
  return (
    <div
      className="w-full rounded-lg animate-[ad-skeleton-pulse_2.4s_ease-in-out_infinite]"
      style={{ minHeight: height, background: "rgba(0,0,0,0.03)" }}
    />
  );
}
