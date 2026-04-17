"use client";

import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  KeyRound, Braces, Database, Clock, Regex, Binary, Terminal, FileJson, FileText, Lock,
  Keyboard, X, TrendingUp, Calculator, Flame, BarChart3, Target
} from "lucide-react";

const TOOLS = [
  { name: "JWT Decoder", path: "/jwt-decoder", icon: KeyRound, shortcut: "1", category: "Dev" as const },
  { name: "JSON to TypeScript", path: "/json-to-typescript", icon: Braces, shortcut: "2", category: "Dev" as const },
  { name: "SQL Formatter", path: "/sql-formatter", icon: Database, shortcut: "3", category: "Dev" as const },
  { name: "Cron Visualizer", path: "/cron-visualizer", icon: Clock, shortcut: "4", category: "Dev" as const },
  { name: "RegEx Tester", path: "/regex-tester", icon: Regex, shortcut: "5", category: "Dev" as const },
  { name: "Base64 Encoder", path: "/base64-encoder", icon: Binary, shortcut: "6", category: "Dev" as const },
  { name: "cURL Converter", path: "/curl-converter", icon: Terminal, shortcut: "7", category: "Dev" as const },
  { name: "YAML ↔ JSON", path: "/yaml-json-converter", icon: FileJson, shortcut: "8", category: "Dev" as const },
  { name: "Markdown Previewer", path: "/markdown-previewer", icon: FileText, shortcut: "9", category: "Dev" as const },
  { name: "Password Generator", path: "/password-generator", icon: Lock, shortcut: "0", category: "Dev" as const },
  { name: "ARR / MRR Calculator", path: "/tools/finance/arr-calculator", icon: TrendingUp, shortcut: "A", category: "Finance" as const },
  { name: "Growth Rate Calculator", path: "/tools/finance/growth-rate-calculator", icon: BarChart3, shortcut: "G", category: "Finance" as const },
  { name: "Runway Calculator", path: "/tools/finance/runway-calculator", icon: Flame, shortcut: "R", category: "Finance" as const },
  { name: "Burn Rate Calculator", path: "/tools/finance/burn-rate-calculator", icon: Calculator, shortcut: "B", category: "Finance" as const },
  { name: "₹100Cr Journey Calculator", path: "/tools/finance/100cr-calculator", icon: Target, shortcut: "F", category: "Finance" as const },
];

// ---------- Context for cross-component events ----------
interface ShellContextValue {
  triggerProcess: () => void;
  triggerCopyResult: () => void;
  onProcess: (cb: () => void) => () => void;
  onCopyResult: (cb: () => void) => () => void;
  showSuccessAd: boolean;
  setShowSuccessAd: (v: boolean) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);
export const useShell = () => useContext(ShellContext);

