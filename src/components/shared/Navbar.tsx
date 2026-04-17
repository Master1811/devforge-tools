"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [mounted,  setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-linked bottom border opacity (Item 22)
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 20], [0, 0.06]);

  const openSearch = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  const isFinance     = pathname.startsWith("/tools/finance");
  const isInteractive = pathname.startsWith("/tools/interactive");
  const isHome        = pathname === "/";
  const isDev         = pathname.startsWith("/tools") && !isFinance && !isInteractive;

  const navLinks = [
    { href: "/tools",             label: "Dev Tools",         active: isDev || isHome },
    { href: "/tools/finance",     label: "Finance Tools",     active: isFinance },
    { href: "/tools/interactive", label: "Interactive Tools", active: isInteractive },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ height: "var(--nav-height, 64px)" }}
      initial={{ y: -80, opacity: 0 }}
      animate={mounted ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.nav
        className={cn(
          "pointer-events-auto flex items-center gap-4",
          "transition-[width,height,margin-top,border-radius,background,box-shadow]",
          "duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? [
                "mt-3 h-[52px] rounded-2xl px-4",
                "bg-[rgba(255,255,255,0.90)] backdrop-blur-xl saturate-150",
                "border border-[rgba(0,0,0,0.10)]",
                "shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_0_rgba(0,0,0,0.04)]",
              ].join(" ")
            : [
                "mt-0 h-[64px] rounded-none px-6",
                "bg-transparent",
              ].join(" "),
        )}
        style={{
          width: scrolled ? "min(700px, calc(100vw - 2rem))" : "100%",
          // Scroll-linked bottom border — only visible on expanded (non-scrolled) state
          borderBottom: scrolled ? undefined : undefined,
        }}
      >
        {/* Scroll-linked bottom hairline — fades in as user scrolls, invisible once pill activates */}
        {!scrolled && (
          <motion.div
            className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
            style={{ backgroundColor: `rgba(0,0,0,${borderOpacity})` } as React.CSSProperties}
          />
        )}

        {/* ── Logo ── */}
        <Link
          href="/"
          className="font-display text-[15px] font-semibold text-[#0A0A0A] tracking-[-0.02em] shrink-0 mr-2"
        >
          DevForge
        </Link>

        {/* ── Centre links ── */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map(({ href, label, active }) => {
            const isInteractiveLink = href === "/tools/interactive";
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-[13px] font-medium",
                  "transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active
                    ? isInteractiveLink ? "text-[#7C3AED]" : "text-[#0A0A0A]"
                    : "text-[rgba(10,10,10,0.45)] hover:text-[rgba(10,10,10,0.80)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 rounded-lg",
                      isInteractiveLink
                        ? "bg-[rgba(139,92,246,0.10)]"
                        : "bg-[rgba(0,0,0,0.07)]",
                    )}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={openSearch}
            aria-label="Search tools (⌘K)"
            className={cn(
              "flex items-center gap-2 h-8 px-2.5 rounded-lg",
              "border border-[rgba(0,0,0,0.12)] bg-transparent",
              "text-[rgba(10,10,10,0.45)] text-[12px] font-mono",
              "transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:text-[#0A0A0A] hover:border-[rgba(0,0,0,0.24)] hover:bg-[rgba(0,0,0,0.04)]",
            )}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline text-[11px]">Search</span>
            <kbd className="hidden sm:inline text-[10px] border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DevForge on GitHub"
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "border border-[rgba(0,0,0,0.12)] bg-transparent",
              "text-[rgba(10,10,10,0.45)]",
              "transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:text-[#0A0A0A] hover:border-[rgba(0,0,0,0.24)] hover:bg-[rgba(0,0,0,0.04)]",
            )}
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.nav>
    </motion.header>
  );
}
