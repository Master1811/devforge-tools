const KEYWORDS = [
  "SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN","CROSS JOIN",
  "ON","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES",
  "UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","INDEX","UNION","UNION ALL",
  "CASE","WHEN","THEN","ELSE","END","AS","IN","NOT","NULL","IS","BETWEEN","LIKE","EXISTS","DISTINCT",
  "WITH","RECURSIVE","RETURNING","CONFLICT","DO","NOTHING","FETCH","FIRST","NEXT","ROWS","ONLY",
  "PARTITION BY","OVER","WINDOW","LATERAL","TABLESAMPLE","USING","NATURAL",
];

// Dialect-specific keywords
const DIALECT_KEYWORDS: Record<SQLDialect, string[]> = {
  standard: [],
  postgresql: ["ILIKE", "SIMILAR TO", "RETURNING", "UPSERT", "ON CONFLICT", "MATERIALIZED", "VACUUM", "ANALYZE", "EXPLAIN ANALYZE", "::"],
  mysql: ["AUTO_INCREMENT", "ENGINE", "CHARSET", "COLLATE", "IF EXISTS", "IGNORE", "REPLACE INTO", "STRAIGHT_JOIN", "USE INDEX", "FORCE INDEX"],
  sqlite: ["AUTOINCREMENT", "GLOB", "VACUUM", "ATTACH", "DETACH", "PRAGMA", "WITHOUT ROWID"],
  oracle: ["ROWNUM", "ROWID", "CONNECT BY", "START WITH", "PRIOR", "LEVEL", "NOCACHE", "SEQUENCE", "NEXTVAL", "CURRVAL", "MERGE INTO"],
  mssql: ["TOP", "NOLOCK", "WITH (NOLOCK)", "IDENTITY", "GETDATE()", "NEWID()", "@@IDENTITY", "SCOPE_IDENTITY()", "OUTPUT", "MERGE"],
};

export type SQLDialect = "standard" | "postgresql" | "mysql" | "sqlite" | "oracle" | "mssql";

export interface SQLFormatOptions {
  indent?: number;
  uppercase?: boolean;
  dialect?: SQLDialect;
  lineWidth?: number;
}

