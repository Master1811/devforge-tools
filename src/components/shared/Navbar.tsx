import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search } from "lucide-react";

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
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="heading-display text-xl">
          Dev<span className="text-primary">Forge</span>
        </Link>
        <div className="flex items-center gap-2">
          {currentTool && (
            <span className="font-mono text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hidden sm:inline-flex">
              {currentTool}
            </span>
          )}
          {/* Command palette trigger */}
          <button
            onClick={openPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface/50 backdrop-blur text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all text-xs font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded border border-border hidden sm:inline">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
