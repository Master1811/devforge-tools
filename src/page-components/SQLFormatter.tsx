"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { optimizeSnowflakeDatabricksSQL, WarehouseType } from "@/lib/tools/sqlOptimizer";
import { AlertTriangle, CheckCircle, Info, Database, Zap, TrendingUp } from "lucide-react";

const WAREHOUSES: { id: WarehouseType; label: string; color: string }[] = [
  { id: "snowflake", label: "Snowflake", color: "bg-blue-500/20 text-blue-400" },
  { id: "databricks", label: "Databricks", color: "bg-red-500/20 text-red-400" },
];

export default function SQLOptimizerPage() {
  const [input, setInput] = useLocalStorage("devforge-sql-optimize-input", "");
  const [warehouse, setWarehouse] = useState<WarehouseType>("snowflake");
  const debounced = useDebounce(input, 300);

  const optimizationResult = debounced.trim()
    ? optimizeSnowflakeDatabricksSQL(debounced, warehouse)
    : null;

  const getSeverityIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Performance')) return <TrendingUp className="w-4 h-4" />;
    if (category.includes('Optimization')) return <Zap className="w-4 h-4" />;
    return <Database className="w-4 h-4" />;
  };

  return (
    <ToolLayout
      title="Snowflake / Databricks SQL Optimizer"
      slug="sql-optimizer"
      description="Analyze SQL queries for performance issues specific to Snowflake and Databricks warehouses. Detect full table scans, inefficient joins, missing partitions, and warehouse-specific optimizations."
      keywords={["sql optimizer", "snowflake sql optimization", "databricks sql performance", "sql query analysis", "warehouse optimization"]}
      howToUse={[
        "Paste your SQL query into the input panel.",
        "Select your warehouse type (Snowflake or Databricks).",
        "Review the optimization score and specific issues found.",
        "Apply the suggested improvements to enhance query performance."
      ]}
      whatIs={{
        title: "What is SQL Query Optimization?",
        content: "SQL optimization analyzes queries for performance bottlenecks specific to modern data warehouses like Snowflake and Databricks. It identifies full table scans that could benefit from partitioning, inefficient joins that might need restructuring, missing indexes or clustering keys, and warehouse-specific optimizations. The optimizer provides actionable recommendations with severity levels (error, warning, info) and calculates an overall optimization score. This helps data engineers and analysts write more efficient queries that reduce compute costs and improve response times. All analysis happens in your browser — your SQL queries are never sent to any external service."
      }}
      faqs={[
        {
          q: "What warehouse-specific optimizations does it detect?",
          a: "For Snowflake: inefficient COUNT(*) OVER() operations, expensive FLATTEN operations. For Databricks: slow MERGE operations on large Delta tables, VACUUM timing considerations."
        },
        {
          q: "How is the optimization score calculated?",
          a: "The score starts at 100 and deducts points for each issue found: 20 points for errors, 5 points for warnings, 1 point for info-level suggestions. Higher scores indicate better optimized queries."
        },
        {
          q: "Can it optimize all types of SQL queries?",
          a: "It analyzes SELECT, INSERT, UPDATE, DELETE, and MERGE statements. It focuses on common performance anti-patterns and warehouse-specific optimizations rather than query rewriting."
        },
        {
          q: "Does it support all SQL dialects?",
          a: "The optimizer works with standard SQL and recognizes Snowflake and Databricks specific syntax. It doesn't require dialect-specific parsing for most optimizations."
        },
        {
          q: "Is this a replacement for EXPLAIN plans?",
          a: "No, this is a complementary tool. Use warehouse EXPLAIN plans for execution details, and this optimizer for general best practices and warehouse-specific guidance."
        },
      ]}
      relatedTools={[
        {
          name: "JSON to BigQuery Schema",
          path: "/json-to-bigquery-schema",
          description: "Generate BigQuery schemas for your optimized query results."
        },
        {
          name: "YAML ↔ JSON Converter",
          path: "/yaml-json-converter",
          description: "Convert configuration files for warehouse deployments."
        },
        {
          name: "Regex Tester",
          path: "/regex-tester",
          description: "Test patterns for SQL string extraction and validation."
        },
      ]}
    >
      <div className="space-y-6">
        {/* Warehouse Selector */}
        <div className="flex flex-wrap gap-2">
          {WAREHOUSES.map(wh => (
            <button
              key={wh.id}
              onClick={() => setWarehouse(wh.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                warehouse === wh.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border hover:bg-surface2"
              }`}
            >
              {wh.label}
            </button>
          ))}
        </div>

        {/* SQL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            SQL Query to Optimize
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`SELECT
  customer_id,
  SUM(amount) as total_spent
FROM orders
WHERE order_date >= '2023-01-01'
GROUP BY customer_id
ORDER BY total_spent DESC;`}
            className="w-full px-4 py-3 border border-[hsl(var(--foreground)/0.1)] rounded-lg bg-[hsl(var(--card))] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] font-mono text-sm min-h-[120px] resize-y placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
            spellCheck={false}
          />
        </div>

        {optimizationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimization Score */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{WAREHOUSES.find(w => w.id === warehouse)?.label} Optimization Results</h3>
              </div>

              {/* Score */}
              <div className="p-4 rounded-lg bg-surface border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Optimization Score</span>
                  <span className={`text-lg font-bold ${optimizationResult.score >= 80 ? 'text-accent' : optimizationResult.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {optimizationResult.score}/100
                  </span>
                </div>
                <div className="w-full bg-surface2 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      optimizationResult.score >= 80 ? 'bg-accent' : optimizationResult.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${optimizationResult.score}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Errors: {optimizationResult.summary.errors}</span>
                  <span>Warnings: {optimizationResult.summary.warnings}</span>
                  <span>Info: {optimizationResult.summary.infos}</span>
                </div>
              </div>

              {/* Issues List */}
              {optimizationResult.issues.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Optimization Issues</h4>
                  {optimizationResult.issues.map((issue, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(issue.type)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getSeverityIcon(issue.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(issue.category)}
                            <span className="text-sm font-medium">{issue.category}</span>
                            {issue.line && (
                              <span className="text-xs text-muted-foreground">Line {issue.line}</span>
                            )}
                          </div>
                          <p className="text-sm mb-2">{issue.message}</p>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Suggestion:</div>
                          <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                          {issue.sqlSnippet && (
                            <div className="mt-2 p-2 bg-surface2 rounded text-xs font-mono">
                              {issue.sqlSnippet}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border bg-accent/10 border-accent/30 text-accent">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Query looks well optimized!</span>
                  </div>
                  <p className="text-xs mt-1 text-accent/80">
                    No major performance issues detected. Consider monitoring execution times and query costs in production.
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Optimization Tips</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface border">
                  <h4 className="text-sm font-medium mb-2">Performance Best Practices</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use LIMIT in development/testing queries</li>
                    <li>• Prefer WHERE clauses over HAVING when possible</li>
                    <li>• Consider clustering keys for frequently filtered columns</li>
                    <li>• Use appropriate data types to reduce storage and processing</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-surface border">
                  <h4 className="text-sm font-medium mb-2">{WAREHOUSES.find(w => w.id === warehouse)?.label} Specific</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {warehouse === 'snowflake' ? (
                      <>
                        <li>• Use clustering keys for large tables</li>
                        <li>• Consider search optimization for LIKE queries</li>
                        <li>• Use APPROX_COUNT_DISTINCT for approximate counts</li>
                        <li>• Leverage automatic clustering and materialized views</li>
                      </>
                    ) : (
                      <>
                        <li>• Use OPTIMIZE after large data changes</li>
                        <li>• Consider Z-ordering for multi-column filters</li>
                        <li>• Use Delta Live Tables for incremental processing</li>
                        <li>• Monitor query history for performance insights</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
