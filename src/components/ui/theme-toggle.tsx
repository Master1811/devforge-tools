import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    applyTheme(resolved);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const cycle = () => {
    setTheme(prev => prev === "dark" ? "light" : prev === "light" ? "system" : "dark");
  };

  return (
    <button
      onClick={cycle}
      className="relative p-2 rounded-lg border border-border bg-surface/50 backdrop-blur text-muted-foreground hover:text-foreground transition-all hover:border-primary/40 hover:shadow-[0_0_12px_-3px_hsl(var(--primary)/0.3)]"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "system" && <Monitor className="w-4 h-4" />}
    </button>
  );
}
