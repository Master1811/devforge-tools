"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";

const FLAG_OPTIONS = ["g", "i", "m", "s", "u"] as const;

export default function RegexTesterPage() {
  const [pattern, setPattern] = useLocalStorage("devforge-regex-pattern", "");
  const [testStr, setTestStr] = useLocalStorage("devforge-regex-test", "");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const dPattern = useDebounce(pattern, 150);
  const dTest = useDebounce(testStr, 150);

  const toggleFlag = (f: string) => setFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

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

  return (
    <ToolLayout
      title="RegEx Tester & Sandbox Online"
      slug="regex-tester"
      description="Test regular expressions in real-time. See matches highlighted, capture groups extracted — free regex tester online."
      keywords={["regex tester online", "regex sandbox", "test regular expression online", "regex101 alternative"]}
      howToUse={["Enter your regex pattern and select flags (g, i, m, etc.).", "Type or paste your test string below.", "Matches are highlighted in real-time with capture groups shown."]}
      whatIs={{ title: "What are Regular Expressions?", content: "Regular expressions (regex) are patterns used to match character combinations in strings. They're a powerful tool for text searching, validation, and extraction. A regex tester online lets you experiment with patterns against test strings in real-time, seeing matches highlighted as you type. Common use cases include validating email addresses, parsing log files, extracting data from text, and search-and-replace operations. Our regex sandbox uses JavaScript's native RegExp engine, supporting flags like global (g), case-insensitive (i), multiline (m), dotAll (s), and Unicode (u). All matching runs locally in your browser with zero latency." }}
      faqs={[
        { q: "What regex engine does this use?", a: "This tool uses JavaScript's native RegExp engine. Syntax may differ slightly from PCRE (PHP/Python) or other flavors, but most common patterns work identically." },
        { q: "What does the 'g' flag do?", a: "The global (g) flag finds all matches in the string, not just the first one. Without it, the regex stops after the first match." },
        { q: "How do I match across multiple lines?", a: "Enable the 'm' (multiline) flag so ^ and $ match the start and end of each line, not just the entire string. The 's' flag makes . match newline characters." },
        { q: "What are capture groups?", a: "Parentheses () in your pattern create capture groups — sub-matches that can be extracted separately. Each group is numbered left to right." },
        { q: "Why is my regex showing an error?", a: "Check for unescaped special characters, mismatched parentheses, or invalid quantifiers. Special characters like . * + ? must be escaped with \\ for literal matching." },
      ]}
      relatedTools={[
        { name: "SQL Formatter", path: "/sql-formatter", description: "Format queries that use regex-based string functions." },
        { name: "Markdown Previewer", path: "/markdown-previewer", description: "Preview regex cheatsheets written in Markdown." },
        { name: "cURL Converter", path: "/curl-converter", description: "Extract patterns from API responses using regex." },
      ]}
    >
      <div className="space-y-4">
        {/* Pattern + flags */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">/</span>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className={`w-full bg-surface border ${error ? "border-destructive" : "border-border"} rounded-lg pl-6 pr-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
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

        {/* Test string */}
        <textarea
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
          placeholder="Enter test string..."
          className="w-full bg-surface border border-border rounded-lg p-4 font-mono text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary resize-y"
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
            <p className="text-xs font-mono text-muted-foreground mb-2">Match Details</p>
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
