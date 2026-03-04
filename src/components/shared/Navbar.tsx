import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="heading-display text-xl">
          Dev<span className="text-primary">Forge</span>
        </Link>
        {currentTool && (
          <span className="font-mono text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
            {currentTool}
          </span>
        )}
      </div>
    </nav>
  );
}