export function formatSQL(sql: string, options: SQLFormatOptions = {}): string {
  const { indent = 2, uppercase = true, dialect = "standard" } = options;
  const pad = " ".repeat(indent);
  let result = sql.replace(/\s+/g, " ").trim();

  // Combine standard and dialect-specific keywords
  const allKeywords = [...KEYWORDS, ...DIALECT_KEYWORDS[dialect]];

  // uppercase keywords
  if (uppercase) {
    for (const kw of allKeywords) {
      if (kw.includes("(") || kw.includes(":")) continue; // Skip special characters
      result = result.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
    }
  }

  const breakBefore = ["SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN",
    "CROSS JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","UPDATE","SET",
    "DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","UNION","UNION ALL","VALUES",
    "WITH","RETURNING","ON CONFLICT","PARTITION BY","OVER","WINDOW"];

  for (const kw of breakBefore) {
    result = result.replace(new RegExp(`\\s+${kw}\\b`, "gi"), `\n${kw}`);
  }

  // indent AND/OR/ON
  result = result.replace(/\b(AND|OR)\b/gi, `\n${pad}$1`);
  result = result.replace(/\bON\b/gi, `\n${pad}ON`);

  // SELECT columns one per line
  const selectMatch = result.match(/^SELECT\s+(.+?)(?=\nFROM)/is);
  if (selectMatch) {
    const cols = selectMatch[1].split(",").map((c, i) => i === 0 ? c.trim() : `${pad}${c.trim()}`);
    result = result.replace(selectMatch[1], "\n" + pad + cols.join(",\n" + pad));
  }

  // Handle CTEs (WITH clause)
  result = result.replace(/\bWITH\s+(\w+)\s+AS\s*\(/gi, "WITH $1 AS (\n" + pad);

  return result.trim();
}

export interface SQLComplexity {
  score: number;
  label: string;
  joinCount: number;
  subqueryCount: number;
  conditionCount: number;
  cteCount: number;
  warnings: string[];
}

export function analyzeSQLComplexity(sql: string): SQLComplexity {
  const upper = sql.toUpperCase();
  const joinCount = (upper.match(/\b(INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b/g) || []).length;
  const subqueryCount = (upper.match(/\(\s*SELECT\b/g) || []).length;
  const conditionCount = (upper.match(/\b(AND|OR)\b/g) || []).length;
  const cteCount = (upper.match(/\bWITH\s+\w+\s+AS\s*\(/g) || []).length;
  const hasWildcard = /SELECT\s+\*/i.test(sql);
  const hasNoLimit = !/\bLIMIT\b/i.test(sql) && /\bSELECT\b/i.test(sql);
  const hasDistinct = /\bDISTINCT\b/i.test(sql);
  const hasOrderByWithoutIndex = /ORDER BY\s+\w+/.test(sql);
  const hasGroupBy = /GROUP BY/i.test(sql);
  const hasHaving = /HAVING/i.test(sql);

  const warnings: string[] = [];
  if (hasWildcard) warnings.push("SELECT * — consider specifying columns for performance");
  if (joinCount >= 4) warnings.push(`${joinCount} JOINs detected — may cause slow queries without proper indexing`);
  if (subqueryCount >= 2) warnings.push(`${subqueryCount} subqueries — consider using CTEs or JOINs instead`);
  if (hasNoLimit && !(/\bINSERT|UPDATE|DELETE|CREATE|ALTER|DROP\b/i.test(sql))) warnings.push("No LIMIT clause — may return excessive rows");
  if (hasDistinct && joinCount > 0) warnings.push("DISTINCT with JOINs — may indicate a join producing duplicates");
  if (hasGroupBy && !hasHaving && conditionCount > 3) warnings.push("Consider adding HAVING clause to filter aggregated results");

  const score = joinCount * 2 + subqueryCount * 3 + conditionCount + cteCount * 2 + (hasWildcard ? 1 : 0);
  let label = "Simple";
  if (score >= 10) label = "Complex";
  else if (score >= 5) label = "Moderate";

  return { score, label, joinCount, subqueryCount, conditionCount, cteCount, warnings };
}

// ============== EXPLAIN PLAN VISUALIZATION ==============
export interface ExplainNode {
  operation: string;
  object?: string;
  cost?: string;
  rows?: string;
  width?: string;
  details: string[];
  children: ExplainNode[];
  level: number;
}

export interface ExplainPlan {
  nodes: ExplainNode[];
  totalCost?: string;
  planningTime?: string;
  executionTime?: string;
  warnings: string[];
}

// Generate simulated EXPLAIN output for educational purposes
export function generateExplainPlan(sql: string, dialect: SQLDialect): ExplainPlan {
  const upper = sql.toUpperCase();
  const nodes: ExplainNode[] = [];
  const warnings: string[] = [];

  // This is a simulation for educational purposes — real EXPLAIN would require database connection
  const isSelect = /^\s*SELECT/i.test(sql);
  const hasJoins = /\bJOIN\b/i.test(sql);
  const hasSubquery = /\(\s*SELECT\b/i.test(sql);
  const hasWhere = /\bWHERE\b/i.test(sql);
  const hasOrderBy = /\bORDER BY\b/i.test(sql);
  const hasGroupBy = /\bGROUP BY\b/i.test(sql);
  const hasLimit = /\bLIMIT\b/i.test(sql);
  const hasDistinct = /\bDISTINCT\b/i.test(sql);
  const hasAggregate = /\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/i.test(sql);

  // Extract table names
  const tableMatches = sql.match(/\bFROM\s+(\w+)|\bJOIN\s+(\w+)/gi) || [];
  const tables = tableMatches.map(m => m.replace(/^(FROM|JOIN)\s+/i, "").trim());

  if (isSelect) {
    let level = 0;
    let estimatedCost = 0;
    let estimatedRows = 1000;

    // Root node
    const rootNode: ExplainNode = {
      operation: hasLimit ? "Limit" : "Result",
      cost: "",
      rows: hasLimit ? "100" : String(estimatedRows),
      details: [],
      children: [],
      level: level++,
    };

    // Sort/Order
    if (hasOrderBy) {
      estimatedCost += 50;
      const sortNode: ExplainNode = {
        operation: "Sort",
        details: ["Sort Key extracted from ORDER BY"],
        cost: String(estimatedCost),
        rows: String(estimatedRows),
        children: [],
        level: level++,
      };
      rootNode.children.push(sortNode);
      if (!hasLimit) warnings.push("ORDER BY without LIMIT may sort large result sets");
    }

    // Distinct/Unique
    if (hasDistinct) {
      estimatedCost += 30;
      const uniqueNode: ExplainNode = {
        operation: "Unique",
        details: ["Removes duplicate rows"],
        cost: String(estimatedCost),
        children: [],
        level: level++,
      };
      (rootNode.children.length > 0 ? rootNode.children[rootNode.children.length - 1].children : rootNode.children).push(uniqueNode);
    }

    // Aggregate
    if (hasAggregate || hasGroupBy) {
      estimatedCost += 40;
      const aggNode: ExplainNode = {
        operation: hasGroupBy ? "HashAggregate" : "Aggregate",
        details: hasGroupBy ? ["Group Key from GROUP BY"] : ["Computes aggregate function"],
        cost: String(estimatedCost),
        children: [],
        level: level++,
      };
      const parent = rootNode.children.length > 0 ? rootNode.children[rootNode.children.length - 1] : rootNode;
      (parent.children.length > 0 ? parent.children[parent.children.length - 1].children : parent.children).push(aggNode);
    }

    // Joins
    if (hasJoins && tables.length >= 2) {
      estimatedCost += tables.length * 100;
      estimatedRows *= tables.length;

      const joinTypes = sql.match(/\b(INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b/gi) || [];
      for (let i = 0; i < Math.min(joinTypes.length, tables.length - 1); i++) {
        const joinType = joinTypes[i].toUpperCase().includes("LEFT") ? "Left" :
                        joinTypes[i].toUpperCase().includes("RIGHT") ? "Right" :
                        joinTypes[i].toUpperCase().includes("FULL") ? "Full" :
                        joinTypes[i].toUpperCase().includes("CROSS") ? "Cross" : "Inner";

        const joinNode: ExplainNode = {
          operation: `Hash ${joinType} Join`,
          object: tables[i + 1],
          details: [`Join on ${tables[0]} and ${tables[i + 1]}`],
          cost: String(estimatedCost),
          rows: String(estimatedRows),
          children: [],
          level: level++,
        };

        // Add scan for right table
        const scanNode: ExplainNode = {
          operation: "Seq Scan",
          object: tables[i + 1],
          cost: String(Math.floor(estimatedCost / 2)),
          rows: "1000",
          details: [],
          children: [],
          level: level + 1,
        };
        joinNode.children.push(scanNode);

        const lastParent = findDeepestNode(rootNode);
        lastParent.children.push(joinNode);
      }

      if (tables.length > 3) warnings.push("Multiple joins — ensure proper indexes exist");
    }

    // Subquery
    if (hasSubquery) {
      estimatedCost += 80;
      warnings.push("Subquery detected — consider rewriting as JOIN or CTE");

      const subqNode: ExplainNode = {
        operation: "SubPlan",
        details: ["Subquery execution"],
        cost: String(estimatedCost),
        children: [{
          operation: "Seq Scan",
          object: "subquery",
          cost: "40",
          rows: "100",
          details: [],
          children: [],
          level: level + 2,
        }],
        level: level++,
      };
      findDeepestNode(rootNode).children.push(subqNode);
    }

    // Table scan
    if (tables.length > 0) {
      const hasIndex = hasWhere && /\bWHERE\s+\w+\s*=/.test(sql);
      estimatedCost += hasIndex ? 20 : 100;

      const scanNode: ExplainNode = {
        operation: hasIndex ? "Index Scan" : "Seq Scan",
        object: tables[0],
        cost: String(estimatedCost),
        rows: hasWhere ? "100" : "1000",
        details: hasWhere ? ["Filter applied from WHERE clause"] : [],
        children: [],
        level: level++,
      };

      if (!hasIndex && hasWhere) {
        warnings.push(`Sequential scan on ${tables[0]} — consider adding index for WHERE column`);
      }

      findDeepestNode(rootNode).children.push(scanNode);
    }

    rootNode.cost = String(estimatedCost);
    nodes.push(rootNode);
  }

  return {
    nodes,
    totalCost: nodes[0]?.cost,
    warnings,
    planningTime: "0.1 ms (simulated)",
    executionTime: "N/A (simulation only)",
  };
}

function findDeepestNode(node: ExplainNode): ExplainNode {
  if (node.children.length === 0) return node;
  return findDeepestNode(node.children[node.children.length - 1]);
}

// Format EXPLAIN output as text
export function formatExplainPlan(plan: ExplainPlan, dialect: SQLDialect): string {
  if (plan.nodes.length === 0) return "Unable to generate execution plan";

  const lines: string[] = [];

  if (dialect === "postgresql") {
    lines.push("QUERY PLAN");
    lines.push("─".repeat(60));
  } else if (dialect === "mysql") {
    lines.push("+----+-------------+-------+------+---------------+------+---------+------+------+-------------+");
    lines.push("| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra       |");
    lines.push("+----+-------------+-------+------+---------------+------+---------+------+------+-------------+");
  }

  function renderNode(node: ExplainNode, prefix: string = ""): void {
    const arrow = prefix ? "→  " : "";
    const costInfo = node.cost ? ` (cost=${node.cost}..${node.cost} rows=${node.rows || "?"})` : "";
    const objInfo = node.object ? ` on ${node.object}` : "";

    lines.push(`${prefix}${arrow}${node.operation}${objInfo}${costInfo}`);

    for (const detail of node.details) {
      lines.push(`${prefix}   ${detail}`);
    }

    for (let i = 0; i < node.children.length; i++) {
      const isLast = i === node.children.length - 1;
      const childPrefix = prefix + (isLast ? "   " : "│  ");
      renderNode(node.children[i], childPrefix);
    }
  }

  for (const node of plan.nodes) {
    renderNode(node);
  }

  if (plan.planningTime) {
    lines.push("");
    lines.push(`Planning Time: ${plan.planningTime}`);
  }

  if (plan.warnings.length > 0) {
    lines.push("");
    lines.push("⚠️ Optimization Hints:");
    for (const warning of plan.warnings) {
      lines.push(`  • ${warning}`);
    }
  }

  return lines.join("\n");
}

// Get dialect-specific tips
export function getDialectTips(dialect: SQLDialect): { tip: string; example: string }[] {
  const tips: Record<SQLDialect, { tip: string; example: string }[]> = {
    standard: [
      { tip: "Use CTEs (WITH clause) for complex queries", example: "WITH cte AS (SELECT ...) SELECT * FROM cte" },
    ],
    postgresql: [
      { tip: "Use EXPLAIN ANALYZE for actual execution stats", example: "EXPLAIN ANALYZE SELECT * FROM users" },
      { tip: "ILIKE for case-insensitive pattern matching", example: "WHERE name ILIKE '%john%'" },
      { tip: "Use RETURNING to get inserted/updated rows", example: "INSERT INTO users (name) VALUES ('John') RETURNING *" },
      { tip: "Array operations with ANY/ALL", example: "WHERE id = ANY(ARRAY[1, 2, 3])" },
      { tip: "Use ON CONFLICT for upserts", example: "INSERT INTO users (...) ON CONFLICT (id) DO UPDATE SET ..." },
    ],
    mysql: [
      { tip: "Use EXPLAIN FORMAT=JSON for detailed plans", example: "EXPLAIN FORMAT=JSON SELECT * FROM users" },
      { tip: "Use FORCE INDEX to hint optimizer", example: "SELECT * FROM users FORCE INDEX (idx_name)" },
      { tip: "Use INSERT ... ON DUPLICATE KEY UPDATE", example: "INSERT INTO users (...) ON DUPLICATE KEY UPDATE name = VALUES(name)" },
      { tip: "Use STRAIGHT_JOIN to control join order", example: "SELECT STRAIGHT_JOIN * FROM a JOIN b" },
    ],
    sqlite: [
      { tip: "Use EXPLAIN QUERY PLAN for optimization info", example: "EXPLAIN QUERY PLAN SELECT * FROM users" },
      { tip: "WITHOUT ROWID tables for specific use cases", example: "CREATE TABLE kv (k PRIMARY KEY, v) WITHOUT ROWID" },
      { tip: "Use PRAGMA to tune performance", example: "PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;" },
    ],
    oracle: [
      { tip: "Use EXPLAIN PLAN FOR to get execution plan", example: "EXPLAIN PLAN FOR SELECT * FROM users; SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);" },
      { tip: "Use ROWNUM for pagination (pre-12c)", example: "WHERE ROWNUM <= 10" },
      { tip: "Use FETCH FIRST for pagination (12c+)", example: "FETCH FIRST 10 ROWS ONLY" },
      { tip: "Use hints for optimizer control", example: "SELECT /*+ INDEX(users idx_name) */ * FROM users" },
    ],
    mssql: [
      { tip: "Use SET STATISTICS IO ON for I/O stats", example: "SET STATISTICS IO ON; SELECT * FROM users" },
      { tip: "Use TOP for limiting results", example: "SELECT TOP 10 * FROM users" },
      { tip: "Use WITH (NOLOCK) for dirty reads", example: "SELECT * FROM users WITH (NOLOCK)" },
      { tip: "Use OUTPUT for getting affected rows", example: "DELETE FROM users OUTPUT deleted.* WHERE id = 1" },
    ],
  };

  return tips[dialect] || tips.standard;
}
