"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SavedScenario, SerializedState } from "@/types/finance-tools";

const MAX_SCENARIOS = 5;
const SCHEMA_VERSION = 1 as const;

// ── Serialization ─────────────────────────────────────────────────────────────

function encodeState<T>(state: SerializedState<T>): string {
  try { return btoa(JSON.stringify(state)); } catch { return ""; }
}

function decodeState<T>(encoded: string): SerializedState<T> | null {
  try {
    const parsed = JSON.parse(atob(encoded));
    if (parsed?.v !== SCHEMA_VERSION) return null;
    return parsed as SerializedState<T>;
  } catch { return null; }
}

function readUrlInputs<T>(defaultInputs: T): T {
  if (typeof window === "undefined") return defaultInputs;
  const s = new URLSearchParams(window.location.search).get("s");
  if (!s) return defaultInputs;
  const parsed = decodeState<T>(s);
  if (!parsed) return defaultInputs;
  return { ...defaultInputs, ...parsed.inputs };
}

function pushUrlState<T>(inputs: T) {
  if (typeof window === "undefined") return;
  const encoded = encodeState<T>({ inputs, v: SCHEMA_VERSION });
  if (!encoded) return;
  const url = new URL(window.location.href);
  url.searchParams.set("s", encoded);
  window.history.replaceState(null, "", url.toString());
}

function storageKey(toolKey: string) {
  return `devforge-finance-scenarios-${toolKey}`;
}

function readStored<T>(toolKey: string): SavedScenario<T>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(toolKey));
    return raw ? (JSON.parse(raw) as SavedScenario<T>[]) : [];
  } catch { return []; }
}

function writeStored<T>(toolKey: string, scenarios: SavedScenario<T>[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(storageKey(toolKey), JSON.stringify(scenarios)); } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useClientScenarioSync<T extends object>(
  defaultInputs: T,
  toolKey: string = "default",
  debounceMs = 250
) {
  const [inputs, setInputsState] = useState<T>(defaultInputs);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario<T>[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from URL + localStorage once (client only)
  useEffect(() => {
    setInputsState(readUrlInputs<T>(defaultInputs));
    setSavedScenarios(readStored<T>(toolKey));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInputs = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setInputsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => pushUrlState<T>(next), debounceMs);
        return next;
      });
    },
    [debounceMs]
  );

  const patchInput = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    [setInputs]
  );

  const saveScenario = useCallback(
    (name: string) => {
      const scenario: SavedScenario<T> = {
        id: Date.now().toString(),
        name: name.trim() || "Untitled",
        inputs: { ...inputs },
        savedAt: new Date().toISOString(),
      };
      setSavedScenarios((prev) => {
        const updated = [scenario, ...prev].slice(0, MAX_SCENARIOS);
        writeStored(toolKey, updated);
        return updated;
      });
    },
    [inputs, toolKey]
  );

  const loadScenario = useCallback(
    (id: string) => {
      const found = savedScenarios.find((s) => s.id === id);
      if (found) setInputs(found.inputs);
    },
    [savedScenarios, setInputs]
  );

  const deleteScenario = useCallback(
    (id: string) => {
      setSavedScenarios((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        writeStored(toolKey, updated);
        return updated;
      });
    },
    [toolKey]
  );

  const getShareableUrl = useCallback((): string => {
    if (typeof window === "undefined") return "";
    const encoded = encodeState<T>({ inputs, v: SCHEMA_VERSION });
    const url = new URL(window.location.href);
    url.searchParams.set("s", encoded);
    return url.toString();
  }, [inputs]);

  const reset = useCallback(() => setInputs(defaultInputs), [setInputs, defaultInputs]);

  return {
    inputs,
    setInputs,
    patchInput,
    savedScenarios,
    saveScenario,
    loadScenario,
    deleteScenario,
    getShareableUrl,
    reset,
  };
}
