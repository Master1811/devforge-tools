"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { Book, Clock, Copy, Check, ChevronDown, ChevronRight, Zap, MessageSquare } from "lucide-react";

const FLAG_OPTIONS = ["g", "i", "m", "s", "u"] as const;

// ============== COMMON PATTERNS LIBRARY ==============
interface PatternCategory {
  name: string;
  patterns: { name: string; pattern: string; description: string; example: string }[];
}

const PATTERN_LIBRARY: PatternCategory[] = [
  {
    name: "Email & URLs",
    patterns: [
      { name: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Matches standard email addresses", example: "test@example.com" },
      { name: "URL (http/https)", pattern: "https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+", description: "Matches HTTP and HTTPS URLs", example: "https://example.com/path" },
      { name: "Domain Name", pattern: "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}", description: "Matches domain names", example: "sub.example.com" },
      { name: "IP Address (IPv4)", pattern: "\\b(?:25[0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})){3}\\b", description: "Matches IPv4 addresses", example: "192.168.1.1" },
    ],
  },
  {
    name: "Phone Numbers",
    patterns: [
      { name: "US Phone", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", description: "US phone number formats", example: "(555) 123-4567" },
      { name: "International Phone", pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", description: "International phone formats", example: "+1-555-123-4567" },
    ],
  },
  {
    name: "Dates & Times",
    patterns: [
      { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", description: "ISO date format", example: "2024-03-15" },
      { name: "Date (MM/DD/YYYY)", pattern: "(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}", description: "US date format", example: "03/15/2024" },
      { name: "Time (24h)", pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?", description: "24-hour time format", example: "14:30:00" },
      { name: "ISO Datetime", pattern: "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:?\\d{2})?", description: "ISO 8601 datetime", example: "2024-03-15T14:30:00Z" },
    ],
  },
  {
    name: "Numbers",
    patterns: [
      { name: "Integer", pattern: "-?\\d+", description: "Positive or negative integer", example: "-123" },
      { name: "Decimal Number", pattern: "-?\\d+\\.\\d+", description: "Decimal/floating point", example: "3.14159" },
      { name: "Currency (USD)", pattern: "\\$\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?", description: "US dollar amounts", example: "$1,234.56" },
      { name: "Percentage", pattern: "\\d+(?:\\.\\d+)?%", description: "Percentage values", example: "99.9%" },
      { name: "Hex Color", pattern: "#(?:[0-9A-Fa-f]{3}){1,2}\\b", description: "CSS hex color codes", example: "#FF5733" },
    ],
  },
  {
    name: "Identifiers",
    patterns: [
      { name: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", description: "UUID format", example: "550e8400-e29b-41d4-a716-446655440000" },
      { name: "Credit Card", pattern: "\\b(?:4\\d{12}(?:\\d{3})?|5[1-5]\\d{14}|3[47]\\d{13})\\b", description: "Major credit card numbers", example: "4111111111111111" },
      { name: "SSN (US)", pattern: "\\d{3}-\\d{2}-\\d{4}", description: "US Social Security Number", example: "123-45-6789" },
      { name: "ZIP Code (US)", pattern: "\\d{5}(?:-\\d{4})?", description: "US ZIP codes", example: "12345-6789" },
    ],
  },
  {
    name: "Programming",
    patterns: [
      { name: "Variable Name", pattern: "[a-zA-Z_][a-zA-Z0-9_]*", description: "Valid variable names", example: "myVariable_123" },
      { name: "HTML Tag", pattern: "<([a-z][a-z0-9]*)\\b[^>]*>.*?<\\/\\1>|<[a-z][a-z0-9]*\\b[^>]*\\/>", description: "HTML elements", example: "<div class='test'>content</div>" },
      { name: "JSON Key", pattern: '"([^"]+)"\\s*:', description: "JSON object keys", example: '"name": ' },
      { name: "Import Statement", pattern: "import\\s+(?:{[^}]+}|\\*\\s+as\\s+\\w+|\\w+)\\s+from\\s+['\"][^'\"]+['\"]", description: "ES6 import statements", example: "import { foo } from 'bar'" },
    ],
  },
];

// ============== REGEX TO ENGLISH EXPLANATION ==============
interface ExplanationPart {
  pattern: string;
  explanation: string;
  type: "literal" | "meta" | "quantifier" | "group" | "class" | "anchor";
}

function explainRegex(pattern: string): ExplanationPart[] {
  const parts: ExplanationPart[] = [];
  let i = 0;

  while (i < pattern.length) {
    const char = pattern[i];
    const next = pattern[i + 1];

    // Character classes
    if (char === "[") {
      const endBracket = pattern.indexOf("]", i + 1);
      if (endBracket !== -1) {
        const classContent = pattern.slice(i, endBracket + 1);
        const isNegated = pattern[i + 1] === "^";
        let explanation = isNegated ? "Any character NOT in: " : "Any character in: ";
        const inner = isNegated ? classContent.slice(2, -1) : classContent.slice(1, -1);
        if (inner.includes("-") && inner.length > 2) {
          explanation += `range ${inner}`;
        } else {
          explanation += inner;
        }
        parts.push({ pattern: classContent, explanation, type: "class" });
        i = endBracket + 1;
        continue;
      }
    }

    // Groups
    if (char === "(") {
      let groupEnd = i + 1;
      let depth = 1;
      while (groupEnd < pattern.length && depth > 0) {
        if (pattern[groupEnd] === "(") depth++;
        else if (pattern[groupEnd] === ")") depth--;
        groupEnd++;
      }
      const groupContent = pattern.slice(i, groupEnd);
      let explanation = "Capturing group";
      if (pattern[i + 1] === "?") {
        if (pattern[i + 2] === ":") explanation = "Non-capturing group";
        else if (pattern[i + 2] === "=") explanation = "Positive lookahead";
        else if (pattern[i + 2] === "!") explanation = "Negative lookahead";
        else if (pattern[i + 2] === "<" && pattern[i + 3] === "=") explanation = "Positive lookbehind";
        else if (pattern[i + 2] === "<" && pattern[i + 3] === "!") explanation = "Negative lookbehind";
      }
      parts.push({ pattern: groupContent, explanation, type: "group" });
      i = groupEnd;
      continue;
    }

    // Quantifiers
    if (char === "{") {
      const endBrace = pattern.indexOf("}", i);
      if (endBrace !== -1) {
        const quantifier = pattern.slice(i, endBrace + 1);
        const nums = quantifier.slice(1, -1).split(",");
        let explanation = "";
        if (nums.length === 1) explanation = `Exactly ${nums[0]} times`;
        else if (nums[1] === "") explanation = `${nums[0]} or more times`;
        else explanation = `Between ${nums[0]} and ${nums[1]} times`;
        parts.push({ pattern: quantifier, explanation, type: "quantifier" });
        i = endBrace + 1;
        continue;
      }
    }

    // Escape sequences
    if (char === "\\") {
      const escaped = pattern.slice(i, i + 2);
      let explanation = "";
      switch (next) {
        case "d": explanation = "Any digit (0-9)"; break;
        case "D": explanation = "Any non-digit"; break;
        case "w": explanation = "Any word character (a-z, A-Z, 0-9, _)"; break;
        case "W": explanation = "Any non-word character"; break;
        case "s": explanation = "Any whitespace"; break;
        case "S": explanation = "Any non-whitespace"; break;
        case "b": explanation = "Word boundary"; break;
        case "B": explanation = "Non-word boundary"; break;
        case "n": explanation = "Newline"; break;
        case "t": explanation = "Tab"; break;
        case "r": explanation = "Carriage return"; break;
        default: explanation = `Literal '${next}'`; break;
      }
      parts.push({ pattern: escaped, explanation, type: "meta" });
      i += 2;
      continue;
    }

    // Meta characters
    const metaChars: Record<string, string> = {
      ".": "Any character (except newline)",
      "^": "Start of string/line",
      "$": "End of string/line",
      "*": "Zero or more of previous",
      "+": "One or more of previous",
      "?": "Zero or one of previous (optional)",
      "|": "OR (alternation)",
    };

    if (metaChars[char]) {
      parts.push({ pattern: char, explanation: metaChars[char], type: char === "^" || char === "$" ? "anchor" : char === "*" || char === "+" || char === "?" ? "quantifier" : "meta" });
      i++;
      continue;
    }

    // Literal characters
    parts.push({ pattern: char, explanation: `Literal '${char}'`, type: "literal" });
    i++;
  }

  return parts;
}

// ============== PERFORMANCE PROFILER ==============
interface PerformanceResult {
  executionTime: number;
  matchCount: number;
  steps: number;
  complexity: "low" | "medium" | "high" | "dangerous";
  warnings: string[];
}

function profileRegex(pattern: string, flags: string, testStr: string): PerformanceResult {
  const warnings: string[] = [];
  let complexity: PerformanceResult["complexity"] = "low";

  // Check for potentially dangerous patterns
  const hasNestedQuantifiers = /(\*|\+|\?)\s*(\*|\+|\?)/.test(pattern);
  const hasBacktracking = /\(\?(?!:).*\)\*|\(\?(?!:).*\)\+/.test(pattern);
  const hasOverlapping = /\.\*.*\.\*/.test(pattern) || /\.\+.*\.\+/.test(pattern);

  if (hasNestedQuantifiers) {
    warnings.push("Nested quantifiers detected — may cause exponential backtracking");
    complexity = "dangerous";
  }
  if (hasOverlapping) {
    warnings.push("Overlapping greedy quantifiers — consider using lazy quantifiers (.*?)");
    complexity = complexity === "dangerous" ? "dangerous" : "high";
  }
  if (pattern.length > 100) {
    warnings.push("Complex pattern — may have performance implications");
    complexity = complexity === "low" ? "medium" : complexity;
  }

  // Actually profile the regex
  let executionTime = 0;
  let matchCount = 0;
  let steps = 0;

  try {
    const re = new RegExp(pattern, flags);
    const start = performance.now();
    const iterations = Math.min(100, Math.max(1, Math.floor(10000 / testStr.length)));

    for (let i = 0; i < iterations; i++) {
      const matches = testStr.match(re);
      matchCount = matches?.length || 0;
    }

    executionTime = (performance.now() - start) / iterations;
    steps = pattern.length * testStr.length; // Rough estimate
  } catch (e) {
    warnings.push("Error during profiling: " + (e as Error).message);
  }

  // Adjust complexity based on execution time
  if (executionTime > 10 && complexity !== "dangerous") complexity = "high";
  else if (executionTime > 1 && complexity === "low") complexity = "medium";

  return { executionTime, matchCount, steps, complexity, warnings };
}

export default function RegexTesterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pattern, setPattern] = useLocalStorage("devforge-regex-pattern", "");
  const [testStr, setTestStr] = useLocalStorage("devforge-regex-test", "");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showProfiler, setShowProfiler] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);

  // Read from URL params on mount
  useEffect(() => {
    const patternParam = searchParams.get("pattern");
    const flagsParam = searchParams.get("flags");
    const testParam = searchParams.get("test");

    if (patternParam && !pattern) setPattern(decodeURIComponent(patternParam));
    if (flagsParam) setFlags(flagsParam.split(""));
    if (testParam && !testStr) setTestStr(decodeURIComponent(testParam));
  }, [searchParams, setPattern, setTestStr]);

  // Update URL when inputs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (pattern.trim()) params.set("pattern", encodeURIComponent(pattern.trim()));
    if (flags.length > 0 && flags.join("") !== "g") params.set("flags", flags.join(""));
    if (testStr.trim()) params.set("test", encodeURIComponent(testStr.trim()));

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    if (newUrl !== window.location.search) {
      router.replace(`/regex-tester${newUrl}`, { scroll: false });
    }
  }, [pattern, flags, testStr, router]);

  const dPattern = useDebounce(pattern, 150);
  const dTest = useDebounce(testStr, 150);

  const toggleFlag = (f: string) => setFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const copyPattern = useCallback(async (p: string) => {
    await navigator.clipboard.writeText(p);
    setCopiedPattern(p);
    setTimeout(() => setCopiedPattern(null), 2000);
  }, []);

  const usePattern = useCallback((p: string, example: string) => {
    setPattern(p);
    if (!testStr.trim()) setTestStr(example);
    setShowLibrary(false);
  }, [setPattern, setTestStr, testStr]);

  const { matches, error, highlighted } = useMemo(() => {
    if (!dPattern || !dTest) return { matches: [], error: "", highlighted: dTest };
    try {
      const re = new RegExp(dPattern, flags.join(""));
      const ms: { match: string; index: number; groups: string[] }[] = [];
      let m;
      const re2 = new RegExp(dPattern, flags.join(""));
      if (flags.includes("g")) {
        while ((m = re2.exec(dTest)) !== null) {
          ms.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m[0].length === 0) re2.lastIndex++;
        }
      } else {
        m = re2.exec(dTest);
        if (m) ms.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      // Build highlighted string
      let h = "";
      let lastIdx = 0;
      const colors = ["bg-primary/30", "bg-accent/30", "bg-destructive/30", "bg-yellow-500/30"];
      ms.forEach((match, i) => {
        h += escapeHtml(dTest.slice(lastIdx, match.index));
        h += `<mark class="${colors[i % colors.length]} rounded px-0.5">${escapeHtml(match.match)}</mark>`;
        lastIdx = match.index + match.match.length;
      });
      h += escapeHtml(dTest.slice(lastIdx));
      return { matches: ms, error: "", highlighted: h };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: dTest };
    }
  }, [dPattern, dTest, flags]);

  const explanation = useMemo(() => {
    if (!dPattern || !showExplanation) return [];
    return explainRegex(dPattern);
  }, [dPattern, showExplanation]);

  const performanceResult = useMemo(() => {
    if (!dPattern || !dTest || !showProfiler) return null;
    return profileRegex(dPattern, flags.join(""), dTest);
  }, [dPattern, dTest, flags, showProfiler]);

  return (
    <ToolLayout
      title="RegEx Tester & Sandbox Online"
      slug="regex-tester"
      description="Test regular expressions with pattern library, English explanations, and performance profiling. Free regex tester online."
      keywords={["regex tester online", "regex sandbox", "test regular expression online", "regex101 alternative", "regex explain", "regex patterns"]}
      howToUse={[
        "Enter your regex pattern and select flags (g, i, m, etc.).",
        "Type or paste your test string below.",
        "Use the Pattern Library for common regex patterns.",
        "Enable 'Explain' to see human-readable explanations.",
        "Use the Profiler to check performance characteristics.",
      ]}
      whatIs={{ title: "What are Regular Expressions?", content: "Regular expressions (regex) are patterns used to match character combinations in strings. They're a powerful tool for text searching, validation, and extraction. A regex tester online lets you experiment with patterns against test strings in real-time, seeing matches highlighted as you type. Common use cases include validating email addresses, parsing log files, extracting data from text, and search-and-replace operations. Our regex sandbox uses JavaScript's native RegExp engine, supporting flags like global (g), case-insensitive (i), multiline (m), dotAll (s), and Unicode (u). All matching runs locally in your browser with zero latency." }}
      faqs={[
        { q: "What regex engine does this use?", a: "This tool uses JavaScript's native RegExp engine. Syntax may differ slightly from PCRE (PHP/Python) or other flavors, but most common patterns work identically." },
        { q: "What does the 'g' flag do?", a: "The global (g) flag finds all matches in the string, not just the first one. Without it, the regex stops after the first match." },
        { q: "How do I match across multiple lines?", a: "Enable the 'm' (multiline) flag so ^ and $ match the start and end of each line, not just the entire string. The 's' flag makes . match newline characters." },
        { q: "What are capture groups?", a: "Parentheses () in your pattern create capture groups — sub-matches that can be extracted separately. Each group is numbered left to right." },
        { q: "How can I see what my regex means?", a: "Enable the 'Explain' feature to see a human-readable breakdown of each part of your regex pattern." },
      ]}
      relatedTools={[
        { name: "SQL Formatter", path: "/sql-formatter", description: "Format queries that use regex-based string functions." },
        { name: "Markdown Previewer", path: "/markdown-previewer", description: "Preview regex cheatsheets written in Markdown." },
        { name: "cURL Converter", path: "/curl-converter", description: "Extract patterns from API responses using regex." },
      ]}
    >
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              showLibrary
                ? "bg-primary text-primary-foreground"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface2"
            }`}
          >
            <Book className="w-4 h-4" />
            Pattern Library
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              showExplanation
                ? "bg-accent text-accent-foreground"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface2"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Explain
          </button>

          <button
            onClick={() => setShowProfiler(!showProfiler)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              showProfiler
                ? "bg-yellow-500 text-black"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface2"
            }`}
          >
            <Zap className="w-4 h-4" />
            Profiler
          </button>
        </div>

        {/* Pattern Library */}
        {showLibrary && (
          <div className="p-4 rounded-lg bg-surface border border-border max-h-[400px] overflow-y-auto">
            <p className="text-xs font-mono text-primary font-bold mb-3 flex items-center gap-2">
              <Book className="w-4 h-4" />
              Common Regex Patterns
            </p>
            <div className="space-y-2">
              {PATTERN_LIBRARY.map(category => (
                <div key={category.name} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                    className="w-full flex items-center justify-between p-3 bg-surface2/50 hover:bg-surface2 transition-colors"
                  >
                    <span className="text-sm font-mono font-bold">{category.name}</span>
                    {expandedCategory === category.name ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {expandedCategory === category.name && (
                    <div className="p-2 space-y-2">
                      {category.patterns.map(p => (
                        <div key={p.name} className="p-3 rounded-lg bg-surface hover:bg-surface2/50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{p.name}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => copyPattern(p.pattern)}
                                className="p-1.5 rounded hover:bg-surface2 transition-colors"
                                title="Copy pattern"
                              >
                                {copiedPattern === p.pattern ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                              </button>
                              <button
                                onClick={() => usePattern(p.pattern, p.example)}
                                className="px-2 py-1 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                              >
                                Use
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                          <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded block overflow-x-auto">
                            {p.pattern}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern + flags */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">/</span>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className={`w-full bg-[hsl(var(--card))] border ${error ? "border-destructive" : "border-[hsl(var(--foreground)/0.1)]"} rounded-lg pl-6 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] caret-primary transition-[border-color,box-shadow] duration-200`}
              placeholder="Enter regex pattern"
              spellCheck={false}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">/{flags.join("")}</span>
          </div>
          <div className="flex gap-1">
            {FLAG_OPTIONS.map(f => (
              <button key={f} onClick={() => toggleFlag(f)} className={`w-9 h-9 rounded-md font-mono text-sm transition-colors ${flags.includes(f) ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground border border-border"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-destructive text-sm font-mono">{error}</p>}

        {/* Regex Explanation */}
        {showExplanation && dPattern && !error && (
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-mono text-accent font-bold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Pattern Explanation
            </p>
            <div className="space-y-1">
              {explanation.map((part, i) => (
                <div key={i} className="flex gap-3 text-sm font-mono items-start p-2 rounded hover:bg-surface2/50">
                  <code className={`px-2 py-0.5 rounded shrink-0 ${
                    part.type === "meta" ? "bg-primary/20 text-primary" :
                    part.type === "quantifier" ? "bg-yellow-500/20 text-yellow-400" :
                    part.type === "group" ? "bg-accent/20 text-accent" :
                    part.type === "class" ? "bg-purple-500/20 text-purple-400" :
                    part.type === "anchor" ? "bg-destructive/20 text-destructive" :
                    "bg-surface2 text-foreground"
                  }`}>{part.pattern}</code>
                  <span className="text-muted-foreground">{part.explanation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Profiler */}
        {showProfiler && performanceResult && (
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-mono text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance Profile
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="p-3 rounded-lg bg-surface2/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Execution Time</p>
                <p className="text-lg font-mono font-bold">{performanceResult.executionTime.toFixed(3)} ms</p>
              </div>
              <div className="p-3 rounded-lg bg-surface2/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Matches</p>
                <p className="text-lg font-mono font-bold">{performanceResult.matchCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface2/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Complexity</p>
                <p className={`text-lg font-mono font-bold ${
                  performanceResult.complexity === "dangerous" ? "text-destructive" :
                  performanceResult.complexity === "high" ? "text-yellow-400" :
                  performanceResult.complexity === "medium" ? "text-primary" :
                  "text-accent"
                }`}>{performanceResult.complexity.toUpperCase()}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface2/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Est. Steps</p>
                <p className="text-lg font-mono font-bold">{performanceResult.steps.toLocaleString()}</p>
              </div>
            </div>
            {performanceResult.warnings.length > 0 && (
              <div className="space-y-1">
                {performanceResult.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-yellow-400">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test string */}
        <textarea
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
          placeholder="Enter test string..."
          className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)] rounded-lg p-4 font-mono text-sm text-foreground min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] resize-y placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
          spellCheck={false}
        />

        {/* Highlighted output */}
        {dTest && !error && (
          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted-foreground">Matches</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
            </div>
            <div className="font-mono text-sm whitespace-pre-wrap break-all" dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        )}

        {/* Match list */}
        {matches.length > 0 && (
          <div className="p-4 rounded-lg bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-mono text-muted-foreground">Match Details</p>
              {matches.some(m => m.groups.length > 0) && (
                <button
                  onClick={() => {
                    const groupsText = matches
                      .filter(m => m.groups.length > 0)
                      .map((m, i) => `Match ${i + 1}:\n${m.groups.map((g, j) => `  Group ${j + 1}: "${g}"`).join('\n')}`)
                      .join('\n\n');
                    navigator.clipboard.writeText(groupsText);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title="Copy all capture groups"
                >
                  <Copy className="w-3 h-3" />
                  Copy Groups
                </button>
              )}
            </div>
            {matches.map((m, i) => (
              <div key={i} className="text-sm font-mono flex flex-wrap gap-3">
                <span className="text-primary">#{i + 1}</span>
                <span>"{m.match}"</span>
                <span className="text-muted-foreground">@{m.index}</span>
                {m.groups.length > 0 && m.groups.map((g, j) => (
                  <span key={j} className="text-accent">G{j + 1}: "{g}"</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
