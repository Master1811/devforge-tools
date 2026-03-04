import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { formatSQL } from "@/lib/tools/sqlFormatter";

export default function SQLFormatterPage() {
  const [input, setInput] = useLocalStorage("devforge-sql-input", "");
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const debounced = useDebounce(input, 200);

  let output = "";
  if (debounced.trim()) {
    try { output = formatSQL(debounced, { indent, uppercase }); }
    catch (e) { output = "Error: " + (e as Error).message; }
  }

  return (
    <ToolLayout
      title="SQL Formatter & Beautifier Online"
      slug="sql-formatter"
      description="Format and beautify SQL queries instantly. Clean indentation, keyword casing, and structured output — free, no signup."
      keywords={["sql formatter online", "sql beautifier", "format sql query online free"]}
      howToUse={["Paste your raw SQL query into the input panel.", "Choose indentation size and keyword casing preferences.", "Copy the formatted SQL from the output panel."]}
      whatIs={{ title: "What is SQL Formatting?", content: "SQL formatting transforms messy, single-line SQL queries into well-structured, readable code. A sql formatter online applies consistent indentation, places major clauses (SELECT, FROM, WHERE, JOIN) on separate lines, and standardizes keyword casing. This makes complex queries easier to review, debug, and maintain. Our sql beautifier handles SELECT statements, JOINs with conditions, subqueries, and nested parentheses. It processes everything locally in your browser — your SQL queries are never transmitted anywhere." }}
      faqs={[
        { q: "Does it support all SQL dialects?", a: "The formatter handles standard SQL syntax including SELECT, INSERT, UPDATE, DELETE, CREATE, and JOIN statements. It works with MySQL, PostgreSQL, SQLite, and SQL Server syntax for most common queries." },
        { q: "Can it handle subqueries?", a: "Yes. Nested subqueries are indented appropriately to show the query hierarchy. Parenthesized expressions are preserved." },
        { q: "Does it validate my SQL?", a: "No, this is a formatter, not a validator. It restructures your SQL for readability but doesn't check for syntax errors or logical issues." },
        { q: "Can I choose tab vs spaces?", a: "Currently the formatter uses spaces. You can choose between 2-space and 4-space indentation." },
        { q: "Is my SQL data safe?", a: "Yes. All formatting happens in your browser. Your SQL queries are never sent to any server." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate types for SQL query results." },
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for SQL string extraction." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert database configs between formats." },
      ]}
    >
      <div className="flex gap-4 mb-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="SQL Input" placeholder="SELECT * FROM users WHERE id = 1" />
        <CodePanel value={output} readOnly label="Formatted SQL" />
      </div>
    </ToolLayout>
  );
}
