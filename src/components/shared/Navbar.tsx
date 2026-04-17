"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Terminal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { motionEase } from "@/lib/motion";

/* ─── Magnetic button wrapper ─── */
function MagneticEl({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.22);
    y.set((e.clientY - cy) * 0.22);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Nav link with colored underline indicator ─── */
function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  accentClass,
  borderClass,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  accentClass: string;
  borderClass: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200",
        isActive
          ? cn("bg-white/[0.06]", accentClass)
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      {/* Underline indicator */}
      <span
        className={cn(
          "absolute bottom-0 left-3 right-3 h-px rounded-full transition-all duration-300",
          isActive ? cn("opacity-100", borderClass) : "opacity-0"
        )}
      />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  const isFinanceActive = pathname.startsWith("/tools/finance");
  const isDevActive =
    !isFinanceActive &&
    (pathname.startsWith("/tools") ||
      pathname === "/" ||
      /^\/(jwt-decoder|json-to|sql-|cron-|regex-|base64-|curl-|yaml-|markdown-|password-)/.test(pathname));

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={mounted ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: reducedMotion ? 0.15 : 0.7, ease: motionEase, delay: reducedMotion ? 0 : 0.1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background,border-color,box-shadow] duration-500 ease-out",
        scrolled
          ? "glass border-b border-border shadow-[var(--shadow-sm)]"
          : "bg-transparent"
      )}
    >
      {/* Thin progress line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-primary/40 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "100%" }}
      />

      <div className="page-container h-14 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <MagneticEl>
          <Link
            href="/"
            className="heading-display text-lg tracking-tight group flex items-center gap-0 select-none flex-shrink-0"
          >
            <motion.span
              className="transition-colors duration-200"
              whileHover={{ x: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Dev
            </motion.span>
            <motion.span
              className="text-primary"
              whileHover={{ x: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Forge
            </motion.span>
          </Link>
        </MagneticEl>

        {/* ── Center navigation ── */}
        <nav className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <NavLink
            href="/tools"
            label="Dev Tools"
            icon={Terminal}
            isActive={isDevActive}
            accentClass="text-cyan-400"
            borderClass="bg-cyan-400"
          />
          <NavLink
            href="/tools/finance"
            label="Finance Tools"
            icon={TrendingUp}
            isActive={isFinanceActive}
            accentClass="text-emerald-400"
            borderClass="bg-emerald-400"
          />
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5">
          <MagneticEl>
            <motion.button
              onClick={openPalette}
              aria-label="Open search command palette"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border",
                "bg-surface/40 backdrop-blur-sm text-muted-foreground",
                "hover:text-foreground hover:border-muted-foreground/30 hover:bg-surface/70",
                "transition-[background,border-color,color] duration-200 ease-out text-xs font-mono",
                "group focus-visible:focus-ring"
              )}
            >
              <motion.span
                className="inline-block"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Search className="w-3.5 h-3.5" />
              </motion.span>
              <span className="hidden sm:inline text-[11px]">Search</span>
              <kbd className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded border border-border hidden sm:inline leading-none
                             group-hover:border-muted-foreground/20 transition-colors duration-200">
                ⌘K
              </kbd>
            </motion.button>
          </MagneticEl>

          <MagneticEl>
            <ThemeToggle />
          </MagneticEl>
        </div>
      </div>
    </motion.nav>
  );
}
