"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { formatSQL, analyzeSQLComplexity, SQLDialect } from "@/lib/tools/sqlFormatter";
import { AlertTriangle, BarChart3 } from "lucide-react";

const DIALECTS: { id: SQLDialect; label: string }[] = [
  { id: "standard", label: "Standard SQL" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "oracle", label: "Oracle" },
  { id: "mssql", label: "MS SQL" },
];

export default function SQLFormatterPage() {
  const [input, setInput] = useLocalStorage("devforge-sql-input", "");
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [dialect, setDialect] = useState<SQLDialect>("standard");
  const debounced = useDebounce(input, 200);

  let output = "";
  if (debounced.trim()) {
    try { output = formatSQL(debounced, { indent, uppercase, dialect }); }
    catch (e) { output = "Error: " + (e as Error).message; }
  }

  const complexity = debounced.trim() ? analyzeSQLComplexity(debounced) : null;

  return (
    <ToolLayout
      title="SQL Formatter & Beautifier Online"
      slug="sql-formatter"
      description="Format and beautify SQL queries instantly. Clean indentation, keyword casing, and structured output — free, no signup."
      keywords={["sql formatter online", "sql beautifier", "format sql query online free"]}
      howToUse={["Paste your raw SQL query into the input panel.", "Choose dialect, indentation size and keyword casing preferences.", "Copy the formatted SQL from the output panel."]}
      whatIs={{ title: "What is SQL Formatting?", content: "SQL formatting transforms messy, single-line SQL queries into well-structured, readable code. A sql formatter online applies consistent indentation, places major clauses (SELECT, FROM, WHERE, JOIN) on separate lines, and standardizes keyword casing. This makes complex queries easier to review, debug, and maintain. Our sql beautifier handles SELECT statements, JOINs with conditions, subqueries, and nested parentheses. It processes everything locally in your browser — your SQL queries are never transmitted anywhere." }}
      faqs={[
        { q: "Does it support all SQL dialects?", a: "The formatter handles standard SQL syntax and provides dialect-specific hints for PostgreSQL, MySQL, Oracle, and MS SQL Server." },
        { q: "Can it handle subqueries?", a: "Yes. Nested subqueries are indented appropriately to show the query hierarchy. Parenthesized expressions are preserved." },
        { q: "Does it validate my SQL?", a: "No, this is a formatter, not a validator. It restructures your SQL for readability but doesn't check for syntax errors or logical issues." },
        { q: "What is the complexity score?", a: "The complexity score estimates query difficulty based on JOIN count, subqueries, and conditions. Higher scores indicate queries that may need optimization." },
        { q: "Is my SQL data safe?", a: "Yes. All formatting happens in your browser. Your SQL queries are never sent to any server." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate types for SQL query results." },
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for SQL string extraction." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert database configs between formats." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Dialect selector */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {DIALECTS.map(d => (
            <button key={d.id} onClick={() => setDialect(d.id)} className={`px-3 py-1.5 text-xs font-mono transition-colors ${dialect === d.id ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"}`}>
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
              {complexity.joinCount} JOIN{complexity.joinCount !== 1 ? "s" : ""} • {complexity.subqueryCount} subquer{complexity.subqueryCount !== 1 ? "ies" : "y"} • {complexity.conditionCount} condition{complexity.conditionCount !== 1 ? "s" : ""}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="SQL Input" placeholder="SELECT * FROM users WHERE id = 1" />
        <CodePanel value={output} readOnly label="Formatted SQL" />
      </div>
    </ToolLayout>
  );
}
