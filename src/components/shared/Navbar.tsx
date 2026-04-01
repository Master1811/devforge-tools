"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useSpring } from "framer-motion";

const toolNames: Record<string, string> = {
  "/jwt-decoder": "JWT Decoder",
  "/json-to-typescript": "JSON → TS",
  "/sql-formatter": "SQL Formatter",
  "/cron-visualizer": "Cron Visualizer",
  "/regex-tester": "RegEx Tester",
  "/base64-encoder": "Base64 Encoder",
  "/curl-converter": "cURL Converter",
  "/yaml-json-converter": "YAML ↔ JSON",
  "/markdown-previewer": "Markdown Preview",
  "/password-generator": "Password Gen",
};

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

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentTool = toolNames[pathname];

  /* mount entrance */
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
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background,border-color,box-shadow] duration-500 ease-out",
        scrolled
          ? "glass border-b border-border shadow-[var(--shadow-sm)]"
          : "bg-transparent"
      )}
    >
      {/* Thin progress line when scrolled */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-primary/40 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "100%" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <MagneticEl>
          <Link
            href="/"
            className="heading-display text-lg tracking-tight group flex items-center gap-0 select-none"
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

        <div className="flex items-center gap-1.5">
          {/* Active tool badge */}
          <AnimatePresence mode="popLayout">
            {currentTool && (
              <motion.span
                key={currentTool}
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-primary/20
                           bg-primary/5 text-primary hidden sm:inline-flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" />
                {currentTool}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Search button */}
          <MagneticEl>
            <motion.button
              onClick={openPalette}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border",
                "bg-surface/40 backdrop-blur-sm text-muted-foreground",
                "hover:text-foreground hover:border-muted-foreground/30 hover:bg-surface/70",
                "active:scale-[0.97]",
                "transition-[background,border-color,color] duration-200 ease-out text-xs font-mono",
                "group"
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

          {/* Theme toggle */}
          <MagneticEl>
            <ThemeToggle />
          </MagneticEl>
        </div>
      </div>
    </motion.nav>
  );
}