import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const currentTool = toolNames[location.pathname];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo",
        scrolled
          ? "glass border-b border-border shadow-[var(--shadow-sm)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="heading-display text-lg tracking-tight group flex items-center gap-0.5"
        >
          <span className="transition-colors duration-200">Dev</span>
          <span className="text-primary transition-opacity duration-200 group-hover:opacity-80">Forge</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {currentTool && (
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-border bg-surface2/60 text-muted-foreground hidden sm:inline-flex items-center transition-colors duration-200">
              {currentTool}
            </span>
          )}

          <button
            onClick={openPalette}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border",
              "bg-surface/40 backdrop-blur-sm text-muted-foreground",
              "hover:text-foreground hover:border-muted-foreground/30 hover:bg-surface/60",
              "active:scale-[0.97]",
              "transition-all duration-200 ease-out-expo text-xs font-mono"
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Search</span>
            <kbd className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded border border-border hidden sm:inline leading-none">⌘K</kbd>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