// ---------- Shell Provider ----------
export function ShellProvider({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [showSuccessAd, setShowSuccessAd] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Callback registries
  const [processCallbacks] = useState<Set<() => void>>(() => new Set());
  const [copyCallbacks] = useState<Set<() => void>>(() => new Set());

  const triggerProcess = useCallback(() => { processCallbacks.forEach(cb => cb()); }, [processCallbacks]);
  const triggerCopyResult = useCallback(() => { copyCallbacks.forEach(cb => cb()); }, [copyCallbacks]);

  const onProcess = useCallback((cb: () => void) => {
    processCallbacks.add(cb);
    return () => { processCallbacks.delete(cb); };
  }, [processCallbacks]);

  const onCopyResult = useCallback((cb: () => void) => {
    copyCallbacks.add(cb);
    return () => { copyCallbacks.delete(cb); };
  }, [copyCallbacks]);

  // Global keyboard listeners
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Cmd+K → command palette
      if (mod && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
        return;
      }

      // Cmd+Enter → trigger process
      if (mod && e.key === "Enter") {
        e.preventDefault();
        triggerProcess();
        return;
      }

      // Cmd+C on non-selection → copy result
      if (mod && e.key === "c" && !window.getSelection()?.toString()) {
        triggerCopyResult();
        return;
      }

      // ? → keyboard hints (only if not in input)
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setHintsOpen(o => !o);
        return;
      }

      // Escape → close hints
      if (e.key === "Escape" && hintsOpen) {
        setHintsOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hintsOpen, triggerProcess, triggerCopyResult]);

  const goToTool = (path: string) => {
    router.push(path);
    setCmdOpen(false);
  };

  const isHome = pathname === "/";
  const devTools = TOOLS.filter((tool) => tool.category === "Dev");
  const financeTools = TOOLS.filter((tool) => tool.category === "Finance");

  return (
    <ShellContext.Provider value={{ triggerProcess, triggerCopyResult, onProcess, onCopyResult, showSuccessAd, setShowSuccessAd }}>
      {children}

      {/* Command Palette */}
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search tools... (⌘K)" />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading="Dev Tools">
            {devTools.map(tool => (
              <CommandItem key={tool.path} onSelect={() => goToTool(tool.path)} className="cursor-pointer">
                <tool.icon className="mr-2 h-4 w-4 text-[rgba(10,10,10,0.55)]" />
                <span>[Dev] {tool.name}</span>
                <kbd className="ml-auto text-[10px] font-mono text-[rgba(10,10,10,0.40)] bg-[rgba(0,0,0,0.05)] px-1.5 py-0.5 rounded">{tool.shortcut}</kbd>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Finance Tools">
            {financeTools.map(tool => (
              <CommandItem key={tool.path} onSelect={() => goToTool(tool.path)} className="cursor-pointer">
                <tool.icon className="mr-2 h-4 w-4 text-[rgba(250,250,250,0.65)]" />
                <span>[Finance] {tool.name}</span>
                <kbd className="ml-auto text-[10px] font-mono text-[rgba(250,250,250,0.40)] bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 rounded">{tool.shortcut}</kbd>
              </CommandItem>
            ))}
          </CommandGroup>
          {!isHome && (
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => goToTool("/")} className="cursor-pointer">
                <span>← Back to Home</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

      {/* Keyboard Hints Overlay */}
      {hintsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setHintsOpen(false)}>
          <div className="absolute inset-0 bg-[#FAFAFA]/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm h-full bg-white border-l border-[rgba(0,0,0,0.10)] p-6 overflow-auto animate-in slide-in-from-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-[#0A0A0A] flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[rgba(10,10,10,0.55)]" />
                Keyboard Shortcuts
              </h2>
              <button onClick={() => setHintsOpen(false)} className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.06)] transition-colors">
                <X className="w-4 h-4 text-[rgba(10,10,10,0.45)]" />
              </button>
            </div>
            <div className="space-y-4">
              <ShortcutSection title="Navigation" items={[
                { keys: ["⌘", "K"], description: "Open command palette" },
                { keys: ["?"], description: "Toggle this panel" },
                { keys: ["Esc"], description: "Close overlays" },
              ]} />
              <ShortcutSection title="Actions" items={[
                { keys: ["⌘", "Enter"], description: "Trigger processing" },
                { keys: ["⌘", "C"], description: "Copy result output" },
                { keys: ["Space"], description: "Regenerate (Password Gen)" },
              ]} />
              <ShortcutSection title="Quick Switch" items={
                TOOLS.map(t => ({ keys: [t.shortcut], description: t.name }))
              } />
            </div>
            <p className="mt-8 text-[10px] font-mono text-[rgba(10,10,10,0.35)]">
              ⌘ = Cmd (Mac) / Ctrl (Win/Linux)
            </p>
          </div>
        </div>
      )}
    </ShellContext.Provider>
  );
}

function ShortcutSection({ title, items }: { title: string; items: { keys: string[]; description: string }[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-mono text-[rgba(10,10,10,0.35)] mb-2 uppercase tracking-[0.10em]">{title}</h3>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-[13px] text-[rgba(10,10,10,0.70)]">{item.description}</span>
            <div className="flex gap-1">
              {item.keys.map(k => (
                <kbd key={k} className="text-[11px] font-mono bg-[rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.10)] text-[rgba(10,10,10,0.50)] px-1.5 py-0.5 rounded min-w-[22px] text-center">
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
