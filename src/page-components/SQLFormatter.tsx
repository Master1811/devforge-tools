"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { formatSQL, analyzeSQLComplexity, SQLDialect, generateExplainPlan, formatExplainPlan, getDialectTips } from "@/lib/tools/sqlFormatter";
import { AlertTriangle, BarChart3, Lightbulb, Play, ChevronDown, ChevronRight, Database, Copy } from "lucide-react";

const DIALECTS: { id: SQLDialect; label: string; color: string }[] = [
  { id: "standard", label: "Standard", color: "bg-muted" },
  { id: "postgresql", label: "PostgreSQL", color: "bg-blue-500/20 text-blue-400" },
  { id: "mysql", label: "MySQL", color: "bg-orange-500/20 text-orange-400" },
  { id: "sqlite", label: "SQLite", color: "bg-cyan-500/20 text-cyan-400" },
  { id: "oracle", label: "Oracle", color: "bg-red-500/20 text-red-400" },
  { id: "mssql", label: "MS SQL", color: "bg-purple-500/20 text-purple-400" },
];

export default function SQLFormatterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useLocalStorage("devforge-sql-input", "");
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [dialect, setDialect] = useState<SQLDialect>("postgresql");
  const [showExplain, setShowExplain] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const debounced = useDebounce(input, 200);

  // Read from URL params on mount
  useEffect(() => {
    const sqlParam = searchParams.get("sql");
    const dialectParam = searchParams.get("dialect");
    const indentParam = searchParams.get("indent");
    const uppercaseParam = searchParams.get("uppercase");

    if (sqlParam && !input) setInput(decodeURIComponent(sqlParam));
    if (dialectParam && ["standard", "postgresql", "mysql", "sqlite", "oracle", "mssql"].includes(dialectParam)) {
      setDialect(dialectParam as SQLDialect);
    }
    if (indentParam) setIndent(parseInt(indentParam) || 2);
    if (uppercaseParam) setUppercase(uppercaseParam === "true");
  }, [searchParams, setInput]);

  // Update URL when inputs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (input.trim()) params.set("sql", encodeURIComponent(input.trim()));
    if (dialect !== "postgresql") params.set("dialect", dialect);
    if (indent !== 2) params.set("indent", indent.toString());
    if (!uppercase) params.set("uppercase", "false");

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    if (newUrl !== window.location.search) {
      router.replace(`/sql-formatter${newUrl}`, { scroll: false });
    }
  }, [input, dialect, indent, uppercase, router]);

  let output = "";
  if (debounced.trim()) {
    try { output = formatSQL(debounced, { indent, uppercase, dialect }); }
    catch (e) { output = "Error: " + (e as Error).message; }
  }

  const complexity = debounced.trim() ? analyzeSQLComplexity(debounced) : null;

  const explainPlan = useMemo(() => {
    if (!showExplain || !debounced.trim()) return null;
    const plan = generateExplainPlan(debounced, dialect);
    return formatExplainPlan(plan, dialect);
  }, [showExplain, debounced, dialect]);

  const dialectTips = useMemo(() => getDialectTips(dialect), [dialect]);

  return (
    <ToolLayout
      title="SQL Formatter & Beautifier Online"
      slug="sql-formatter"
      description="Format and beautify SQL queries instantly. Supports PostgreSQL, MySQL, SQLite, Oracle, MS SQL with EXPLAIN plan visualization."
      keywords={["sql formatter online", "sql beautifier", "format sql query online free", "postgresql formatter", "mysql formatter", "explain plan"]}
      howToUse={[
        "Paste your raw SQL query into the input panel.",
        "Choose your dialect (PostgreSQL, MySQL, SQLite, Oracle, MS SQL).",
        "Adjust indentation size and keyword casing preferences.",
        "Click 'Show EXPLAIN' to see a simulated execution plan.",
        "Copy the formatted SQL from the output panel.",
      ]}
      whatIs={{ title: "What is SQL Formatting?", content: "SQL formatting transforms messy, single-line SQL queries into well-structured, readable code. A sql formatter online applies consistent indentation, places major clauses (SELECT, FROM, WHERE, JOIN) on separate lines, and standardizes keyword casing. This makes complex queries easier to review, debug, and maintain. Our sql beautifier handles SELECT statements, JOINs with conditions, subqueries, CTEs, and nested parentheses. It supports dialect-specific syntax for PostgreSQL, MySQL, SQLite, Oracle, and MS SQL Server. The EXPLAIN visualization helps you understand query execution plans for optimization." }}
      faqs={[
        { q: "Does it support all SQL dialects?", a: "Yes! We support Standard SQL, PostgreSQL, MySQL, SQLite, Oracle, and MS SQL Server with dialect-specific keywords and tips." },
        { q: "Can it handle subqueries and CTEs?", a: "Yes. Nested subqueries and CTEs (WITH clauses) are indented appropriately to show the query hierarchy." },
        { q: "What is the EXPLAIN visualization?", a: "The EXPLAIN feature generates a simulated execution plan showing how the database would process your query. It's educational and helps identify potential performance issues." },
        { q: "What is the complexity score?", a: "The complexity score estimates query difficulty based on JOIN count, subqueries, CTEs, and conditions. Higher scores indicate queries that may need optimization." },
        { q: "Is my SQL data safe?", a: "Yes. All formatting and analysis happens in your browser. Your SQL queries are never sent to any server." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate types for SQL query results." },
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for SQL string extraction." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert database configs between formats." },
      ]}
    >
      {/* Dialect selector */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex gap-1 p-1 rounded-lg bg-surface2/50">
          {DIALECTS.map(d => (
            <button
              key={d.id}
              onClick={() => setDialect(d.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                dialect === d.id
                  ? `bg-primary text-primary-foreground`
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Indent:
          <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="bg-surface border border-border rounded px-2 py-1 text-sm">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-primary" />
          Uppercase keywords
        </label>
      </div>

      {/* Complexity Analysis */}
      {complexity && debounced.trim() && (
        <div className="mb-4 p-4 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Complexity:</span>
              <span className={`text-xs font-mono font-bold ${
                complexity.label === "Complex" ? "text-destructive" :
                complexity.label === "Moderate" ? "text-yellow-400" : "text-accent"
              }`}>{complexity.label} ({complexity.score})</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {complexity.joinCount} JOIN{complexity.joinCount !== 1 ? "s" : ""} •
              {complexity.subqueryCount} subquer{complexity.subqueryCount !== 1 ? "ies" : "y"} •
              {complexity.cteCount} CTE{complexity.cteCount !== 1 ? "s" : ""} •
              {complexity.conditionCount} condition{complexity.conditionCount !== 1 ? "s" : ""}
            </span>
          </div>
          {complexity.warnings.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {complexity.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono text-yellow-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="SQL Input" placeholder="SELECT * FROM users WHERE id = 1" />
        <CodePanel value={output} readOnly label="Formatted SQL" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {output && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Copy formatted SQL"
          >
            <Copy className="w-4 h-4" />
            Copy SQL
          </button>
        )}

        <button
          onClick={() => setShowExplain(!showExplain)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
            showExplain
              ? "bg-primary text-primary-foreground"
              : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface2"
          }`}
        >
          <Play className="w-4 h-4" />
          {showExplain ? "Hide EXPLAIN" : "Show EXPLAIN"}
        </button>

        <button
          onClick={() => setShowTips(!showTips)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
            showTips
              ? "bg-accent text-accent-foreground"
              : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface2"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {dialect.charAt(0).toUpperCase() + dialect.slice(1)} Tips
        </button>
      </div>

      {/* EXPLAIN Plan Visualization */}
      {showExplain && debounced.trim() && (
        <div className="mt-4 p-4 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary font-bold">Simulated EXPLAIN Plan ({dialect.toUpperCase()})</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">Educational</span>
          </div>
          <pre className="text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto bg-surface2/50 p-4 rounded-lg">
            {explainPlan || "Enter a SELECT query to see execution plan"}
          </pre>
          <p className="text-[10px] font-mono text-muted-foreground mt-3">
            ⚠️ This is a simulated execution plan for educational purposes. For real execution plans, run EXPLAIN directly on your database.
          </p>
        </div>
      )}

      {/* Dialect Tips */}
      {showTips && (
        <div className="mt-4 p-4 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono text-accent font-bold">{dialect.toUpperCase()} Tips & Features</span>
          </div>
          <div className="space-y-3">
            {dialectTips.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface2/50">
                <p className="text-sm text-foreground mb-2">{tip.tip}</p>
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded block overflow-x-auto">
                  {tip.example}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
